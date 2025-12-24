import React, { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Eye, EyeOff, Mail, Lock, Phone } from "lucide-react"
import { useSignupMutation } from "@/store/api/authApi"
import { handleApiError } from "@/utils/api"

interface RegisterFormProps {
  onSuccess: (email: string) => void
}

const RegisterForm: React.FC<RegisterFormProps> = ({ onSuccess }) => {
  const [signup, { isLoading }] = useSignupMutation()
  const [showPassword, setShowPassword] = useState(false)
  const [formData, setFormData] = useState({
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  })

  const [errors, setErrors] = useState({
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    general: "",
  })

  const validateField = (name: string, value: string) => {
    let errorMessage = ""
    switch (name) {
      case "email": {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        if (!value) errorMessage = "Vui lòng nhập email"
        else if (!emailRegex.test(value)) errorMessage = "Email không hợp lệ"
        break
      }
      case "phone": {
        const phoneRegex = /^[0-9]{10}$/
        if (!value) errorMessage = "Vui lòng nhập số điện thoại"
        else if (!phoneRegex.test(value))
          errorMessage = "Số điện thoại phải có 10 chữ số"
        break
      }
      case "password": {
        // Min 6 chars, 1 uppercase, 1 special char
        const hasUpperCase = /[A-Z]/.test(value)
        const hasSpecialChar = /[^a-zA-Z0-9]/.test(value)
        if (!value) errorMessage = "Vui lòng nhập mật khẩu"
        else if (value.length < 6)
          errorMessage = "Mật khẩu phải có ít nhất 6 ký tự"
        else if (!hasUpperCase)
          errorMessage = "Mật khẩu phải có ít nhất 1 chữ hoa"
        else if (!hasSpecialChar)
          errorMessage = "Mật khẩu phải có ít nhất 1 ký tự đặc biệt"
        break
      }
      case "confirmPassword":
        if (!value) errorMessage = "Vui lòng nhập lại mật khẩu"
        else if (value !== formData.password)
          errorMessage = "Mật khẩu không khớp"
        break
      default:
        break
    }
    return errorMessage
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))

    // Real-time validation
    const error = validateField(name, value)
    setErrors((prev) => ({ ...prev, [name]: error, general: "" }))

    // Special case: if password changes, re-validate confirmPassword if it has a value
    if (name === "password" && formData.confirmPassword) {
      const confirmError =
        value !== formData.confirmPassword ? "Mật khẩu không khớp" : ""
      setErrors((prev) => ({ ...prev, confirmPassword: confirmError }))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Validate all fields
    const emailError = validateField("email", formData.email)
    const phoneError = validateField("phone", formData.phone)
    const passwordError = validateField("password", formData.password)
    const confirmPasswordError = validateField(
      "confirmPassword",
      formData.confirmPassword
    )

    if (emailError || phoneError || passwordError || confirmPasswordError) {
      setErrors({
        email: emailError,
        phone: phoneError,
        password: passwordError,
        confirmPassword: confirmPasswordError,
        general: "",
      })
      return
    }

    try {
      const result = await signup({
        EMAIL: formData.email,
        PASSWORD: formData.password,
        PHONE: formData.phone,
      }).unwrap()

      if (result.status === 200) {
        onSuccess(formData.email)
      } else {
        setErrors((prev) => ({
          ...prev,
          general: result.message || "Đăng ký thất bại",
        }))
      }
    } catch (err: unknown) {
      const errorMessage = handleApiError(err)
      setErrors((prev) => ({ ...prev, general: errorMessage }))
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {errors.general && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-600">
          {errors.general}
        </div>
      )}

      <div className="space-y-2">
        <Label htmlFor="regEmail" className="text-sm font-medium text-gray-700">
          Email
        </Label>
        <div className="relative">
          <Mail className="absolute top-3 left-3 h-4 w-4 text-gray-400" />
          <Input
            id="regEmail"
            name="email"
            type="email"
            placeholder="email@gmail.com"
            className={`h-11 border-gray-300 pl-10 focus:border-emerald-500 focus:ring-emerald-500 ${errors.email ? "border-red-500" : ""}`}
            value={formData.email}
            onChange={handleChange}
          />
        </div>
        {errors.email && (
          <p className="mt-1 text-xs text-red-500">{errors.email}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="regPhone" className="text-sm font-medium text-gray-700">
          Số điện thoại
        </Label>
        <div className="relative">
          <Phone className="absolute top-3 left-3 h-4 w-4 text-gray-400" />
          <Input
            id="regPhone"
            name="phone"
            type="tel"
            placeholder="0123456789"
            className={`h-11 border-gray-300 pl-10 focus:border-emerald-500 focus:ring-emerald-500 ${errors.phone ? "border-red-500" : ""}`}
            value={formData.phone}
            onChange={handleChange}
          />
        </div>
        {errors.phone && (
          <p className="mt-1 text-xs text-red-500">{errors.phone}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label
          htmlFor="regPassword"
          className="text-sm font-medium text-gray-700"
        >
          Mật khẩu
        </Label>
        <div className="relative">
          <Lock className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <Input
            id="regPassword"
            name="password"
            autoComplete="new-password"
            type={showPassword ? "text" : "password"}
            placeholder="••••••••"
            className={`h-11 w-full border-gray-300 pr-10 pl-10 focus:border-emerald-500 focus:ring-emerald-500 ${
              errors.password ? "border-red-500" : ""
            }`}
            value={formData.password}
            onChange={handleChange}
          />
          <button
            type="button"
            className="absolute top-1/2 right-3 -translate-y-1/2 text-gray-500 hover:text-gray-700"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? (
              <EyeOff className="h-4 w-4" />
            ) : (
              <Eye className="h-4 w-4" />
            )}
          </button>
        </div>
        {errors.password && (
          <p className="mt-1 text-xs text-red-500">{errors.password}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label
          htmlFor="confirmPassword"
          className="text-sm font-medium text-gray-700"
        >
          Nhập lại mật khẩu
        </Label>
        <div className="relative">
          <Lock className="absolute top-3 left-3 h-4 w-4 text-gray-400" />
          <Input
            id="confirmPassword"
            name="confirmPassword"
            type={showPassword ? "text" : "password"}
            placeholder="••••••••"
            className={`h-11 border-gray-300 pl-10 focus:border-emerald-500 focus:ring-emerald-500 ${errors.confirmPassword ? "border-red-500" : ""}`}
            value={formData.confirmPassword}
            onChange={handleChange}
          />
        </div>
        {errors.confirmPassword && (
          <p className="mt-1 text-xs text-red-500">{errors.confirmPassword}</p>
        )}
      </div>

      <Button
        type="submit"
        className="h-11 w-full bg-emerald-600 font-medium text-white hover:bg-emerald-700"
        disabled={isLoading}
      >
        {isLoading ? (
          <div className="flex items-center">
            <div className="mr-2 h-4 w-4 animate-spin rounded-full border-b-2 border-white"></div>
            Đang đăng ký...
          </div>
        ) : (
          "Đăng ký"
        )}
      </Button>
    </form>
  )
}

export default RegisterForm

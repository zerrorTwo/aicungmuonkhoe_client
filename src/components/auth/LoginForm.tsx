import React, { useState } from "react"
import { useNavigate } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Eye, EyeOff, Mail, Lock } from "lucide-react"
import { useLoginMutation } from "@/store/api/authApi"
import { useSendOtpMutation } from "@/store/api/mailApi"
import { useAppDispatch } from "@/store/hooks"
import {
  loginStart,
  loginSuccess,
  loginFailure,
} from "@/store/slices/authSlice"
import { OTP_TYPE } from "@/utils/constans"
import { handleApiError } from "@/utils/api"

interface LoginFormProps {
  onForgotPassword: () => void
  onNeedVerification: (email: string) => void
}

const LoginForm: React.FC<LoginFormProps> = ({
  onForgotPassword,
  onNeedVerification,
}) => {
  const navigate = useNavigate()
  const dispatch = useAppDispatch()
  const [login, { isLoading: isLoginLoading }] = useLoginMutation()
  const [sendOtp] = useSendOtpMutation()

  const getStatusFromError = (error: unknown): number | undefined => {
    if (typeof error === "object" && error !== null) {
      const maybe = error as { status?: unknown }
      if (typeof maybe.status === "number") return maybe.status
    }
    return undefined
  }

  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState("")
  const [loginData, setLoginData] = useState({
    email: "",
    password: "",
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setLoginData((prev) => ({ ...prev, [name]: value }))
    if (error) setError("")
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    if (!loginData.email || !loginData.password) {
      setError("Vui lòng điền đầy đủ thông tin")
      return
    }

    try {
      dispatch(loginStart())

      const result = await login({
        EMAIL: loginData.email,
        PASSWORD: loginData.password,
      }).unwrap()

      if (result.status === 200) {
        // Save to Redux
        dispatch(
          loginSuccess({
            user: result.data.user,
            token: result.data.access_token,
          })
        );

        // Save to localStorage
        localStorage.setItem("access_token", result.data.access_token);
        localStorage.setItem("user", JSON.stringify(result.data.user));
        localStorage.setItem("conversation_id", result.data.conversation_id);

        navigate("/", { replace: true });
      } else {
        dispatch(loginFailure());
        setError(result.message || "Đăng nhập thất bại");
      }
    } catch (err: any) {
      // Handle account not verified
      if (err.status === 403) {
        try {
          await sendOtp({
            EMAIL: loginData.email,
            OTP_TYPE: OTP_TYPE.SIGN_UP,
          }).unwrap();
          onNeedVerification(loginData.email);
        } catch (otpErr) {
          console.error("Error sending OTP:", otpErr);
          setError(
            "Tài khoản chưa xác thực và không thể gửi mã OTP. Vui lòng thử lại sau."
          );
        }
      } else {
        const errorMessage = handleApiError(err);
        setError(errorMessage);
        dispatch(loginFailure());
      }
    }
  };

  return (
    <form onSubmit={handleLogin} className="space-y-4">
      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-600">
          {error}
        </div>
      )}

      <div className="space-y-2">
        <Label htmlFor="email" className="text-sm font-medium text-gray-700">
          Email
        </Label>
        <div className="relative">
          <Mail className="absolute top-3 left-3 h-4 w-4 text-gray-400" />
          <Input
            id="email"
            name="email"
            type="email"
            placeholder="email@example.com"
            className="h-11 border-gray-300 pl-10 focus:border-emerald-500 focus:ring-emerald-500"
            value={loginData.email}
            onChange={handleChange}
            required
          />
        </div>
      </div>

      <div className="relative">
        <Lock className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-gray-400" />
        <Input
          id="password"
          name="password"
          autoComplete="new-password"
          type={showPassword ? "text" : "password"}
          placeholder="••••••••"
          className="h-11 w-full border-gray-300 pr-10 pl-10 focus:border-emerald-500 focus:ring-emerald-500"
          value={loginData.password}
          onChange={handleChange}
          required
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

      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={onForgotPassword}
          className="text-sm font-medium text-emerald-600 hover:text-emerald-700 hover:underline"
        >
          Quên mật khẩu?
        </button>
      </div>

      <Button
        type="submit"
        className="h-11 w-full bg-emerald-600 font-medium text-white hover:bg-emerald-700"
        disabled={isLoginLoading}
      >
        {isLoginLoading ? (
          <div className="flex items-center">
            <div className="mr-2 h-4 w-4 animate-spin rounded-full border-b-2 border-white"></div>
            Đang đăng nhập...
          </div>
        ) : (
          "Đăng nhập"
        )}
      </Button>
    </form>
  )
}

export default LoginForm

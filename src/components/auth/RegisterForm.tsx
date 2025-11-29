import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Eye, EyeOff, Mail, Lock, Phone } from 'lucide-react';
import { useSignupMutation } from '@/store/api/authApi';
import { handleApiError } from '@/utils/api';

interface RegisterFormProps {
    onSuccess: (email: string) => void;
}

const RegisterForm: React.FC<RegisterFormProps> = ({ onSuccess }) => {
    const [signup, { isLoading }] = useSignupMutation();
    const [showPassword, setShowPassword] = useState(false);
    const [formData, setFormData] = useState({
        email: '',
        phone: '',
        password: '',
        confirmPassword: ''
    });

    const [errors, setErrors] = useState({
        email: '',
        phone: '',
        password: '',
        confirmPassword: '',
        general: ''
    });

    const validateField = (name: string, value: string) => {
        let errorMessage = '';
        switch (name) {
            case 'email':
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!value) errorMessage = 'Vui lòng nhập email';
                else if (!emailRegex.test(value)) errorMessage = 'Email không hợp lệ';
                break;
            case 'phone':
                const phoneRegex = /^[0-9]{10}$/;
                if (!value) errorMessage = 'Vui lòng nhập số điện thoại';
                else if (!phoneRegex.test(value)) errorMessage = 'Số điện thoại phải có 10 chữ số';
                break;
            case 'password':
                // Min 6 chars, 1 uppercase, 1 special char
                const hasUpperCase = /[A-Z]/.test(value);
                const hasSpecialChar = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(value);
                if (!value) errorMessage = 'Vui lòng nhập mật khẩu';
                else if (value.length < 6) errorMessage = 'Mật khẩu phải có ít nhất 6 ký tự';
                else if (!hasUpperCase) errorMessage = 'Mật khẩu phải có ít nhất 1 chữ hoa';
                else if (!hasSpecialChar) errorMessage = 'Mật khẩu phải có ít nhất 1 ký tự đặc biệt';
                break;
            case 'confirmPassword':
                if (!value) errorMessage = 'Vui lòng nhập lại mật khẩu';
                else if (value !== formData.password) errorMessage = 'Mật khẩu không khớp';
                break;
            default:
                break;
        }
        return errorMessage;
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));

        // Real-time validation
        const error = validateField(name, value);
        setErrors(prev => ({ ...prev, [name]: error, general: '' }));

        // Special case: if password changes, re-validate confirmPassword if it has a value
        if (name === 'password' && formData.confirmPassword) {
            const confirmError = value !== formData.confirmPassword ? 'Mật khẩu không khớp' : '';
            setErrors(prev => ({ ...prev, confirmPassword: confirmError }));
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Validate all fields
        const emailError = validateField('email', formData.email);
        const phoneError = validateField('phone', formData.phone);
        const passwordError = validateField('password', formData.password);
        const confirmPasswordError = validateField('confirmPassword', formData.confirmPassword);

        if (emailError || phoneError || passwordError || confirmPasswordError) {
            setErrors({
                email: emailError,
                phone: phoneError,
                password: passwordError,
                confirmPassword: confirmPasswordError,
                general: ''
            });
            return;
        }

        try {
            const result = await signup({
                EMAIL: formData.email,
                PASSWORD: formData.password,
                PHONE: formData.phone,
            }).unwrap();

            if (result.status === 200) {
                onSuccess(formData.email);
            } else {
                setErrors(prev => ({ ...prev, general: result.message || 'Đăng ký thất bại' }));
            }
        } catch (err: any) {
            const errorMessage = handleApiError(err);
            setErrors(prev => ({ ...prev, general: errorMessage }));
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            {errors.general && (
                <div className="p-3 text-red-600 text-sm bg-red-50 border border-red-200 rounded-lg">
                    {errors.general}
                </div>
            )}

            <div className="space-y-2">
                <Label htmlFor="regEmail" className="text-sm font-medium text-gray-700">Email</Label>
                <div className="relative">
                    <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                        id="regEmail"
                        name="email"
                        type="email"
                        placeholder="email@gmail.com"
                        className={`pl-10 h-11 border-gray-300 focus:border-emerald-500 focus:ring-emerald-500 ${errors.email ? 'border-red-500' : ''}`}
                        value={formData.email}
                        onChange={handleChange}
                    />
                </div>
                {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email}</p>}
            </div>

            <div className="space-y-2">
                <Label htmlFor="regPhone" className="text-sm font-medium text-gray-700">Số điện thoại</Label>
                <div className="relative">
                    <Phone className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                        id="regPhone"
                        name="phone"
                        type="tel"
                        placeholder="0123456789"
                        className={`pl-10 h-11 border-gray-300 focus:border-emerald-500 focus:ring-emerald-500 ${errors.phone ? 'border-red-500' : ''}`}
                        value={formData.phone}
                        onChange={handleChange}
                    />
                </div>
                {errors.phone && <p className="text-xs text-red-500 mt-1">{errors.phone}</p>}
            </div>

            <div className="space-y-2">
                <Label htmlFor="regPassword" className="text-sm font-medium text-gray-700">Mật khẩu</Label>
                <div className="relative">
                    <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                        id="regPassword"
                        name="password"
                        type={showPassword ? "text" : "password"}
                        placeholder="••••••••"
                        className={`pl-10 pr-10 h-11 border-gray-300 focus:border-emerald-500 focus:ring-emerald-500 ${errors.password ? 'border-red-500' : ''}`}
                        value={formData.password}
                        onChange={handleChange}
                    />
                    <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                        onClick={() => setShowPassword(!showPassword)}
                    >
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>
                </div>
                {errors.password && <p className="text-xs text-red-500 mt-1">{errors.password}</p>}
            </div>

            <div className="space-y-2">
                <Label htmlFor="confirmPassword" className="text-sm font-medium text-gray-700">Nhập lại mật khẩu</Label>
                <div className="relative">
                    <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                        id="confirmPassword"
                        name="confirmPassword"
                        type={showPassword ? "text" : "password"}
                        placeholder="••••••••"
                        className={`pl-10 h-11 border-gray-300 focus:border-emerald-500 focus:ring-emerald-500 ${errors.confirmPassword ? 'border-red-500' : ''}`}
                        value={formData.confirmPassword}
                        onChange={handleChange}
                    />
                </div>
                {errors.confirmPassword && <p className="text-xs text-red-500 mt-1">{errors.confirmPassword}</p>}
            </div>

            <Button
                type="submit"
                className="w-full h-11 bg-emerald-600 hover:bg-emerald-700 text-white font-medium"
                disabled={isLoading}
            >
                {isLoading ? (
                    <div className="flex items-center">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Đang đăng ký...
                    </div>
                ) : (
                    "Đăng ký"
                )}
            </Button>
        </form>
    );
};

export default RegisterForm;

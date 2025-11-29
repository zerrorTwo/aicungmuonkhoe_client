import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Eye, EyeOff, Mail, Lock } from 'lucide-react';
import { useLoginMutation } from '@/store/api/authApi';
import { useSendOtpMutation } from '@/store/api/mailApi';
import { useAppDispatch } from '@/store/hooks';
import { loginStart, loginSuccess, loginFailure } from '@/store/slices/authSlice';
import { OTP_TYPE } from '@/utils/constans';
import { handleApiError } from '@/utils/api';

interface LoginFormProps {
    onForgotPassword: () => void;
    onNeedVerification: (email: string) => void;
}

const LoginForm: React.FC<LoginFormProps> = ({ onForgotPassword, onNeedVerification }) => {
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const [login, { isLoading: isLoginLoading }] = useLoginMutation();
    const [sendOtp] = useSendOtpMutation();

    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const [loginData, setLoginData] = useState({
        email: '',
        password: ''
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setLoginData(prev => ({ ...prev, [name]: value }));
        if (error) setError('');
    };

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (!loginData.email || !loginData.password) {
            setError('Vui lòng điền đầy đủ thông tin');
            return;
        }

        try {
            dispatch(loginStart());

            const result = await login({
                EMAIL: loginData.email,
                PASSWORD: loginData.password
            }).unwrap();

            if (result.status === 200) {
                // Save to Redux
                dispatch(loginSuccess({
                    user: result.data.user,
                    token: result.data.access_token,
                }));

                // Save to localStorage
                localStorage.setItem('access_token', result.data.access_token);
                localStorage.setItem('user', JSON.stringify(result.data.user));

                navigate('/', { replace: true });
            } else {
                dispatch(loginFailure());
                setError(result.message || 'Đăng nhập thất bại');
            }
        } catch (err: any) {
            // Handle account not verified
            if (err.status === 403) {
                try {
                    await sendOtp({ EMAIL: loginData.email, OTP_TYPE: OTP_TYPE.SIGN_UP }).unwrap();
                    onNeedVerification(loginData.email);
                } catch (otpErr) {
                    console.error('Error sending OTP:', otpErr);
                    setError('Tài khoản chưa xác thực và không thể gửi mã OTP. Vui lòng thử lại sau.');
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
                <div className="p-3 text-red-600 text-sm bg-red-50 border border-red-200 rounded-lg">
                    {error}
                </div>
            )}

            <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-medium text-gray-700">Email</Label>
                <div className="relative">
                    <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                        id="email"
                        name="email"
                        type="email"
                        placeholder="email@example.com"
                        className="pl-10 h-11 border-gray-300 focus:border-emerald-500 focus:ring-emerald-500"
                        value={loginData.email}
                        onChange={handleChange}
                        required
                    />
                </div>
            </div>

            <div className="space-y-2">
                <Label htmlFor="password" className="text-sm font-medium text-gray-700">Mật khẩu</Label>
                <div className="relative">
                    <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                        id="password"
                        name="password"
                        type={showPassword ? "text" : "password"}
                        placeholder="••••••••"
                        className="pl-10 pr-10 h-11 border-gray-300 focus:border-emerald-500 focus:ring-emerald-500"
                        value={loginData.password}
                        onChange={handleChange}
                        required
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
            </div>

            <div className="flex items-center justify-between">
                <button
                    type="button"
                    onClick={onForgotPassword}
                    className="text-sm text-emerald-600 hover:text-emerald-700 hover:underline font-medium"
                >
                    Quên mật khẩu?
                </button>
            </div>

            <Button
                type="submit"
                className="w-full h-11 bg-emerald-600 hover:bg-emerald-700 text-white font-medium"
                disabled={isLoginLoading}
            >
                {isLoginLoading ? (
                    <div className="flex items-center">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Đang đăng nhập...
                    </div>
                ) : (
                    "Đăng nhập"
                )}
            </Button>
        </form>
    );
};

export default LoginForm;

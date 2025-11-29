import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent } from '@/components/ui/card';
import { Mail, Lock, Shield } from 'lucide-react';
import Logo from '@/components/ui/Logo';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { useLoginMutation, useVerifyEmailMutation } from '../store/api/authApi';
import { useForgotPasswordMutation, useResetPasswordMutation } from '../store/api/userApi';
import { useAppDispatch } from '@/store/hooks';
import { loginSuccess } from '@/store/slices/authSlice';
import { handleApiError } from '@/utils/api';
import { useAuth } from '@/hooks/useAuth';
import { useSendOtpMutation } from '@/store/api/mailApi';
import LoginForm from '@/components/auth/LoginForm';
import RegisterForm from '@/components/auth/RegisterForm';
import { OTP_TYPE } from '@/utils/constans';

const Login: React.FC = () => {
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const { isAuthenticated } = useAuth();
    const [login] = useLoginMutation();
    const [verifyEmail, { isLoading: isVerifyEmailLoading }] = useVerifyEmailMutation();
    const [sendOtp] = useSendOtpMutation();
    const [forgotPassword, { isLoading: isForgotPasswordLoading }] = useForgotPasswordMutation();
    const [resetPassword, { isLoading: isResetPasswordLoading }] = useResetPasswordMutation();

    const [error, setError] = useState<string>('');

    // Verify email flow state for registration
    const [verifyEmailStep, setVerifyEmailStep] = useState<'register' | 'verify' | null>(null);
    const [verifyEmailData, setVerifyEmailData] = useState({
        email: '',
        otp: ''
    });

    // Forgot password flow state
    const [forgotPasswordStep, setForgotPasswordStep] = useState<'email' | 'reset' | null>(null);
    const [forgotPasswordData, setForgotPasswordData] = useState({
        email: '',
        otp: '',
        newPassword: '',
        confirmPassword: ''
    });

    // Temporary password storage for auto-login after verification
    const [tempPassword, setTempPassword] = useState('');

    // Check if user is already authenticated and redirect to home
    useEffect(() => {
        if (isAuthenticated()) {
            console.log('User is already authenticated, redirecting to home...');
            navigate('/', { replace: true });
        }
    }, [isAuthenticated, navigate]);

    // Verify email handlers
    const handleVerifyEmailInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setVerifyEmailData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleVerifyEmail = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (!verifyEmailData.otp) {
            setError('Vui lòng nhập mã OTP');
            return;
        }

        if (verifyEmailData.otp.length !== 6) {
            setError('Mã OTP phải có 6 số');
            return;
        }

        try {
            console.log('Verifying email with OTP:', verifyEmailData.otp);

            const result = await verifyEmail({
                EMAIL: verifyEmailData.email,
                OTP_CODE: verifyEmailData.otp
            }).unwrap();

            console.log('Verify email result:', result);

            if (result.status === 200) {
                // Email verified successfully, now login the user
                console.log('Email verified successfully, logging in user...');

                // Auto login after successful verification
                if (tempPassword) {
                    const loginResult = await login({
                        EMAIL: verifyEmailData.email,
                        PASSWORD: tempPassword
                    }).unwrap();

                    if (loginResult.status === 200) {
                        // Save to Redux
                        dispatch(loginSuccess({
                            user: loginResult.data.user,
                            token: loginResult.data.access_token,
                        }));

                        // Save to localStorage
                        localStorage.setItem('access_token', loginResult.data.access_token);
                        localStorage.setItem('user', JSON.stringify(loginResult.data.user));

                        console.log('Auto login successful after verification, navigating to home page...');
                        navigate('/', { replace: true });
                    } else {
                        setError('Xác thực thành công nhưng không thể đăng nhập tự động. Vui lòng đăng nhập thủ công.');
                        handleBackToLoginFromVerify();
                    }
                } else {
                    handleBackToLoginFromVerify();
                    // Optional: Show success message
                    // alert('Xác thực thành công! Vui lòng đăng nhập.');
                }
            } else {
                setError(result.message || 'Xác thực email thất bại');
            }
        } catch (err: any) {
            console.log('Verify email error:', err);
            const errorMessage = handleApiError(err);
            setError(errorMessage);
        }
    };

    const handleBackToLoginFromVerify = () => {
        setVerifyEmailStep(null);
        setVerifyEmailData({ email: '', otp: '' });
        setTempPassword('');
        setError('');
    };

    const handleResendVerificationOTP = async () => {
        setVerifyEmailData(prev => ({ ...prev, otp: '' }));
        setError('');

        try {
            console.log('Resending verification OTP to:', verifyEmailData.email);
            await sendOtp({ EMAIL: verifyEmailData.email, OTP_TYPE: OTP_TYPE.SIGN_UP }).unwrap();
        } catch (err: any) {
            console.log('Resend verification OTP error:', err);
            const errorMessage = handleApiError(err);
            setError(errorMessage);
        }
    };

    // Forgot password handlers
    const handleForgotPasswordInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setForgotPasswordData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSendOTP = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (!forgotPasswordData.email) {
            setError('Vui lòng nhập email');
            return;
        }

        try {
            console.log('Sending OTP to:', forgotPasswordData.email);

            // Call API to send OTP
            const result = await forgotPassword({
                EMAIL: forgotPasswordData.email
            }).unwrap();

            console.log('Send OTP result:', result);

            // Move to OTP verification step
            setForgotPasswordStep('reset');

        } catch (err: any) {
            console.log('Send OTP error:', err);
            const errorMessage = handleApiError(err);
            setError(errorMessage);
        }
    };

    const handleResetPassword = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (!forgotPasswordData.otp || !forgotPasswordData.newPassword || !forgotPasswordData.confirmPassword) {
            setError('Vui lòng điền đầy đủ thông tin');
            return;
        }

        if (forgotPasswordData.newPassword !== forgotPasswordData.confirmPassword) {
            setError('Mật khẩu mới và xác nhận mật khẩu không khớp');
            return;
        }

        if (forgotPasswordData.newPassword.length < 6) {
            setError('Mật khẩu phải có ít nhất 6 ký tự');
            return;
        }

        try {
            console.log('Resetting password with OTP:', forgotPasswordData.otp);

            // Call API to reset password
            const result = await resetPassword({
                EMAIL: forgotPasswordData.email,
                OTP_CODE: forgotPasswordData.otp,
                NEW_PASSWORD: forgotPasswordData.newPassword
            }).unwrap();

            console.log('Reset password result:', result);

            // Reset state and show success
            setForgotPasswordStep(null);
            setForgotPasswordData({ email: '', otp: '', newPassword: '', confirmPassword: '' });
            setError('');

        } catch (err: any) {
            console.log('Reset password error:', err);
            const errorMessage = handleApiError(err);
            setError(errorMessage);
        }
    };

    const handleBackToLogin = () => {
        setForgotPasswordStep(null);
        setForgotPasswordData({ email: '', otp: '', newPassword: '', confirmPassword: '' });
        setError('');
    };

    const handleResendOTP = async () => {
        setForgotPasswordData(prev => ({ ...prev, otp: '' }));
        setError('');

        try {
            console.log('Resending OTP to:', forgotPasswordData.email);

            // Call API to resend OTP
            const result = await forgotPassword({
                EMAIL: forgotPasswordData.email
            }).unwrap();

            console.log('Resend OTP result:', result);

        } catch (err: any) {
            console.log('Resend OTP error:', err);
            const errorMessage = handleApiError(err);
            setError(errorMessage);
        }
    };

    return (
        <div className="min-h-screen flex flex-col">
            {/* Header */}
            <Header />

            {/* Main Content */}
            <div className="flex-1 flex">
                <div className="flex-1 flex p-5 gap-[20px]">
                    <div className="flex-1 flex gap-5">
                        {/* Left Side - Background Image */}
                        <div className="hidden lg:flex lg:w-[calc(50%+50px)] relative">
                            <img
                                src="/auth-background.png"
                                alt="Login Background"
                                className="object-cover w-full h-full rounded-xl shadow-lg"
                            />
                        </div>

                        {/* Right Side - Login Form */}
                        <div className="max-h-[calc(700px)] overflow-y-auto rounded-xl shadow-lg w-full lg:w-[calc(50%-50px)] flex items-center justify-center bg-white p-5">
                            <div className="w-full h-full max-w-md space-y-8">
                                {/* Logo/Header */}
                                <div className="text-center">
                                    <Link
                                        to="/"
                                        className="inline-flex items-center justify-center hover:opacity-80 transition-opacity"
                                    >
                                        <Logo width={80} height={60} />
                                    </Link>
                                    <h2 className="mt-6 text-3xl font-bold text-gray-900">
                                        Chào mừng trở lại
                                    </h2>
                                    <p className="mt-2 text-sm text-gray-600">
                                        Đăng nhập để tiếp tục chăm sóc sức khỏe
                                    </p>
                                </div>

                                {/* Auth Form */}
                                <Card className="rounded-lg border-0 bg-white text-slate-900 shadow-[0_0_8px_rgba(0,0,0,0.2)]">
                                    <CardContent className="p-6">
                                        {/* Show Login/Register tabs only when not in forgot password or verify email mode */}
                                        {forgotPasswordStep === null && verifyEmailStep === null ? (
                                            <Tabs defaultValue="login" className="w-full">
                                                <TabsList className="grid w-full grid-cols-2 mb-6">
                                                    <TabsTrigger value="login" className="text-sm font-medium">
                                                        Đăng nhập
                                                    </TabsTrigger>
                                                    <TabsTrigger value="register" className="text-sm font-medium">
                                                        Đăng ký
                                                    </TabsTrigger>
                                                </TabsList>

                                                {/* Form Container with Fixed Height */}
                                                <div className="min-h-[300px]">
                                                    {/* Login Tab */}
                                                    <TabsContent value="login" className="space-y-4">
                                                        <LoginForm
                                                            onForgotPassword={() => setForgotPasswordStep('email')}
                                                            onNeedVerification={(email) => {
                                                                setVerifyEmailData({ email, otp: '' });
                                                                setVerifyEmailStep('verify');
                                                            }}
                                                        />
                                                    </TabsContent>

                                                    {/* Register Tab */}
                                                    <TabsContent value="register" className="space-y-4">
                                                        <RegisterForm
                                                            onSuccess={(email) => {
                                                                setVerifyEmailData({ email, otp: '' });
                                                                setVerifyEmailStep('verify');
                                                            }}
                                                        />
                                                    </TabsContent>
                                                </div>
                                            </Tabs>
                                        ) : verifyEmailStep !== null ? (
                                            /* Verify Email Flow */
                                            <div className="w-full">
                                                {/* Error Message for Verify Email */}
                                                {error && (
                                                    <div className="mb-4 p-3 text-red-600 text-sm bg-red-50 border border-red-200 rounded-lg">
                                                        {error}
                                                    </div>
                                                )}

                                                {/* Verify Email Step */}
                                                {verifyEmailStep === 'verify' && (
                                                    <div>
                                                        <div className="mb-6">
                                                            <h3 className="text-xl font-semibold text-gray-900 mb-1">
                                                                Xác thực email
                                                            </h3>
                                                            <p className="text-sm text-gray-600">
                                                                Nhập mã OTP đã được gửi đến: <span className="font-medium">{verifyEmailData.email}</span>
                                                            </p>
                                                        </div>

                                                        <form onSubmit={handleVerifyEmail} className="space-y-4">
                                                            <div className="space-y-2">
                                                                <Label className="text-sm font-medium text-gray-700">
                                                                    Mã OTP
                                                                </Label>
                                                                <div className="relative">
                                                                    <Shield className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                                                                    <Input
                                                                        name="otp"
                                                                        type="text"
                                                                        required
                                                                        maxLength={6}
                                                                        value={verifyEmailData.otp}
                                                                        onChange={handleVerifyEmailInputChange}
                                                                        className="pl-10 h-11 border-gray-300 focus:border-emerald-500 focus:ring-emerald-500 text-center tracking-wider font-mono"
                                                                        placeholder="000000"
                                                                    />
                                                                </div>
                                                            </div>

                                                            <div className="flex space-x-3 pt-2">
                                                                <Button
                                                                    type="button"
                                                                    variant="outline"
                                                                    onClick={handleBackToLoginFromVerify}
                                                                    className="flex-1"
                                                                >
                                                                    Quay lại
                                                                </Button>
                                                                <Button
                                                                    type="submit"
                                                                    disabled={isVerifyEmailLoading}
                                                                    className="flex-1 bg-emerald-600 hover:bg-emerald-700"
                                                                >
                                                                    {isVerifyEmailLoading ? (
                                                                        <>
                                                                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                                                            Đang xác thực...
                                                                        </>
                                                                    ) : (
                                                                        'Xác thực'
                                                                    )}
                                                                </Button>
                                                            </div>

                                                            <div className="text-center pt-4">
                                                                <button
                                                                    type="button"
                                                                    onClick={handleResendVerificationOTP}
                                                                    className="text-sm text-emerald-600 hover:text-emerald-700 hover:underline"
                                                                >
                                                                    Không nhận được mã? Gửi lại
                                                                </button>
                                                            </div>
                                                        </form>
                                                    </div>
                                                )}
                                            </div>
                                        ) : (
                                            /* Forgot Password Flow */
                                            <div className="w-full">
                                                {/* Error Message for Forgot Password */}
                                                {error && (
                                                    <div className="mb-4 p-3 text-red-600 text-sm bg-red-50 border border-red-200 rounded-lg">
                                                        {error}
                                                    </div>
                                                )}

                                                {/* Step 1: Enter Email */}
                                                {forgotPasswordStep === 'email' && (
                                                    <div>
                                                        <div className="mb-6">
                                                            <h3 className="text-xl font-semibold text-gray-900 mb-1">
                                                                Quên mật khẩu
                                                            </h3>
                                                            <p className="text-sm text-gray-600">
                                                                Nhập email của bạn để nhận mã xác thực
                                                            </p>
                                                        </div>

                                                        <form onSubmit={handleSendOTP} className="space-y-4">
                                                            <div className="space-y-2">
                                                                <Label className="text-sm font-medium text-gray-700">
                                                                    Email
                                                                </Label>
                                                                <div className="relative">
                                                                    <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                                                                    <Input
                                                                        name="email"
                                                                        type="email"
                                                                        required
                                                                        value={forgotPasswordData.email}
                                                                        onChange={handleForgotPasswordInputChange}
                                                                        className="pl-10 h-11 border-gray-300 focus:border-emerald-500 focus:ring-emerald-500"
                                                                        placeholder="Nhập email của bạn"
                                                                    />
                                                                </div>
                                                            </div>

                                                            <div className="flex space-x-3 pt-2">
                                                                <Button
                                                                    type="button"
                                                                    variant="outline"
                                                                    onClick={handleBackToLogin}
                                                                    className="flex-1"
                                                                >
                                                                    Quay lại
                                                                </Button>
                                                                <Button
                                                                    type="submit"
                                                                    disabled={isForgotPasswordLoading}
                                                                    className="flex-1 bg-emerald-600 hover:bg-emerald-700"
                                                                >
                                                                    {isForgotPasswordLoading ? (
                                                                        <div className="flex items-center">
                                                                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                                                            Đang gửi...
                                                                        </div>
                                                                    ) : (
                                                                        'Gửi mã'
                                                                    )}
                                                                </Button>
                                                            </div>
                                                        </form>
                                                    </div>
                                                )}

                                                {/* Step 2: Enter OTP and New Password */}
                                                {forgotPasswordStep === 'reset' && (
                                                    <div>
                                                        <div className="mb-6">
                                                            <h3 className="text-xl font-semibold text-gray-900 mb-1">
                                                                Đặt lại mật khẩu
                                                            </h3>
                                                            <p className="text-sm text-gray-600">
                                                                Nhập mã OTP đã được gửi đến: <span className="font-medium">{forgotPasswordData.email}</span>
                                                            </p>
                                                        </div>

                                                        <form onSubmit={handleResetPassword} className="space-y-4">
                                                            <div className="space-y-2">
                                                                <Label className="text-sm font-medium text-gray-700">
                                                                    Mã OTP
                                                                </Label>
                                                                <div className="relative">
                                                                    <Shield className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                                                                    <Input
                                                                        name="otp"
                                                                        type="text"
                                                                        required
                                                                        maxLength={6}
                                                                        value={forgotPasswordData.otp}
                                                                        onChange={handleForgotPasswordInputChange}
                                                                        className="pl-10 h-11 border-gray-300 focus:border-emerald-500 focus:ring-emerald-500 text-center tracking-wider font-mono"
                                                                        placeholder="000000"
                                                                    />
                                                                </div>
                                                            </div>

                                                            <div className="space-y-2">
                                                                <Label className="text-sm font-medium text-gray-700">
                                                                    Mật khẩu mới
                                                                </Label>
                                                                <div className="relative">
                                                                    <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                                                                    <Input
                                                                        name="newPassword"
                                                                        type="password"
                                                                        required
                                                                        value={forgotPasswordData.newPassword}
                                                                        onChange={handleForgotPasswordInputChange}
                                                                        className="pl-10 h-11 border-gray-300 focus:border-emerald-500 focus:ring-emerald-500"
                                                                        placeholder="Mật khẩu ít nhất 6 ký tự"
                                                                    />
                                                                </div>
                                                            </div>

                                                            <div className="space-y-2">
                                                                <Label className="text-sm font-medium text-gray-700">
                                                                    Xác nhận mật khẩu mới
                                                                </Label>
                                                                <div className="relative">
                                                                    <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                                                                    <Input
                                                                        name="confirmPassword"
                                                                        type="password"
                                                                        required
                                                                        value={forgotPasswordData.confirmPassword}
                                                                        onChange={handleForgotPasswordInputChange}
                                                                        className="pl-10 h-11 border-gray-300 focus:border-emerald-500 focus:ring-emerald-500"
                                                                        placeholder="Nhập lại mật khẩu mới"
                                                                    />
                                                                </div>
                                                            </div>

                                                            <div className="flex space-x-3 pt-2">
                                                                <Button
                                                                    type="button"
                                                                    variant="outline"
                                                                    onClick={() => setForgotPasswordStep('email')}
                                                                    className="flex-1"
                                                                >
                                                                    Quay lại
                                                                </Button>
                                                                <Button
                                                                    type="submit"
                                                                    disabled={isResetPasswordLoading}
                                                                    className="flex-1 bg-emerald-600 hover:bg-emerald-700"
                                                                >
                                                                    {isResetPasswordLoading ? (
                                                                        <div className="flex items-center">
                                                                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                                                            Đang xử lý...
                                                                        </div>
                                                                    ) : (
                                                                        'Đặt lại mật khẩu'
                                                                    )}
                                                                </Button>
                                                            </div>

                                                            <div className="text-center pt-4">
                                                                <button
                                                                    type="button"
                                                                    onClick={handleResendOTP}
                                                                    disabled={isForgotPasswordLoading}
                                                                    className="text-sm text-emerald-600 hover:text-emerald-700 hover:underline font-medium disabled:opacity-50"
                                                                >
                                                                    {isForgotPasswordLoading ? 'Đang gửi...' : 'Gửi lại mã OTP'}
                                                                </button>
                                                            </div>
                                                        </form>
                                                    </div>
                                                )}
                                            </div>
                                        )}

                                        {/* Terms */}
                                        <div className="mt-6 text-center text-xs text-gray-500">
                                            Bằng cách đăng ký, bạn đồng ý với{" "}
                                            <Link
                                                to="/terms"
                                                className="text-emerald-600 hover:text-emerald-700 hover:underline font-medium"
                                            >
                                                Điều khoản sử dụng
                                            </Link>{" "}
                                            và{" "}
                                            <Link
                                                to="/privacy"
                                                className="text-emerald-600 hover:text-emerald-700 hover:underline font-medium"
                                            >
                                                Chính sách bảo mật
                                            </Link>
                                        </div>
                                    </CardContent>
                                </Card>

                                {/* Footer */}
                                <div className="text-center text-sm text-gray-500 pb-5">
                                    © 2025 Ai cũng muốn khỏe. Tất cả quyền được bảo lưu.
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
            </div>

            {/* Footer */}
            <Footer />
        </div>
    );
};

export default Login;
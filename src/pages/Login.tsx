import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent } from '@/components/ui/card';
import { Eye, EyeOff, Mail, Lock, User, Shield } from 'lucide-react';
import Logo from '@/components/ui/Logo';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { useLoginMutation, useSignupMutation, useVerifyEmailMutation } from '../store/api/authApi';
import { useForgotPasswordMutation, useResetPasswordMutation } from '../store/api/userApi';
import { useAppDispatch } from '@/store/hooks';
import { loginStart, loginSuccess, loginFailure } from '@/store/slices/authSlice';
import { handleApiError } from '@/utils/api';
import { useAuth } from '@/hooks/useAuth';
import { useSendOtpMutation } from '@/store/api/mailApi';
import { OTP_TYPE } from '@/utils/constans';

const Login: React.FC = () => {
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const { isAuthenticated } = useAuth();
    const [login, { isLoading: isLoginLoading }] = useLoginMutation();
    const [signup] = useSignupMutation();
    const [verifyEmail, { isLoading: isVerifyEmailLoading }] = useVerifyEmailMutation();
    const [sendOtp] = useSendOtpMutation();
    const [forgotPassword, { isLoading: isForgotPasswordLoading }] = useForgotPasswordMutation();
    const [resetPassword, { isLoading: isResetPasswordLoading }] = useResetPasswordMutation();

    const [showPassword, setShowPassword] = useState(false);
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

    // Login form state
    const [loginData, setLoginData] = useState({
        email: '',
        password: ''
    });

    // Register form state
    const [registerData, setRegisterData] = useState({
        email: '',
        phone: '',
        password: '',
        confirmPassword: ''
    });

    // Check if user is already authenticated and redirect to home
    useEffect(() => {
        if (isAuthenticated()) {
            console.log('User is already authenticated, redirecting to home...');
            navigate('/', { replace: true });
        }
    }, [isAuthenticated, navigate]);

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

            console.log('Login result:', result);
            

            if (result.status === 200) {
                console.log('Login successful, user data:', result.data.user);

                // Save to Redux
                dispatch(loginSuccess({
                    user: result.data.user,
                    token: result.data.access_token,
                }));

                // Save to localStorage
                localStorage.setItem('access_token', result.data.access_token);
                localStorage.setItem('user', JSON.stringify(result.data.user));

                console.log('Login successful, navigating to home page...');
                // Navigate to home page - only on success
                navigate('/', { replace: true });
            } else {
                // Login failed - don't navigate
                console.log('Login failed with status:', result.status);
                dispatch(loginFailure());
                setError(result.message || 'Đăng nhập thất bại');
            }
        } catch (err: any) {
            // xử lý trường hợp tài khoản chưa xác thực email
            if (err.status === 403) {

                // tiến hành gửi lại otp xác thực email
                await sendOtp({ EMAIL: loginData.email, OTP_TYPE: OTP_TYPE.SIGN_UP }).unwrap();
                // Save email for verification and move to verify step
                setVerifyEmailData({
                    email: loginData.email,
                    otp: ''
                });
                setVerifyEmailStep('verify');
                setError(''); // Clear any previous errors
            } else {
            console.log('Login error caught:', err);
            const errorMessage = handleApiError(err);
            setError(errorMessage);
            dispatch(loginFailure());
            // Don't navigate on error - stay on login page
            }
        }
    };

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (!registerData.email || !registerData.password || !registerData.confirmPassword) {
            setError('Vui lòng điền đầy đủ thông tin');
            return;
        }

        if (!registerData.phone) {
            setError('Vui lòng nhập số điện thoại');
            return;
        }

        if (registerData.password !== registerData.confirmPassword) {
            setError('Mật khẩu và nhập lại mật khẩu không khớp');
            return;
        }

        if (registerData.password.length < 6) {
            setError('Mật khẩu phải có ít nhất 6 ký tự');
            return;
        }

        try {
            const result = await signup({
                EMAIL: registerData.email,
                PASSWORD: registerData.password,
                PHONE: registerData.phone,
            }).unwrap();

            console.log('Register result:', result);

            if (result.status === 200) {
                console.log('Register successful, moving to verify email step');
                
                // Save email for verification and move to verify step
                setVerifyEmailData({
                    email: registerData.email,
                    otp: ''
                });
                setVerifyEmailStep('verify');
                setError(''); // Clear any previous errors
            } else {
                // Register failed - don't navigate
                console.log('Register failed with status:', result.status);
                setError(result.message || 'Đăng ký thất bại');
            }
        } catch (err: any) {
            console.log('Register error caught:', err);
            const errorMessage = handleApiError(err);
            setError(errorMessage);
            // Don't navigate on error - stay on login page
        }
    };

    const handleLoginInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setLoginData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleRegisterInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setRegisterData(prev => ({
            ...prev,
            [name]: value
        }));
    };

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
                const loginResult = await login({
                    EMAIL: verifyEmailData.email,
                    PASSWORD: registerData.password // Use the password from registration
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
        setError('');
    };

    const handleResendVerificationOTP = async () => {
        setVerifyEmailData(prev => ({ ...prev, otp: '' }));
        setError('');
        
        try {
            console.log('Resending verification OTP to:', verifyEmailData.email);
            
            // Re-signup to trigger new OTP
            const result = await signup({
                EMAIL: verifyEmailData.email,
                PASSWORD: registerData.password,
                PHONE: registerData.phone,
            }).unwrap();

            console.log('Resend verification OTP result:', result);
            
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
                                src="/auth-background2.jpeg"
                                alt="Login Background"
                                className="object-cover w-full h-full rounded-xl shadow-lg"
                            />
                        </div>

                        {/* Right Side - Login Form */}
                        <div className="rounded-xl shadow-lg w-full lg:w-[calc(50%-50px)] flex items-center justify-center bg-white p-5">
                            <div className="w-full max-w-md space-y-8">
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

                                                {/* Error Message */}
                                                {error && (
                                                    <div className="mb-4 p-3 text-red-600 text-sm bg-red-50 border border-red-200 rounded-lg">
                                                        {error}
                                                    </div>
                                                )}

                                            {/* Form Container with Fixed Height */}
                                            <div className="min-h-[300px]">{/* Fixed height container */}

                                                {/* Login Tab */}
                                                <TabsContent value="login" className="space-y-4">
                                                    <form onSubmit={handleLogin} className="space-y-4">
                                                        <div className="space-y-2">
                                                            <Label
                                                                htmlFor="email"
                                                                className="text-sm font-medium text-gray-700"
                                                            >
                                                                Email
                                                            </Label>
                                                            <div className="relative">
                                                                <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                                                                <Input
                                                                    id="email"
                                                                    name="email"
                                                                    type="email"
                                                                    placeholder="email@example.com"
                                                                    className="pl-10 h-11 border-gray-300 focus:border-emerald-500 focus:ring-emerald-500"
                                                                    value={loginData.email}
                                                                    onChange={handleLoginInputChange}
                                                                    required
                                                                />
                                                            </div>
                                                        </div>

                                                        <div className="space-y-2">
                                                            <Label
                                                                htmlFor="password"
                                                                className="text-sm font-medium text-gray-700"
                                                            >
                                                                Mật khẩu
                                                            </Label>
                                                            <div className="relative">
                                                                <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                                                                <Input
                                                                    id="password"
                                                                    name="password"
                                                                    type={showPassword ? "text" : "password"}
                                                                    placeholder="••••••••"
                                                                    className="pl-10 pr-10 h-11 border-gray-300 focus:border-emerald-500 focus:ring-emerald-500"
                                                                    value={loginData.password}
                                                                    onChange={handleLoginInputChange}
                                                                    required
                                                                />
                                                                <Button
                                                                    type="button"
                                                                    variant="ghost"
                                                                    size="sm"
                                                                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                                                                    onClick={() => setShowPassword(!showPassword)}
                                                                >
                                                                    {showPassword ? (
                                                                        <EyeOff className="h-4 w-4" />
                                                                    ) : (
                                                                        <Eye className="h-4 w-4" />
                                                                    )}
                                                                </Button>
                                                            </div>
                                                        </div>

                                        <div className="flex items-center justify-between">
                                            <button
                                                type="button"
                                                onClick={() => setForgotPasswordStep('email')}
                                                className="text-sm text-emerald-600 hover:text-emerald-700 hover:underline font-medium"
                                            >
                                                Quên mật khẩu?
                                            </button>
                                        </div>                                                        <Button
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
                                                </TabsContent>

                                                {/* Register Tab */}
                                                <TabsContent value="register" className="space-y-4">
                                                    <form onSubmit={handleRegister} className="space-y-4">
                                                        <div className="space-y-2">
                                                            <Label
                                                                htmlFor="regEmail"
                                                                className="text-sm font-medium text-gray-700"
                                                            >
                                                                Email
                                                            </Label>
                                                            <div className="relative">
                                                                <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                                                                <Input
                                                                    id="regEmail"
                                                                    name="email"
                                                                    type="email"
                                                                    placeholder="email@gmail.com"
                                                                    className="pl-10 h-11 border-gray-300 focus:border-emerald-500 focus:ring-emerald-500"
                                                                    value={registerData.email}
                                                                    onChange={handleRegisterInputChange}
                                                                    required
                                                                />
                                                            </div>
                                                        </div>

                                                        <div className="space-y-2">
                                                            <Label
                                                                htmlFor="regPhone"
                                                                className="text-sm font-medium text-gray-700"
                                                            >
                                                                Số điện thoại
                                                            </Label>
                                                            <div className="relative">
                                                                <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                                                                <Input
                                                                    id="regPhone"
                                                                    name="phone"
                                                                    type="tel"
                                                                    placeholder="0123456789"
                                                                    className="pl-10 h-11 border-gray-300 focus:border-emerald-500 focus:ring-emerald-500"
                                                                    value={registerData.phone}
                                                                    onChange={handleRegisterInputChange}
                                                                    required
                                                                />
                                                            </div>
                                                        </div>

                                                        <div className="space-y-2">
                                                            <Label
                                                                htmlFor="regPassword"
                                                                className="text-sm font-medium text-gray-700"
                                                            >
                                                                Mật khẩu
                                                            </Label>
                                                            <div className="relative">
                                                                <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                                                                <Input
                                                                    id="regPassword"
                                                                    name="password"
                                                                    type={showPassword ? "text" : "password"}
                                                                    placeholder="••••••••"
                                                                    className="pl-10 pr-10 h-11 border-gray-300 focus:border-emerald-500 focus:ring-emerald-500"
                                                                    value={registerData.password}
                                                                    onChange={handleRegisterInputChange}
                                                                    required
                                                                    minLength={6}
                                                                />
                                                                <Button
                                                                    type="button"
                                                                    variant="ghost"
                                                                    size="sm"
                                                                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                                                                    onClick={() => setShowPassword(!showPassword)}
                                                                >
                                                                    {showPassword ? (
                                                                        <EyeOff className="h-4 w-4" />
                                                                    ) : (
                                                                        <Eye className="h-4 w-4" />
                                                                    )}
                                                                </Button>
                                                            </div>
                                                        </div>

                                                        <div className="space-y-2">
                                                            <Label
                                                                htmlFor="confirmPassword"
                                                                className="text-sm font-medium text-gray-700"
                                                            >
                                                                Nhập lại mật khẩu
                                                            </Label>
                                                            <div className="relative">
                                                                <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                                                                <Input
                                                                    id="confirmPassword"
                                                                    name="confirmPassword"
                                                                    type={showPassword ? "text" : "password"}
                                                                    placeholder="••••••••"
                                                                    className="pl-10 h-11 border-gray-300 focus:border-emerald-500 focus:ring-emerald-500"
                                                                    value={registerData.confirmPassword}
                                                                    onChange={handleRegisterInputChange}
                                                                    required
                                                                />
                                                            </div>
                                                        </div>

                                                        <Button
                                                            type="submit"
                                                            className="w-full h-11 bg-emerald-600 hover:bg-emerald-700 text-white font-medium"
                                                            disabled={isLoginLoading}
                                                        >
                                                            {isLoginLoading ? (
                                                                <div className="flex items-center">
                                                                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                                                    Đang đăng ký...
                                                                </div>
                                                            ) : (
                                                                "Đăng ký"
                                                            )}
                                                        </Button>
                                                    </form>
                                                </TabsContent>
                                            </div>{/* End of fixed height container */}
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
                                <div className="text-center text-sm text-gray-500">
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
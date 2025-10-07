import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent } from '@/components/ui/card';
import { Eye, EyeOff, Mail, Lock } from 'lucide-react';
import Logo from '@/components/ui/Logo';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { useLoginMutation, useSignupMutation } from '@/store/store';
import { useAppDispatch } from '@/store/hooks';
import { loginStart, loginSuccess, loginFailure } from '@/store/slices/authSlice';
import { handleApiError } from '@/utils/api';
import { useAuth } from '@/hooks/useAuth';

const Login: React.FC = () => {
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const { isAuthenticated } = useAuth();
    const [login, { isLoading: isLoginLoading }] = useLoginMutation();
    const [signup] = useSignupMutation();

    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState<string>('');

    // Login form state
    const [loginData, setLoginData] = useState({
        email: '',
        password: ''
    });

    // Register form state
    const [registerData, setRegisterData] = useState({
        email: '',
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

            console.log(result);

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
                // Navigate to home page with fallback
                setTimeout(() => {
                    try {
                        navigate('/', { replace: true });
                    } catch (error) {
                        console.log('React Router navigation failed, using window.location');
                        window.location.href = '/';
                    }
                }, 100);
            } else {
                throw new Error(result.message || 'Đăng nhập thất bại');
            }
        } catch (err: any) {
            const errorMessage = handleApiError(err);
            setError(errorMessage);
            dispatch(loginFailure());
        }
    };

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (!registerData.email || !registerData.password || !registerData.confirmPassword) {
            setError('Vui lòng điền đầy đủ thông tin');
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
            }).unwrap();

            if (result.status === 200) {
                console.log('Register successful, user data:', result.data.user);

                // Auto login after successful registration - Save to Redux
                dispatch(loginSuccess({
                    user: result.data.user,
                    token: result.data.access_token,
                }));

                // Save to localStorage
                localStorage.setItem('access_token', result.data.access_token);
                localStorage.setItem('user', JSON.stringify(result.data.user));

                console.log('Register successful, navigating to home page...');
                // Navigate to home page with fallback
                setTimeout(() => {
                    try {
                        navigate('/', { replace: true });
                    } catch (error) {
                        console.log('React Router navigation failed, using window.location');
                        window.location.href = '/';
                    }
                }, 100);
            } else {
                throw new Error(result.message || 'Đăng ký thất bại');
            }
        } catch (err: any) {
            const errorMessage = handleApiError(err);
            setError(errorMessage);
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
                                                            <Link
                                                                to="/forgot-password"
                                                                className="text-sm text-emerald-600 hover:text-emerald-700 hover:underline font-medium"
                                                            >
                                                                Quên mật khẩu?
                                                            </Link>
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
                                                                    placeholder="email@example.com"
                                                                    className="pl-10 h-11 border-gray-300 focus:border-emerald-500 focus:ring-emerald-500"
                                                                    value={registerData.email}
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
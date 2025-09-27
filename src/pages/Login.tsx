import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Eye, EyeOff, Mail, Lock, User, Phone, Calendar } from 'lucide-react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';

const Login: React.FC = () => {
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        // Mock login logic
        setTimeout(() => setIsLoading(false), 2000);
    };

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        // Mock register logic
        setTimeout(() => setIsLoading(false), 2000);
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-emerald-50 to-blue-50">
            <Header />

            <main className="container mx-auto px-4 py-12">
                <div className="max-w-md mx-auto">
                    <div className="text-center mb-8">
                        <h1 className="text-3xl font-bold text-slate-900 mb-2">Chào mừng trở lại</h1>
                        <p className="text-slate-600">Đăng nhập để tiếp tục chăm sóc sức khỏe</p>
                    </div>

                    <Card className="shadow-lg">
                        <CardHeader className="space-y-1 pb-4">
                            <CardTitle className="text-2xl text-center">Đăng nhập / Đăng ký</CardTitle>
                            <CardDescription className="text-center">
                                Tạo tài khoản mới hoặc đăng nhập vào tài khoản hiện có
                            </CardDescription>
                        </CardHeader>

                        <CardContent>
                            <Tabs defaultValue="login" className="w-full">
                                <TabsList className="grid w-full grid-cols-2">
                                    <TabsTrigger value="login">Đăng nhập</TabsTrigger>
                                    <TabsTrigger value="register">Đăng ký</TabsTrigger>
                                </TabsList>

                                <TabsContent value="login" className="space-y-4 mt-6">
                                    <form onSubmit={handleLogin} className="space-y-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="email">Email</Label>
                                            <div className="relative">
                                                <Mail className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                                                <Input
                                                    id="email"
                                                    type="email"
                                                    placeholder="email@example.com"
                                                    className="pl-10"
                                                    required
                                                />
                                            </div>
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="password">Mật khẩu</Label>
                                            <div className="relative">
                                                <Lock className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                                                <Input
                                                    id="password"
                                                    type={showPassword ? "text" : "password"}
                                                    placeholder="••••••••"
                                                    className="pl-10 pr-10"
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
                                            <Link to="/forgot-password" className="text-sm text-emerald-600 hover:underline">
                                                Quên mật khẩu?
                                            </Link>
                                        </div>

                                        <Button
                                            type="submit"
                                            className="w-full bg-emerald-600 hover:bg-emerald-700"
                                            disabled={isLoading}
                                        >
                                            {isLoading ? "Đang đăng nhập..." : "Đăng nhập"}
                                        </Button>
                                    </form>
                                </TabsContent>

                                <TabsContent value="register" className="space-y-4 mt-6">
                                    <form onSubmit={handleRegister} className="space-y-4">
                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="space-y-2">
                                                <Label htmlFor="firstName">Họ</Label>
                                                <div className="relative">
                                                    <User className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                                                    <Input
                                                        id="firstName"
                                                        placeholder="Nguyễn"
                                                        className="pl-10"
                                                        required
                                                    />
                                                </div>
                                            </div>
                                            <div className="space-y-2">
                                                <Label htmlFor="lastName">Tên</Label>
                                                <Input
                                                    id="lastName"
                                                    placeholder="Văn A"
                                                    required
                                                />
                                            </div>
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="regEmail">Email</Label>
                                            <div className="relative">
                                                <Mail className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                                                <Input
                                                    id="regEmail"
                                                    type="email"
                                                    placeholder="email@example.com"
                                                    className="pl-10"
                                                    required
                                                />
                                            </div>
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="phone">Số điện thoại</Label>
                                            <div className="relative">
                                                <Phone className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                                                <Input
                                                    id="phone"
                                                    type="tel"
                                                    placeholder="0123456789"
                                                    className="pl-10"
                                                    required
                                                />
                                            </div>
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="birthDate">Ngày sinh</Label>
                                            <div className="relative">
                                                <Calendar className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                                                <Input
                                                    id="birthDate"
                                                    type="date"
                                                    className="pl-10"
                                                    required
                                                />
                                            </div>
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="regPassword">Mật khẩu</Label>
                                            <div className="relative">
                                                <Lock className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                                                <Input
                                                    id="regPassword"
                                                    type={showPassword ? "text" : "password"}
                                                    placeholder="••••••••"
                                                    className="pl-10 pr-10"
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

                                        <Button
                                            type="submit"
                                            className="w-full bg-emerald-600 hover:bg-emerald-700"
                                            disabled={isLoading}
                                        >
                                            {isLoading ? "Đang đăng ký..." : "Đăng ký"}
                                        </Button>
                                    </form>
                                </TabsContent>
                            </Tabs>

                            <div className="mt-6 text-center text-sm text-slate-600">
                                Bằng cách đăng ký, bạn đồng ý với{' '}
                                <Link to="/terms" className="text-emerald-600 hover:underline">
                                    Điều khoản sử dụng
                                </Link>{' '}
                                và{' '}
                                <Link to="/privacy" className="text-emerald-600 hover:underline">
                                    Chính sách bảo mật
                                </Link>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </main>

            <Footer />
        </div>
    );
};

export default Login;
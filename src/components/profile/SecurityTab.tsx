import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Shield, Lock, Phone, Mail, Eye, EyeOff } from 'lucide-react';

const SecurityTab: React.FC = () => {
    const [showCurrentPassword, setShowCurrentPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    return (
        <Card className="shadow-weather">
            <CardHeader>
                <CardTitle className="flex items-center">
                    <Shield className="w-5 h-5 mr-2" />
                    Cài đặt bảo mật
                </CardTitle>
                <CardDescription>Quản lý mật khẩu và thông tin bảo mật tài khoản</CardDescription>
            </CardHeader>
            <CardContent>
                <Tabs defaultValue="password" className="space-y-4">
                    <TabsList className="grid w-full grid-cols-3">
                        <TabsTrigger value="password" className="flex items-center gap-2">
                            <Lock className="w-4 h-4" />
                            Mật khẩu
                        </TabsTrigger>
                        <TabsTrigger value="phone" className="flex items-center gap-2">
                            <Phone className="w-4 h-4" />
                            Số điện thoại
                        </TabsTrigger>
                        <TabsTrigger value="email" className="flex items-center gap-2">
                            <Mail className="w-4 h-4" />
                            Email
                        </TabsTrigger>
                    </TabsList>

                    <TabsContent value="password" className="space-y-4">
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-lg">Đổi mật khẩu</CardTitle>
                                <CardDescription>Cập nhật mật khẩu để bảo vệ tài khoản của bạn</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="currentPassword">Mật khẩu hiện tại</Label>
                                    <div className="relative">
                                        <Input
                                            id="currentPassword"
                                            type={showCurrentPassword ? "text" : "password"}
                                            placeholder="••••••••"
                                            className="pr-10"
                                        />
                                        <Button
                                            type="button"
                                            variant="ghost"
                                            size="sm"
                                            className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                                            onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                                        >
                                            {showCurrentPassword ? (
                                                <EyeOff className="h-4 w-4 text-muted-foreground" />
                                            ) : (
                                                <Eye className="h-4 w-4 text-muted-foreground" />
                                            )}
                                        </Button>
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="newPassword">Mật khẩu mới</Label>
                                    <div className="relative">
                                        <Input
                                            id="newPassword"
                                            type={showNewPassword ? "text" : "password"}
                                            placeholder="••••••••"
                                            className="pr-10"
                                        />
                                        <Button
                                            type="button"
                                            variant="ghost"
                                            size="sm"
                                            className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                                            onClick={() => setShowNewPassword(!showNewPassword)}
                                        >
                                            {showNewPassword ? (
                                                <EyeOff className="h-4 w-4 text-muted-foreground" />
                                            ) : (
                                                <Eye className="h-4 w-4 text-muted-foreground" />
                                            )}
                                        </Button>
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="confirmPassword">Xác nhận mật khẩu mới</Label>
                                    <div className="relative">
                                        <Input
                                            id="confirmPassword"
                                            type={showConfirmPassword ? "text" : "password"}
                                            placeholder="••••••••"
                                            className="pr-10"
                                        />
                                        <Button
                                            type="button"
                                            variant="ghost"
                                            size="sm"
                                            className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                        >
                                            {showConfirmPassword ? (
                                                <EyeOff className="h-4 w-4 text-muted-foreground" />
                                            ) : (
                                                <Eye className="h-4 w-4 text-muted-foreground" />
                                            )}
                                        </Button>
                                    </div>
                                </div>
                                <div className="flex justify-end">
                                    <Button className="bg-gradient-primary hover:opacity-90">
                                        <Lock className="w-4 h-4 mr-2" />
                                        Cập nhật mật khẩu
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    <TabsContent value="phone" className="space-y-4">
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-lg">Cập nhật số điện thoại</CardTitle>
                                <CardDescription>Thay đổi số điện thoại liên kết với tài khoản</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="currentPhone">Số điện thoại hiện tại</Label>
                                    <Input
                                        id="currentPhone"
                                        type="tel"
                                        placeholder="0987654321"
                                        defaultValue="0987654321"
                                        disabled
                                        className="bg-muted"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="newPhone">Số điện thoại mới</Label>
                                    <Input
                                        id="newPhone"
                                        type="tel"
                                        placeholder="Nhập số điện thoại mới"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="phoneOtp">Mã xác thực OTP</Label>
                                    <div className="flex gap-2">
                                        <Input
                                            id="phoneOtp"
                                            type="text"
                                            placeholder="Nhập mã OTP"
                                            className="flex-1"
                                        />
                                        <Button variant="outline">
                                            Gửi OTP
                                        </Button>
                                    </div>
                                </div>
                                <div className="flex justify-end">
                                    <Button className="bg-gradient-primary hover:opacity-90">
                                        <Phone className="w-4 h-4 mr-2" />
                                        Cập nhật số điện thoại
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    <TabsContent value="email" className="space-y-4">
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-lg">Cập nhật email</CardTitle>
                                <CardDescription>Thay đổi địa chỉ email liên kết với tài khoản</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="currentEmail">Email hiện tại</Label>
                                    <Input
                                        id="currentEmail"
                                        type="email"
                                        placeholder="minhnguyen@example.com"
                                        defaultValue="minhnguyen@example.com"
                                        disabled
                                        className="bg-muted"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="newEmail">Email mới</Label>
                                    <Input
                                        id="newEmail"
                                        type="email"
                                        placeholder="Nhập địa chỉ email mới"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="emailOtp">Mã xác thực từ email</Label>
                                    <div className="flex gap-2">
                                        <Input
                                            id="emailOtp"
                                            type="text"
                                            placeholder="Nhập mã xác thực"
                                            className="flex-1"
                                        />
                                        <Button variant="outline">
                                            Gửi mã xác thực
                                        </Button>
                                    </div>
                                </div>
                                <div className="flex justify-end">
                                    <Button className="bg-gradient-primary hover:opacity-90">
                                        <Mail className="w-4 h-4 mr-2" />
                                        Cập nhật email
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>
                </Tabs>
            </CardContent>
        </Card>
    );
};

export default SecurityTab;
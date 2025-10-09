import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Shield, Lock, Phone, Mail, Eye, EyeOff, Loader2, Check } from 'lucide-react';
import { useUpdateSecuritySettingMutation, useSendOtpMutation } from '@/store/api/userApi';
import { toastPromise } from '@/utils/toast';

const SecurityTab: React.FC = () => {
    const [showCurrentPassword, setShowCurrentPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    
    const currentUser = localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')!) : null;
    console.log(currentUser)
    // Form state for password change
    const [passwordForm, setPasswordForm] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
        newPhone: '',
        newEmail: '',
        otp: '',
    });

    // Error state for validation
    const [errors, setErrors] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
        newPhone: '',
        newEmail: '',
        otp: '',
        general: ''
    });

    const [otpState, setOtpState] = useState({
        loading: false,
        success: false,
        error: '',
    });

    // RTK Query mutation
    const [updateSecuritySetting, { isLoading: isUpdating }] = useUpdateSecuritySettingMutation();
    const [sendOtp] = useSendOtpMutation();

    // Clear error when user starts typing
    const clearError = (field: keyof typeof errors) => {
        if (errors[field]) {
            setErrors(prev => ({ ...prev, [field]: '' }));
        }
    };

    // Handle password form input changes
    const handlePasswordChange = (field: keyof typeof passwordForm, value: string) => {
        setPasswordForm(prev => ({
            ...prev,
            [field]: value
        }));
        
        // Clear error when user starts typing
        clearError(field as keyof typeof errors);
        if (errors.general) {
            setErrors(prev => ({ ...prev, general: '' }));
        }
    };

    // Validate form
    const validateForm = () => {
        const newErrors = {
            currentPassword: '',
            newPassword: '',
            confirmPassword: '',
            newPhone: '',
            newEmail: '',
            otp: '',
            general: ''
        };

        if (!passwordForm.currentPassword) {
            newErrors.currentPassword = 'Vui lòng nhập mật khẩu hiện tại';
        }

        if (!passwordForm.newPassword) {
            newErrors.newPassword = 'Vui lòng nhập mật khẩu mới';
        } else if (passwordForm.newPassword.length < 6) {
            newErrors.newPassword = 'Mật khẩu mới phải có ít nhất 6 ký tự';
        }

        if (!passwordForm.confirmPassword) {
            newErrors.confirmPassword = 'Vui lòng xác nhận mật khẩu mới';
        } else if (passwordForm.newPassword !== passwordForm.confirmPassword) {
            newErrors.confirmPassword = 'Mật khẩu xác nhận không khớp';
        }

        if (passwordForm.currentPassword && passwordForm.newPassword && 
            passwordForm.currentPassword === passwordForm.newPassword) {
            newErrors.newPassword = 'Mật khẩu mới phải khác mật khẩu hiện tại';
        }

        setErrors(newErrors);
        return !Object.values(newErrors).some(error => error !== '');
    };

    // Validate form for phone/email update
    const validateUpdateForm = (type: 'phone' | 'email') => {
        const newErrors = {
            currentPassword: '',
            newPassword: '',
            confirmPassword: '',
            newPhone: '',
            newEmail: '',
            otp: '',
            general: ''
        };

        if (type === 'phone') {
            if (!passwordForm.newPhone) {
                newErrors.newPhone = 'Vui lòng nhập số điện thoại mới';
            } else if (!/^[0-9]{10,11}$/.test(passwordForm.newPhone)) {
                newErrors.newPhone = 'Số điện thoại không hợp lệ';
            }
        }

        if (type === 'email') {
            if (!passwordForm.newEmail) {
                newErrors.newEmail = 'Vui lòng nhập email mới';
            } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(passwordForm.newEmail)) {
                newErrors.newEmail = 'Email không hợp lệ';
            }
        }

        if (!passwordForm.otp) {
            newErrors.otp = 'Vui lòng nhập mã OTP';
        } else if (passwordForm.otp.length !== 6) {
            newErrors.otp = 'Mã OTP phải có 6 ký tự';
        }

        setErrors(newErrors);
        return !Object.values(newErrors).some(error => error !== '');
    };

    // Unified function to handle all security updates
    const handleSecurityUpdate = async (type: 'password' | 'phone' | 'email') => {
        try {
            // Reset general error
            setErrors(prev => ({ ...prev, general: '' }));

            // Validate form based on type
            let isValid = false;
            if (type === 'password') {
                isValid = validateForm();
            } else {
                isValid = validateUpdateForm(type);
            }

            if (!isValid) {
                return;
            }

            // Prepare payload based on type
            let payload = {};
            let messages = {
                loading: '',
                success: '',
                error: ''
            };

            switch (type) {
                case 'password':
                    payload = {
                        CURRENT_PASSWORD: passwordForm.currentPassword,
                        NEW_PASSWORD: passwordForm.newPassword
                    };
                    messages = {
                        loading: 'Đang cập nhật mật khẩu...',
                        success: 'Cập nhật mật khẩu thành công!',
                        error: 'Có lỗi xảy ra khi cập nhật mật khẩu'
                    };
                    break;
                case 'phone':
                    payload = {
                        PHONE: passwordForm.newPhone,
                        OTP_CODE: passwordForm.otp,
                    };
                    messages = {
                        loading: 'Đang cập nhật số điện thoại...',
                        success: 'Cập nhật số điện thoại thành công!',
                        error: 'Cập nhật số điện thoại thất bại'
                    };
                    break;
                case 'email':
                    payload = {
                        EMAIL: passwordForm.newEmail,
                        OTP_CODE: passwordForm.otp,
                    };
                    messages = {
                        loading: 'Đang cập nhật email...',
                        success: 'Cập nhật email thành công!',
                        error: 'Cập nhật email thất bại'
                    };
                    break;
            }

            // Call API
            const result = await toastPromise(
                updateSecuritySetting(payload).unwrap(),
                messages
            );

            // thay đổi localStorage sau khi update
            localStorage.removeItem('user');
            localStorage.setItem('user', JSON.stringify(result.data));
            
            // Reset form on success
            setPasswordForm({
                currentPassword: '',
                newPassword: '',
                confirmPassword: '',
                newPhone: '',
                newEmail: '',
                otp: '',
            });

            // Reset OTP state for phone/email updates
            if (type === 'phone' || type === 'email') {
                setOtpState({ loading: false, success: false, error: '' });
            }

        } catch (error: any) {
            console.error(`${type} update error:`, error);
            
            // Handle specific errors from backend
            if (type === 'password' && error?.data?.message?.includes('Current password is incorrect')) {
                setErrors(prev => ({ ...prev, currentPassword: 'Mật khẩu hiện tại không đúng' }));
            } else {
                setErrors(prev => ({ ...prev, general: `Có lỗi xảy ra khi cập nhật ${type === 'password' ? 'mật khẩu' : type === 'phone' ? 'số điện thoại' : 'email'}. Vui lòng thử lại.` }));
            }
        }
    };

    const handleSendOtp = async (type: 'email' | 'phone', value: string) => {
        // Validate input before sending OTP
        if (!value) {
            setErrors(prev => ({
                ...prev,
                [type === 'email' ? 'newEmail' : 'newPhone']: `Vui lòng nhập ${type === 'email' ? 'email' : 'số điện thoại'} mới`
            }));
            return;
        }

        if (type === 'email' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
            setErrors(prev => ({ ...prev, newEmail: 'Email không hợp lệ' }));
            return;
        }

        if (type === 'phone' && !/^[0-9]{10,11}$/.test(value)) {
            setErrors(prev => ({ ...prev, newPhone: 'Số điện thoại không hợp lệ' }));
            return;
        }

        setOtpState({ loading: true, success: false, error: '' });
        
        try {
            const payload = type === 'email' ? { email: value } : { phone: value };
            
            await toastPromise(
                sendOtp(payload).unwrap(),
                {
                    loading: 'Đang gửi mã xác thực...',
                    success: 'Mã xác thực đã được gửi!',
                    error: 'Gửi mã xác thực thất bại',
                }
            );
            setOtpState({ loading: false, success: true, error: '' });
        } catch (error: any) {
            console.error('Send OTP error:', error);
            setOtpState({ loading: false, success: false, error: error.message || 'Có lỗi xảy ra' });
        }
    };

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
                                {/* General error message */}
                                {errors.general && (
                                    <div className="bg-red-50 border border-red-200 rounded-md p-3">
                                        <p className="text-red-700 text-sm">{errors.general}</p>
                                    </div>
                                )}

                                <div className="space-y-2">
                                    <Label htmlFor="currentPassword">Mật khẩu hiện tại</Label>
                                    <div className="relative">
                                        <Input
                                            id="currentPassword"
                                            type={showCurrentPassword ? "text" : "password"}
                                            placeholder="••••••••"
                                            className={`pr-10 ${errors.currentPassword ? 'border-red-500 focus:border-red-500' : ''}`}
                                            value={passwordForm.currentPassword}
                                            onChange={(e) => handlePasswordChange('currentPassword', e.target.value)}
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
                                    {errors.currentPassword && (
                                        <p className="text-red-500 text-sm mt-1">{errors.currentPassword}</p>
                                    )}
                                </div>
                                
                                <div className="space-y-2">
                                    <Label htmlFor="newPassword">Mật khẩu mới</Label>
                                    <div className="relative">
                                        <Input
                                            id="newPassword"
                                            type={showNewPassword ? "text" : "password"}
                                            placeholder="••••••••"
                                            className={`pr-10 ${errors.newPassword ? 'border-red-500 focus:border-red-500' : ''}`}
                                            value={passwordForm.newPassword}
                                            onChange={(e) => handlePasswordChange('newPassword', e.target.value)}
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
                                    {errors.newPassword && (
                                        <p className="text-red-500 text-sm mt-1">{errors.newPassword}</p>
                                    )}
                                </div>
                                
                                <div className="space-y-2">
                                    <Label htmlFor="confirmPassword">Xác nhận mật khẩu mới</Label>
                                    <div className="relative">
                                        <Input
                                            id="confirmPassword"
                                            type={showConfirmPassword ? "text" : "password"}
                                            placeholder="••••••••"
                                            className={`pr-10 ${errors.confirmPassword ? 'border-red-500 focus:border-red-500' : ''}`}
                                            value={passwordForm.confirmPassword}
                                            onChange={(e) => handlePasswordChange('confirmPassword', e.target.value)}
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
                                    {errors.confirmPassword && (
                                        <p className="text-red-500 text-sm mt-1">{errors.confirmPassword}</p>
                                    )}
                                </div>
                                
                                {/* Password strength indicator - only show if no errors on new password */}
                                {passwordForm.newPassword && !errors.newPassword && (
                                    <div className="space-y-2">
                                        <div className="flex items-center justify-between text-sm">
                                            <span>Độ mạnh mật khẩu:</span>
                                            <span className={`font-medium ${
                                                passwordForm.newPassword.length >= 8 
                                                    ? 'text-green-600' 
                                                    : passwordForm.newPassword.length >= 6 
                                                    ? 'text-yellow-600' 
                                                    : 'text-red-600'
                                            }`}>
                                                {passwordForm.newPassword.length >= 8 
                                                    ? 'Mạnh' 
                                                    : passwordForm.newPassword.length >= 6 
                                                    ? 'Trung bình' 
                                                    : 'Yếu'}
                                            </span>
                                        </div>
                                        <div className="h-2 bg-gray-200 rounded-full">
                                            <div 
                                                className={`h-full rounded-full transition-all duration-300 ${
                                                    passwordForm.newPassword.length >= 8 
                                                        ? 'bg-green-500 w-full' 
                                                        : passwordForm.newPassword.length >= 6 
                                                        ? 'bg-yellow-500 w-2/3' 
                                                        : 'bg-red-500 w-1/3'
                                                }`}
                                            />
                                        </div>
                                    </div>
                                )}

                                {/* Password match indicator - only show if both passwords are entered and no errors */}
                                {passwordForm.confirmPassword && passwordForm.newPassword && !errors.confirmPassword && !errors.newPassword && (
                                    <div className="text-sm">
                                        {passwordForm.newPassword === passwordForm.confirmPassword ? (
                                            <span className="text-green-600 flex items-center">
                                                ✓ Mật khẩu khớp
                                            </span>
                                        ) : (
                                            <span className="text-red-600 flex items-center">
                                                ✗ Mật khẩu không khớp
                                            </span>
                                        )}
                                    </div>
                                )}

                                <div className="flex justify-end">
                                    <Button 
                                        className="bg-gradient-primary hover:opacity-90"
                                        onClick={() => handleSecurityUpdate('password')}
                                        disabled={isUpdating}
                                    >
                                        <Lock className="w-4 h-4 mr-2" />
                                        {isUpdating ? 'Đang cập nhật...' : 'Cập nhật mật khẩu'}
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
                                        defaultValue={currentUser?.PHONE || '0987654321'}
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
                                        className={errors.newPhone ? 'border-red-500 focus:border-red-500' : ''}
                                        value={passwordForm.newPhone}
                                        onChange={(e) => handlePasswordChange('newPhone', e.target.value)}
                                    />
                                    {errors.newPhone && (
                                        <p className="text-red-500 text-sm mt-1">{errors.newPhone}</p>
                                    )}
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="phoneOtp">Mã xác thực OTP</Label>
                                    <div className="flex gap-2">
                                        <Input
                                            id="phoneOtp"
                                            type="text"
                                            placeholder="Nhập mã OTP"
                                            className={`flex-1 ${errors.otp ? 'border-red-500 focus:border-red-500' : ''}`}
                                            value={passwordForm.otp}
                                            onChange={(e) => handlePasswordChange('otp', e.target.value)}
                                        />
                                        <Button
                                            className='cursor-pointer'
                                            variant="outline"
                                            onClick={() => handleSendOtp('phone', passwordForm.newPhone)}
                                            disabled={otpState.loading || otpState.success || !passwordForm.newPhone}
                                        >
                                            {otpState.loading ? (
                                                <Loader2 className="w-4 h-4 animate-spin" />
                                            ) : otpState.success ? (
                                                <Check className="w-4 h-4 text-green-600" />
                                            ) : (
                                                'Gửi OTP'
                                            )}
                                        </Button>
                                    </div>
                                    {errors.otp && (
                                        <p className="text-red-500 text-sm mt-1">{errors.otp}</p>
                                    )}
                                </div>
                                <div className="flex justify-end">
                                    <Button 
                                        className="bg-gradient-primary hover:opacity-90"
                                        onClick={() => handleSecurityUpdate('phone')}
                                    >
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
                                        defaultValue={currentUser?.EMAIL || 'minhnguyen@example.com'}
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
                                        className={errors.newEmail ? 'border-red-500 focus:border-red-500' : ''}
                                        value={passwordForm.newEmail}
                                        onChange={(e) => handlePasswordChange('newEmail', e.target.value)}
                                    />
                                    {errors.newEmail && (
                                        <p className="text-red-500 text-sm mt-1">{errors.newEmail}</p>
                                    )}
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="emailOtp">Mã xác thực từ email</Label>
                                    <div className="flex gap-2">
                                        <Input
                                            id="emailOtp"
                                            type="text"
                                            placeholder="Nhập mã xác thực"
                                            className={`flex-1 ${errors.otp ? 'border-red-500 focus:border-red-500' : ''}`}
                                            value={passwordForm.otp}
                                            onChange={(e) => handlePasswordChange('otp', e.target.value)}
                                        />
                                        <Button
                                            className='cursor-pointer'
                                            variant="outline"
                                            onClick={() => handleSendOtp('email', passwordForm.newEmail)}
                                            disabled={otpState.loading || otpState.success || !passwordForm.newEmail}
                                        >
                                            {otpState.loading ? (
                                                <Loader2 className="w-4 h-4 animate-spin" />
                                            ) : otpState.success ? (
                                                <Check className="w-4 h-4 text-green-600" />
                                            ) : (
                                                'Gửi mã xác thực'
                                            )}
                                        </Button>
                                    </div>
                                    {errors.otp && (
                                        <p className="text-red-500 text-sm mt-1">{errors.otp}</p>
                                    )}
                                </div>
                                <div className="flex justify-end">
                                    <Button 
                                        className="bg-gradient-primary hover:opacity-90"
                                        onClick={() => handleSecurityUpdate('email')}
                                    >
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
import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Camera } from 'lucide-react';
import type { UserInfo } from '@/types/user.type';
interface ProfileAvatarProps {
    userInfo: UserInfo | null;

    isEditing: boolean;
    onAvatarChange?: (file: File | null) => void;
}

const ProfileAvatar: React.FC<ProfileAvatarProps> = ({ userInfo, isEditing, onAvatarChange }) => {
    const fileInputRef = React.useRef<HTMLInputElement>(null);

    // Lấy initials từ tên hoặc email
    const getInitials = (name: string, email: string) => {
        if (name && name.trim()) {
            return name.split(' ')
                .filter(n => n.length > 0)
                .map(n => n[0].toUpperCase())
                .slice(0, 2)
                .join('');
        }
        // Fallback từ email
        return email.charAt(0).toUpperCase();
    };

    const handleCameraClick = () => {
        if (isEditing && onAvatarChange) {
            fileInputRef.current?.click();
        }
    };

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0] || null;
        if (onAvatarChange) {
            onAvatarChange(file);
        }
        // Reset input để có thể chọn lại cùng file
        event.target.value = '';
    };

    const initials = getInitials(userInfo?.FULL_NAME || '', userInfo?.EMAIL || '');
    
    return (
        <div className="flex flex-col items-center space-y-4">
            <div className="relative">
                <Avatar className="w-24 h-24">
                    {userInfo?.AVATAR ? (
                        <AvatarImage
                            src={userInfo.AVATAR}
                            alt="Profile"
                        />
                    ) : (
                        // Fallback để hiển thị hình đẹp nếu không có avatar từ backend
                        <AvatarImage
                            src="https://images.unsplash.com/photo-1494790108755-2616c9cf0d4f?q=80&w=387&auto=format&fit=crop"
                            alt="Profile"
                        />
                    )}
                    <AvatarFallback className="text-2xl bg-gradient-primary text-primary-foreground">
                        {initials}
                    </AvatarFallback>
                </Avatar>
                {isEditing && onAvatarChange && (
                    <>
                        <Button
                            size="sm"
                            className="absolute -bottom-2 -right-2 rounded-full w-8 h-8 p-0"
                            onClick={handleCameraClick}
                        >
                            <Camera className="w-4 h-4" />
                        </Button>
                        <input
                            ref={fileInputRef}
                            type="file"
                            accept="image/jpeg,image/jpg,image/png,image/webp"
                            onChange={handleFileChange}
                            className="hidden"
                        />
                    </>
                )}
            </div>
            <div className="text-center">
                <h3 className="text-xl font-semibold">{userInfo?.FULL_NAME || "Người dùng"}</h3>
                <p className="text-muted-foreground">{userInfo?.EMAIL}</p>
                <Badge variant="secondary" className="mt-2">Tài khoản đã xác thực</Badge>
            </div>
        </div>
    );
};

export default ProfileAvatar;
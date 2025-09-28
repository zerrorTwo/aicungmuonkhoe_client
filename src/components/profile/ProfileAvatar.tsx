import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Camera } from 'lucide-react';

interface ProfileAvatarProps {
    userInfo: {
        name: string;
        email: string;
        avatar?: string;
    };
    isEditing: boolean;
}

const ProfileAvatar: React.FC<ProfileAvatarProps> = ({ userInfo, isEditing }) => {
    return (
        <div className="flex flex-col items-center space-y-4">
            <div className="relative">
                <Avatar className="w-24 h-24">
                    <AvatarImage
                        src="https://images.unsplash.com/photo-1494790108755-2616c9cf0d4f?q=80&w=387&auto=format&fit=crop"
                        alt="Profile"
                    />
                    <AvatarFallback className="text-2xl bg-gradient-primary text-primary-foreground">
                        {userInfo.name.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                </Avatar>
                {isEditing && (
                    <Button
                        size="sm"
                        className="absolute -bottom-2 -right-2 rounded-full w-8 h-8 p-0"
                    >
                        <Camera className="w-4 h-4" />
                    </Button>
                )}
            </div>
            <div className="text-center">
                <h3 className="text-xl font-semibold">{userInfo.name}</h3>
                <p className="text-muted-foreground">{userInfo.email}</p>
                <Badge variant="secondary" className="mt-2">Tài khoản đã xác thực</Badge>
            </div>
        </div>
    );
};

export default ProfileAvatar;
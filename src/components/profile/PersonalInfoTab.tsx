import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Edit3, X, Save } from 'lucide-react';
import ProfileAvatar from './ProfileAvatar';
import PersonalInfoForm from './PersonalInfoForm';

interface PersonalInfoTabProps {
    userInfo: {
        name: string;
        email: string;
        phone: string;
        birthDate: string;
        gender: string;
        address: string;
        avatar?: string;
    };
}

const PersonalInfoTab: React.FC<PersonalInfoTabProps> = ({ userInfo }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const handleSave = async () => {
        setIsLoading(true);
        // Mock save logic
        setTimeout(() => {
            setIsLoading(false);
            setIsEditing(false);
        }, 1500);
    };

    return (
        <Card className="shadow-weather animate-scale-in">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
                <div>
                    <CardTitle className="text-2xl">Thông tin cá nhân</CardTitle>
                    <CardDescription>Cập nhật thông tin cá nhân của bạn</CardDescription>
                </div>
                <Button
                    variant={isEditing ? "destructive" : "outline"}
                    size="sm"
                    className='cursor-pointer'
                    onClick={() => isEditing ? setIsEditing(false) : setIsEditing(true)}
                >
                    {isEditing ? <X className="cursor-pointer w-4 h-4 mr-2" /> : <Edit3 className="cursor-pointer w-4 h-4 mr-2" />}
                    {isEditing ? 'Hủy' : 'Chỉnh sửa'}
                </Button>
            </CardHeader>

            <CardContent className="space-y-6">
                <ProfileAvatar userInfo={userInfo} isEditing={isEditing} />
                <PersonalInfoForm userInfo={userInfo} isEditing={isEditing} />

                {isEditing && (
                    <div className="flex justify-end space-x-4">
                        <Button className='cursor-pointer' variant="outline" onClick={() => setIsEditing(false)}>
                            Hủy
                        </Button>
                        <Button
                            onClick={handleSave}
                            disabled={isLoading}
                            className="cursor-pointer bg-gradient-primary hover:opacity-90"
                        >
                            {isLoading ? "Đang lưu..." : (
                                <>
                                    <Save className="w-4 h-4 mr-2" />
                                    Lưu thay đổi
                                </>
                            )}
                        </Button>
                    </div>
                )}
            </CardContent>
        </Card>
    );
};

export default PersonalInfoTab;
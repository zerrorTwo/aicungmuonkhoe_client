import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Edit3, X, Save } from 'lucide-react';
import { showToast, toastPromise } from '@/utils/toast';
import { useUpdateUserProfileMutation } from '@/store/api/userApi';
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
    const [formData, setFormData] = useState({
        fullName: '',
        phone: '',
        birthDate: '',
        address: '',
        avatar: '',
        genderId: 1
    });

    // RTK Query mutation hook
    const [updateUserProfile, { isLoading: isUpdating, error: updateError }] = useUpdateUserProfileMutation();

    // Initialize form data khi userInfo thay đổi
    React.useEffect(() => {
        if (userInfo) {
            setFormData({
                fullName: userInfo.name || '',
                phone: userInfo.phone || '',
                birthDate: userInfo.birthDate || '',
                address: userInfo.address || '',
                avatar: userInfo.avatar || '',
                genderId: userInfo.gender === 'NỮ' ? 2 : 1 // Convert gender name to ID
            });
        }
    }, [userInfo]);

    const handleSave = async () => {
        try {
            
            // Prepare update data (chỉ gửi fields đã thay đổi)
            const updateData: any = {};
            
            if (formData.fullName !== userInfo.name) {
                updateData.fullName = formData.fullName;
            }
            if (formData.phone !== userInfo.phone) {
                updateData.phone = formData.phone;
            }
            if (formData.birthDate !== userInfo.birthDate) {
                updateData.birthDate = formData.birthDate;
            }
            if (formData.address !== userInfo.address) {
                updateData.address = formData.address;
            }
            if (formData.avatar !== userInfo.avatar) {
                updateData.avatar = formData.avatar;
            }
            
            // Gender logic: chỉ update nếu khác
            const currentGenderId = userInfo.gender === 'NỮ' ? 2 : 1;
            if (formData.genderId !== currentGenderId) {
                updateData.genderId = formData.genderId;
            }

            // Chỉ call API nếu có thay đổi
            if (Object.keys(updateData).length > 0) {
                // Sử dụng toastPromise cho API call
                await toastPromise(
                    updateUserProfile(updateData).unwrap(),
                    {
                        loading: 'Đang cập nhật thông tin...',
                        success: 'Cập nhật thông tin thành công!',
                        error: 'Có lỗi xảy ra khi cập nhật thông tin!'
                    }
                );
                
                setIsEditing(false);
            } else {
                // Info toast when no changes
                showToast.info('Không có thay đổi nào để lưu');
                setIsEditing(false);
            }
            
        } catch (error) {
            console.error('Update failed:', error);
            // Error được handle bởi toastPromise rồi, không cần thêm error toast ở đây
        }
    };

    // Đảm bảo userInfo có đầy đủ properties với default values
    const safeUserInfo = {
        name: userInfo?.name || "Người dùng",
        email: userInfo?.email || "",
        phone: userInfo?.phone || "",
        birthDate: userInfo?.birthDate || "",
        gender: userInfo?.gender || "",
        address: userInfo?.address || "",
        avatar: userInfo?.avatar || "",
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
                <ProfileAvatar userInfo={safeUserInfo} isEditing={isEditing} />
                <PersonalInfoForm 
                    userInfo={safeUserInfo} 
                    isEditing={isEditing}
                    formData={formData}
                    onFormDataChange={setFormData}
                />

                {updateError && (
                    <div className="text-red-500 text-sm mt-2">
                        Có lỗi xảy ra khi cập nhật thông tin. Vui lòng thử lại.
                    </div>
                )}

                {isEditing && (
                    <div className="flex justify-end space-x-4">
                        <Button className='cursor-pointer' variant="outline" onClick={() => setIsEditing(false)}>
                            Hủy
                        </Button>
                        <Button
                            onClick={handleSave}
                            disabled={isUpdating}
                            className="cursor-pointer bg-gradient-primary hover:opacity-90"
                        >
                            {isUpdating ? "Đang lưu..." : (
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
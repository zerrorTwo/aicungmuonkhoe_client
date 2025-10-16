import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Edit3, X, Save } from 'lucide-react';
import { showToast, toastPromise } from '@/utils/toast';
import { useUpdateUserProfileMutation, useUploadUserAvatarMutation } from '@/store/api/userApi';
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
    const [avatarPreview, setAvatarPreview] = useState<string>('');

    // RTK Query mutation hooks
    const [updateUserProfile, { isLoading: isUpdating, error: updateError }] = useUpdateUserProfileMutation();
    const [uploadUserAvatar, { isLoading: isUploading }] = useUploadUserAvatarMutation();

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
            setAvatarPreview(userInfo.avatar || '');
        }
    }, [userInfo]);

    // Handle avatar file selection
    const handleAvatarChange = async (file: File | null) => {
        if (!file) {
            setAvatarPreview(userInfo.avatar || '');
            return;
        }

        // Validate file
        const maxSize = 5 * 1024 * 1024; // 5MB
        const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
        
        if (file.size > maxSize) {
            showToast.error('Kích thước file quá lớn. Tối đa 5MB.');
            return;
        }
        
        if (!allowedTypes.includes(file.type)) {
            showToast.error('Định dạng file không hỗ trợ. Chỉ chấp nhận JPG, PNG, WebP.');
            return;
        }

        // Create preview URL immediately
        const previewUrl = URL.createObjectURL(file);
        setAvatarPreview(previewUrl);
        
        // Upload avatar immediately
        try {
            const formData = new FormData();
            formData.append('avatar', file);
            
          
            // Check if FormData has avatar
            const hasAvatar = formData.has('avatar');
            console.log('FormData has avatar:', hasAvatar);
            
            const result = await toastPromise(
                uploadUserAvatar(formData).unwrap(),
                {
                    loading: 'Đang upload ảnh đại diện...',
                    success: 'Cập nhật ảnh đại diện thành công!',
                    error: 'Có lỗi xảy ra khi upload ảnh!'
                }
            );
            

            // Update localStorage with new user data after successful avatar upload
            if (result?.data) {
                
                const currentUser = localStorage.getItem('user');
                if (currentUser) {
                    const userData = JSON.parse(currentUser);
                    const updatedUserData = {
                        ...userData,
                        avatar: result.data.avatar,
                        fullName: result.data.fullName || userData.fullName,
                        phone: result.data.phone || userData.phone,
                        birthDate: result.data.birthDate || userData.birthDate,
                        address: result.data.address || userData.address,
                        gender: result.data.gender || userData.gender
                    };
                    localStorage.setItem('user', JSON.stringify(updatedUserData));
                    console.log('Updated localStorage user data after avatar upload:', updatedUserData);
                }
            }
            
        } catch (error) {
            console.error('Avatar upload failed:', error);
            // Revert preview on error
            setAvatarPreview(userInfo.avatar || '');
        }
    };

    const handleSave = async () => {
        try {
            console.log('=== HANDLE SAVE ===');
            console.log('formData:', formData);
            
            // Check if there are any text field changes
            const hasTextChanges = 
                formData.fullName !== userInfo.name ||
                formData.phone !== userInfo.phone ||
                formData.birthDate !== userInfo.birthDate ||
                formData.address !== userInfo.address ||
                formData.genderId !== (userInfo.gender === 'NỮ' ? 2 : 1);
            
            if (!hasTextChanges) {
                showToast.info('Không có thay đổi nào để lưu');
                setIsEditing(false);
                return;
            }

            // Prepare JSON data for profile update (text fields only)
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
            
            const currentGenderId = userInfo.gender === 'NỮ' ? 2 : 1;
            if (formData.genderId !== currentGenderId) {
                updateData.genderId = formData.genderId;
            }

            console.log('Update data:', updateData);

            // Call API with JSON data
            const result = await toastPromise(
                updateUserProfile(updateData).unwrap(),
                {
                    loading: 'Đang cập nhật thông tin...',
                    success: 'Cập nhật thông tin thành công!',
                    error: 'Có lỗi xảy ra khi cập nhật thông tin!'
                }
            );

            // Update localStorage with new user data after successful profile update
            if (result?.data) {
                const currentUser = localStorage.getItem('user');
                if (currentUser) {
                    const userData = JSON.parse(currentUser);
                    const updatedUserData = {
                        ...userData,
                        fullName: result.data.fullName || userData.fullName,
                        phone: result.data.phone || userData.phone,
                        birthDate: result.data.birthDate || userData.birthDate,
                        address: result.data.address || userData.address,
                        gender: result.data.gender || userData.gender,
                        avatar: result.data.avatar || userData.avatar
                    };
                    localStorage.setItem('user', JSON.stringify(updatedUserData));
                    console.log('Updated localStorage user data after profile update:', updatedUserData);
                }
            }
            
            setIsEditing(false);
            
        } catch (error) {
            console.error('Update failed:', error);
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
        avatar: avatarPreview || userInfo?.avatar || "", // Use preview if available
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
                <ProfileAvatar 
                    userInfo={safeUserInfo} 
                    isEditing={isEditing}
                    onAvatarChange={handleAvatarChange}
                />
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
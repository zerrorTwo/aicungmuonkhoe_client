import React, { useState } from 'react';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import DatePicker from '../ui/date-picker';
import { User, Mail, Phone, MapPin, Calendar } from 'lucide-react';

interface PersonalInfoFormProps {
    userInfo: {
        name: string;
        email: string;
        phone: string;
        birthDate: string;
        gender: string;
        address: string;
    };
    isEditing: boolean;
    formData?: {
        fullName: string;
        phone: string;
        birthDate: string;
        address: string;
        avatar: string;
        genderId: number;
    };
    onFormDataChange?: (data: any) => void;
}

const PersonalInfoForm: React.FC<PersonalInfoFormProps> = ({ 
    userInfo, 
    isEditing, 
    formData: parentFormData, 
    onFormDataChange 
}) => {
    // Use parent formData if provided, otherwise fall back to userInfo
    const [localFormData, setLocalFormData] = useState({
        name: userInfo.name,
        email: userInfo.email,
        phone: userInfo.phone,
        birthDate: userInfo.birthDate,
        gender: userInfo.gender,
        address: userInfo.address
    });

    // Sync with parent formData khi có
    React.useEffect(() => {
        if (parentFormData) {
            setLocalFormData(prev => ({
                ...prev,
                name: parentFormData.fullName,
                phone: parentFormData.phone,
                birthDate: parentFormData.birthDate,
                address: parentFormData.address,
                gender: parentFormData.genderId === 2 ? 'NỮ' : 'NAM'
            }));
        }
    }, [parentFormData]);

    const handleInputChange = (field: string, value: string) => {
        setLocalFormData(prev => ({ ...prev, [field]: value }));
        
        // Notify parent component
        if (onFormDataChange) {
            const updatedData = { ...localFormData, [field]: value };
            onFormDataChange({
                fullName: updatedData.name,
                phone: updatedData.phone,
                birthDate: updatedData.birthDate,
                address: updatedData.address,
                avatar: parentFormData?.avatar || '',
                genderId: updatedData.gender === 'NỮ' ? 2 : 1
            });
        }
    };
    
    const handleDateChange = (date: string) => {
        handleInputChange('birthDate', date);
    };

    const handleGenderChange = (gender: string) => {
        handleInputChange('gender', gender);
    };

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
                <Label htmlFor="fullName">Họ và tên</Label>
                <div className="relative">
                    <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                        id="fullName"
                        value={localFormData.name}
                        onChange={(e) => handleInputChange('name', e.target.value)}
                        className="pl-10"
                        disabled={!isEditing}
                    />
                </div>
            </div>

            <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <div className="relative">
                    <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                        id="email"
                        type="email"
                        defaultValue={userInfo.email}
                        className="pl-10"
                        disabled={true} // Email không thể chỉnh sửa
                    />
                </div>
            </div>

            <div className="space-y-2">
                <Label htmlFor="phone">Số điện thoại</Label>
                <div className="relative">
                    <Phone className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                        id="phone"
                        value={localFormData.phone}
                        onChange={(e) => handleInputChange('phone', e.target.value)}
                        className="pl-10"
                        disabled={!isEditing}
                    />
                </div>
            </div>

            <div className="space-y-2">
                <Label htmlFor="birthDate">Ngày sinh</Label>
                <div className="relative">
                    <Calendar className="absolute left-3 top-3 h-4 w-4 text-muted-foreground z-10" />
                    <DatePicker
                        placeholder="Chọn ngày sinh"
                        value={localFormData.birthDate}
                        onChange={handleDateChange}
                        disabled={!isEditing}
                        format="YYYY-MM-DD"
                        className="pl-10"
                    />
                </div>
            </div>

            <div className="space-y-2">
                <Label htmlFor="gender">Giới tính</Label>
                <Select disabled={!isEditing} value={localFormData.gender} onValueChange={handleGenderChange}>
                    <SelectTrigger>
                        <SelectValue placeholder="Chọn giới tính" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="NAM">Nam</SelectItem>
                        <SelectItem value="NỮ">Nữ</SelectItem>
                        <SelectItem value="KHÁC">Khác</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            <div className="space-y-2">
                <Label htmlFor="address">Địa chỉ</Label>
                <div className="relative">
                    <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                        id="address"
                        value={localFormData.address}
                        onChange={(e) => handleInputChange('address', e.target.value)}
                        className="pl-10"
                        disabled={!isEditing}
                    />
                </div>
            </div>
        </div>
    );
};

export default PersonalInfoForm;
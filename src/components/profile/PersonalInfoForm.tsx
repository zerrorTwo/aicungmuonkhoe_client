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
}

const PersonalInfoForm: React.FC<PersonalInfoFormProps> = ({ userInfo, isEditing }) => {
    const [formData, setFormData] = useState({
        name: userInfo.name,
        email: userInfo.email,
        phone: userInfo.phone,
        birthDate: userInfo.birthDate,
        gender: userInfo.gender,
        address: userInfo.address
    });
    
    const handleDateChange = (date: string) => {
        setFormData(prev => ({ ...prev, birthDate: date }));
    };

    const handleGenderChange = (gender: string) => {
        setFormData(prev => ({ ...prev, gender }));
    };

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
                <Label htmlFor="fullName">Họ và tên</Label>
                <div className="relative">
                    <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                        id="fullName"
                        defaultValue={userInfo.name}
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
                        disabled={!isEditing}
                    />
                </div>
            </div>

            <div className="space-y-2">
                <Label htmlFor="phone">Số điện thoại</Label>
                <div className="relative">
                    <Phone className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                        id="phone"
                        defaultValue={userInfo.phone}
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
                        value={formData.birthDate}
                        onChange={handleDateChange}
                        disabled={!isEditing}
                        format="YYYY-MM-DD"
                        className="pl-10"
                    />
                </div>
            </div>

            <div className="space-y-2">
                <Label htmlFor="gender">Giới tính</Label>
                <Select disabled={!isEditing} value={formData.gender} onValueChange={handleGenderChange}>
                    <SelectTrigger>
                        <SelectValue placeholder="Chọn giới tính" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="Nam">Nam</SelectItem>
                        <SelectItem value="Nữ">Nữ</SelectItem>
                        <SelectItem value="Khác">Khác</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            <div className="space-y-2">
                <Label htmlFor="address">Địa chỉ</Label>
                <div className="relative">
                    <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                        id="address"
                        defaultValue={userInfo.address}
                        className="pl-10"
                        disabled={!isEditing}
                    />
                </div>
            </div>
        </div>
    );
};

export default PersonalInfoForm;
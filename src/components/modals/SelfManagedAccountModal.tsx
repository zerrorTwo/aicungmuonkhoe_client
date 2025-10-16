import React, { useState } from 'react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import DatePicker from '../ui/date-picker';
import { User, Upload, Calendar, Users } from 'lucide-react';
import ModalOverlay from './ModalOverlay';

interface SelfManagedAccountModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (formData: {
        displayName: string;
        birthDate: string;
        gender: string;
    }) => void;
}

const SelfManagedAccountModal: React.FC<SelfManagedAccountModalProps> = ({
    isOpen,
    onClose,
    onSubmit
}) => {
    const [formData, setFormData] = useState({
        displayName: '',
        birthDate: '',
        gender: ''
    });

    const handleSubmit = () => {
        if (formData.displayName && formData.birthDate && formData.gender) {
            onSubmit(formData);
            // Reset form
            setFormData({
                displayName: '',
                birthDate: '',
                gender: ''
            });
        } else {
            alert('Vui lòng điền đầy đủ thông tin bắt buộc');
        }
    };

    const handleDateChange = (date: string) => {
        setFormData({ ...formData, birthDate: date });
    };

    return (
        <ModalOverlay isOpen={isOpen} onClose={onClose}>
            <div className="p-6">
                <h2 className="text-xl font-bold text-[hsl(158,64%,52%)] mb-6">Thêm tài khoản tự quản lý</h2>

                {/* Avatar Upload */}
                <div className="flex justify-center mb-6">
                    <div className="relative">
                        <div className="w-20 h-20 rounded-full bg-gray-200 flex items-center justify-center">
                            <User className="w-8 h-8 text-gray-400" />
                        </div>
                        <div className="absolute bottom-0 right-0 w-6 h-6 bg-[hsl(158,64%,52%)] rounded-full flex items-center justify-center cursor-pointer">
                            <Upload className="w-3 h-3 text-white" />
                        </div>
                        <span className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 text-xs text-[hsl(158,64%,52%)]">Cập nhật</span>
                    </div>
                </div>

                {/* Form Fields */}
                <div className="space-y-4">
                    <div>
                        <Label className="text-sm font-medium flex items-center">
                            <User className="w-4 h-4 mr-1" />
                            Tên hiển thị <span className="text-red-500 ml-1">*</span>
                        </Label>
                        <Input
                            placeholder="Nhập tên hiển thị"
                            className="mt-1"
                            value={formData.displayName}
                            onChange={(e) => setFormData({ ...formData, displayName: e.target.value })}
                        />
                    </div>

                    <div>
                        <Label className="text-sm font-medium flex items-center">
                            <Calendar className="w-4 h-4 mr-1" />
                            Ngày sinh <span className="text-red-500 ml-1">*</span>
                        </Label>
                        <div className="mt-1 relative">
                            <DatePicker
                                value={formData.birthDate}
                                onChange={handleDateChange}
                                placeholder="Chọn ngày sinh"
                            />
                        </div>
                    </div>

                    <div>
                        <Label className="text-sm font-medium flex items-center">
                            <Users className="w-4 h-4 mr-1" />
                            Giới tính <span className="text-red-500 ml-1">*</span>
                        </Label>
                        <select
                            className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[hsl(158,64%,52%)]"
                            value={formData.gender}
                            onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                        >
                            <option value="">Chọn giới tính</option>
                            <option value="male">Nam</option>
                            <option value="female">Nữ</option>
                            <option value="other">Khác</option>
                        </select>
                    </div>
                </div>

                {/* Button */}
                <Button
                    className="cursor-pointer w-full mt-6 bg-[hsl(158,64%,52%)] hover:bg-[hsl(158,64%,45%)] text-white"
                    onClick={handleSubmit}
                >
                    Lưu
                </Button>
            </div>
        </ModalOverlay>
    );
};

export default SelfManagedAccountModal;
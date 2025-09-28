import React from 'react';
import { Button } from '../ui/button';
import { User } from 'lucide-react';
import ModalOverlay from './ModalOverlay';

interface ConfirmModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    title?: string;
    confirmText?: string;
    cancelText?: string;
}

const ConfirmModal: React.FC<ConfirmModalProps> = ({
    isOpen,
    onClose,
    onConfirm,
    title = "Bạn có muốn tiếp tục thêm tài khoản tự quản lý?",
    confirmText = "Tiếp tục",
    cancelText = "Hủy"
}) => {
    return (
        <ModalOverlay isOpen={isOpen} onClose={onClose}>
            <div className="p-6 text-center">
                <h2 className="text-xl font-bold text-[hsl(158,64%,52%)] mb-4">{title}</h2>

                <div className="flex justify-center mb-6">
                    <div className="w-24 h-24 bg-[hsl(158,64%,92%)] rounded-full flex items-center justify-center">
                        <div className="w-16 h-16 bg-[hsl(158,64%,52%)] rounded-full flex items-center justify-center">
                            <User className="w-8 h-8 text-white" />
                        </div>
                    </div>
                </div>

                <div className="flex gap-3">
                    <Button
                        variant="outline"
                        className="cursor-pointer flex-1 border-red-200 text-red-600 hover:bg-red-50"
                        onClick={onClose}
                    >
                        {cancelText}
                    </Button>
                    <Button
                        className="cursor-pointer flex-1 bg-[hsl(158,64%,52%)] hover:bg-[hsl(158,64%,45%)] text-white"
                        onClick={() => {
                            onConfirm();
                            onClose();
                        }}
                    >
                        {confirmText}
                    </Button>
                </div>
            </div>
        </ModalOverlay>
    );
};

export default ConfirmModal;
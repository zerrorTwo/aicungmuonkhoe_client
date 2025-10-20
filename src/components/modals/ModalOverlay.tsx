import React from 'react';
import { X } from 'lucide-react';

interface ModalOverlayProps {
    isOpen: boolean;
    onClose: () => void;
    children: React.ReactNode;
    maxWidth?: string;
}

const ModalOverlay = React.forwardRef<HTMLDivElement, ModalOverlayProps>(
    ({ isOpen, onClose, children, maxWidth = "max-w-md" }, ref) => {
        if (!isOpen) return null;

        return (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[9999] overflow-visible" onClick={onClose}>
                <div
                    ref={ref as React.RefObject<HTMLDivElement>}
                    className={`bg-white rounded-lg shadow-xl border ${maxWidth} w-full mx-4 relative overflow-visible`}
                    onClick={(e) => e.stopPropagation()}
                    style={{ overflow: 'visible' }}
                >
                    <button
                        onClick={onClose}
                        className="cursor-pointer absolute top-4 right-4 text-gray-400 hover:text-gray-600 z-10"
                    >
                        <X className="w-6 h-6" />
                    </button>
                    {children}
                </div>
            </div>
        );
    }
);

export default ModalOverlay;
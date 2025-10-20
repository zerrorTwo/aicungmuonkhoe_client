import React, { useEffect, useState, useRef, useCallback } from "react";
import ModalOverlay from "../ModalOverlay";
import { Button } from "../../ui/button";
import { Input } from "../../ui/input";
import { Label } from "../../ui/label";
import DatePicker from "../../ui/date-picker";

export interface UricUpdatePayload {
    date: string;
    value: number; // mg/dL
}

interface UricUpdateModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (data: UricUpdatePayload) => Promise<void> | void;
    initialData?: Partial<UricUpdatePayload> | null;
}

const UricUpdateModal: React.FC<UricUpdateModalProps> = ({ isOpen, onClose, onSubmit, initialData }) => {
    const [date, setDate] = useState<string>(new Date().toISOString().slice(0, 10));
    const [value, setValue] = useState<string>("");
    const [submitting, setSubmitting] = useState(false);
    const [errors, setErrors] = useState<{ date?: string; value?: string }>({});

    const datePickerRef = useRef<HTMLDivElement>(null);
    const getPosition = useCallback(() => datePickerRef.current?.getBoundingClientRect() || {
        top: 0, left: 0, width: 0, height: 0, bottom: 0, right: 0, x: 0, y: 0, toJSON: () => ({})
    } as DOMRect, []);

    useEffect(() => {
        if (initialData) {
            setDate(initialData.date ? new Date(initialData.date).toISOString().slice(0, 10) : new Date().toISOString().slice(0, 10));
            setValue(initialData.value !== undefined ? String(initialData.value) : "");
        } else if (isOpen) {
            setDate(new Date().toISOString().slice(0, 10));
            setValue("");
        }
        setErrors({});
    }, [initialData, isOpen]);

    const validate = () => {
        const e: typeof errors = {};
        if (!date) e.date = "Vui lòng chọn ngày";
        const v = parseFloat(value);
        if (!value || isNaN(v) || v <= 0) e.value = "Chỉ số Axit uric không hợp lệ";
        setErrors(e);
        return Object.keys(e).length === 0;
    };

    const handleSubmit = async () => {
        if (!validate()) return;
        try {
            setSubmitting(true);
            await onSubmit({ date, value: parseFloat(value) });
            onClose();
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <ModalOverlay isOpen={isOpen} onClose={onClose}>
            <div className="p-6 max-h-[80vh] overflow-y-auto">
                <h2 className="text-xl font-bold text-foreground mb-4">Cập nhật chỉ số Axit uric</h2>
                <div className="space-y-4">
                    <div>
                        <Label className="text-sm font-medium">Ngày đo <span className="text-red-500">*</span></Label>
                        <div ref={datePickerRef} className="relative mt-1">
                            <DatePicker
                                value={date}
                                onChange={(newDate) => setDate(newDate)}
                                placeholder="Chọn ngày đo"
                                offsetX={0}
                                offsetY={0}
                                getPosition={getPosition}
                            />
                        </div>
                        {errors.date && <p className="text-xs text-red-500 mt-1">{errors.date}</p>}
                    </div>
                    <div>
                        <Label className="text-sm font-medium">Axit uric <span className="text-red-500">*</span></Label>
                        <div className="flex gap-2 mt-1">
                            <Input placeholder="Nhập chỉ số (Ví dụ: 5.5)" value={value} onChange={(e) => setValue(e.target.value)} />
                            <div className="min-w-24 grid place-items-center rounded-md border border-input bg-background px-3 text-sm">mg/dL</div>
                        </div>
                        {errors.value && <p className="text-xs text-red-500 mt-1">{errors.value}</p>}
                    </div>
                </div>
                <div className="flex gap-3 mt-6">
                    <Button onClick={onClose} variant="outline" className="flex-1 border-red-500 text-red-500 hover:bg-red-50" disabled={submitting}>Hủy</Button>
                    <Button onClick={handleSubmit} className="flex-1 bg-[hsl(158,64%,52%)] hover:bg-[hsl(158,64%,45%)] text-white" disabled={submitting}>{submitting ? "Đang lưu..." : "Cập nhật"}</Button>
                </div>
            </div>
        </ModalOverlay>
    );
};

export default UricUpdateModal;

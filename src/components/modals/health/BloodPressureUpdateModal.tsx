import React, { useEffect, useState, useRef } from "react";
import ModalOverlay from "../ModalOverlay";
import { Button } from "../../ui/button";
import { Input } from "../../ui/input";
import { Label } from "../../ui/label";
import DatePicker from "../../ui/date-picker";

export interface BloodPressureUpdatePayload {
    date: string; // yyyy-mm-dd
    valueSys: number; // mmHg
    valueDia: number; // mmHg
}

interface BloodPressureUpdateModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (data: BloodPressureUpdatePayload) => Promise<void> | void;
    initialData?: Partial<BloodPressureUpdatePayload> | null;
}

const BloodPressureUpdateModal: React.FC<BloodPressureUpdateModalProps> = ({ isOpen, onClose, onSubmit, initialData }) => {
    const [date, setDate] = useState<string>(new Date().toISOString().slice(0, 10));
    const [sys, setSys] = useState<string>("");
    const [dia, setDia] = useState<string>("");
    const [submitting, setSubmitting] = useState(false);
    const [errors, setErrors] = useState<{ date?: string; sys?: string; dia?: string; logic?: string }>({});

    const datePickerRef = useRef<HTMLDivElement>(null);
    const modalRef = useRef<HTMLDivElement>(null); // Typed as RefObject<HTMLDivElement> to match ModalOverlay's expected ref type

    useEffect(() => {
        if (initialData) {
            setDate(initialData.date ? new Date(initialData.date).toISOString().slice(0, 10) : new Date().toISOString().slice(0, 10));
            setSys(initialData.valueSys !== undefined ? String(initialData.valueSys) : "");
            setDia(initialData.valueDia !== undefined ? String(initialData.valueDia) : "");
        } else if (isOpen) {
            setDate(new Date().toISOString().slice(0, 10));
            setSys("");
            setDia("");
        }
        setErrors({});
    }, [initialData, isOpen]);

    const validate = () => {
        const e: typeof errors = {};
        if (!date) e.date = "Vui lòng chọn ngày";
        const s = parseFloat(sys);
        const d = parseFloat(dia);
        if (!sys || isNaN(s) || s <= 0) e.sys = "SYS không hợp lệ";
        if (!dia || isNaN(d) || d <= 0) e.dia = "DIA không hợp lệ";
        if (!e.sys && !e.dia && d > s) e.logic = "SYS phải lớn hơn DIA";
        setErrors(e);
        return Object.keys(e).length === 0;
    };

    const handleSubmit = async () => {
        if (!validate()) return;
        try {
            setSubmitting(true);
            await onSubmit({ date, valueSys: parseFloat(sys), valueDia: parseFloat(dia) });
            onClose();
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <ModalOverlay isOpen={isOpen} onClose={onClose} ref={modalRef}>
            <div className="p-6 max-h-[80vh] overflow-y-auto">
                <h2 className="text-xl font-bold text-foreground mb-4">Cập nhật chỉ số Huyết áp</h2>
                <div className="space-y-4">
                    <div>
                        <Label className="text-sm font-medium">Ngày đo <span className="text-red-500">*</span></Label>
                        <div ref={datePickerRef} className="relative mt-1">
                            <DatePicker
                                value={date}
                                onChange={(newDate) => setDate(newDate)}
                                placeholder="Chọn ngày đo"
                            />
                        </div>
                        {errors.date && <p className="text-xs text-red-500 mt-1">{errors.date}</p>}
                    </div>
                    <div>
                        <Label className="text-sm font-medium">Huyết áp Tâm thu (SYS) <span className="text-red-500">*</span></Label>
                        <div className="flex gap-2 mt-1">
                            <Input placeholder="Nhập chỉ số (Ví dụ: 120)" value={sys} onChange={(e) => setSys(e.target.value)} />
                            <div className="min-w-24 grid place-items-center rounded-md border border-input bg-background px-3 text-sm">mmHg</div>
                        </div>
                        {errors.sys && <p className="text-xs text-red-500 mt-1">{errors.sys}</p>}
                    </div>
                    <div>
                        <Label className="text-sm font-medium">Huyết áp Tâm trương (DIA) <span className="text-red-500">*</span></Label>
                        <div className="flex gap-2 mt-1">
                            <Input placeholder="Nhập chỉ số (Ví dụ: 80)" value={dia} onChange={(e) => setDia(e.target.value)} />
                            <div className="min-w-24 grid place-items-center rounded-md border border-input bg-background px-3 text-sm">mmHg</div>
                        </div>
                        {errors.dia && <p className="text-xs text-red-500 mt-1">{errors.dia}</p>}
                        {errors.logic && <p className="text-xs text-orange-500 mt-1">{errors.logic}</p>}
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

export default BloodPressureUpdateModal;

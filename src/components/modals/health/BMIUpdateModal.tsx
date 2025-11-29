import React, { useEffect, useState, useRef, useCallback } from "react";
import ModalOverlay from "../ModalOverlay";
import { Button } from "../../ui/button";
import { Input } from "../../ui/input";
import { Label } from "../../ui/label";
import DatePicker from "../../ui/date-picker";
import { useCreateConclusionClientMutation } from "@/store/api/conclusionApi"; // Import the API hook

export interface BMIUpdatePayload {
    DATE: string; // yyyy-mm-dd
    VALUE_HEIGHT: number; // cm
    VALUE_WEIGHT: number; // kg
    HEALTH_DOCUMENT_ID: number;
    MODEL: 'BMI';
    AGE_TYPE: string;
    TIME: string; // HH:mm:ss
}

interface BMIUpdateModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit?: (data: BMIUpdatePayload) => Promise<void> | void;
    initialData?: Partial<BMIUpdatePayload> | null;
    ageType: string; // New prop for age type
    healthDocumentId: number; // New prop for health document ID
}

const BMIUpdateModal: React.FC<BMIUpdateModalProps> = ({ isOpen, onClose, onSubmit, initialData, ageType, healthDocumentId }) => {
    const [createConclusionClient] = useCreateConclusionClientMutation(); // Initialize the mutation
    const [date, setDate] = useState<string>(new Date().toISOString().slice(0, 10));
    const [height, setHeight] = useState<string>("");
    const [weight, setWeight] = useState<string>("");
    const [submitting, setSubmitting] = useState(false);
    const [errors, setErrors] = useState<{ date?: string; height?: string; weight?: string; healthDocumentId?: string }>({});

    const datePickerRef = useRef<HTMLDivElement>(null);
    const modalRef = useRef<HTMLDivElement>(null);
    const getPosition = useCallback(() => datePickerRef.current?.getBoundingClientRect() || {
        top: 0, left: 0, width: 0, height: 0, bottom: 0, right: 0, x: 0, y: 0, toJSON: () => ({})
    } as DOMRect, []);

    useEffect(() => {
        if (initialData) {
            setDate(initialData.DATE ? new Date(initialData.DATE).toISOString().slice(0, 10) : new Date().toISOString().slice(0, 10));
            setHeight(initialData.VALUE_HEIGHT !== undefined ? String(initialData.VALUE_HEIGHT) : "");
            setWeight(initialData.VALUE_WEIGHT !== undefined ? String(initialData.VALUE_WEIGHT) : "");
        } else if (isOpen) {
            setDate(new Date().toISOString().slice(0, 10));
            setHeight("");
            setWeight("");
        }
        setErrors({});
    }, [initialData, isOpen]);

    const validate = () => {
        const e: typeof errors = {};
        if (!date) e.date = "Vui lòng chọn ngày";
        const h = parseFloat(height);
        const w = parseFloat(weight);
        if (!height || isNaN(h) || h <= 0) e.height = "Chiều cao không hợp lệ";
        if (!weight || isNaN(w) || w <= 0) e.weight = "Cân nặng không hợp lệ";
        setErrors(e);
        return Object.keys(e).length === 0;
    };

    const handleSubmit = async () => {
        if (!validate()) {
            return;
        }
        try {
            setSubmitting(true);

            // Format payload with uppercase fields
            const payload: BMIUpdatePayload = {
                DATE: date,
                VALUE_HEIGHT: parseFloat(parseFloat(height).toFixed(2)),
                VALUE_WEIGHT: parseFloat(parseFloat(weight).toFixed(2)),
                HEALTH_DOCUMENT_ID: healthDocumentId, // Use prop value
                MODEL: 'BMI',
                AGE_TYPE: ageType, // Use prop value
                TIME: new Date().toISOString().slice(11, 19), // Add current time in HH:mm:ss format
            };

            // Call the API to create a BMI record using /client endpoint
            await createConclusionClient(payload).unwrap();

            // Call parent's onSubmit callback to trigger refresh
            await Promise.resolve(onSubmit?.(payload));

            onClose();
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <ModalOverlay isOpen={isOpen} onClose={onClose} ref={modalRef}>
            <div className="p-6 max-h-[80vh] overflow-y-auto">
                <h2 className="text-xl font-bold text-foreground mb-4">Cập nhật chỉ số BMI</h2>
                <div className="space-y-4">
                    <div>
                        <Label className="text-sm font-medium position-relative">Ngày đo <span className="text-red-500 absolute">*</span></Label>
                        <div ref={datePickerRef} className="relative mt-1">
                            <DatePicker
                                value={date}
                                onChange={(newDate) => setDate(newDate)}
                                placeholder="Chọn ngày đo"
                                offsetX={0}
                                offsetY={0}
                                getPosition={getPosition}
                                containerRef={modalRef as React.RefObject<HTMLElement>}
                            />
                        </div>
                        {errors.date && <p className="text-xs text-red-500 mt-1">{errors.date}</p>}
                    </div>
                    <div>
                        <Label className="text-sm font-medium">Chiều cao <span className="text-red-500">*</span></Label>
                        <div className="flex gap-2 mt-1">
                            <Input placeholder="Nhập chỉ số (Ví dụ: 170)" value={height} onChange={(e) => setHeight(e.target.value)} />
                            <div className="min-w-20 grid place-items-center rounded-md border border-input bg-background px-3 text-sm">cm</div>
                        </div>
                        {errors.height && <p className="text-xs text-red-500 mt-1">{errors.height}</p>}
                    </div>
                    <div>
                        <Label className="text-sm font-medium">Cân nặng <span className="text-red-500">*</span></Label>
                        <div className="flex gap-2 mt-1">
                            <Input placeholder="Nhập chỉ số (Ví dụ: 65)" value={weight} onChange={(e) => setWeight(e.target.value)} />
                            <div className="min-w-20 grid place-items-center rounded-md border border-input bg-background px-3 text-sm">kg</div>
                        </div>
                        {errors.weight && <p className="text-xs text-red-500 mt-1">{errors.weight}</p>}
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

export default BMIUpdateModal;

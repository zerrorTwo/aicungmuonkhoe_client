import React, { useEffect, useMemo, useState } from "react";
import ModalOverlay from "./ModalOverlay";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";

export type ConclusionSeverity = "low" | "medium" | "high";

export interface HealthConclusion {
    id?: string | number;
    title: string;
    conclusion: string;
    recommendation?: string;
    severity: ConclusionSeverity;
    date: string; // ISO date string (yyyy-mm-dd)
    author?: string;
}

interface ConclusionModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (data: HealthConclusion) => Promise<void> | void;
    initialData?: Partial<HealthConclusion> | null;
}

const defaultForm: HealthConclusion = {
    title: "",
    conclusion: "",
    recommendation: "",
    severity: "low",
    date: new Date().toISOString().slice(0, 10),
    author: "",
};

const ConclusionModal: React.FC<ConclusionModalProps> = ({
    isOpen,
    onClose,
    onSubmit,
    initialData,
}) => {
    const mode = useMemo(() => (initialData?.id ? "update" : "create"), [initialData]);

    const [form, setForm] = useState<HealthConclusion>(defaultForm);
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        if (initialData) {
            setForm({
                ...defaultForm,
                ...initialData,
                // ensure date is yyyy-mm-dd
                date: initialData.date
                    ? new Date(initialData.date).toISOString().slice(0, 10)
                    : defaultForm.date,
                severity: (initialData.severity as ConclusionSeverity) || "low",
            } as HealthConclusion);
        } else {
            setForm(defaultForm);
        }
        setErrors({});
    }, [initialData, isOpen]);

    const validate = () => {
        const next: Record<string, string> = {};
        if (!form.title?.trim()) next.title = "Vui lòng nhập tiêu đề";
        if (!form.conclusion?.trim()) next.conclusion = "Vui lòng nhập kết luận";
        if (!form.date) next.date = "Vui lòng chọn ngày";
        setErrors(next);
        return Object.keys(next).length === 0;
    };

    const handleSubmit = async () => {
        if (!validate()) return;
        try {
            setSubmitting(true);
            await onSubmit(form);
            onClose();
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <ModalOverlay isOpen={isOpen} onClose={onClose}>
            <div className="p-6 max-h-[80vh] overflow-y-auto">
                <h2 className="text-xl font-bold text-foreground mb-1">
                    {mode === "create" ? "Tạo kết luận sức khỏe" : "Cập nhật kết luận sức khỏe"}
                </h2>
                <p className="text-sm text-muted-foreground mb-5">
                    Tóm tắt tình trạng sức khỏe và khuyến nghị theo dõi/điều chỉnh.
                </p>

                <div className="space-y-4">
                    <div>
                        <Label className="text-sm font-medium">
                            Tiêu đề <span className="text-red-500">*</span>
                        </Label>
                        <Input
                            placeholder="Ví dụ: Kết luận khám định kỳ Q4/2025"
                            value={form.title}
                            onChange={(e) => setForm((s) => ({ ...s, title: e.target.value }))}
                            className="mt-1"
                        />
                        {errors.title && (
                            <p className="text-xs text-red-500 mt-1">{errors.title}</p>
                        )}
                    </div>

                    <div>
                        <Label className="text-sm font-medium">
                            Ngày <span className="text-red-500">*</span>
                        </Label>
                        <Input
                            type="date"
                            value={form.date}
                            onChange={(e) => setForm((s) => ({ ...s, date: e.target.value }))}
                            className="mt-1"
                        />
                        {errors.date && (
                            <p className="text-xs text-red-500 mt-1">{errors.date}</p>
                        )}
                    </div>

                    <div>
                        <Label className="text-sm font-medium">Mức độ</Label>
                        <select
                            className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[hsl(158,64%,52%)] bg-background"
                            value={form.severity}
                            onChange={(e) =>
                                setForm((s) => ({ ...s, severity: e.target.value as ConclusionSeverity }))
                            }
                        >
                            <option value="low">Thấp</option>
                            <option value="medium">Trung bình</option>
                            <option value="high">Cao</option>
                        </select>
                    </div>

                    <div>
                        <Label className="text-sm font-medium">
                            Kết luận <span className="text-red-500">*</span>
                        </Label>
                        <textarea
                            rows={5}
                            placeholder="Mô tả ngắn gọn về tình trạng hiện tại, chỉ số đáng chú ý..."
                            value={form.conclusion}
                            onChange={(e) => setForm((s) => ({ ...s, conclusion: e.target.value }))}
                            className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[hsl(158,64%,52%)] bg-background"
                        />
                        {errors.conclusion && (
                            <p className="text-xs text-red-500 mt-1">{errors.conclusion}</p>
                        )}
                    </div>

                    <div>
                        <Label className="text-sm font-medium">Khuyến nghị</Label>
                        <textarea
                            rows={4}
                            placeholder="Chế độ dinh dưỡng, vận động, ngủ nghỉ, tái khám..."
                            value={form.recommendation}
                            onChange={(e) => setForm((s) => ({ ...s, recommendation: e.target.value }))}
                            className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[hsl(158,64%,52%)] bg-background"
                        />
                    </div>

                    <div>
                        <Label className="text-sm font-medium">Người lập</Label>
                        <Input
                            placeholder="Tên bác sĩ/Người đánh giá (tuỳ chọn)"
                            value={form.author || ""}
                            onChange={(e) => setForm((s) => ({ ...s, author: e.target.value }))}
                            className="mt-1"
                        />
                    </div>
                </div>

                <div className="flex gap-3 mt-6">
                    <Button
                        onClick={onClose}
                        variant="outline"
                        className="flex-1 border-red-500 text-red-500 hover:bg-red-50"
                        disabled={submitting}
                    >
                        Hủy
                    </Button>
                    <Button
                        onClick={handleSubmit}
                        className="flex-1 bg-[hsl(158,64%,52%)] hover:bg-[hsl(158,64%,45%)] text-white"
                        disabled={submitting}
                    >
                        {submitting ? "Đang lưu..." : mode === "create" ? "Tạo kết luận" : "Cập nhật"}
                    </Button>
                </div>
            </div>
        </ModalOverlay>
    );
};

export default ConclusionModal;

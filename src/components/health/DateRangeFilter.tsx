import DatePicker from '@/components/ui/date-picker';
import dayjs, { Dayjs } from 'dayjs';
import { Calendar, Minus } from 'lucide-react';

interface DateRangeFilterProps {
    startDate: Dayjs | null;
    endDate: Dayjs | null;
    onStartDateChange: (date: Dayjs) => void;
    onEndDateChange: (date: Dayjs) => void;
    className?: string;
    color?: 'primary' | 'blue' | 'orange' | 'green' | 'yellow';
}

export default function DateRangeFilter({
    startDate,
    endDate,
    onStartDateChange,
    onEndDateChange,
    className,
    color = 'primary',
}: DateRangeFilterProps) {
    // Map simple colors to text colors if needed, primarily used for text styling in reference
    // Here we stick to a clean default implementation using Tailwind classes

    return (
        <div className={`flex items-center border border-gray-300 rounded-xl overflow-hidden bg-white relative pr-10 ${className}`}>
            {/* Start Date */}
            <div className="flex-1 min-w-[140px] border-r-0">
                <DatePicker
                    placeholder="Từ ngày"
                    value={startDate ? startDate.format('YYYY-MM-DD') : null}
                    onChange={(dateStr) => onStartDateChange(dayjs(dateStr))}
                    disabledDate={endDate || undefined}
                    disabledType="max"
                    className="border-none shadow-none focus-visible:ring-0 px-3 py-2 h-10 text-base md:text-lg cursor-pointer w-full text-center font-normal"
                />
            </div>

            {/* Separator */}
            <Minus className="text-gray-400 w-4 h-4 mx-1 flex-shrink-0" />

            {/* End Date */}
            <div className="flex-1 min-w-[120px]">
                <DatePicker
                    placeholder="Đến ngày"
                    value={endDate ? endDate.format('YYYY-MM-DD') : null}
                    onChange={(dateStr) => onEndDateChange(dayjs(dateStr))}
                    disabledDate={startDate || undefined}
                    disabledType="min"
                    className="border-none shadow-none focus-visible:ring-0 px-3 py-2 h-10 text-base md:text-lg cursor-pointer w-full text-center font-normal"
                />
            </div>

            {/* Calendar Icon */}
            <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                <Calendar className="w-5 h-5 text-gray-400" />
            </div>
        </div>
    );
}

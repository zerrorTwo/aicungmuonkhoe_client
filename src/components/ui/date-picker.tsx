/* eslint-disable react-hooks/exhaustive-deps */
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import dayjs, { Dayjs } from 'dayjs';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Input } from './input';
import { cn } from '../../lib/utils';

type DatePickerProps = {
    placeholder?: string;
    disabledDate?: Dayjs;
    disabledType?: 'min' | 'max';
    value?: string | null;
    format?: string;
    onChange?: (date: string) => void;
    onFocus?: () => void;
    onBlur?: () => void;
    disabled?: boolean;
    className?: string;
    offsetX?: number;
    offsetY?: number;
    getPosition?: () => DOMRect;
    containerRef?: React.RefObject<HTMLElement>;
};

export default function DatePicker({
    placeholder = "Chọn ngày",
    disabledDate,
    disabledType = 'max',
    value = new Date().toISOString().slice(0, 10),
    format = 'YYYY-MM-DD',
    onChange,
    onFocus,
    onBlur,
    disabled = false,
    className,
}: DatePickerProps) {
    const pickerRef = useRef<HTMLDivElement>(null);
    const yearRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLDivElement>(null);

    const now = dayjs();
    const currentYear = now.year();

    const [showPicker, setShowPicker] = useState(false);
    const [selectedDate, setSelectedDate] = useState<{
        year: number;
        month: number;
        day: number;
    }>(() => {
        const dateValue = value ? dayjs(value) : now;
        return {
            year: dateValue.year(),
            month: dateValue.month(),
            day: dateValue.date()
        };
    });

    const years = useMemo(() => {
        return Array.from({ length: 201 }, (_, i) => currentYear - 100 + i);
    }, [currentYear]);

    const daysInMonth = dayjs(
        `${selectedDate.year}-${selectedDate.month + 1}`
    ).daysInMonth();

    const firstDay =
        (dayjs(`${selectedDate.year}-${selectedDate.month + 1}-01`).day() + 6) % 7;

    const prevMonthDays = dayjs(
        `${selectedDate.year}-${selectedDate.month}`
    ).daysInMonth();

    const prevMonth = useMemo(() => {
        if (selectedDate.month - 1 < 0) return 11;
        return selectedDate.month - 1;
    }, [selectedDate.month]);

    const nextMonth = useMemo(() => {
        if (selectedDate.month + 1 > 11) return 0;
        return selectedDate.month + 1;
    }, [selectedDate.month]);

    const disabledYear = (year: number) => {
        if (disabledDate) {
            if (disabledType === 'max') {
                return year > disabledDate.year();
            }
            if (disabledType === 'min') {
                return year < disabledDate.year();
            }
        }
        return false;
    };

    const disabledDay = (day: number, month: number) => {
        if (disabledDate) {
            if (disabledType === 'max') {
                return dayjs(`${selectedDate.year}-${month + 1}-${day}`)
                    .startOf('day')
                    .isAfter(disabledDate.startOf('day'));
            }
            if (disabledType === 'min') {
                return dayjs(`${selectedDate.year}-${month + 1}-${day}`)
                    .startOf('day')
                    .isBefore(disabledDate.startOf('day'));
            }
        }
        return false;
    };

    const handleYearClick = (year: number) => {
        setSelectedDate((prev) => ({ ...prev, year }));
        // scroll đến year vừa click (an toàn)
        requestAnimationFrame(() => updateYearScrollPosition());
    };

    const handleDateClick = (
        day: number,
        isPrevMonth = false,
        isNextMonth = false
    ) => {
        let newDate;
        if (isPrevMonth) {
            setSelectedDate((prev) => {
                const month = (prev.month - 1 + 12) % 12;
                const year = prev.month - 1 < 0 ? prev.year - 1 : prev.year;
                return { ...prev, day, month, year };
            });
            newDate = dayjs(`${selectedDate.year}-${((selectedDate.month - 1) % 12) + 1}-${day}`);
        } else if (isNextMonth) {
            setSelectedDate((prev) => {
                const month = (prev.month + 1) % 12;
                const year = prev.month + 1 > 11 ? prev.year + 1 : prev.year;
                return { ...prev, day, month, year };
            });
            newDate = dayjs(`${selectedDate.year}-${((selectedDate.month + 1) % 12) + 1}-${day}`);
        } else {
            setSelectedDate((prev) => ({ ...prev, day }));
            newDate = dayjs(`${selectedDate.year}-${selectedDate.month + 1}-${day}`);
        }

        onChange?.(newDate.format(format));
        setShowPicker(false);
    };

    const handleMonthChange = (offset: number) => {
        setSelectedDate((prev) => {
            const newMonth = (prev.month + offset + 12) % 12;
            const newYear =
                offset > 0 && newMonth < prev.month
                    ? prev.year + 1
                    : offset < 0 && newMonth > prev.month
                        ? prev.year - 1
                        : prev.year;
            return { ...prev, month: newMonth, year: newYear };
        });
    };

    const updateYearScrollPosition = useCallback(() => {
        const container = yearRef.current;
        if (!container) return;

        // đo chiều cao vùng chứa
        const containerHeight = container.clientHeight || container.getBoundingClientRect().height || 0;

        // tìm item đầu tiên (mảng years render các <div> trực tiếp)
        const firstItem = container.firstElementChild as HTMLElement | null;
        // nếu firstItem null thì không làm gì
        const itemHeight = firstItem
            ? firstItem.getBoundingClientRect().height
            : 36; // fallback cứng

        // tìm index của năm được chọn, nếu không thấy thì dùng năm hiện tại
        const index = years.indexOf(selectedDate.year);
        const validIndex = index !== -1 ? index : Math.max(0, years.indexOf(currentYear));

        // tính vị trí scroll sao cho item nằm giữa container
        const scrollPosition = validIndex * itemHeight - (containerHeight / 2) + (itemHeight / 2);

        // dùng requestAnimationFrame để chắc DOM đã layout xong
        requestAnimationFrame(() => {
            container.scrollTo({
                top: Math.max(0, scrollPosition),
                behavior: 'smooth'
            });
        });
    }, [selectedDate.year, years, currentYear]);

    // Khi mở picker, gọi scroll — dùng small timeout để chắc chắn list đã mount
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                pickerRef.current &&
                !pickerRef.current.contains(event.target as Node) &&
                inputRef.current &&
                !inputRef.current.contains(event.target as Node)
            ) {
                setShowPicker(false);
            }
        };

        if (showPicker) {
            document.addEventListener('mousedown', handleClickOutside);

            // gọi update sau khi mount; setTimeout 0 + rAF trong fn giúp ổn định across browsers
            setTimeout(() => {
                updateYearScrollPosition();
            }, 0);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [showPicker, updateYearScrollPosition]);

    useEffect(() => {
        if (value) {
            const dateValue = dayjs(value);
            setSelectedDate({
                year: dateValue.year(),
                month: dateValue.month(),
                day: dateValue.date()
            });
        }
    }, [value]);

    const displayValue = value ? dayjs(value).format('DD/MM/YYYY') : '';

    return (
        <div className="relative">
            <div ref={inputRef}>
                <Input
                    readOnly
                    autoFocus
                    placeholder={placeholder}
                    value={displayValue}
                    onClick={() => !disabled && setShowPicker(!showPicker)}
                    onFocus={onFocus}
                    onBlur={onBlur}
                    disabled={disabled}
                    className={cn("cursor-pointer", className)}
                />
            </div>

            {showPicker && createPortal(
                <div
                    ref={pickerRef}
                    className="z-[10000] bg-white border border-border rounded-lg shadow-xl"
                    style={(() => {
                        const rect = inputRef.current?.getBoundingClientRect();
                        let top = 100, left = 100;
                        if (rect) {
                            const { top: inputTop, left: inputLeft, height: inputHeight } = rect;
                            const viewportHeight = window.innerHeight;
                            const pickerHeight = 350; // Approximate height of the picker

                            // Calculate top position
                            if (inputTop + inputHeight + pickerHeight > viewportHeight) {
                                top = inputTop - pickerHeight - 8; // Place above the input
                            } else {
                                top = inputTop + inputHeight + 8; // Place below the input
                            }

                            // Calculate left position
                            const pickerWidth = 320; // Fixed width of the picker
                            if (inputLeft + pickerWidth > window.innerWidth) {
                                left = window.innerWidth - pickerWidth - 8; // Align to the right edge
                            } else {
                                left = inputLeft; // Align to the left edge
                            }
                        }
                        return {
                            width: '320px',
                            maxHeight: '350px',
                            position: 'fixed',
                            top,
                            left
                        };
                    })()}
                >
                    <div className="flex">
                        {/* Year Selection */}
                        <div className="w-20 border-r border-border bg-muted/20">
                            <div className="px-2 py-2 font-medium text-xs text-foreground border-b bg-muted/30 text-center">
                                Năm
                            </div>
                            <div
                                ref={yearRef}
                                className="max-h-72 overflow-y-auto p-1"
                            >
                                {years.map((year) => (
                                    <div
                                        key={year}
                                        className={cn(
                                            "px-1 py-1 text-xs cursor-pointer rounded mx-0.5 transition-all hover:bg-primary/10 text-center",
                                            selectedDate.year === year && "bg-primary text-primary-foreground font-medium",
                                            disabledYear(year) && "opacity-50 cursor-not-allowed pointer-events-none"
                                        )}
                                        onClick={() => handleYearClick(year)}
                                    >
                                        {year}
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Calendar */}
                        <div className="flex-1 p-3">
                            {/* Header */}
                            <div className="flex items-center justify-between mb-3">
                                <button
                                    className="p-1 hover:bg-muted/70 rounded transition-all"
                                    onClick={() => handleMonthChange(-1)}
                                >
                                    <ChevronLeft className="w-3 h-3 text-muted-foreground" />
                                </button>
                                <span className="font-medium text-sm">
                                    Th{selectedDate.month + 1}/{selectedDate.year}
                                </span>
                                <button
                                    className="p-1 hover:bg-muted/70 rounded transition-all"
                                    onClick={() => handleMonthChange(1)}
                                >
                                    <ChevronRight className="w-3 h-3 text-muted-foreground" />
                                </button>
                            </div>

                            {/* Weekdays */}
                            <div className="grid grid-cols-7 gap-0.5 mb-1">
                                {['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN'].map((day) => (
                                    <div key={day} className="text-center text-xs font-medium text-muted-foreground p-1">
                                        {day}
                                    </div>
                                ))}
                            </div>

                            {/* Days */}
                            <div className="grid grid-cols-7 gap-0.5">
                                {/* Previous month days */}
                                {Array.from(
                                    { length: firstDay },
                                    (_, i) => prevMonthDays - firstDay + i + 1
                                ).map((day) => (
                                    <button
                                        key={`prev-${day}`}
                                        className={cn(
                                            "w-7 h-7 text-xs rounded hover:bg-muted/50 transition-all text-muted-foreground",
                                            disabledDay(day, prevMonth) && "opacity-50 cursor-not-allowed"
                                        )}
                                        onClick={() => !disabledDay(day, prevMonth) && handleDateClick(day, true)}
                                    >
                                        {day}
                                    </button>
                                ))}

                                {/* Current month days */}
                                {Array.from({ length: daysInMonth }, (_, i) => i + 1).map(
                                    (day) => (
                                        <button
                                            key={day}
                                            className={cn(
                                                "w-7 h-7 text-xs rounded hover:bg-muted/70 transition-all font-medium",
                                                selectedDate.day === day && "bg-primary text-primary-foreground shadow-sm",
                                                disabledDay(day, selectedDate.month) && "opacity-50 cursor-not-allowed"
                                            )}
                                            onClick={() => !disabledDay(day, selectedDate.month) && handleDateClick(day)}
                                        >
                                            {day}
                                        </button>
                                    )
                                )}

                                {/* Next month days */}
                                {Array.from({ length: 42 - firstDay - daysInMonth }, (_, i) => i + 1).map(
                                    (day) => (
                                        <button
                                            key={`next-${day}`}
                                            className={cn(
                                                "w-7 h-7 text-xs rounded hover:bg-muted/50 transition-all text-muted-foreground",
                                                disabledDay(day, nextMonth) && "opacity-50 cursor-not-allowed"
                                            )}
                                            onClick={() => !disabledDay(day, nextMonth) && handleDateClick(day, false, true)}
                                        >
                                            {day}
                                        </button>
                                    )
                                )}
                            </div>
                        </div>
                    </div>
                </div>,
                document.body
            )}
        </div>
    );
}

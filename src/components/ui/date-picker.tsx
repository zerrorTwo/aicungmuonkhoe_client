/* eslint-disable react-hooks/exhaustive-deps */
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
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
};

export default function DatePicker({
    placeholder = "Chọn ngày",
    disabledDate,
    disabledType = 'max',
    value,
    format = 'YYYY-MM-DD',
    onChange,
    onFocus,
    onBlur,
    disabled = false,
    className
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
        updateYearScrollPosition();
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
        if (yearRef.current) {
            const itemHeight = 36;
            const index = years.indexOf(selectedDate.year);
            const containerHeight = 300;
            const scrollPosition =
                index * itemHeight - containerHeight / 2 + itemHeight / 2;
            yearRef.current.scrollTo({
                top: Math.max(0, scrollPosition),
                behavior: 'smooth'
            });
        }
    }, [selectedDate.year, years]);

    const updateCalendarPosition = useCallback(() => {
        if (!showPicker) return;
        updateYearScrollPosition();
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
            updateCalendarPosition();
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [showPicker, updateCalendarPosition]);

    const displayValue = value ? dayjs(value).format('DD/MM/YYYY') : '';

    return (
        <div className="relative">
            <div ref={inputRef}>
                <Input
                    readOnly
                    placeholder={placeholder}
                    value={displayValue}
                    onClick={() => !disabled && setShowPicker(!showPicker)}
                    onFocus={onFocus}
                    onBlur={onBlur}
                    disabled={disabled}
                    className={cn("cursor-pointer", className)}
                />
            </div>

            {showPicker && (
                <div
                    ref={pickerRef}
                    className="absolute top-full left-0 z-[9999] bg-white border border-border rounded-lg shadow-xl mt-1"
                    style={{
                        width: '320px',
                        maxHeight: '350px'
                    }}
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
                            </div>                            {/* Weekdays */}
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
                                )}                                {/* Next month days */}
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
                </div>
            )}
        </div>
    );
}
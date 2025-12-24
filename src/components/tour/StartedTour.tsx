import React from 'react';
import Joyride, { type CallBackProps, STATUS, type Step } from 'react-joyride';
import { Sparkles, User, Activity, Heart, CheckCircle2 } from 'lucide-react';

interface StartedTourProps {
    run: boolean;
    onFinish: () => void;
}

const StartedTour: React.FC<StartedTourProps> = ({ run, onFinish }) => {
    const steps: Step[] = [
        {
            target: 'body',
            content: (
                <div className="relative overflow-hidden bg-white">
                    <div className="absolute inset-0 bg-gradient-to-br from-emerald-500 via-teal-400 to-cyan-500 opacity-10"></div>

                    <div className="relative p-6">
                        <div className="flex justify-center mb-4">
                            <div className="relative">
                                <div className="absolute inset-0 bg-emerald-500 rounded-full opacity-20 animate-ping"></div>
                                <div className="relative bg-gradient-to-br from-emerald-500 to-teal-600 p-4 rounded-full">
                                    <Sparkles className="h-10 w-10 text-white" />
                                </div>
                            </div>
                        </div>

                        <h2 className="text-3xl font-bold text-center bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent mb-3">
                            Chào mừng đến với<br />Ai Cũng Muốn Khỏe! 🎉
                        </h2>

                        <p className="text-gray-600 text-center mb-5 leading-relaxed text-base">
                            Chúng tôi rất vui được đồng hành cùng bạn trên hành trình chăm sóc sức khỏe.
                            Hãy cùng khám phá các tính năng tuyệt vời nhé!
                        </p>

                        <div className="flex flex-wrap gap-2 justify-center">
                            <span className="px-3 py-1.5 bg-emerald-100 text-emerald-700 rounded-full text-sm font-medium">
                                🎯 Theo dõi BMI
                            </span>
                            <span className="px-3 py-1.5 bg-teal-100 text-teal-700 rounded-full text-sm font-medium">
                                📊 Biểu đồ sức khỏe
                            </span>
                            <span className="px-3 py-1.5 bg-cyan-100 text-cyan-700 rounded-full text-sm font-medium">
                                💪 Khuyến nghị cá nhân
                            </span>
                        </div>
                    </div>
                </div>
            ),
            placement: 'center',
            disableBeacon: true,
        },
        {
            target: 'body',
            content: (
                <div className="relative overflow-hidden bg-white">
                    <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-bl from-emerald-400 to-transparent opacity-15 rounded-bl-full"></div>

                    <div className="relative p-6">
                        <div className="flex justify-center mb-4">
                            <div className="bg-gradient-to-br from-emerald-500 to-teal-600 p-3.5 rounded-2xl shadow-lg">
                                <User className="h-12 w-12 text-white" />
                            </div>
                        </div>

                        <h2 className="text-2xl font-bold text-center text-gray-900 mb-3">
                            Hồ sơ sức khỏe cá nhân
                        </h2>

                        <p className="text-gray-600 text-center mb-5 leading-relaxed">
                            Click vào avatar ở góc trên để hoàn thiện hồ sơ của bạn với các thông tin như
                            chiều cao, cân nặng, tuổi, giới tính.
                        </p>

                        <div className="bg-gradient-to-br from-emerald-50 to-teal-50 border-2 border-emerald-200 rounded-2xl p-4 mb-3">
                            <div className="grid grid-cols-2 gap-4 text-sm">
                                <div className="text-center">
                                    <p className="text-gray-500 mb-1.5 text-xs font-medium">Chiều cao</p>
                                    <p className="font-bold text-lg text-emerald-700">170 cm</p>
                                </div>
                                <div className="text-center">
                                    <p className="text-gray-500 mb-1.5 text-xs font-medium">Cân nặng</p>
                                    <p className="font-bold text-lg text-emerald-700">65 kg</p>
                                </div>
                                <div className="text-center">
                                    <p className="text-gray-500 mb-1.5 text-xs font-medium">Tuổi</p>
                                    <p className="font-bold text-lg text-teal-700">25</p>
                                </div>
                                <div className="text-center">
                                    <p className="text-gray-500 mb-1.5 text-xs font-medium">BMI</p>
                                    <p className="font-bold text-lg text-teal-700">22.5</p>
                                </div>
                            </div>
                        </div>

                        <p className="text-sm text-center text-emerald-600 font-medium">
                            ✨ Thông tin chính xác giúp phân tích sức khỏe tốt hơn
                        </p>
                    </div>
                </div>
            ),
            placement: 'center',
        },
        {
            target: 'body',
            content: (
                <div className="relative overflow-hidden bg-white">
                    <div className="absolute top-0 left-0 w-40 h-40 bg-gradient-to-br from-teal-400 to-transparent opacity-15 rounded-br-full"></div>

                    <div className="relative p-6">
                        <div className="flex justify-center mb-4">
                            <div className="bg-gradient-to-br from-teal-500 to-cyan-600 p-3.5 rounded-2xl shadow-lg">
                                <Activity className="h-12 w-12 text-white" />
                            </div>
                        </div>

                        <h2 className="text-2xl font-bold text-center text-gray-900 mb-3">
                            Theo dõi chỉ số sức khỏe
                        </h2>

                        <p className="text-gray-600 text-center mb-5 leading-relaxed">
                            Tính toán BMI, cập nhật cân nặng định kỳ, xem biểu đồ tiến trình
                            để theo dõi sức khỏe của bạn một cách khoa học.
                        </p>

                        <div className="space-y-3">
                            <div className="flex items-center gap-3 p-3.5 bg-gradient-to-r from-teal-50 to-cyan-50 rounded-xl border border-teal-200">
                                <div className="bg-teal-500 p-2.5 rounded-lg shrink-0">
                                    <span className="text-xl">📊</span>
                                </div>
                                <div className="flex-1">
                                    <p className="font-bold text-gray-900 mb-0.5">Biểu đồ BMI</p>
                                    <p className="text-xs text-gray-600">Theo dõi xu hướng thay đổi theo thời gian</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3 p-3.5 bg-gradient-to-r from-cyan-50 to-teal-50 rounded-xl border border-cyan-200">
                                <div className="bg-cyan-500 p-2.5 rounded-lg shrink-0">
                                    <span className="text-xl">⚖️</span>
                                </div>
                                <div className="flex-1">
                                    <p className="font-bold text-gray-900 mb-0.5">Cập nhật cân nặng</p>
                                    <p className="text-xs text-gray-600">Ghi lại hành trình sức khỏe của bạn</p>
                                </div>
                            </div>
                        </div>

                        <p className="text-sm text-center text-teal-600 mt-4 font-medium">
                            📈 Dữ liệu được lưu trữ an toàn và bảo mật
                        </p>
                    </div>
                </div>
            ),
            placement: 'center',
        },
        {
            target: 'body',
            content: (
                <div className="relative overflow-hidden bg-white">
                    <div className="absolute bottom-0 right-0 w-40 h-40 bg-gradient-to-tl from-pink-400 to-transparent opacity-15 rounded-tl-full"></div>

                    <div className="relative p-6">
                        <div className="flex justify-center mb-4">
                            <div className="bg-gradient-to-br from-pink-500 to-rose-600 p-3.5 rounded-2xl shadow-lg">
                                <Heart className="h-12 w-12 text-white" />
                            </div>
                        </div>

                        <h2 className="text-2xl font-bold text-center text-gray-900 mb-3">
                            Khuyến nghị cá nhân hóa
                        </h2>

                        <p className="text-gray-600 text-center mb-5 leading-relaxed">
                            Nhận lời khuyên về dinh dưỡng, luyện tập và lối sống
                            phù hợp với thể trạng và mục tiêu của bạn.
                        </p>

                        <div className="space-y-2.5">
                            <div className="flex items-start gap-2.5 p-3 bg-pink-50 rounded-lg border border-pink-100">
                                <CheckCircle2 className="h-5 w-5 text-pink-500 mt-0.5 shrink-0" />
                                <span className="text-sm text-gray-700 leading-relaxed">Chế độ ăn uống cân bằng cho từng độ tuổi</span>
                            </div>
                            <div className="flex items-start gap-2.5 p-3 bg-rose-50 rounded-lg border border-rose-100">
                                <CheckCircle2 className="h-5 w-5 text-rose-500 mt-0.5 shrink-0" />
                                <span className="text-sm text-gray-700 leading-relaxed">Bài tập phù hợp với thể trạng hiện tại</span>
                            </div>
                            <div className="flex items-start gap-2.5 p-3 bg-pink-50 rounded-lg border border-pink-100">
                                <CheckCircle2 className="h-5 w-5 text-pink-500 mt-0.5 shrink-0" />
                                <span className="text-sm text-gray-700 leading-relaxed">Lời khuyên từ chuyên gia y tế</span>
                            </div>
                            <div className="flex items-start gap-2.5 p-3 bg-rose-50 rounded-lg border border-rose-100">
                                <CheckCircle2 className="h-5 w-5 text-rose-500 mt-0.5 shrink-0" />
                                <span className="text-sm text-gray-700 leading-relaxed">Theo dõi tiến độ và điều chỉnh kế hoạch</span>
                            </div>
                        </div>

                        <p className="text-sm text-center text-pink-600 mt-4 font-medium">
                            💝 Được thiết kế riêng cho bạn
                        </p>
                    </div>
                </div>
            ),
            placement: 'center',
        },
        {
            target: 'body',
            content: (
                <div className="relative overflow-hidden bg-white">
                    <div className="absolute inset-0 bg-gradient-to-br from-emerald-500 via-teal-400 to-cyan-500 opacity-10 animate-pulse"></div>

                    <div className="relative p-6">
                        <div className="flex justify-center mb-4">
                            <div className="relative">
                                <div className="absolute inset-0 bg-emerald-500 rounded-full opacity-20 animate-ping"></div>
                                <div className="relative bg-gradient-to-br from-emerald-500 to-teal-600 p-4 rounded-full shadow-lg">
                                    <CheckCircle2 className="h-10 w-10 text-white" />
                                </div>
                            </div>
                        </div>

                        <h2 className="text-3xl font-bold text-center bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent mb-3">
                            Bắt đầu ngay! 🚀
                        </h2>

                        <p className="text-gray-600 text-center mb-5 leading-relaxed text-base">
                            Bạn đã sẵn sàng để bắt đầu hành trình chăm sóc sức khỏe.
                            Hãy hoàn thiện hồ sơ để nhận trải nghiệm tốt nhất!
                        </p>

                        <div className="bg-gradient-to-r from-emerald-50 via-teal-50 to-cyan-50 border-2 border-emerald-200 rounded-xl p-4 mb-4">
                            <p className="text-emerald-800 text-sm font-semibold text-center mb-2">
                                💡 Mẹo hữu ích
                            </p>
                            <p className="text-emerald-700 text-sm text-center leading-relaxed">
                                Bạn có thể xem lại hướng dẫn này bất kỳ lúc nào trong phần cài đặt tài khoản
                            </p>
                        </div>

                        <div className="flex justify-center gap-2">
                            {[1, 2, 3, 4, 5].map((i) => (
                                <div key={i} className="h-2 w-10 bg-emerald-200 rounded-full overflow-hidden">
                                    <div className="h-full bg-gradient-to-r from-emerald-500 to-teal-600 rounded-full"></div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            ),
            placement: 'center',
        },
    ];

    const handleJoyrideCallback = (data: CallBackProps) => {
        const { status } = data;

        if (status === STATUS.FINISHED || status === STATUS.SKIPPED) {
            onFinish();
        }
    };

    return (
        <Joyride
            steps={steps}
            run={run}
            continuous
            showProgress
            showSkipButton
            callback={handleJoyrideCallback}
            styles={{
                options: {
                    primaryColor: '#10B981',
                    textColor: '#1F2937',
                    backgroundColor: '#FFFFFF',
                    arrowColor: '#FFFFFF',
                    overlayColor: 'rgba(0, 0, 0, 0.6)',
                    zIndex: 10000,
                    width: 650,
                    beaconSize: 36,
                },
                beacon: {
                    borderRadius: '50%',
                    display: 'inline-block',
                    height: 36,
                    width: 36,
                },
                beaconInner: {
                    backgroundColor: '#10B981',
                    borderRadius: '50%',
                    display: 'block',
                    height: 20,
                    width: 20,
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                },
                beaconOuter: {
                    backgroundColor: 'rgba(16, 185, 129, 0.2)',
                    border: '2px solid #10B981',
                    borderRadius: '50%',
                    display: 'block',
                    height: 36,
                    width: 36,
                    animation: 'joyride-beacon 1.2s ease-in-out infinite',
                },
                tooltip: {
                    borderRadius: 16,
                    padding: 0,
                    maxWidth: 650,
                    boxShadow: '0 20px 60px rgba(0, 0, 0, 0.2)',
                },
                tooltipContainer: {
                    textAlign: 'left',
                },
                tooltipContent: {
                    padding: 0,
                },
                tooltipFooter: {
                    padding: '18px 24px',
                    marginTop: 0,
                    borderTop: '1px solid #E5E7EB',
                },
                buttonNext: {
                    backgroundColor: '#10B981',
                    borderRadius: 10,
                    padding: '12px 28px',
                    fontSize: 15,
                    fontWeight: 600,
                    border: 'none',
                    boxShadow: '0 4px 12px rgba(16, 185, 129, 0.3)',
                    transition: 'all 0.2s ease',
                    cursor: 'pointer',
                    color: '#FFFFFF',
                },
                buttonBack: {
                    color: '#6B7280',
                    marginRight: 12,
                    backgroundColor: '#FFFFFF',
                    border: '1.5px solid #D1D5DB',
                    borderRadius: 10,
                    padding: '12px 24px',
                    fontSize: 14,
                    fontWeight: 500,
                    transition: 'all 0.2s ease',
                    cursor: 'pointer',
                },
                buttonSkip: {
                    color: '#9CA3AF',
                    fontSize: 14,
                    fontWeight: 500,
                    padding: '10px 16px',
                    borderRadius: 8,
                    backgroundColor: 'transparent',
                    border: 'none',
                    transition: 'all 0.2s ease',
                    cursor: 'pointer',
                },
                buttonClose: {
                    color: '#6B7280',
                    padding: 10,
                    borderRadius: 6,
                    backgroundColor: 'transparent',
                    border: 'none',
                    transition: 'all 0.2s ease',
                    cursor: 'pointer',
                },
            }}
            locale={{
                back: 'Quay lại',
                close: 'Đóng',
                last: 'Hoàn thành',
                next: 'Tiếp theo',
                skip: 'Bỏ qua',
            }}
        />
    );
};

export default StartedTour;
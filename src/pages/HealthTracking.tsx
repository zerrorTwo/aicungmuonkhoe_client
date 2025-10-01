import React from 'react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const HealthTracking: React.FC = () => {
    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-emerald-50 to-blue-50">
            <Header />

            <main className="container mx-auto px-4 py-12">
                <div className="max-w-6xl mx-auto">
                    <div className="text-center mb-8">
                        <h1 className="text-3xl font-bold text-slate-900 mb-2">
                            Theo dõi chỉ số sức khỏe
                        </h1>
                        <p className="text-slate-600">
                            Quản lý và theo dõi các chỉ số sức khỏe của bạn một cách hiệu quả
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {/* BMI Card */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    📊 Chỉ số BMI
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold text-green-600 mb-2">22.5</div>
                                <p className="text-sm text-slate-600">Bình thường</p>
                                <div className="w-full bg-gray-200 rounded-full h-2 mt-3">
                                    <div className="bg-green-500 h-2 rounded-full" style={{ width: '60%' }}></div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Heart Rate Card */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    ❤️ Nhịp tim
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold text-red-500 mb-2">72 bpm</div>
                                <p className="text-sm text-slate-600">Bình thường</p>
                                <div className="w-full bg-gray-200 rounded-full h-2 mt-3">
                                    <div className="bg-red-500 h-2 rounded-full" style={{ width: '70%' }}></div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Blood Pressure Card */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    🩺 Huyết áp
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold text-blue-600 mb-2">120/80</div>
                                <p className="text-sm text-slate-600">Lý tưởng</p>
                                <div className="w-full bg-gray-200 rounded-full h-2 mt-3">
                                    <div className="bg-blue-500 h-2 rounded-full" style={{ width: '80%' }}></div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Blood Sugar Card */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    🍯 Đường huyết
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold text-yellow-600 mb-2">95 mg/dL</div>
                                <p className="text-sm text-slate-600">Bình thường</p>
                                <div className="w-full bg-gray-200 rounded-full h-2 mt-3">
                                    <div className="bg-yellow-500 h-2 rounded-full" style={{ width: '65%' }}></div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Exercise Card */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    💪 Hoạt động thể chất
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold text-green-600 mb-2">150 phút</div>
                                <p className="text-sm text-slate-600">Tuần này</p>
                                <div className="w-full bg-gray-200 rounded-full h-2 mt-3">
                                    <div className="bg-green-500 h-2 rounded-full" style={{ width: '85%' }}></div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Sleep Card */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    😴 Giấc ngủ
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold text-purple-600 mb-2">7.5 giờ</div>
                                <p className="text-sm text-slate-600">Đêm qua</p>
                                <div className="w-full bg-gray-200 rounded-full h-2 mt-3">
                                    <div className="bg-purple-500 h-2 rounded-full" style={{ width: '75%' }}></div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Quick Actions */}
                    <div className="mt-12">
                        <h2 className="text-xl font-semibold text-slate-900 mb-6">Thao tác nhanh</h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                            <button className="p-4 bg-white rounded-lg shadow hover:shadow-md transition-shadow text-left">
                                <div className="text-2xl mb-2">📝</div>
                                <div className="font-medium">Cập nhật chỉ số</div>
                                <div className="text-sm text-slate-600">Nhập chỉ số mới</div>
                            </button>

                            <button className="p-4 bg-white rounded-lg shadow hover:shadow-md transition-shadow text-left">
                                <div className="text-2xl mb-2">📊</div>
                                <div className="font-medium">Xem biểu đồ</div>
                                <div className="text-sm text-slate-600">Theo dõi xu hướng</div>
                            </button>

                            <button className="p-4 bg-white rounded-lg shadow hover:shadow-md transition-shadow text-left">
                                <div className="text-2xl mb-2">🎯</div>
                                <div className="font-medium">Đặt mục tiêu</div>
                                <div className="text-sm text-slate-600">Lập kế hoạch sức khỏe</div>
                            </button>

                            <button className="p-4 bg-white rounded-lg shadow hover:shadow-md transition-shadow text-left">
                                <div className="text-2xl mb-2">💊</div>
                                <div className="font-medium">Nhắc nhở thuốc</div>
                                <div className="text-sm text-slate-600">Quản lý thuốc men</div>
                            </button>
                        </div>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
};

export default HealthTracking;
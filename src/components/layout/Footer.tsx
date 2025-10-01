import React from 'react';
import { Button } from '@/components/ui/button';
import {
    Heart,
    Phone,
    Mail,
    MapPin,
    Facebook,
    Instagram,
    Youtube,
    MessageCircle
} from 'lucide-react';
import Logo from '@/components/ui/Logo';

const Footer: React.FC = () => {
    const footerSections = [
        {
            title: 'Dịch vụ',
            links: [
                'Theo dõi sức khỏe',
                'Tư vấn trực tuyến',
                'Kết hoạch dinh dưỡng',
                'Nhật ký sức khỏe',
                'Mục tiêu cá nhân'
            ]
        },
        {
            title: 'Hỗ trợ',
            links: [
                'Trung tâm trợ giúp',
                'Liên hệ',
                'Câu hỏi thường gặp',
                'Hướng dẫn sử dụng',
                'Báo cáo lỗi'
            ]
        },
        {
            title: 'Công ty',
            links: [
                'Giới thiệu',
                'Tin tức',
                'Tuyển dụng',
                'Đối tác',
                'Chính sách bảo mật'
            ]
        }
    ];

    const contactInfo = [
        { icon: Phone, text: '1900 1234 567', link: 'tel:19001234567' },
        { icon: Mail, text: 'support@suckhoegiadinh.vn', link: 'mailto:support@suckhoegiadinh.vn' },
        { icon: MapPin, text: 'TP. Hồ Chí Minh, Việt Nam', link: '#' }
    ];

    const socialLinks = [
        { icon: Facebook, link: '#', color: 'text-blue-600' },
        { icon: Instagram, link: '#', color: 'text-pink-600' },
        { icon: Youtube, link: '#', color: 'text-red-600' },
        { icon: MessageCircle, link: '#', color: 'text-green-600' }
    ];

    return (
        <footer className="bg-white border-t border-slate-200">
            <div className="container mx-auto px-4 lg:px-6">
                {/* Main Footer Content */}
                <div className="py-12 lg:py-16">
                    <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 lg:gap-12">
                        {/* Brand Section */}
                        <div className="lg:col-span-1 space-y-6">
                            <div className="flex items-center space-x-3">
                                <Logo className="w-12 h-12" width={48} height={48} />
                                <div>
                                    <h3 className="text-xl font-bold text-slate-900">
                                        Ai cũng muốn khỏe
                                    </h3>
                                    <p className="text-sm text-slate-600">
                                        Chăm sóc toàn diện
                                    </p>
                                </div>
                            </div>

                            <p className="text-slate-600 leading-relaxed">
                                Nền tảng chăm sóc sức khỏe hàng đầu Việt Nam, mang đến các giải pháp y tế hiện đại và toàn diện cho mọi gia đình.
                            </p>

                            {/* Social Links */}
                            <div className="flex space-x-3">
                                {socialLinks.map((social, index) => (
                                    <Button
                                        key={index}
                                        variant="outline"
                                        size="sm"
                                        className="p-2 h-auto hover:scale-110 transition-transform duration-300 border-slate-200"
                                    >
                                        <social.icon className={`w-4 h-4 ${social.color}`} />
                                    </Button>
                                ))}
                            </div>
                        </div>

                        {/* Footer Links */}
                        {footerSections.map((section, index) => (
                            <div key={index} className="space-y-6">
                                <h4 className="text-lg font-semibold text-slate-900">
                                    {section.title}
                                </h4>
                                <ul className="space-y-3">
                                    {section.links.map((link, linkIndex) => (
                                        <li key={linkIndex}>
                                            <Button
                                                variant="ghost"
                                                className="p-0 h-auto text-slate-600 hover:text-emerald-600 justify-start font-normal"
                                            >
                                                {link}
                                            </Button>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Contact & Newsletter Section */}
                <div className="py-8 border-t border-slate-200">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
                        {/* Contact Info */}
                        <div className="space-y-4">
                            <h4 className="text-lg font-semibold text-slate-900 flex items-center">
                                <Heart className="w-5 h-5 mr-2 text-emerald-600" />
                                Liên hệ với chúng tôi
                            </h4>
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                {contactInfo.map((contact, index) => (
                                    <div key={index} className="flex items-center space-x-3">
                                        <div className="p-2 bg-emerald-100 rounded-lg">
                                            <contact.icon className="w-4 h-4 text-emerald-600" />
                                        </div>
                                        <a
                                            href={contact.link}
                                            className="text-sm text-slate-600 hover:text-emerald-600 transition-colors duration-300"
                                        >
                                            {contact.text}
                                        </a>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Newsletter */}
                        <div className="space-y-4">
                            <h4 className="text-lg font-semibold text-slate-900">
                                Nhận tin tức sức khỏe
                            </h4>
                            <p className="text-sm text-slate-600">
                                Đăng ký để nhận những thông tin mới nhất về sức khỏe và dinh dưỡng
                            </p>
                            <div className="flex space-x-2">
                                <input
                                    type="email"
                                    placeholder="Nhập email của bạn"
                                    className="flex-1 px-4 py-2 bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm"
                                />
                                <Button className="bg-emerald-600 hover:bg-emerald-700 text-white px-6">
                                    Đăng ký
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="py-6 border-t border-slate-200">
                    <div className="flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0">
                        <p className="text-sm text-slate-600">
                            © 2024 Sức khỏe gia đình Việt. Tất cả quyền được bảo lưu.
                        </p>
                        <div className="flex space-x-6 text-sm">
                            <Button variant="ghost" className="p-0 h-auto text-slate-600 hover:text-emerald-600">
                                Điều khoản sử dụng
                            </Button>
                            <Button variant="ghost" className="p-0 h-auto text-slate-600 hover:text-emerald-600">
                                Chính sách bảo mật
                            </Button>
                            <Button variant="ghost" className="p-0 h-auto text-slate-600 hover:text-emerald-600">
                                Cookie
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
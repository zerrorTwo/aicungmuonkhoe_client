import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import HealthLogo from '@/components/ui/health-logo';

const Header: React.FC = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const navigationItems = [
        { label: 'Trang chủ', href: '/', active: true },
        { label: 'Theo dõi sức khỏe', href: '/health-tracking' },
        { label: 'Thông tin sức khỏe', href: '/health-info' },
        { label: 'Liên kết tài khoản', href: '/account-linking' },
        { label: 'Hồ sơ cá nhân', href: '/profile' },
    ];

    return (
        <header className="bg-white/95 backdrop-blur-md border-b border-slate-200 sticky top-0 z-50">
            <div className="container mx-auto px-4 lg:px-6">
                <div className="flex items-center justify-between h-16 lg:h-20">
                    {/* Logo */}
                    <div className="flex items-center space-x-3">
                        <HealthLogo className="w-10 h-10 lg:w-12 lg:h-12" />
                        <div className="hidden sm:block">
                            <h1 className="text-lg lg:text-xl font-bold text-slate-900">
                                Sức khỏe gia đình Việt
                            </h1>
                            <p className="text-xs text-slate-600">Chăm sóc sức khỏe toàn diện</p>
                        </div>
                    </div>

                    {/* Desktop Navigation */}
                    <nav className="hidden lg:flex items-center space-x-1">
                        {navigationItems.map((item) => (
                            <Link key={item.href} to={item.href}>
                                <Button
                                    variant={item.active ? "default" : "ghost"}
                                    className={`px-4 py-2 text-sm font-medium transition-all duration-300 ${item.active
                                        ? 'bg-emerald-600 text-white shadow-lg'
                                        : 'hover:bg-slate-100 text-slate-600 hover:text-slate-900'
                                        }`}
                                >
                                    {item.label}
                                </Button>
                            </Link>
                        ))}
                    </nav>

                    {/* User Actions */}
                    <div className="flex items-center space-x-3">
                        <Link to="/login">
                            <Button
                                variant="outline"
                                size="sm"
                                className="hidden sm:flex items-center space-x-2 border-emerald-200 hover:bg-emerald-50"
                            >
                                <User className="w-4 h-4" />
                                <span>Đăng nhập</span>
                            </Button>
                        </Link>

                        {/* Mobile Menu Button */}
                        <Button
                            variant="ghost"
                            size="sm"
                            className="lg:hidden"
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                        >
                            {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                        </Button>
                    </div>
                </div>

                {/* Mobile Navigation */}
                {isMenuOpen && (
                    <div className="lg:hidden py-4 border-t border-slate-200">
                        <nav className="space-y-2">
                            {navigationItems.map((item) => (
                                <Link key={item.href} to={item.href}>
                                    <Button
                                        variant={item.active ? "default" : "ghost"}
                                        className={`w-full justify-start text-sm ${item.active
                                            ? 'bg-emerald-600 text-white'
                                            : 'text-slate-600 hover:text-slate-900'
                                            }`}
                                    >
                                        {item.label}
                                    </Button>
                                </Link>
                            ))}
                            <div className="pt-2 mt-2 border-t border-slate-200">
                                <Link to="/login">
                                    <Button variant="outline" className="w-full justify-start text-sm">
                                        <User className="w-4 h-4 mr-2" />
                                        Đăng nhập
                                    </Button>
                                </Link>
                            </div>
                        </nav>
                    </div>
                )}
            </div>
        </header>
    );
};

export default Header;
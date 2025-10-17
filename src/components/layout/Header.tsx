import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Menu, X, User, Settings, LogOut, UserCircle, FileText, Shield, Bell } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Logo from '@/components/ui/Logo';
import { useAuth } from '@/hooks/useAuth';
import { useAppDispatch } from '@/store/hooks';
import { logout as logoutAction } from '@/store/slices/authSlice';
import { useLogoutMutation } from '@/store/api/authApi';

const Header: React.FC = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const navigate = useNavigate();
    const location = useLocation();
    const dispatch = useAppDispatch();

    // Auth state
    const { isAuthenticated } = useAuth();
    const user = localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')!) : null;
    const [logoutMutation] = useLogoutMutation();

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsUserDropdownOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const handleLogout = async () => {
        try {
            await logoutMutation().unwrap();
            dispatch(logoutAction());
            localStorage.removeItem('access_token');
            localStorage.removeItem('user');
            navigate('/login');
        } catch (error) {
            console.error('Logout failed:', error);
            // Force logout even if API call fails
            dispatch(logoutAction());
            localStorage.removeItem('access_token');
            localStorage.removeItem('user');
            navigate('/login');
        }
    };

    const getUserDisplayName = () => {
        if (user?.EMAIL) {
            return user.EMAIL.split('@')[0];
        }
        return 'User';
    };

    const getUserAvatar = () => {
        if (user?.FACE_IMAGE) {
            return user.FACE_IMAGE;
        }
        return null;
    };

    // Function to check if a route is active
    const isRouteActive = (href: string) => {
        if (href === '/') {
            return location.pathname === '/';
        }
        return location.pathname.startsWith(href);
    };

    const navigationItems = [
        { label: 'Trang chủ', href: '/' },
        { label: 'Theo dõi sức khỏe', href: '/health-tracking' },
        { label: 'Thông tin sức khỏe', href: '/health-info' },
        { label: 'Liên kết tài khoản', href: '/account-linking' },
        { label: 'Hồ sơ cá nhân', href: '/profile' },
    ];

    return (
        <header className="bg-white/95 backdrop-blur-md border-b border-slate-200 sticky top-0 z-50">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16 lg:h-20">
                    {/* Logo */}
                    <div className="flex items-center space-x-3">
                        <Logo className="w-10 h-10 lg:w-12 lg:h-12" width={48} height={48} />
                        <div className="hidden sm:block">
                            <h1 className="text-lg lg:text-xl font-bold text-slate-900">
                                Ai cũng muốn khỏe
                            </h1>
                            <p className="text-xs text-slate-600">Chăm sóc sức khỏe toàn diện</p>
                        </div>
                    </div>
                    {/* Desktop Navigation */}
                    <nav className="hidden lg:flex items-center space-x-1">
                        {navigationItems.map((item) => {
                            const isActive = isRouteActive(item.href);
                            return (
                                <Link key={item.href} to={item.href} onClick={() => setIsMenuOpen(false)}>
                                    <Button
                                        variant={isActive ? "default" : "ghost"}
                                        className={`cursor-pointer px-4 py-2 text-sm font-medium transition-all duration-300 ${isActive
                                            ? 'bg-gradient-primary text-white shadow-lg'
                                            : 'hover:bg-slate-100 text-slate-600 hover:text-slate-900'
                                            }`}
                                    >
                                        {item.label}
                                    </Button>
                                </Link>
                            );
                        })}
                    </nav>

                    {/* User Actions */}
                    <div className="flex items-center space-x-3">
                        {isAuthenticated() && user ? (
                            // User Avatar & Dropdown
                            <div className="relative" ref={dropdownRef}>
                                <button
                                    onClick={() => setIsUserDropdownOpen(!isUserDropdownOpen)}
                                    className="flex items-center space-x-2 p-2 rounded-full hover:bg-slate-100 transition-colors duration-200 user-avatar"
                                >
                                    {getUserAvatar() ? (
                                        <>
                                            <span className="hidden sm:block text-sm font-medium text-teal-500">
                                                Hi, {getUserDisplayName()}
                                            </span>
                                            <img
                                                src={getUserAvatar()!}
                                                alt="User Avatar"
                                                className="w-10 h-10 rounded-full border-2 border-emerald-200 object-cover"
                                            />
                                        </>
                                    ) : (
                                        <>
                                            <span className="hidden sm:block text-sm font-medium text-teal-500">
                                                Hi, {getUserDisplayName()}
                                            </span>
                                            <div className="w-10 h-10 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-full flex items-center justify-center text-white font-semibold">
                                                {getUserDisplayName().charAt(0).toUpperCase()}
                                            </div>
                                        </>
                                    )}
                                </button>

                                {/* Dropdown Menu */}
                                {isUserDropdownOpen && (
                                    <div className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-lg border border-slate-200 py-2 z-50 user-dropdown-enter">
                                        {/* User Info Header */}
                                        <div className="px-4 py-3 border-b border-slate-100">
                                            <div className="flex items-center space-x-3">
                                                {getUserAvatar() ? (
                                                    <img
                                                        src={getUserAvatar()!}
                                                        alt="User Avatar"
                                                        className="w-10 h-10 rounded-full border-2 border-emerald-200 object-cover"
                                                    />
                                                ) : (
                                                    <div className="w-10 h-10 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-full flex items-center justify-center text-white font-semibold">
                                                        {getUserDisplayName().charAt(0).toUpperCase()}
                                                    </div>
                                                )}
                                                <div>
                                                    <p className="font-semibold text-slate-900">{getUserDisplayName()}</p>
                                                    <p className="text-sm text-slate-500 truncate max-w-32">{user.EMAIL}</p>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Menu Items */}
                                        <div className="py-2">
                                            <Link
                                                to="/profile"
                                                className="flex items-center space-x-3 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 transition-colors user-menu-item"
                                                onClick={() => setIsUserDropdownOpen(false)}
                                            >
                                                <UserCircle className="w-4 h-4" />
                                                <span>Tài khoản cá nhân</span>
                                            </Link>

                                            <Link
                                                to="/health-tracking"
                                                className="flex items-center space-x-3 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 transition-colors"
                                                onClick={() => setIsUserDropdownOpen(false)}
                                            >
                                                <FileText className="w-4 h-4" />
                                                <span>Thông tin sức khỏe</span>
                                            </Link>

                                            <Link
                                                to="/account-linking"
                                                className="flex items-center space-x-3 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 transition-colors"
                                                onClick={() => setIsUserDropdownOpen(false)}
                                            >
                                                <Shield className="w-4 h-4" />
                                                <span>Liên kết tài khoản</span>
                                            </Link>

                                            <button
                                                className="flex items-center space-x-3 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 transition-colors w-full"
                                                onClick={() => setIsUserDropdownOpen(false)}
                                            >
                                                <Bell className="w-4 h-4" />
                                                <span>Thông báo</span>
                                                <span className="ml-auto bg-emerald-500 text-white text-xs rounded-full px-2 py-1">3</span>
                                            </button>

                                            <button
                                                className="flex items-center space-x-3 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 transition-colors w-full"
                                                onClick={() => setIsUserDropdownOpen(false)}
                                            >
                                                <Settings className="w-4 h-4" />
                                                <span>Cài đặt</span>
                                            </button>
                                        </div>

                                        {/* Logout */}
                                        <div className="border-t border-slate-100 pt-2">
                                            <button
                                                onClick={handleLogout}
                                                className="flex items-center space-x-3 px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors w-full"
                                            >
                                                <LogOut className="w-4 h-4" />
                                                <span>Đăng xuất</span>
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        ) : (
                            // Login Button (when not authenticated)
                            <Link to="/login">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    className="hidden sm:flex items-center space-x-2 border-emerald-200 hover:bg-emerald-50 cursor-pointer"
                                >
                                    <User className="w-4 h-4" />
                                    <span>Đăng nhập</span>
                                </Button>
                            </Link>
                        )}

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
                            {navigationItems.map((item) => {
                                const isActive = isRouteActive(item.href);
                                return (
                                    <Link key={item.href} to={item.href} onClick={() => setIsMenuOpen(false)}>
                                        <Button
                                            variant={isActive ? "default" : "ghost"}
                                            className={`w-full justify-start text-sm ${isActive
                                                ? 'bg-gradient-primary text-white'
                                                : 'text-slate-600 hover:text-slate-900'
                                                }`}
                                        >
                                            {item.label}
                                        </Button>
                                    </Link>
                                );
                            })}

                            <div className="pt-2 mt-2 border-t border-slate-200">
                                {isAuthenticated() && user ? (
                                    // User info for mobile
                                    <div className="space-y-2">
                                        {/* User Info */}
                                        <div className="flex items-center space-x-3 px-3 py-2 bg-slate-50 rounded-lg">
                                            {getUserAvatar() ? (
                                                <img
                                                    src={getUserAvatar()!}
                                                    alt="User Avatar"
                                                    className="w-8 h-8 rounded-full border-2 border-emerald-200 object-cover"
                                                />
                                            ) : (
                                                <div className="w-8 h-8 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                                                    {getUserDisplayName().charAt(0).toUpperCase()}
                                                </div>
                                            )}
                                            <div className="flex-1 min-w-0">
                                                <p className="font-semibold text-slate-900 text-sm">{getUserDisplayName()}</p>
                                                <p className="text-xs text-slate-500 truncate">{user.EMAIL}</p>
                                            </div>
                                        </div>

                                        {/* Mobile User Actions */}
                                        <Link to="/profile">
                                            <Button variant="ghost" className="w-full justify-start text-sm">
                                                <UserCircle className="w-4 h-4 mr-2" />
                                                Tài khoản cá nhân
                                            </Button>
                                        </Link>

                                        <button className="w-full">
                                            <Button variant="ghost" className="w-full justify-start text-sm">
                                                <Bell className="w-4 h-4 mr-2" />
                                                Thông báo
                                                <span className="ml-auto bg-emerald-500 text-white text-xs rounded-full px-2 py-1">3</span>
                                            </Button>
                                        </button>

                                        <button className="w-full">
                                            <Button variant="ghost" className="w-full justify-start text-sm">
                                                <Settings className="w-4 h-4 mr-2" />
                                                Cài đặt
                                            </Button>
                                        </button>

                                        <button onClick={handleLogout} className="w-full">
                                            <Button variant="ghost" className="w-full justify-start text-sm text-red-600 hover:text-red-700 hover:bg-red-50">
                                                <LogOut className="w-4 h-4 mr-2" />
                                                Đăng xuất
                                            </Button>
                                        </button>
                                    </div>
                                ) : (
                                    // Login button for mobile
                                    <Link to="/login">
                                        <Button variant="outline" className="w-full justify-start text-sm">
                                            <User className="w-4 h-4 mr-2" />
                                            Đăng nhập
                                        </Button>
                                    </Link>
                                )}
                            </div>
                        </nav>
                    </div>
                )}
            </div>
        </header>
    );
};

export default Header;
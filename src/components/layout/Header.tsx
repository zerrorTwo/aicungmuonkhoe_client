import React, { useState, useRef, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import {
  Menu,
  X,
  User,
  Settings,
  LogOut,
  UserCircle,
  FileText,
  Shield,
  Bell,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import Logo from "@/components/ui/Logo";
import { cn } from "@/lib/utils";
import { useAuth } from "@/hooks/useAuth";
import { useAppDispatch } from "@/store/hooks";
import { logout as logoutAction } from "@/store/slices/authSlice";
import { useLogoutMutation } from "@/store/api/authApi";
import { isMobile } from "react-device-detect";

const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useAppDispatch();

  // Auth state
  const { isAuthenticated } = useAuth();
  const user = localStorage.getItem("user")
    ? JSON.parse(localStorage.getItem("user")!)
    : null;
  const [logoutMutation] = useLogoutMutation();

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsUserDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Close mobile menu when route changes
  useEffect(() => {
    setIsMenuOpen(false);
  }, [location.pathname]);

  const handleLogout = async () => {
    try {
      await logoutMutation().unwrap();
      dispatch(logoutAction());
      localStorage.removeItem("access_token");
      localStorage.removeItem("user");
      navigate("/login");
    } catch (error) {
      console.error("Logout failed:", error);
      // Force logout even if API call fails
      dispatch(logoutAction());
      localStorage.removeItem("access_token");
      localStorage.removeItem("user");
      navigate("/login");
    }
  };

  const getUserDisplayName = () => {
    if (user?.EMAIL) {
      return user.EMAIL.split("@")[0];
    }
    return "User";
  };

  const getUserAvatar = () => {
    if (user?.FACE_IMAGE) {
      return user.FACE_IMAGE;
    }
    return null;
  };

  // Function to check if a route is active
  const isRouteActive = (href: string) => {
    if (href === "/") {
      return location.pathname === "/";
    }
    return location.pathname.startsWith(href);
  };

  const navigationItems = [
    { label: "Trang chủ", href: "/" },
    { label: "Theo dõi sức khỏe", href: "/health-tracking" },
    { label: "Tư vấn sức khỏe", href: "/health-consulting" },
    { label: "Liên kết tài khoản", href: "/account-linking" },
    { label: "Hồ sơ cá nhân", href: "/profile" },
    { label: "Cộng đồng", href: "/post-article" },
  ];

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/95 backdrop-blur-md">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between lg:h-20">
          {/* Logo */}
          <div className="flex items-center space-x-3">
            <Logo
              className="h-10 w-10 lg:h-12 lg:w-12"
              width={48}
              height={48}
            />
            <div className="hidden sm:block">
              <h1 className="text-lg font-bold text-slate-900 lg:text-xl">
                Ai cũng muốn khỏe
              </h1>
              <p className="text-xs text-slate-600">
                Chăm sóc sức khỏe toàn diện
              </p>
            </div>
          </div>
          {/* Desktop Navigation */}
          <nav className="hidden items-center space-x-1 lg:flex">
            {navigationItems.map((item) => {
              const isActive = isRouteActive(item.href);
              return (
                <Link
                  key={item.href}
                  to={item.href}
                  onClick={() => setIsMenuOpen(false)}
                >
                  <Button
                    variant="ghost"
                    className={cn(
                      "cursor-pointer px-4 py-2 text-sm font-medium transition-all duration-300",
                      isActive
                        ? "!bg-emerald-600 !text-white shadow-lg hover:!bg-emerald-700"
                        : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                    )}
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
                  className="user-avatar flex items-center space-x-2 rounded-full p-2 transition-colors duration-200 hover:bg-slate-100"
                >
                  {getUserAvatar() ? (
                    <>
                      <span className="hidden text-sm font-medium text-teal-500 sm:block">
                        Hi, {getUserDisplayName()}
                      </span>
                      <img
                        src={getUserAvatar()!}
                        alt="User Avatar"
                        className="h-10 w-10 rounded-full border-2 border-emerald-200 object-cover"
                      />
                    </>
                  ) : (
                    <>
                      <span className="hidden text-sm font-medium text-teal-500 sm:block">
                        Hi, {getUserDisplayName()}
                      </span>
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-emerald-400 to-emerald-600 font-semibold text-white">
                        {getUserDisplayName().charAt(0).toUpperCase()}
                      </div>
                    </>
                  )}
                </button>

                {/* Dropdown Menu */}
                {isUserDropdownOpen && (
                  <div className="user-dropdown-enter absolute right-0 z-50 mt-2 w-64 rounded-xl border border-slate-200 bg-white py-2 shadow-lg">
                    {/* User Info Header */}
                    <div className="border-b border-slate-100 px-4 py-3">
                      <div className="flex items-center space-x-3">
                        {getUserAvatar() ? (
                          <img
                            src={getUserAvatar()!}
                            alt="User Avatar"
                            className="h-10 w-10 rounded-full border-2 border-emerald-200 object-cover"
                          />
                        ) : (
                          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-emerald-400 to-emerald-600 font-semibold text-white">
                            {getUserDisplayName().charAt(0).toUpperCase()}
                          </div>
                        )}
                        <div>
                          <p className="font-semibold text-slate-900">
                            {getUserDisplayName()}
                          </p>
                          <p className="max-w-32 truncate text-sm text-slate-500">
                            {user.EMAIL}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Menu Items */}
                    <div className="py-2">
                      <Link
                        to="/profile"
                        className="user-menu-item flex items-center space-x-3 px-4 py-2 text-sm text-slate-700 transition-colors hover:bg-slate-50"
                        onClick={() => setIsUserDropdownOpen(false)}
                      >
                        <UserCircle className="h-4 w-4" />
                        <span>Tài khoản cá nhân</span>
                      </Link>

                      <Link
                        to="/health-tracking"
                        className="flex items-center space-x-3 px-4 py-2 text-sm text-slate-700 transition-colors hover:bg-slate-50"
                        onClick={() => setIsUserDropdownOpen(false)}
                      >
                        <FileText className="h-4 w-4" />
                        <span>Thông tin sức khỏe</span>
                      </Link>

                      <Link
                        to="/account-linking"
                        className="flex items-center space-x-3 px-4 py-2 text-sm text-slate-700 transition-colors hover:bg-slate-50"
                        onClick={() => setIsUserDropdownOpen(false)}
                      >
                        <Shield className="h-4 w-4" />
                        <span>Liên kết tài khoản</span>
                      </Link>

                      <button
                        className="flex w-full items-center space-x-3 px-4 py-2 text-sm text-slate-700 transition-colors hover:bg-slate-50"
                        onClick={() => setIsUserDropdownOpen(false)}
                      >
                        <Bell className="h-4 w-4" />
                        <span>Thông báo</span>
                        <span className="ml-auto rounded-full bg-emerald-500 px-2 py-1 text-xs text-white">
                          3
                        </span>
                      </button>

                      <button
                        className="flex w-full items-center space-x-3 px-4 py-2 text-sm text-slate-700 transition-colors hover:bg-slate-50"
                        onClick={() => setIsUserDropdownOpen(false)}
                      >
                        <Settings className="h-4 w-4" />
                        <span>Cài đặt</span>
                      </button>
                    </div>

                    {/* Logout */}
                    <div className="border-t border-slate-100 pt-2">
                      <button
                        onClick={handleLogout}
                        className="flex w-full items-center space-x-3 px-4 py-2 text-sm text-red-600 transition-colors hover:bg-red-50"
                      >
                        <LogOut className="h-4 w-4" />
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
                  size="small"
                  className="hidden cursor-pointer items-center space-x-2 border-emerald-200 hover:bg-emerald-50 sm:flex"
                >
                  <User className="h-4 w-4" />
                  <span>Đăng nhập</span>
                </Button>
              </Link>
            )}

            {/* Mobile Menu Button */}
            {isMobile && (
              <Button
                variant="ghost"
                size="small"
                className="lg:hidden"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
              >
                {isMenuOpen ? (
                  <X className="h-5 w-5" />
                ) : (
                  <Menu className="h-5 w-5" />
                )}
              </Button>
            )}
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="fixed inset-0 z-40 lg:hidden">
            <div
              className="absolute inset-0 bg-black/30"
              onClick={() => setIsMenuOpen(false)}
            />
            <div className="absolute top-16 right-0 left-0 max-h-[calc(100vh-4rem)] overflow-y-auto border-t border-slate-200 bg-white py-4">
              <nav className="space-y-2 px-4">
                {navigationItems.map((item) => {
                  const isActive = isRouteActive(item.href);
                  return (
                    <Link
                      key={item.href}
                      to={item.href}
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <Button
                        variant="ghost"
                        className={cn(
                          "w-full justify-start text-sm",
                          isActive
                            ? "!bg-emerald-600 !text-white hover:!bg-emerald-700"
                            : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                        )}
                      >
                        {item.label}
                      </Button>
                    </Link>
                  );
                })}

                <div className="mt-2 border-t border-slate-200 pt-2">
                  {isAuthenticated() && user ? (
                    // User info for mobile
                    <div className="space-y-2">
                      {/* User Info */}
                      <div className="flex items-center space-x-3 rounded-lg bg-slate-50 px-3 py-2">
                        {getUserAvatar() ? (
                          <img
                            src={getUserAvatar()!}
                            alt="User Avatar"
                            className="h-8 w-8 rounded-full border-2 border-emerald-200 object-cover"
                          />
                        ) : (
                          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-emerald-400 to-emerald-600 text-sm font-semibold text-white">
                            {getUserDisplayName().charAt(0).toUpperCase()}
                          </div>
                        )}
                        <div className="min-w-0 flex-1">
                          <p className="text-sm font-semibold text-slate-900">
                            {getUserDisplayName()}
                          </p>
                          <p className="truncate text-xs text-slate-500">
                            {user.EMAIL}
                          </p>
                        </div>
                      </div>

                      {/* Mobile User Actions */}
                      <Link to="/profile" onClick={() => setIsMenuOpen(false)}>
                        <Button
                          variant="ghost"
                          className="w-full justify-start text-sm"
                        >
                          <UserCircle className="mr-2 h-4 w-4" />
                          Tài khoản cá nhân
                        </Button>
                      </Link>

                      <button
                        className="w-full"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        <Button
                          variant="ghost"
                          className="w-full justify-start text-sm"
                        >
                          <Bell className="mr-2 h-4 w-4" />
                          Thông báo
                          <span className="ml-auto rounded-full bg-emerald-500 px-2 py-1 text-xs text-white">
                            3
                          </span>
                        </Button>
                      </button>

                      <button
                        className="w-full"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        <Button
                          variant="ghost"
                          className="w-full justify-start text-sm"
                        >
                          <Settings className="mr-2 h-4 w-4" />
                          Cài đặt
                        </Button>
                      </button>

                      <button
                        onClick={() => {
                          setIsMenuOpen(false);
                          handleLogout();
                        }}
                        className="w-full"
                      >
                        <Button
                          variant="ghost"
                          className="w-full justify-start text-sm text-red-600 hover:bg-red-50 hover:text-red-700"
                        >
                          <LogOut className="mr-2 h-4 w-4" />
                          Đăng xuất
                        </Button>
                      </button>
                    </div>
                  ) : (
                    // Login button for mobile
                    <Link to="/login" onClick={() => setIsMenuOpen(false)}>
                      <Button
                        variant="outline"
                        className="w-full justify-start text-sm"
                      >
                        <User className="mr-2 h-4 w-4" />
                        Đăng nhập
                      </Button>
                    </Link>
                  )}
                </div>
              </nav>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;

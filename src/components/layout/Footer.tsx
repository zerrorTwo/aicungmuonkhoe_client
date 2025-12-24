import React from "react"
import { Button } from "@/components/ui/button"
import {
  Heart,
  Phone,
  Mail,
  MapPin,
  Facebook,
  Instagram,
  Youtube,
  MessageCircle,
} from "lucide-react"
import Logo from "@/components/ui/Logo"
import { Link } from "react-router-dom"

const Footer: React.FC = () => {
  const footerSections = [
    {
      title: "Dịch vụ",
      links: [
        { text: "Theo dõi sức khỏe", href: "/health-tracking" },
        { text: "Tư vấn y tế trực tuyến", href: "/online-consultation" },
        { text: "Kết hoạch dinh dưỡng", href: "/meal-planning" },
        { text: "Nhật ký sức khỏe", href: "/health-journal" },
        { text: "Mục tiêu cá nhân", href: "/personal-goals" },
      ],
    },
    {
      title: "Hỗ trợ",
      links: [
        { text: "Trung tâm trợ giúp", href: "/help" },
        { text: "Liên hệ", href: "/contact" },
        { text: "Câu hỏi thường gặp", href: "/faq" },
        { text: "Hướng dẫn sử dụng", href: "/guides" },
        { text: "Báo cáo lỗi", href: "/report" },
      ],
    },
    {
      title: "Công ty",
      links: [
        { text: "Giới thiệu", href: "/about" },
        { text: "Tin tức", href: "/news" },
        { text: "Tuyển dụng", href: "/careers" },
        { text: "Đối tác", href: "/partners" },
        { text: "Chính sách bảo mật", href: "/privacy" },
      ],
    },
  ]

  const contactInfo = [
    { icon: Phone, text: "1900 1234 567", link: "tel:19001234567" },
    { icon: Mail, text: "support@gmail.com", link: "mailto:support@gmail.com" },
    { icon: MapPin, text: "TP. Hồ Chí Minh, Việt Nam", link: "#" },
  ]

  const socialLinks = [
    { icon: Facebook, link: "#", color: "text-blue-600" },
    { icon: Instagram, link: "#", color: "text-pink-600" },
    { icon: Youtube, link: "#", color: "text-red-600" },
    { icon: MessageCircle, link: "#", color: "text-green-600" },
  ]

  return (
    <footer className="border-t border-slate-200 bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Footer Content */}
        <div className="py-12 lg:py-16">
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-4 lg:gap-12">
            {/* Brand Section */}
            <div className="space-y-6 lg:col-span-1">
              <div className="flex items-center space-x-3">
                <Logo className="h-12 w-12" width={48} height={48} />
                <div>
                  <h3 className="text-xl font-bold text-slate-900">
                    Ai cũng muốn khỏe
                  </h3>
                  <p className="text-sm text-slate-600">Chăm sóc toàn diện</p>
                </div>
              </div>

              <p className="leading-relaxed text-slate-600">
                Nền tảng chăm sóc sức khỏe hàng đầu Việt Nam, mang đến các giải
                pháp y tế hiện đại và toàn diện cho mọi gia đình.
              </p>

              {/* Social Links */}
              <div className="flex space-x-3">
                {socialLinks.map((social, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    size="small"
                    className="h-auto border-slate-200 p-2 transition-transform duration-300 hover:scale-110"
                  >
                    <social.icon className={`h-4 w-4 ${social.color}`} />
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
                      <Link
                        to={link.href}
                        onClick={() =>
                          window.scrollTo({ top: 0, behavior: "smooth" })
                        }
                        className="h-auto cursor-pointer justify-start p-0 font-normal text-slate-600 hover:text-emerald-600"
                      >
                        {link.text}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Contact & Newsletter Section */}
        <div className="border-t border-slate-200 py-8">
          <div className="grid grid-cols-1 items-center gap-8 lg:grid-cols-2">
            {/* Contact Info */}
            <div className="space-y-4">
              <h4 className="flex items-center text-lg font-semibold text-slate-900">
                <Heart className="mr-2 h-5 w-5 text-emerald-600" />
                Liên hệ với chúng tôi
              </h4>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                {contactInfo.map((contact, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    <div className="rounded-lg bg-emerald-100 p-2">
                      <contact.icon className="h-4 w-4 text-emerald-600" />
                    </div>
                    <a
                      href={contact.link}
                      className="text-sm text-slate-600 transition-colors duration-300 hover:text-emerald-600"
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
                Đăng ký để nhận những thông tin mới nhất về sức khỏe và dinh
                dưỡng
              </p>
              <div className="flex space-x-2">
                <input
                  type="email"
                  placeholder="Nhập email của bạn"
                  className="flex-1 rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
                <Button className="bg-emerald-600 px-6 text-white hover:bg-emerald-700">
                  Đăng ký
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-slate-200 py-6">
          <div className="flex flex-col items-center justify-between space-y-4 sm:flex-row sm:space-y-0">
            <p className="text-sm text-slate-600">
              © 2024 Sức khỏe gia đình Việt. Tất cả quyền được bảo lưu.
            </p>
            <div className="flex space-x-6 text-sm">
              <Button
                variant="ghost"
                className="h-auto p-0 text-slate-600 hover:text-emerald-600"
                onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
              >
                Điều khoản sử dụng
              </Button>
              <Button
                variant="ghost"
                className="h-auto p-0 text-slate-600 hover:text-emerald-600"
                onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
              >
                Chính sách bảo mật
              </Button>
              <Button
                variant="ghost"
                className="h-auto p-0 text-slate-600 hover:text-emerald-600"
                onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
              >
                Cookie
              </Button>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer

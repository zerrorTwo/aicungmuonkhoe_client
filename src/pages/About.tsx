import React from 'react';
import { Target, Eye, Award, Users } from 'lucide-react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';

// Data constants - dễ dàng quản lý và chỉnh sửa
const ABOUT_DATA = {
  intro: {
    title: 'GIỚI THIỆU DỰ ÁN',
    subtitle: 'WEBSITE DINH DƯỠNG & SỨC KHỎE "AI CŨNG MUỐN KHỎE"',
    quote: '"Kiến thức dinh dưỡng đúng đắn là nền tảng cho một cuộc sống khỏe mạnh và hạnh phúc"',
    content: [
      'Trong bối cảnh xu hướng chăm sóc sức khỏe và dinh dưỡng ngày càng được quan tâm, cùng với sự gia tăng các bệnh mãn tính như béo phì, tim mạch, tiểu đường, nhu cầu tiếp cận thông tin dinh dưỡng khoa học, chính xác và dễ hiểu đang trở nên cấp thiết hơn bao giờ hết. Người dân Việt Nam, đặc biệt là các bà nội trợ, cha mẹ và những người quan tâm đến sức khỏe gia đình, đang tìm kiếm một nguồn thông tin đáng tin cậy để cải thiện chế độ ăn uống hàng ngày.',
      'Website "AI Cũng Muốn Khỏe" ra đời với sứ mệnh nâng cao nhận thức cộng đồng về dinh dưỡng thông qua việc cung cấp kiến thức khoa học được kiểm chứng, kết hợp công nghệ hiện đại để mang đến giải pháp cá nhân hóa cho từng người dùng. Chúng tôi tin rằng mỗi gia đình Việt Nam đều xứng đáng có được những bữa ăn vừa ngon miệng, vừa đảm bảo dinh dưỡng phù hợp với nhu cầu sức khỏe của từng thành viên.'
    ]
  },

  mission: {
    title: '1. Mục tiêu của dự án',
    quote: 'Xây dựng nền tảng số giúp người dân Việt Nam dễ dàng tiếp cận kiến thức dinh dưỡng khoa học, từ đó cải thiện chất lượng cuộc sống và giảm thiểu nguy cơ mắc các bệnh liên quan đến chế độ ăn uống'
  },

  development: {
    title: '2. Đội ngũ phát triển',
    intro: 'Dự án được phát triển bởi đội ngũ đa ngành, kết hợp giữa chuyên môn công nghệ và y tế dinh dưỡng, bao gồm:',
    company: {
      name: 'Nhóm Phát Triển Sản Phẩm:',
      points: [
        'Đội ngũ lập trình viên chuyên về phát triển web (React, TypeScript) và xây dựng hệ thống backend xử lý dữ liệu dinh dưỡng phức tạp.',
        'Chuyên gia thiết kế UI/UX tập trung vào trải nghiệm người dùng, đảm bảo giao diện thân thiện và dễ sử dụng cho mọi lứa tuổi.',
        'Đội ngũ kiểm thử và đảm bảo chất lượng, đảm bảo tính ổn định và bảo mật thông tin người dùng.',
        'Phát triển tính năng cá nhân hóa: hệ thống phân tích chỉ số sức khỏe, tư vấn dinh dưỡng tự động và lên thực đơn phù hợp cho từng đối tượng người dùng.'
      ]
    },
    partners: {
      title: '3. Đối tác chuyên môn',
      intro: 'Để đảm bảo tính chính xác và khoa học của nội dung, chúng tôi hợp tác với các chuyên gia:',
      list: [
        {
          name: 'Chuyên gia Dinh dưỡng & Y tế:',
          points: [
            'Tư vấn và kiểm duyệt toàn bộ nội dung về dinh dưỡng, đảm bảo thông tin chính xác, cập nhật theo các nghiên cứu khoa học mới nhất.',
            'Xây dựng bộ tiêu chuẩn dinh dưỡng cho người Việt Nam theo từng độ tuổi, giới tính và tình trạng sức khỏe.',
            'Phát triển các công thức tính toán chỉ số dinh dưỡng và thuật toán gợi ý thực đơn phù hợp với văn hóa ẩm thực Việt Nam.'
          ]
        }
      ]
    }
  },

  features: {
    title: '4. Tính năng nổi bật',
    list: [
      {
        name: 'Quản lý sức khỏe cá nhân:',
        description: 'Người dùng có thể theo dõi các chỉ số sức khỏe (BMI, cân nặng, chiều cao, lượng đường, muối...) và nhận được tư vấn dựa trên dữ liệu cá nhân.'
      },
      {
        name: 'Kho công thức món ăn:',
        description: 'Hàng trăm công thức món ăn lành mạnh với thông tin dinh dưỡng chi tiết, hướng dẫn chế biến và hình ảnh minh họa sinh động.'
      },
      {
        name: 'Lên thực đơn tự động:',
        description: 'Hệ thống AI gợi ý thực đơn cân bằng dinh dưỡng dựa trên chỉ số sức khỏe, sở thích ăn uống và nguyên liệu có sẵn.'
      },
      {
        name: 'Quản lý gia đình:',
        description: 'Tạo và quản lý tài khoản cho nhiều thành viên trong gia đình, theo dõi sức khỏe của từng người một cách riêng biệt.'
      }
    ]
  },

  values: [
    {
      icon: Target,
      title: 'Sứ mệnh',
      description: 'Nâng cao nhận thức và cải thiện thói quen ăn uống của người dân Việt Nam thông qua kiến thức khoa học'
    },
    {
      icon: Eye,
      title: 'Tầm nhìn',
      description: 'Trở thành nền tảng dinh dưỡng hàng đầu, đồng hành cùng hàng triệu gia đình Việt trên hành trình chăm sóc sức khỏe'
    },
    {
      icon: Award,
      title: 'Giá trị cốt lõi',
      description: 'Khoa học - Chính xác - Dễ tiếp cận - Cá nhân hóa - Bảo mật thông tin người dùng'
    },
    {
      icon: Users,
      title: 'Đối tượng phục vụ',
      description: 'Phụ nữ nội trợ, cha mẹ, người quan tâm sức khỏe, người cần chế độ ăn đặc biệt và chuyên gia dinh dưỡng'
    }
  ]
};

const About: React.FC = () => {
  return (
   <>
   <Header/>
    <div className="min-h-screen bg-white">
      {/* Hero Image Section */}
      <div className="relative h-64 overflow-hidden bg-gradient-to-br from-blue-100 to-green-100 sm:h-80">
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <p className="mb-2 text-lg font-medium text-teal-700 sm:text-xl">
              {ABOUT_DATA.intro.title}
            </p>
            <h1 className="px-4 text-xl font-bold text-gray-800 sm:text-2xl lg:text-3xl">
              {ABOUT_DATA.intro.subtitle}
            </h1>
          </div>
        </div>
        {/* Decorative elements */}
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-teal-600"></div>
      </div>

      {/* Quote Section */}
      <div className="border-b-2 border-gray-100 bg-gradient-to-r from-teal-50 to-blue-50 py-8">
        <div className="mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
          <p className="text-xl font-semibold italic text-teal-700 sm:text-2xl">
            {ABOUT_DATA.intro.quote}
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-8">
        {/* Introduction */}
        <div className="mb-16">
          <div className="space-y-6 text-justify leading-relaxed text-gray-700">
            {ABOUT_DATA.intro.content.map((paragraph, index) => (
              <p key={index} className="text-base">
                {paragraph}
              </p>
            ))}
          </div>
        </div>

        {/* Mission Quote Box */}
        <div className="mb-16">
          <h2 className="mb-8 text-2xl font-bold text-gray-900">
            {ABOUT_DATA.mission.title}
          </h2>
          <div className="relative rounded-2xl border-4 border-teal-500 bg-gradient-to-br from-teal-50 to-blue-50 p-8 shadow-sm">
            <div className="absolute -left-3 -top-3 text-6xl text-teal-500 opacity-50">
              "
            </div>
            <p className="relative text-center text-xl font-semibold italic text-teal-700 sm:text-2xl">
              {ABOUT_DATA.mission.quote}
            </p>
            <div className="absolute -bottom-3 -right-3 text-6xl text-teal-500 opacity-50">
              "
            </div>
          </div>
        </div>

        {/* Development Section */}
        <div className="mb-16">
          <h2 className="mb-6 text-2xl font-bold text-gray-900">
            {ABOUT_DATA.development.title}
          </h2>
          <p className="mb-8 text-justify leading-relaxed text-gray-700">
            {ABOUT_DATA.development.intro}
          </p>

          {/* Company Info Box */}
          <div className="mb-8 rounded-xl border-2 border-indigo-200 bg-indigo-50 p-6">
            <div className="mb-4 flex items-center gap-4">
              <div className="flex h-16 w-16 flex-shrink-0 items-center justify-center rounded-lg bg-white p-2 shadow-sm">
                <Users className="h-10 w-10 text-indigo-600" />
              </div>
              <h3 className="text-lg font-bold text-indigo-700">
                {ABOUT_DATA.development.company.name}
              </h3>
            </div>
            <ul className="space-y-3">
              {ABOUT_DATA.development.company.points.map((point, index) => (
                <li key={index} className="flex gap-3 text-justify text-sm leading-relaxed text-gray-700">
                  <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-indigo-500"></span>
                  <span>{point}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Partners Section */}
          <div>
            <h2 className="mb-6 text-2xl font-bold text-gray-900">
              {ABOUT_DATA.development.partners.title}
            </h2>
            <p className="mb-6 text-justify leading-relaxed text-gray-700">
              {ABOUT_DATA.development.partners.intro}
            </p>

            {ABOUT_DATA.development.partners.list.map((partner, pIndex) => (
              <div key={pIndex} className="rounded-xl border-2 border-green-200 bg-green-50 p-6">
                <div className="mb-4 flex items-center gap-4">
                  <div className="flex h-16 w-16 flex-shrink-0 items-center justify-center rounded-full bg-white shadow-sm">
                    <Award className="h-10 w-10 text-green-600" />
                  </div>
                  <h3 className="text-lg font-bold text-green-700">
                    {partner.name}
                  </h3>
                </div>
                <ul className="space-y-3">
                  {partner.points.map((point, index) => (
                    <li key={index} className="flex gap-3 text-justify text-sm leading-relaxed text-gray-700">
                      <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-green-500"></span>
                      <span>{point}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Features Section */}
        <div className="mb-16">
          <h2 className="mb-8 text-2xl font-bold text-gray-900">
            {ABOUT_DATA.features.title}
          </h2>
          <div className="space-y-6">
            {ABOUT_DATA.features.list.map((feature, index) => (
              <div
                key={index}
                className="rounded-lg border-l-4 border-teal-500 bg-gray-50 p-6 transition-all hover:bg-gray-100"
              >
                <h3 className="mb-2 text-lg font-semibold text-gray-900">
                  {feature.name}
                </h3>
                <p className="text-justify leading-relaxed text-gray-700">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Values Grid */}
        <div className="border-t-2 border-gray-100 pt-12">
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {ABOUT_DATA.values.map((value, index) => {
              const Icon = value.icon;
              return (
                <div
                  key={index}
                  className="rounded-lg border border-gray-200 bg-gray-50 p-6 text-center transition-all hover:border-teal-300 hover:shadow-md"
                >
                  <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-teal-100 text-teal-600">
                    <Icon className="h-7 w-7" />
                  </div>
                  <h3 className="mb-2 font-semibold text-gray-900">
                    {value.title}
                  </h3>
                  <p className="text-sm text-gray-600">
                    {value.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Social Share Section */}
      <div className="border-t-2 border-gray-100 bg-gray-50 py-8">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap items-center justify-center gap-4 text-sm text-gray-600">
            <span className="font-medium">Chia sẻ:</span>
            <button className="flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2 transition-colors hover:bg-blue-50">
              <span>Facebook</span>
            </button>
            <button className="flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2 transition-colors hover:bg-blue-50">
              <span>Twitter</span>
            </button>
            <button className="flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2 transition-colors hover:bg-gray-100">
              <span>Email</span>
            </button>
          </div>
        </div>
      </div>
    </div>
    <Footer/>
    </>
  );
};

export default About;
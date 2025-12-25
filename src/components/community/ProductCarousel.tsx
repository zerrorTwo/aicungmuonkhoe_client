import React from "react";
import { Carousel } from "antd";
import { ShoppingCart, Star, Zap, ChevronRight } from "lucide-react";

interface Product {
  id: number;
  name: string;
  price: number;
  originalPrice?: number;
  image: string;
  rating: number;
  sold: number;
  category: string;
}

// Mock data với ảnh Unsplash chất lượng cao
const mockProducts: Product[] = [
  {
    id: 1,
    name: "Vitamin C Complex 1000mg - Tăng đề kháng tự nhiên",
    price: 299000,
    originalPrice: 399000,
    category: "Thực phẩm chức năng",
    // Ảnh lọ thuốc cam/vàng
    image:
      "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&q=80&w=400",
    rating: 4.8,
    sold: 1200,
  },
  {
    id: 2,
    name: "Whey Protein Isolate - Chocolate (2.5kg)",
    price: 1850000,
    originalPrice: 2200000,
    category: "Thể hình",
    // Ảnh bình shaker và bột
    image:
      "https://images.unsplash.com/photo-1579722821273-0f6c7d44362f?auto=format&fit=crop&q=80&w=400",
    rating: 4.9,
    sold: 856,
  },
  {
    id: 3,
    name: "Dầu cá Omega 3 Premium - Sáng mắt, bổ tim",
    price: 450000,
    originalPrice: 650000,
    category: "Sức khỏe",
    // Ảnh viên nang dầu cá
    image:
      "https://images.unsplash.com/photo-1550572017-edd951aa8f72?auto=format&fit=crop&q=80&w=400",
    rating: 4.7,
    sold: 2341,
  },
  {
    id: 4,
    name: "Thảm Yoga Định Tuyến Cao Su Non TPE",
    price: 320000,
    originalPrice: 450000,
    category: "Dụng cụ tập",
    // Ảnh thảm Yoga cuộn tròn
    image:
      "https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?auto=format&fit=crop&q=80&w=400",
    rating: 4.9,
    sold: 3456,
  },
  {
    id: 5,
    name: "Máy đo huyết áp bắp tay tự động",
    price: 1200000,
    originalPrice: 1500000,
    category: "Thiết bị y tế",
    // Ảnh thiết bị y tế
    image:
      "https://images.unsplash.com/photo-1631549916768-4119b2d5f926?auto=format&fit=crop&q=80&w=400",
    rating: 5.0,
    sold: 234,
  },
  {
    id: 6,
    name: "Serum Vitamin B5 - Phục hồi da hư tổn",
    price: 550000,
    originalPrice: 750000,
    category: "Làm đẹp",
    // Ảnh chai serum
    image:
      "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&q=80&w=400",
    rating: 4.6,
    sold: 678,
  },
];

export const ProductCarousel: React.FC = () => {
  return (
    <div className="relative group/container">
      {/* Header Section */}
      <div className="flex items-center justify-between mb-5 px-1">
        <div className="flex items-center gap-2">
          <div className="bg-blue-600 p-2 rounded-lg text-white shadow-lg shadow-blue-200">
            <ShoppingCart size={20} />
          </div>
          <div>
            <h3 className="text-lg font-bold text-gray-900 leading-none">
              Gợi ý cho bạn
            </h3>
            <p className="text-xs text-gray-500 mt-1">
              Sản phẩm chăm sóc sức khỏe top đầu
            </p>
          </div>
        </div>
        <button className="text-sm font-medium text-blue-600 hover:text-blue-700 flex items-center gap-1 transition-all hover:gap-2">
          Xem tất cả <ChevronRight size={16} />
        </button>
      </div>

      {/* Carousel Container */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 relative overflow-hidden">
        {/* Background Decoration */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-blue-50 rounded-bl-full -z-0 opacity-50" />

        <Carousel
          autoplay
          dots={{ className: "custom-dots" }}
          slidesToShow={3}
          slidesToScroll={1}
          infinite
          autoplaySpeed={4000}
          className="pb-8" // Padding bottom cho dots
          responsive={[
            {
              breakpoint: 1024,
              settings: {
                slidesToShow: 2,
              },
            },
            {
              breakpoint: 640,
              settings: {
                slidesToShow: 1,
              },
            },
          ]}
        >
          {mockProducts.map((product) => (
            <div key={product.id} className="px-3 py-2 h-full">
              {/* Product Card */}
              <div className="group bg-white rounded-xl border border-gray-100 overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-300 h-full flex flex-col relative">
                {/* Discount Badge */}
                {product.originalPrice && (
                  <div className="absolute top-3 left-3 z-10 bg-red-500 text-white text-[10px] font-bold px-2 py-1 rounded-md shadow-sm flex items-center gap-1">
                    <Zap size={10} fill="currentColor" />-
                    {Math.round(
                      ((product.originalPrice - product.price) /
                        product.originalPrice) *
                        100
                    )}
                    %
                  </div>
                )}

                {/* Image Container */}
                <div className="relative aspect-square overflow-hidden bg-gray-50">
                  <img
                    alt={product.name}
                    src={product.image}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    loading="lazy"
                  />

                  {/* Quick Action Overlay (Hiện khi hover) */}
                  <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                    <button className="bg-white text-gray-900 font-medium px-4 py-2 rounded-full shadow-lg transform translate-y-4 group-hover:translate-y-0 transition-all duration-300 text-sm hover:bg-blue-600 hover:text-white">
                      Xem nhanh
                    </button>
                  </div>
                </div>

                {/* Content */}
                <div className="p-4 flex flex-col flex-1">
                  <div className="text-xs text-gray-500 mb-1">
                    {product.category}
                  </div>
                  <h4 className="text-sm font-semibold text-gray-800 line-clamp-2 min-h-[40px] mb-2 group-hover:text-blue-600 transition-colors">
                    {product.name}
                  </h4>

                  {/* Rating & Sold */}
                  <div className="flex items-center gap-2 mb-3 text-xs">
                    <div className="flex items-center text-yellow-500">
                      <Star size={12} fill="currentColor" />
                      <span className="ml-1 font-medium text-gray-700">
                        {product.rating}
                      </span>
                    </div>
                    <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
                    <span className="text-gray-500">
                      Đã bán{" "}
                      {product.sold >= 1000
                        ? `${(product.sold / 1000).toFixed(1)}k`
                        : product.sold}
                    </span>
                  </div>

                  {/* Price Section */}
                  <div className="mt-auto">
                    <div className="flex items-end gap-2 mb-3">
                      <span className="text-lg font-bold text-blue-600">
                        {product.price.toLocaleString("vi-VN")}₫
                      </span>
                      {product.originalPrice && (
                        <span className="text-xs text-gray-400 line-through mb-1">
                          {product.originalPrice.toLocaleString("vi-VN")}₫
                        </span>
                      )}
                    </div>

                    {/* Add to Cart Button */}
                    <button className="w-full py-2.5 rounded-lg bg-gray-50 text-gray-700 font-medium text-sm group-hover:bg-blue-600 group-hover:text-white transition-colors duration-200 flex items-center justify-center gap-2">
                      <ShoppingCart size={16} />
                      Thêm vào giỏ
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </Carousel>
      </div>

      {/* Custom Styles cho dots */}
      <style>{`
        .custom-dots {
            bottom: -5px !important;
        }
        .custom-dots li {
            margin: 0 4px !important;
        }
        .custom-dots li button {
          background: #e2e8f0 !important;
          height: 4px !important;
          border-radius: 4px !important;
          transition: all 0.3s ease !important;
          opacity: 1 !important;
        }
        .custom-dots li.slick-active button {
          background: #2563eb !important;
          width: 32px !important;
        }
      `}</style>
    </div>
  );
};

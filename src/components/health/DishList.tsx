import React from "react";
import type { DishBasic } from "@/types/dish.type";
import { Card, Empty, Spin } from "antd";
import { Clock, ChefHat } from "lucide-react";

interface DishListProps {
  dishes: DishBasic[];
  isLoading?: boolean;
  onDishClick: (dish: DishBasic) => void;
}

const DishList: React.FC<DishListProps> = ({
  dishes,
  isLoading,
  onDishClick,
}) => {
  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-20">
        <Spin size="large" tip="Đang tải danh sách món ăn..." />
      </div>
    );
  }

  if (!dishes || dishes.length === 0) {
    return (
      <div className="py-20">
        <Empty
          description="Không tìm thấy món ăn phù hợp với độ tuổi của bạn"
          image={Empty.PRESENTED_IMAGE_SIMPLE}
        />
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {dishes.map((dish) => (
        <Card
          key={`${dish.ID}_${dish.AGE_GROUP_ID}`}
          hoverable
          className="overflow-hidden rounded-xl border-gray-200 hover:shadow-2xl transition-all duration-300"
          cover={
            <div className="relative h-48 overflow-hidden">
              <img
                alt={dish.NAME}
                src={dish.SMALL_IMAGE}
                className="w-full h-full object-cover hover:scale-110 transition-transform duration-300"
                onError={(e) => {
                  (e.target as HTMLImageElement).src =
                    "https://via.placeholder.com/300x200?text=No+Image";
                }}
              />
              <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-semibold text-emerald-600">
                {dish.AGE_GROUP_ID}
              </div>
            </div>
          }
          onClick={() => onDishClick(dish)}
        >
          <div className="space-y-3">
            <h3 className="text-lg font-bold text-gray-800 line-clamp-2 min-h-[56px]">
              {dish.NAME}
            </h3>

            <div className="flex items-center gap-4 text-sm text-gray-600">
              {dish.COOKING_METHOD_NAME && (
                <div className="flex items-center gap-1">
                  <ChefHat size={16} className="text-emerald-500" />
                  <span>{dish.COOKING_METHOD_NAME}</span>
                </div>
              )}

              <div className="flex items-center gap-1">
                <Clock size={16} className="text-blue-500" />
                <span>
                  {new Date(dish.CREATED_AT).toLocaleDateString("vi-VN")}
                </span>
              </div>
            </div>

            <div className="pt-3 border-t border-gray-100">
              <button className="w-full bg-gradient-to-r from-emerald-500 to-teal-600 text-white py-2 rounded-lg hover:from-emerald-600 hover:to-teal-700 transition-all duration-200 font-medium">
                Xem chi tiết
              </button>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
};

export default DishList;

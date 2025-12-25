import React from "react";
import { Spin, Tag, Typography, Tabs } from "antd";
import {
  ChevronRight,
  ChefHat,
  Clock,
  Utensils,
  Info,
  Lightbulb,
} from "lucide-react";
import type { DishDetail } from "@/types/dish.type";

const { Title, Text, Paragraph } = Typography;
const { TabPane } = Tabs;

interface DishDetailViewProps {
  dish: DishDetail | null;
  isLoading?: boolean;
  onBack: () => void;
}

const DishDetailView: React.FC<DishDetailViewProps> = ({
  dish,
  isLoading,
  onBack,
}) => {
  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-20">
        <Spin size="large" tip="Đang tải thông tin món ăn..." />
      </div>
    );
  }

  if (!dish) return null;

  const nutritionData = [
    {
      label: "Năng lượng",
      value: dish.NUTRITION.ENERGY,
      unit: "kcal",
      color: "orange",
    },
    {
      label: "Nước",
      value: dish.NUTRITION.WATER,
      unit: "g",
      color: "blue",
    },
    {
      label: "Protein",
      value: dish.NUTRITION.PROTEIN,
      unit: "g",
      color: "red",
    },
    {
      label: "Protein động vật",
      value: dish.NUTRITION.ANIMAL_PROTEIN,
      unit: "g",
      color: "red",
    },
    {
      label: "Protein thực vật",
      value: dish.NUTRITION.VEGETABLE_PROTEIN,
      unit: "g",
      color: "green",
    },
    {
      label: "Chất béo",
      value: dish.NUTRITION.FAT,
      unit: "g",
      color: "yellow",
    },
    {
      label: "Chất béo động vật",
      value: dish.NUTRITION.ANIMAL_FAT,
      unit: "g",
      color: "yellow",
    },
    {
      label: "Chất béo thực vật",
      value: dish.NUTRITION.VEGETABLE_FAT,
      unit: "g",
      color: "green",
    },
    {
      label: "Tinh bột/Đường",
      value: dish.NUTRITION.STARCH_SUGAR,
      unit: "g",
      color: "purple",
    },
    {
      label: "Chất xơ",
      value: dish.NUTRITION.FIBER,
      unit: "g",
      color: "green",
    },
    {
      label: "Chất béo không bão hòa đơn",
      value: dish.NUTRITION.MONO_UNSATURATED_FAT,
      unit: "g",
      color: "cyan",
    },
    {
      label: "Chất béo không bão hòa đa",
      value: dish.NUTRITION.POLY_UNSATURATED_FAT,
      unit: "g",
      color: "cyan",
    },
    {
      label: "Tổng chất béo không bão hòa",
      value: dish.NUTRITION.TOTAL_UNSATURATED_FAT,
      unit: "g",
      color: "cyan",
    },
    {
      label: "Cholesterol",
      value: dish.NUTRITION.CHOLESTEROL,
      unit: "mg",
      color: "magenta",
    },
    {
      label: "Đường",
      value: dish.NUTRITION.SUGAR,
      unit: "g",
      color: "pink",
    },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Back Button */}
      <div className="flex items-center gap-3">
        <button
          onClick={onBack}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors flex items-center gap-2 text-gray-600 hover:text-emerald-600"
        >
          <ChevronRight size={20} className="rotate-180" />
          <span className="font-medium">Quay lại</span>
        </button>
      </div>

      {/* Header with Image */}
      <div className="relative h-80 overflow-hidden rounded-3xl shadow-xl">
        <img
          src={dish.LARGE_IMAGE}
          alt={dish.NAME}
          className="w-full h-full object-cover"
          onError={(e) => {
            (e.target as HTMLImageElement).src =
              "https://via.placeholder.com/900x300?text=No+Image";
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
        <div className="absolute bottom-8 left-8 right-8">
          <Title level={1} className="!text-white !mb-3">
            {dish.NAME}
          </Title>
          <div className="flex items-center gap-3 text-white/90">
            <Tag color="green" className="text-sm">
              {dish.AGE_GROUP_ID}
            </Tag>
            {dish.COOKING_METHOD_NAME && (
              <div className="flex items-center gap-2 bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full">
                <ChefHat size={16} />
                <span className="text-sm font-medium">
                  {dish.COOKING_METHOD_NAME}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Tags */}
      {dish.TAGS && dish.TAGS.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {dish.TAGS.map((tag: string, index: number) => (
            <Tag key={index} color="blue" className="text-sm px-3 py-1">
              {tag}
            </Tag>
          ))}
        </div>
      )}

      {/* Content Tabs */}
      <div className="bg-white rounded-3xl p-6 shadow-lg">
        <Tabs defaultActiveKey="ingredients" className="custom-tabs">
          {/* Ingredients Tab */}
          <TabPane
            tab={
              <span className="flex items-center gap-2 text-base">
                <Utensils size={18} />
                Nguyên liệu
              </span>
            }
            key="ingredients"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              {dish.INGREDIENTS.map((ingredient: any) => (
                <div
                  key={ingredient.ID}
                  className="flex items-center gap-4 p-4 bg-gradient-to-br from-gray-50 to-white rounded-2xl hover:shadow-md transition-all border border-gray-100"
                >
                  <img
                    src={ingredient.IMAGE}
                    alt={ingredient.NAME}
                    className="w-20 h-20 rounded-xl object-cover shadow-sm"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src =
                        "https://via.placeholder.com/80?text=?";
                    }}
                  />
                  <div className="flex-1">
                    <Text strong className="block text-base mb-1">
                      {ingredient.NAME}
                    </Text>
                    <Text type="secondary" className="text-sm block">
                      Khối lượng:{" "}
                      <span className="font-semibold">
                        {ingredient.WEIGHT}g
                      </span>
                    </Text>
                    {ingredient.PROCESSING_METHOD && (
                      <Text
                        type="secondary"
                        className="text-xs block mt-1 italic"
                      >
                        {ingredient.PROCESSING_METHOD}
                      </Text>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </TabPane>

          {/* Nutrition Tab */}
          <TabPane
            tab={
              <span className="flex items-center gap-2 text-base">
                <ChefHat size={18} />
                Dinh dưỡng
              </span>
            }
            key="nutrition"
          >
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-4">
              {nutritionData.map((item) => (
                <div
                  key={item.label}
                  className="p-5 bg-gradient-to-br from-white via-gray-50 to-white rounded-2xl border border-gray-200 hover:border-emerald-200 hover:shadow-md transition-all"
                >
                  <Text
                    type="secondary"
                    className="text-xs block mb-2 uppercase tracking-wide font-semibold"
                  >
                    {item.label}
                  </Text>
                  <div className="flex items-baseline gap-1">
                    <Text strong className="text-2xl text-gray-800">
                      {item.value.toFixed(2)}
                    </Text>
                    <Text type="secondary" className="text-sm">
                      {item.unit}
                    </Text>
                  </div>
                </div>
              ))}
            </div>
          </TabPane>

          {/* Instructions Tab */}
          <TabPane
            tab={
              <span className="flex items-center gap-2 text-base">
                <Clock size={18} />
                Hướng dẫn
              </span>
            }
            key="instructions"
          >
            <div className="mt-4 p-6 bg-gradient-to-br from-blue-50 to-white rounded-2xl border border-blue-100">
              {dish.COOKING_INSTRUCTION ? (
                <Paragraph className="whitespace-pre-wrap !mb-0 text-gray-700 leading-relaxed">
                  {dish.COOKING_INSTRUCTION}
                </Paragraph>
              ) : (
                <Text type="secondary" className="italic">
                  Chưa có hướng dẫn nấu ăn cho món này.
                </Text>
              )}
            </div>
          </TabPane>

          {/* Tips Tab */}
          <TabPane
            tab={
              <span className="flex items-center gap-2 text-base">
                <Lightbulb size={18} />
                Mẹo hay
              </span>
            }
            key="tips"
          >
            <div className="mt-4 p-6 bg-gradient-to-br from-yellow-50 to-white rounded-2xl border border-yellow-100">
              {dish.TIPS ? (
                <Paragraph className="whitespace-pre-wrap !mb-0 text-gray-700 leading-relaxed">
                  {dish.TIPS}
                </Paragraph>
              ) : (
                <Text type="secondary" className="italic">
                  Chưa có mẹo nấu ăn cho món này.
                </Text>
              )}
            </div>
          </TabPane>

          {/* Additional Info Tab */}
          {dish.ADDITIONAL_INFO && (
            <TabPane
              tab={
                <span className="flex items-center gap-2 text-base">
                  <Info size={18} />
                  Thông tin thêm
                </span>
              }
              key="additional"
            >
              <div className="mt-4 p-6 bg-gradient-to-br from-green-50 to-white rounded-2xl border border-green-100">
                <Paragraph className="whitespace-pre-wrap !mb-0 text-gray-700 leading-relaxed">
                  {dish.ADDITIONAL_INFO}
                </Paragraph>
              </div>
            </TabPane>
          )}
        </Tabs>
      </div>
    </div>
  );
};

export default DishDetailView;

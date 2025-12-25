import React from "react";
import { Modal, Tabs, Spin, Tag, Typography } from "antd";
import type { DishDetail } from "@/types/dish.type";
import { X, ChefHat, Clock, Utensils, Info, Lightbulb } from "lucide-react";

const { Title, Text, Paragraph } = Typography;
const { TabPane } = Tabs;

interface DishDetailModalProps {
  dish: DishDetail | null;
  isLoading?: boolean;
  isOpen: boolean;
  onClose: () => void;
}

const DishDetailModal: React.FC<DishDetailModalProps> = ({
  dish,
  isLoading,
  isOpen,
  onClose,
}) => {
  if (isLoading) {
    return (
      <Modal
        open={isOpen}
        onCancel={onClose}
        footer={null}
        width={900}
        centered
      >
        <div className="flex justify-center items-center py-20">
          <Spin size="large" tip="Đang tải thông tin món ăn..." />
        </div>
      </Modal>
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
    { label: "Nước", value: dish.NUTRITION.WATER, unit: "g", color: "blue" },
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
    { label: "Đường", value: dish.NUTRITION.SUGAR, unit: "g", color: "pink" },
  ];

  return (
    <Modal
      open={isOpen}
      onCancel={onClose}
      footer={null}
      width={1000}
      centered
      closeIcon={<X size={20} />}
      styles={{ body: { maxHeight: "80vh", overflowY: "auto" } }}
    >
      <div className="space-y-6">
        {/* Header with Image */}
        <div className="relative h-64 -mx-6 -mt-6 mb-6 overflow-hidden rounded-t-lg">
          <img
            src={dish.LARGE_IMAGE}
            alt={dish.NAME}
            className="w-full h-full object-cover"
            onError={(e) => {
              (e.target as HTMLImageElement).src =
                "https://via.placeholder.com/900x300?text=No+Image";
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
          <div className="absolute bottom-6 left-6 right-6">
            <Title level={2} className="!text-white !mb-2">
              {dish.NAME}
            </Title>
            <div className="flex items-center gap-3 text-white/90">
              <Tag color="green">{dish.AGE_GROUP_ID}</Tag>
              {dish.COOKING_METHOD_NAME && (
                <div className="flex items-center gap-1">
                  <ChefHat size={16} />
                  <span>{dish.COOKING_METHOD_NAME}</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Tags */}
        {dish.TAGS && dish.TAGS.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {dish.TAGS.map((tag: string, index: number) => (
              <Tag key={index} color="blue">
                {tag}
              </Tag>
            ))}
          </div>
        )}

        {/* Tabs */}
        <Tabs defaultActiveKey="ingredients" className="custom-tabs">
          {/* Ingredients Tab */}
          <TabPane
            tab={
              <span className="flex items-center gap-2">
                <Utensils size={16} />
                Nguyên liệu
              </span>
            }
            key="ingredients"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {dish.INGREDIENTS.map((ingredient: any) => (
                <div
                  key={ingredient.ID}
                  className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <img
                    src={ingredient.IMAGE}
                    alt={ingredient.NAME}
                    className="w-16 h-16 rounded-lg object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src =
                        "https://via.placeholder.com/64?text=?";
                    }}
                  />
                  <div className="flex-1">
                    <Text strong className="block">
                      {ingredient.NAME}
                    </Text>
                    <Text type="secondary" className="text-sm">
                      Khối lượng: {ingredient.WEIGHT}g
                    </Text>
                    {ingredient.PROCESSING_METHOD && (
                      <Text type="secondary" className="text-xs block mt-1">
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
              <span className="flex items-center gap-2">
                <ChefHat size={16} />
                Dinh dưỡng
              </span>
            }
            key="nutrition"
          >
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {nutritionData.map((item) => (
                <div
                  key={item.label}
                  className="p-4 bg-gradient-to-br from-white to-gray-50 rounded-lg border border-gray-200"
                >
                  <Text type="secondary" className="text-xs block mb-1">
                    {item.label}
                  </Text>
                  <div className="flex items-baseline gap-1">
                    <Text strong className="text-lg">
                      {item.value.toFixed(2)}
                    </Text>
                    <Text type="secondary" className="text-xs">
                      {item.unit}
                    </Text>
                  </div>
                </div>
              ))}
            </div>
          </TabPane>

          {/* Instructions Tab */}
          {dish.COOKING_INSTRUCTION && (
            <TabPane
              tab={
                <span className="flex items-center gap-2">
                  <Clock size={16} />
                  Hướng dẫn
                </span>
              }
              key="instructions"
            >
              <div className="space-y-4">
                <div className="p-4 bg-blue-50 rounded-lg">
                  <Paragraph className="whitespace-pre-wrap !mb-0">
                    {dish.COOKING_INSTRUCTION}
                  </Paragraph>
                </div>
              </div>
            </TabPane>
          )}

          {/* Tips Tab */}
          {dish.TIPS && (
            <TabPane
              tab={
                <span className="flex items-center gap-2">
                  <Lightbulb size={16} />
                  Mẹo hay
                </span>
              }
              key="tips"
            >
              <div className="p-4 bg-yellow-50 rounded-lg">
                <Paragraph className="whitespace-pre-wrap !mb-0">
                  {dish.TIPS}
                </Paragraph>
              </div>
            </TabPane>
          )}

          {/* Additional Info Tab */}
          {dish.ADDITIONAL_INFO && (
            <TabPane
              tab={
                <span className="flex items-center gap-2">
                  <Info size={16} />
                  Thông tin thêm
                </span>
              }
              key="additional"
            >
              <div className="p-4 bg-green-50 rounded-lg">
                <Paragraph className="whitespace-pre-wrap !mb-0">
                  {dish.ADDITIONAL_INFO}
                </Paragraph>
              </div>
            </TabPane>
          )}
        </Tabs>
      </div>
    </Modal>
  );
};

export default DishDetailModal;

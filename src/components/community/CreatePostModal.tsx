import React, { useState } from "react";
import { Modal, Input, Button, Upload, message, Image } from "antd";
import type { UploadFile, UploadProps } from "antd";
import { useDispatch, useSelector } from "react-redux";
import {
  Image as ImageIcon,
  X,
  Loader2,
  Upload as UploadIconLucide,
} from "lucide-react";
import {
  closeCreatePostModal,
  selectIsCreatePostModalOpen,
} from "../../store/slices/communitySlice";
import {
  useCreatePostMutation,
  useUploadImageMutation,
} from "../../store/api/communityApi";

const { TextArea } = Input;

export const CreatePostModal: React.FC = () => {
  const dispatch = useDispatch();
  const isOpen = useSelector(selectIsCreatePostModalOpen);
  const [createPost, { isLoading }] = useCreatePostMutation();
  const [uploadImage, { isLoading: isUploading }] = useUploadImageMutation();

  // Lấy user từ localStorage giống như Header
  const currentUser = localStorage.getItem("user")
    ? JSON.parse(localStorage.getItem("user")!)
    : null;

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [fileList, setFileList] = useState<UploadFile[]>([]);

  const getUserDisplayName = () => {
    if (currentUser?.EMAIL) {
      return currentUser.EMAIL.split("@")[0];
    }
    return "User";
  };

  const getUserAvatar = () => {
    if (currentUser?.FACE_IMAGE) {
      return currentUser.FACE_IMAGE;
    }
    return null;
  };

  const handleClose = () => {
    setTitle("");
    setContent("");
    setImageUrl("");
    setFileList([]);
    dispatch(closeCreatePostModal());
  };

  const handleImageUpload: UploadProps["customRequest"] = async ({
    file,
    onSuccess,
    onError,
  }) => {
    try {
      const result = await uploadImage(file as File).unwrap();
      setImageUrl(result.url);
      onSuccess?.(result);
      message.success("Upload ảnh thành công!");
    } catch (error: any) {
      onError?.(error);
      message.error(error?.data?.message || "Upload ảnh thất bại!");
    }
  };

  const handleRemoveImage = () => {
    setImageUrl("");
    setFileList([]);
  };

  const beforeUpload = (file: File) => {
    const isImage = file.type.startsWith("image/");
    if (!isImage) {
      message.error("Chỉ được upload file ảnh!");
      return false;
    }
    const isLt5M = file.size / 1024 / 1024 < 5;
    if (!isLt5M) {
      message.error("Ảnh phải nhỏ hơn 5MB!");
      return false;
    }
    return true;
  };

  const handleSubmit = async () => {
    if (!title.trim() || !content.trim()) {
      message.warning("Vui lòng nhập tiêu đề và nội dung bài viết!");
      return;
    }

    try {
      await createPost({
        TITLE: title.trim(),
        CONTENT: content.trim(),
        IMAGE_URL: imageUrl.trim() || undefined,
      }).unwrap();

      message.success("Đăng bài thành công!");
      handleClose();
    } catch (error: any) {
      message.error(error?.data?.message || "Có lỗi xảy ra khi đăng bài");
    }
  };

  return (
    <Modal
      title={
        <div className="text-center font-bold text-lg text-gray-800">
          Tạo bài viết mới
        </div>
      }
      open={isOpen}
      onCancel={handleClose}
      footer={null}
      centered
      width={600}
      className="rounded-xl overflow-hidden"
    >
      <div className="flex flex-col gap-4 py-2">
        {/* User Info Preview */}
        <div className="flex items-center gap-3 mb-2">
          {getUserAvatar() ? (
            <img
              src={getUserAvatar()!}
              alt="User Avatar"
              className="w-10 h-10 rounded-full border-2 border-emerald-200 object-cover"
            />
          ) : (
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center text-white font-bold text-lg">
              {getUserDisplayName().charAt(0).toUpperCase()}
            </div>
          )}
          <div>
            <div className="font-semibold text-gray-900">
              {getUserDisplayName()}
            </div>
            <div className="text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full w-fit">
              Công khai
            </div>
          </div>
        </div>

        {/* Inputs */}
        <Input
          placeholder="Tiêu đề bài viết (ngắn gọn, súc tích)..."
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="font-bold text-lg border-none shadow-none px-0 focus:shadow-none placeholder:text-gray-400"
          maxLength={100}
        />

        <TextArea
          placeholder="Bạn đang cảm thấy thế nào? Hãy chia sẻ câu chuyện sức khỏe của bạn..."
          value={content}
          onChange={(e) => setContent(e.target.value)}
          autoSize={{ minRows: 4, maxRows: 10 }}
          className="text-base border-none shadow-none px-0 focus:shadow-none placeholder:text-gray-400 resize-none"
        />

        {/* Image Preview Area */}
        {imageUrl && (
          <div className="relative rounded-lg overflow-hidden border border-gray-200 mt-2">
            <Image
              src={imageUrl}
              alt="Preview"
              className="w-full max-h-80 object-contain"
              preview
            />
            <button
              onClick={handleRemoveImage}
              className="absolute top-2 right-2 p-1.5 bg-red-500 hover:bg-red-600 rounded-full text-white transition-all shadow-lg"
            >
              <X size={18} />
            </button>
          </div>
        )}

        {/* Tools & Submit */}
        <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100">
          <div className="flex gap-2">
            <Upload
              accept="image/*"
              showUploadList={false}
              customRequest={handleImageUpload}
              beforeUpload={beforeUpload}
              disabled={isUploading || !!imageUrl}
            >
              <Button
                type="text"
                icon={
                  isUploading ? (
                    <Loader2 className="animate-spin text-gray-400" size={20} />
                  ) : (
                    <ImageIcon size={20} className="text-green-600" />
                  )
                }
                disabled={isUploading || !!imageUrl}
                className="flex items-center gap-2 text-gray-600 hover:bg-gray-50"
              >
                {isUploading ? "Đang tải..." : "Thêm ảnh"}
              </Button>
            </Upload>
          </div>

          <Button
            type="primary"
            onClick={handleSubmit}
            disabled={isLoading || isUploading || !title || !content}
            className="bg-blue-600 hover:bg-blue-700 font-medium px-8 h-9 rounded-full shadow-sm"
          >
            {isLoading ? (
              <Loader2 className="animate-spin w-4 h-4" />
            ) : (
              "Đăng bài"
            )}
          </Button>
        </div>
      </div>
    </Modal>
  );
};

import React, { useState } from "react";
import { formatDistanceToNow } from "date-fns";
import { vi } from "date-fns/locale"; // Import locale tiếng Việt
import { Dropdown, Tooltip, Avatar, message } from "antd";
import type { MenuProps } from "antd";
import {
  Heart,
  MessageCircle,
  MoreHorizontal,
  Share2,
  Trash2,
  Edit,
  Send,
} from "lucide-react";

import type { Post } from "../../store/api/communityApi";
import {
  useToggleLikeMutation,
  useGetCommentsQuery,
  useCreateCommentMutation,
  useDeleteCommentMutation,
} from "../../store/api/communityApi";
import { cn } from "../../lib/utils"; // Giả sử bạn có hàm cn từ clsx/tailwind-merge

interface PostCardProps {
  post: Post;
  onDelete?: (postId: number) => void;
  showProducts?: boolean;
}

export const PostCard: React.FC<PostCardProps> = ({ post, onDelete }) => {
  // Lấy user từ localStorage giống như Header
  const currentUser = localStorage.getItem("user")
    ? JSON.parse(localStorage.getItem("user")!)
    : null;

  const [toggleLike] = useToggleLikeMutation();
  const [createComment, { isLoading: isCommenting }] =
    useCreateCommentMutation();
  const [deleteComment] = useDeleteCommentMutation();

  const [showComments, setShowComments] = useState(false);
  const [commentText, setCommentText] = useState("");

  const { data: comments = [], refetch: refetchComments } = useGetCommentsQuery(
    post.POST_ID,
    {
      skip: !showComments,
    }
  );

  const isOwner = currentUser?.USER_ID === post.USER_ID;
  const isLiked = post.IS_LIKED_BY_USER;

  const getUserDisplayName = () => {
    if (currentUser?.EMAIL) {
      return currentUser.EMAIL.split("@")[0];
    }
    return "User";
  };

  // Xử lý menu dropdown cho chủ bài viết
  const menuItems: MenuProps["items"] = [
    {
      key: "delete",
      label: <span className="text-red-600 font-medium">Xóa bài viết</span>,
      icon: <Trash2 size={16} className="text-red-600" />,
      onClick: () => onDelete?.(post.POST_ID),
    },
  ];

  const handleLike = async () => {
    try {
      await toggleLike(post.POST_ID).unwrap();
    } catch {
      message.error("Lỗi kết nối");
    }
  };

  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim()) return;

    try {
      await createComment({
        postId: post.POST_ID,
        content: { CONTENT: commentText.trim() },
      }).unwrap();
      setCommentText("");
      refetchComments();
    } catch {
      message.error("Không thể gửi bình luận");
    }
  };

  const handleDeleteComment = async (commentId: number) => {
    try {
      await deleteComment({ commentId, postId: post.POST_ID }).unwrap();
      message.success("Đã xóa bình luận");
      refetchComments();
    } catch {
      message.error("Lỗi khi xóa bình luận");
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-all duration-200 overflow-hidden mb-6">
      {/* 1. Header: Avatar + Info */}
      <div className="p-4 flex justify-between items-start">
        <div className="flex gap-3">
          <Avatar
            size={44}
            className="bg-gradient-to-br from-blue-500 to-cyan-400 text-lg font-bold shadow-sm"
          >
            {post.USER.EMAIL.charAt(0).toUpperCase()}
          </Avatar>
          <div>
            <h4 className="font-bold text-gray-900 text-sm leading-tight">
              {post.USER.EMAIL}
            </h4>
            <Tooltip title={new Date(post.CREATED_AT).toLocaleString("vi-VN")}>
              <span className="text-xs text-gray-500 hover:underline cursor-pointer">
                {formatDistanceToNow(new Date(post.CREATED_AT), {
                  addSuffix: true,
                  locale: vi,
                })}
              </span>
            </Tooltip>
          </div>
        </div>

        {isOwner && (
          <Dropdown menu={{ items: menuItems }} placement="bottomRight" arrow>
            <button className="text-gray-400 hover:bg-gray-100 p-2 rounded-full transition-colors">
              <MoreHorizontal size={20} />
            </button>
          </Dropdown>
        )}
      </div>

      {/* 2. Content */}
      <div className="px-4 pb-2">
        <h3 className="font-bold text-lg text-gray-800 mb-2 leading-snug">
          {post.TITLE}
        </h3>
        <p className="text-gray-600 text-base leading-relaxed whitespace-pre-wrap">
          {post.CONTENT}
        </p>
      </div>

      {/* 3. Image (Nếu có) */}
      {post.IMAGE_URL && (
        <div className="mt-3 px-4">
          <div className="rounded-lg overflow-hidden border border-gray-100 bg-gray-50 max-h-[500px] flex items-center justify-center">
            <img
              src={post.IMAGE_URL}
              alt="Post content"
              className="w-full h-full object-cover"
              loading="lazy"
            />
          </div>
        </div>
      )}

      {/* 4. Stats & Actions */}
      <div className="px-4 py-3">
        {/* Số lượng like/cmt */}
        <div className="flex items-center justify-between text-sm text-gray-500 mb-3 border-b border-gray-50 pb-2">
          <div className="flex items-center gap-1">
            {post.LIKE_COUNT > 0 && (
              <>
                <div className="bg-red-500 p-1 rounded-full">
                  <Heart size={10} fill="white" className="text-white" />
                </div>
                <span>{post.LIKE_COUNT} người thích</span>
              </>
            )}
          </div>
          <div className="flex gap-4">
            <span>{post.COMMENT_COUNT} bình luận</span>
          </div>
        </div>

        {/* Action Buttons Grid */}
        <div className="grid grid-cols-3 gap-1">
          <button
            onClick={handleLike}
            className={cn(
              "flex items-center justify-center gap-2 py-2 rounded-lg transition-all active:scale-95 font-medium text-sm",
              isLiked
                ? "text-red-500 bg-red-50"
                : "text-gray-600 hover:bg-gray-100"
            )}
          >
            <Heart size={20} fill={isLiked ? "currentColor" : "none"} />
            <span>Thích</span>
          </button>

          <button
            onClick={() => setShowComments(!showComments)}
            className="flex items-center justify-center gap-2 py-2 rounded-lg text-gray-600 hover:bg-gray-100 transition-all font-medium text-sm"
          >
            <MessageCircle size={20} />
            <span>Bình luận</span>
          </button>

          <button className="flex items-center justify-center gap-2 py-2 rounded-lg text-gray-600 hover:bg-gray-100 transition-all font-medium text-sm">
            <Share2 size={20} />
            <span>Chia sẻ</span>
          </button>
        </div>
      </div>

      {/* 5. Comment Section */}
      {showComments && (
        <div className="bg-gray-50/50 border-t border-gray-100 p-4">
          {/* Input Comment */}
          <form
            onSubmit={handleSubmitComment}
            className="flex gap-3 mb-5 items-start"
          >
            <Avatar
              size={32}
              className="bg-gradient-to-br from-emerald-400 to-emerald-600 text-white font-bold flex-shrink-0"
            >
              {getUserDisplayName().charAt(0).toUpperCase()}
            </Avatar>
            <div className="flex-1 relative">
              <input
                type="text"
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                placeholder="Viết bình luận công khai..."
                className="w-full bg-gray-100 border-transparent focus:bg-white focus:border-blue-300 rounded-2xl py-2 px-4 pr-10 text-sm transition-all outline-none"
                disabled={isCommenting}
              />
              <button
                type="submit"
                disabled={!commentText.trim()}
                className="absolute right-2 top-1.5 text-blue-600 hover:bg-blue-50 p-1 rounded-full disabled:opacity-30 disabled:hover:bg-transparent"
              >
                <Send size={16} />
              </button>
            </div>
          </form>

          {/* List Comments */}
          <div className="space-y-4">
            {comments.map((cmt) => (
              <div key={cmt.COMMENT_ID} className="flex gap-2.5 group">
                <Avatar
                  size={32}
                  className="bg-gray-200 text-gray-600 flex-shrink-0"
                >
                  {cmt.USER.EMAIL.charAt(0).toUpperCase()}
                </Avatar>
                <div className="flex-1">
                  <div className="bg-gray-100 rounded-2xl rounded-tl-none px-3 py-2 inline-block max-w-[90%]">
                    <div className="font-bold text-xs text-gray-900 mb-0.5">
                      {cmt.USER.EMAIL}
                    </div>
                    <div className="text-sm text-gray-800 break-words">
                      {cmt.CONTENT}
                    </div>
                  </div>
                  <div className="flex items-center gap-3 mt-1 ml-1">
                    <span className="text-xs text-gray-500 font-medium cursor-pointer hover:underline">
                      Thích
                    </span>
                    <span className="text-xs text-gray-500 font-medium cursor-pointer hover:underline">
                      Phản hồi
                    </span>
                    <span className="text-xs text-gray-400">
                      {formatDistanceToNow(new Date(cmt.CREATED_AT), {
                        locale: vi,
                      })}
                    </span>

                    {currentUser?.USER_ID === cmt.USER_ID && (
                      <button
                        onClick={() => handleDeleteComment(cmt.COMMENT_ID)}
                        className="text-xs text-red-400 hover:text-red-600 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        Xóa
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
            {comments.length === 0 && (
              <div className="text-center py-4 text-gray-400 text-sm italic">
                Chưa có bình luận nào. Hãy là người đầu tiên!
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

import React, { useState, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Pagination, Skeleton, Avatar } from "antd";
import {
  Filter,
  Clock,
  Flame,
  MessageSquare,
  User,
  Salad,
  Dumbbell,
  BrainCircuit,
  Stethoscope,
  Sun,
  LayoutGrid,
  X,
} from "lucide-react";

import {
  useGetPostsQuery,
  useDeletePostMutation,
} from "../store/api/communityApi";
import {
  openCreatePostModal,
  setCurrentPage,
  selectCurrentPage,
  selectPostsPerPage,
} from "../store/slices/communitySlice";
import { PostCard } from "../components/community/PostCard";
import { CreatePostModal } from "../components/community/CreatePostModal";
import Header from "@/components/layout/Header";
import { ProductCarousel } from "../components/community/ProductCarousel";
// import Footer from "@/components/layout/Footer"; // Tạm comment theo code cũ của bạn

// --- Sub-component cho Menu Item để code gọn hơn ---
const MenuItem = ({
  icon: Icon,
  label,
  active,
  onClick,
  count,
}: {
  icon: any;
  label: string;
  active?: boolean;
  onClick: () => void;
  count?: number;
}) => (
  <div
    onClick={onClick}
    className={`
      flex items-center justify-between px-4 py-3 rounded-xl cursor-pointer transition-all duration-200 group
      ${
        active
          ? "bg-blue-50 text-blue-700 font-semibold shadow-sm border border-blue-100"
          : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
      }
    `}
  >
    <div className="flex items-center gap-3">
      <Icon
        size={20}
        className={
          active ? "text-blue-600" : "text-gray-500 group-hover:text-gray-700"
        }
      />
      <span className="text-[15px]">{label}</span>
    </div>
    {count && (
      <span
        className={`text-xs px-2 py-0.5 rounded-full ${active ? "bg-white text-blue-600" : "bg-gray-100 text-gray-500"}`}
      >
        {count}
      </span>
    )}
  </div>
);

export const Community: React.FC = () => {
  const dispatch = useDispatch();
  const currentPage = useSelector(selectCurrentPage);
  const postsPerPage = useSelector(selectPostsPerPage);

  // Lấy user từ localStorage
  const currentUser = localStorage.getItem("user")
    ? JSON.parse(localStorage.getItem("user")!)
    : null;

  // Filter states
  // sortBy: 'newest' | 'popular' | 'my_posts'
  const [viewMode, setViewMode] = useState<string>("newest");
  const [filterTags, setFilterTags] = useState<string[]>([]);

  // Mapping viewMode sang params API
  const queryParams = {
    page: currentPage,
    limit: postsPerPage,
    sortBy: viewMode === "popular" ? "popular" : "newest",
    tags: filterTags.length > 0 ? filterTags.join(",") : undefined,
    myPosts: viewMode === "my_posts",
  };

  const { data, isLoading, isError, refetch } = useGetPostsQuery(queryParams);

  const [deletePost] = useDeletePostMutation();

  // Random indexes logic (Giữ nguyên)
  const productsShowIndexes = useMemo(() => {
    const total = data?.posts?.length || 0;
    if (total === 0) return new Set();
    const count = Math.floor(Math.random() * 6) + 5;
    const indexes = new Set<number>();
    while (indexes.size < Math.min(count, total)) {
      indexes.add(Math.floor(Math.random() * total));
    }
    return indexes;
  }, [data?.posts?.length]);

  // Helper functions (Giữ nguyên)
  const getUserDisplayName = () =>
    currentUser?.EMAIL ? currentUser.EMAIL.split("@")[0] : "User";
  const getUserAvatar = () => currentUser?.FACE_IMAGE || null;

  const handleDeletePost = async (postId: number) => {
    try {
      await deletePost(postId).unwrap();
      refetch();
    } catch (e) {
      console.error(e);
    }
  };

  const toggleTag = (tag: string) => {
    setFilterTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  return (
    <div className="min-h-screen bg-[#F0F2F5] font-sans text-gray-900">
      <Header />

      <main className="container mx-auto px-4 py-6 max-w-7xl">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* ================= LEFT SIDEBAR (DESIGN MỚI) ================= */}
          <div className="hidden lg:block lg:col-span-3">
            <div className="sticky top-24 space-y-6">
              {/* Box 1: Điều hướng chính (Feeds) */}
              <div className="bg-white rounded-2xl shadow-sm p-3 border border-gray-100">
                <h3 className="px-4 py-2 text-xs font-bold text-gray-400 uppercase tracking-wider">
                  Bảng tin
                </h3>
                <div className="space-y-1">
                  <MenuItem
                    icon={Clock}
                    label="Mới nhất"
                    active={viewMode === "newest"}
                    onClick={() => setViewMode("newest")}
                  />
                  <MenuItem
                    icon={Flame}
                    label="Xu hướng / Phổ biến"
                    active={viewMode === "popular"}
                    onClick={() => setViewMode("popular")}
                  />
                  <MenuItem
                    icon={User}
                    label="Bài viết của tôi"
                    active={viewMode === "my_posts"}
                    onClick={() => setViewMode("my_posts")}
                  />
                </div>
              </div>

              {/* Box 2: Chủ đề (Topics) */}
              <div className="bg-white rounded-2xl shadow-sm p-3 border border-gray-100">
                <div className="flex items-center justify-between px-4 py-2">
                  <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider">
                    Khám phá chủ đề
                  </h3>
                  {filterTags.length > 0 && (
                    <button
                      onClick={() => setFilterTags([])}
                      className="text-xs text-blue-600 hover:bg-blue-50 px-2 py-1 rounded-md transition-colors"
                    >
                      Xóa lọc
                    </button>
                  )}
                </div>

                <div className="space-y-1">
                  <MenuItem
                    icon={LayoutGrid}
                    label="Tất cả chủ đề"
                    active={filterTags.length === 0}
                    onClick={() => setFilterTags([])}
                  />
                  <div className="my-2 border-t border-gray-100 mx-4"></div>

                  <MenuItem
                    icon={Salad}
                    label="Dinh dưỡng"
                    active={filterTags.includes("nutrition")}
                    onClick={() => toggleTag("nutrition")}
                  />
                  <MenuItem
                    icon={Dumbbell}
                    label="Tập luyện & Yoga"
                    active={filterTags.includes("exercise")}
                    onClick={() => toggleTag("exercise")}
                  />
                  <MenuItem
                    icon={BrainCircuit}
                    label="Sức khỏe tinh thần"
                    active={filterTags.includes("mental")}
                    onClick={() => toggleTag("mental")}
                  />
                  <MenuItem
                    icon={Stethoscope}
                    label="Bệnh lý & Tư vấn"
                    active={filterTags.includes("disease")}
                    onClick={() => toggleTag("disease")}
                  />
                  <MenuItem
                    icon={Sun}
                    label="Lối sống lành mạnh"
                    active={filterTags.includes("lifestyle")}
                    onClick={() => toggleTag("lifestyle")}
                  />
                </div>
              </div>

              {/* Box 3: Footer nhỏ */}
              <div className="px-4 text-xs text-gray-400 text-center leading-relaxed">
                © 2024 AiCungMuonKhoe <br />
                Chia sẻ • Kết nối • Sống khỏe
              </div>
            </div>
          </div>

          {/* ================= MAIN FEED ================= */}
          <div className="col-span-1 lg:col-span-6">
            {/* Quick Post Widget */}
            <div className="bg-white rounded-2xl shadow-sm p-4 mb-6 border border-gray-100">
              <div className="flex gap-3 mb-3">
                {getUserAvatar() ? (
                  <img
                    src={getUserAvatar()!}
                    alt="User"
                    className="h-10 w-10 rounded-full border border-gray-100 object-cover"
                  />
                ) : (
                  <Avatar
                    size={40}
                    className="bg-gradient-to-br from-emerald-400 to-emerald-600 text-white font-bold"
                  >
                    {getUserDisplayName().charAt(0).toUpperCase()}
                  </Avatar>
                )}
                <button
                  onClick={() => dispatch(openCreatePostModal())}
                  className="flex-1 bg-gray-100 hover:bg-gray-200 transition-colors rounded-full text-left px-4 text-gray-500 text-[15px] h-11 flex items-center"
                >
                  {getUserDisplayName()}, bạn đang cảm thấy thế nào?
                </button>
              </div>
              <div className="flex justify-between pt-3 border-t border-gray-50">
                <button
                  onClick={() => dispatch(openCreatePostModal())}
                  className="flex-1 flex items-center justify-center gap-2 py-2 hover:bg-gray-50 rounded-lg text-sm font-medium text-gray-600 transition-colors"
                >
                  <div className="text-green-500">
                    <LayoutGrid size={20} />
                  </div>
                  Ảnh/Video
                </button>
                <button
                  onClick={() => dispatch(openCreatePostModal())}
                  className="flex-1 flex items-center justify-center gap-2 py-2 hover:bg-gray-50 rounded-lg text-sm font-medium text-gray-600 transition-colors"
                >
                  <div className="text-yellow-500">
                    <Sun size={20} />
                  </div>
                  Cảm xúc
                </button>
              </div>
            </div>

            {/* Active Filters Summary (Chips) */}
            {filterTags.length > 0 && (
              <div className="mb-4 flex flex-wrap gap-2 items-center">
                <span className="text-sm text-gray-500 mr-1">Đang xem:</span>
                {filterTags.map((tag) => (
                  <span
                    key={tag}
                    className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm font-medium flex items-center gap-1"
                  >
                    {tag === "nutrition" && "Dinh dưỡng"}
                    {tag === "exercise" && "Tập luyện"}
                    {tag === "mental" && "Tinh thần"}
                    {tag === "disease" && "Bệnh lý"}
                    {tag === "lifestyle" && "Lối sống"}
                    <button
                      onClick={() => toggleTag(tag)}
                      className="hover:text-blue-900"
                    >
                      <X size={14} />
                    </button>
                  </span>
                ))}
              </div>
            )}

            {/* Posts List */}
            {isLoading && (
              <div className="space-y-4">
                {[1, 2].map((i) => (
                  <div key={i} className="bg-white rounded-xl p-4 shadow-sm">
                    <Skeleton avatar active paragraph={{ rows: 3 }} />
                  </div>
                ))}
              </div>
            )}

            {isError && (
              <div className="bg-red-50 text-red-600 p-6 rounded-xl text-center border border-red-100 flex flex-col items-center gap-2">
                <Filter size={32} className="opacity-50" />
                <p>Không tải được bài viết. Vui lòng thử lại sau.</p>
                <button
                  onClick={refetch}
                  className="text-sm font-bold underline hover:text-red-800"
                >
                  Tải lại trang
                </button>
              </div>
            )}

            {!isLoading && !isError && (
              <>
                {data?.posts?.length > 0 ? (
                  <div className="space-y-6">
                    {data.posts.map((post: any, index: number) => (
                      <React.Fragment key={post.POST_ID}>
                        {/* 1. Render bài Post */}
                        <PostCard
                          post={post}
                          onDelete={handleDeletePost}
                          // Xóa dòng showProducts={...} đi
                        />

                        {/* 2. Check và Render Carousel NẰM NGOÀI PostCard */}
                        {productsShowIndexes.has(index) && (
                          <div className="mb-6">
                            {" "}
                            {/* Thêm margin bottom để tách với bài post tiếp theo */}
                            <ProductCarousel />
                          </div>
                        )}
                      </React.Fragment>
                    ))}
                  </div>
                ) : (
                  <div className="bg-white rounded-2xl p-10 text-center shadow-sm border border-gray-100">
                    <div className="bg-gray-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
                      <MessageSquare size={32} className="text-gray-300" />
                    </div>
                    <h3 className="text-lg font-bold text-gray-800 mb-2">
                      Chưa có bài viết nào
                    </h3>
                    <p className="text-gray-500 mb-6 max-w-xs mx-auto">
                      {filterTags.length > 0
                        ? "Không tìm thấy bài viết cho chủ đề này. Hãy thử chọn chủ đề khác."
                        : "Hãy là người đầu tiên chia sẻ câu chuyện sức khỏe của bạn!"}
                    </p>
                    {filterTags.length > 0 ? (
                      <button
                        onClick={() => setFilterTags([])}
                        className="text-blue-600 font-medium hover:underline"
                      >
                        Xóa bộ lọc
                      </button>
                    ) : (
                      <button
                        onClick={() => dispatch(openCreatePostModal())}
                        className="bg-blue-600 text-white px-6 py-2 rounded-full hover:bg-blue-700 transition-colors font-medium"
                      >
                        Tạo bài viết ngay
                      </button>
                    )}
                  </div>
                )}

                {/* Pagination */}
                {data?.totalPages > 1 && (
                  <div className="flex justify-center mt-8 pb-8">
                    <Pagination
                      current={currentPage}
                      total={data.total}
                      pageSize={postsPerPage}
                      onChange={(page) => {
                        dispatch(setCurrentPage(page));
                        window.scrollTo({ top: 0, behavior: "smooth" });
                      }}
                      showSizeChanger={false}
                    />
                  </div>
                )}
              </>
            )}
          </div>

          {/* ================= RIGHT SIDEBAR ================= */}
          <div className="hidden lg:block lg:col-span-3">
            {/* Trending Box */}
            <div className="bg-white rounded-2xl shadow-sm p-4 sticky top-24 border border-gray-100">
              <div className="flex items-center gap-2 mb-4 pb-2 border-b border-gray-50">
                <Flame size={20} className="text-orange-500 fill-orange-500" />
                <h3 className="font-bold text-gray-800">Chủ đề nổi bật</h3>
              </div>
              <ul className="space-y-1">
                {[
                  { tag: "#GiamCanLanhManh", count: "2.4k bài" },
                  { tag: "#YogaTaiNha", count: "1.8k bài" },
                  { tag: "#DinhDuong", count: "1.2k bài" },
                  { tag: "#BenhTimMach", count: "850 bài" },
                  { tag: "#MeVaBe", count: "500 bài" },
                ].map((item, idx) => (
                  <li
                    key={idx}
                    className="flex items-center justify-between p-2 hover:bg-gray-50 rounded-lg cursor-pointer group transition-colors"
                  >
                    <span className="text-sm font-medium text-gray-700 group-hover:text-blue-600">
                      {item.tag}
                    </span>
                    <span className="text-xs text-gray-400">{item.count}</span>
                  </li>
                ))}
              </ul>
              <button className="w-full mt-4 text-xs font-medium text-blue-600 hover:bg-blue-50 py-2 rounded-lg transition-colors">
                Xem thêm
              </button>
            </div>
          </div>
        </div>

        <CreatePostModal />
      </main>
    </div>
  );
};

export default Community;

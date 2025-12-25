/**
 * Community API endpoints using RTK Query
 * Handles all API calls related to posts, comments, and likes
 *
 * Features:
 * - Automatic caching and invalidation
 * - Optimistic updates for better UX
 * - Type-safe API calls
 */

import { baseApi } from "./baseApi";

/* ==================== TYPE DEFINITIONS ==================== */

/**
 * User information embedded in posts and comments
 */
export interface CommunityUser {
  USER_ID: number;
  EMAIL: string;
  FACE_IMAGE?: string;
  FIRST_NAME?: string;
  LAST_NAME?: string;
}

/**
 * Post entity with aggregated data
 */
export interface Post {
  POST_ID: number;
  USER_ID: number;
  TITLE: string;
  CONTENT: string;
  IMAGE_URL?: string;
  STATUS: number;
  IS_DELETED: number;
  CREATED_AT: string;
  UPDATED_AT: string;
  LIKE_COUNT: number;
  COMMENT_COUNT: number;
  IS_LIKED_BY_USER: boolean;
  USER: CommunityUser;
}

/**
 * Upload image response
 */
export interface UploadImageResponse {
  url: string;
}

/**
 * Comment entity with author info
 */
export interface Comment {
  COMMENT_ID: number;
  POST_ID: number;
  USER_ID: number;
  CONTENT: string;
  IS_DELETED: number;
  CREATED_AT: string;
  UPDATED_AT: string;
  USER: CommunityUser;
}

/**
 * Request payload for creating a post
 */
export interface CreatePostRequest {
  TITLE: string;
  CONTENT: string;
  IMAGE_URL?: string;
}

/**
 * Request payload for updating a post
 */
export interface UpdatePostRequest {
  TITLE?: string;
  CONTENT?: string;
  IMAGE_URL?: string;
}

/**
 * Request payload for creating a comment
 */
export interface CreateCommentRequest {
  CONTENT: string;
}

/**
 * Response from get posts endpoint
 */
export interface GetPostsResponse {
  status: number;
  message: string;
  data: {
    posts: Post[];
    total: number;
    page: number;
    totalPages: number;
  };
}

/**
 * Response from single post endpoint
 */
export interface GetPostResponse {
  status: number;
  message: string;
  data: Post;
}

/**
 * Response from toggle like endpoint
 */
export interface ToggleLikeResponse {
  status: number;
  message: string;
  data: {
    IS_LIKED: boolean;
    LIKE_COUNT: number;
    ACTION: "liked" | "unliked";
  };
}

/**
 * Response from get comments endpoint
 */
export interface GetCommentsResponse {
  status: number;
  message: string;
  data: Comment[];
}

/**
 * Response from create/delete operations
 */
export interface CommunityResponse<T = any> {
  status: number;
  message: string;
  data: T;
}

export const communityApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    /**
     * Upload image to Cloudinary
     */
    uploadImage: builder.mutation<UploadImageResponse, File>({
      query: (file) => {
        const formData = new FormData();
        formData.append("file", file);
        return {
          url: "/community/upload-image",
          method: "POST",
          body: formData,
        };
      },
      transformResponse: (response: CommunityResponse<UploadImageResponse>) =>
        response.data,
    }),

    /**
     * Get paginated list of posts
     */
    getPosts: builder.query<
      GetPostsResponse["data"],
      {
        page?: number;
        limit?: number;
        sortBy?: string;
        tags?: string;
        myPosts?: boolean;
      }
    >({
      query: ({ page = 1, limit = 10, sortBy, tags, myPosts }) => {
        let url = `/community/posts?page=${page}&limit=${limit}`;
        if (sortBy) url += `&sortBy=${sortBy}`;
        if (tags) url += `&tags=${tags}`;
        if (myPosts) url += `&myPosts=${myPosts}`;
        return {
          url,
          method: "GET",
        };
      },
      transformResponse: (response: GetPostsResponse) => response.data,
      providesTags: (result) =>
        result
          ? [
              ...result.posts.map(({ POST_ID }) => ({
                type: "Post" as const,
                id: POST_ID,
              })),
              { type: "Posts", id: "LIST" },
            ]
          : [{ type: "Posts", id: "LIST" }],
    }),

    /**
     * Get a single post by ID
     */
    getPostById: builder.query<Post, number>({
      query: (postId) => ({
        url: `/community/posts/${postId}`,
        method: "GET",
      }),
      transformResponse: (response: GetPostResponse) => response.data,
      providesTags: (result, error, postId) => [{ type: "Post", id: postId }],
    }),

    /**
     * Create a new post
     */
    createPost: builder.mutation<Post, CreatePostRequest>({
      query: (body) => ({
        url: "/community/posts",
        method: "POST",
        body,
      }),
      transformResponse: (response: CommunityResponse<Post>) => response.data,
      invalidatesTags: [{ type: "Posts", id: "LIST" }],
    }),

    /**
     * Update an existing post
     */
    updatePost: builder.mutation<
      Post,
      { postId: number; updateData: UpdatePostRequest }
    >({
      query: ({ postId, updateData }) => ({
        url: `/community/posts/${postId}`,
        method: "PUT",
        body: updateData,
      }),
      transformResponse: (response: CommunityResponse<Post>) => response.data,
      invalidatesTags: (result, error, { postId }) => [
        { type: "Post", id: postId },
        { type: "Posts", id: "LIST" },
      ],
    }),

    /**
     * Delete a post (soft delete)
     */
    deletePost: builder.mutation<void, number>({
      query: (postId) => ({
        url: `/community/posts/${postId}`,
        method: "DELETE",
      }),
      invalidatesTags: (result, error, postId) => [
        { type: "Post", id: postId },
        { type: "Posts", id: "LIST" },
      ],
    }),

    /**
     * Toggle like on a post
     */
    toggleLike: builder.mutation<ToggleLikeResponse["data"], number>({
      query: (postId) => ({
        url: `/community/posts/${postId}/like`,
        method: "POST",
      }),
      transformResponse: (response: ToggleLikeResponse) => response.data,
      // Optimistic update for instant UI feedback
      async onQueryStarted(postId, { dispatch, queryFulfilled }) {
        // Update cache optimistically
        const patchResult = dispatch(
          communityApi.util.updateQueryData(
            "getPosts",
            { page: 1, limit: 10 },
            (draft) => {
              const post = draft.posts.find((p) => p.POST_ID === postId);
              if (post) {
                post.IS_LIKED_BY_USER = !post.IS_LIKED_BY_USER;
                post.LIKE_COUNT += post.IS_LIKED_BY_USER ? 1 : -1;
              }
            }
          )
        );

        try {
          await queryFulfilled;
        } catch {
          // Revert optimistic update on error
          patchResult.undo();
        }
      },
      invalidatesTags: (result, error, postId) => [
        { type: "Post", id: postId },
      ],
    }),

    /**
     * Get all comments for a post
     */
    getComments: builder.query<Comment[], number>({
      query: (postId) => ({
        url: `/community/posts/${postId}/comments`,
        method: "GET",
      }),
      transformResponse: (response: GetCommentsResponse) => response.data,
      providesTags: (result, error, postId) =>
        result
          ? [
              ...result.map(({ COMMENT_ID }) => ({
                type: "Comment" as const,
                id: COMMENT_ID,
              })),
              { type: "Comment", id: `POST-${postId}` },
            ]
          : [{ type: "Comment", id: `POST-${postId}` }],
    }),

    /**
     * Create a comment on a post
     */
    createComment: builder.mutation<
      Comment,
      { postId: number; content: CreateCommentRequest }
    >({
      query: ({ postId, content }) => ({
        url: `/community/posts/${postId}/comments`,
        method: "POST",
        body: content,
      }),
      transformResponse: (response: CommunityResponse<Comment>) =>
        response.data,
      invalidatesTags: (result, error, { postId }) => [
        { type: "Comment", id: `POST-${postId}` },
        { type: "Post", id: postId },
        { type: "Posts", id: "LIST" },
      ],
    }),

    /**
     * Delete a comment (soft delete)
     */
    deleteComment: builder.mutation<
      void,
      { commentId: number; postId: number }
    >({
      query: ({ commentId }) => ({
        url: `/community/comments/${commentId}`,
        method: "DELETE",
      }),
      invalidatesTags: (result, error, { commentId, postId }) => [
        { type: "Comment", id: commentId },
        { type: "Comment", id: `POST-${postId}` },
        { type: "Post", id: postId },
        { type: "Posts", id: "LIST" },
      ],
    }),
  }),
});

export const {
  useUploadImageMutation,
  useGetPostsQuery,
  useGetPostByIdQuery,
  useCreatePostMutation,
  useUpdatePostMutation,
  useDeletePostMutation,
  useToggleLikeMutation,
  useGetCommentsQuery,
  useCreateCommentMutation,
  useDeleteCommentMutation,
} = communityApi;

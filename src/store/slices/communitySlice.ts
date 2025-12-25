import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

import type { Post, Comment } from "../api/communityApi";

/**
 * State shape for community slice
 */
interface CommunityState {
  selectedPost: Post | null;

  // Modal visibility flags
  isCreatePostModalOpen: boolean;
  isEditPostModalOpen: boolean;
  isCommentModalOpen: boolean;
  isDeleteConfirmOpen: boolean;

  // ID of item being deleted (post or comment)
  deleteItemId: number | null;
  deleteItemType: "post" | "comment" | null;

  // Pagination state
  currentPage: number;
  postsPerPage: number;

  // Filter/Sort preferences
  sortBy: "newest" | "popular" | "trending";

  // Comment input state
  commentText: string;
}

/**
 * Initial state for community slice
 */
const initialState: CommunityState = {
  selectedPost: null,
  isCreatePostModalOpen: false,
  isEditPostModalOpen: false,
  isCommentModalOpen: false,
  isDeleteConfirmOpen: false,
  deleteItemId: null,
  deleteItemType: null,
  currentPage: 1,
  postsPerPage: 10,
  sortBy: "newest",
  commentText: "",
};

/**
 * Community slice with reducers for UI state management
 */
const communitySlice = createSlice({
  name: "community",
  initialState,
  reducers: {
    /**
     * Set the currently selected post for viewing details
     */
    setSelectedPost: (state, action: PayloadAction<Post | null>) => {
      state.selectedPost = action.payload;
    },

    /**
     * Open the create post modal
     */
    openCreatePostModal: (state) => {
      state.isCreatePostModalOpen = true;
    },

    /**
     * Close the create post modal
     */
    closeCreatePostModal: (state) => {
      state.isCreatePostModalOpen = false;
    },

    /**
     * Open the edit post modal
     */
    openEditPostModal: (state, action: PayloadAction<Post>) => {
      state.selectedPost = action.payload;
      state.isEditPostModalOpen = true;
    },

    /**
     * Close the edit post modal
     */
    closeEditPostModal: (state) => {
      state.isEditPostModalOpen = false;
      state.selectedPost = null;
    },

    /**
     * Open the comment modal for a specific post
     */
    openCommentModal: (state, action: PayloadAction<Post>) => {
      state.selectedPost = action.payload;
      state.isCommentModalOpen = true;
    },

    /**
     * Close the comment modal
     */
    closeCommentModal: (state) => {
      state.isCommentModalOpen = false;
      state.commentText = "";
    },

    /**
     * Open delete confirmation dialog
     */
    openDeleteConfirm: (
      state,
      action: PayloadAction<{ id: number; type: "post" | "comment" }>
    ) => {
      state.deleteItemId = action.payload.id;
      state.deleteItemType = action.payload.type;
      state.isDeleteConfirmOpen = true;
    },

    /**
     * Close delete confirmation dialog
     */
    closeDeleteConfirm: (state) => {
      state.isDeleteConfirmOpen = false;
      state.deleteItemId = null;
      state.deleteItemType = null;
    },

    /**
     * Set current page number
     */
    setCurrentPage: (state, action: PayloadAction<number>) => {
      state.currentPage = action.payload;
    },

    /**
     * Set posts per page
     */
    setPostsPerPage: (state, action: PayloadAction<number>) => {
      state.postsPerPage = action.payload;
      state.currentPage = 1; // Reset to first page when changing limit
    },

    /**
     * Go to next page
     */
    nextPage: (state) => {
      state.currentPage += 1;
    },

    /**
     * Go to previous page
     */
    previousPage: (state) => {
      if (state.currentPage > 1) {
        state.currentPage -= 1;
      }
    },

    /**
     * Set sort order for posts
     */
    setSortBy: (
      state,
      action: PayloadAction<"newest" | "popular" | "trending">
    ) => {
      state.sortBy = action.payload;
    },

    /**
     * Update comment input text
     */
    setCommentText: (state, action: PayloadAction<string>) => {
      state.commentText = action.payload;
    },

    /**
     * Clear comment input
     */
    clearCommentText: (state) => {
      state.commentText = "";
    },
    /**
     * Reset entire community state to initial values
     */
    resetCommunityState: () => initialState,
  },
});

export const {
  setSelectedPost,
  openCreatePostModal,
  closeCreatePostModal,
  openEditPostModal,
  closeEditPostModal,
  openCommentModal,
  closeCommentModal,
  openDeleteConfirm,
  closeDeleteConfirm,
  setCurrentPage,
  setPostsPerPage,
  nextPage,
  previousPage,
  setSortBy,
  setCommentText,
  clearCommentText,
  resetCommunityState,
} = communitySlice.actions;

/**
 * Export reducer for store configuration
 */
export default communitySlice.reducer;

/**
 * Selectors for accessing community state
 * Use these in components with useSelector hook
 */
export const selectSelectedPost = (state: { community: CommunityState }) =>
  state.community.selectedPost;

export const selectIsCreatePostModalOpen = (state: {
  community: CommunityState;
}) => state.community.isCreatePostModalOpen;

export const selectIsEditPostModalOpen = (state: {
  community: CommunityState;
}) => state.community.isEditPostModalOpen;

export const selectIsCommentModalOpen = (state: {
  community: CommunityState;
}) => state.community.isCommentModalOpen;

export const selectIsDeleteConfirmOpen = (state: {
  community: CommunityState;
}) => state.community.isDeleteConfirmOpen;

export const selectDeleteItem = (state: { community: CommunityState }) => ({
  id: state.community.deleteItemId,
  type: state.community.deleteItemType,
});

export const selectCurrentPage = (state: { community: CommunityState }) =>
  state.community.currentPage;

export const selectPostsPerPage = (state: { community: CommunityState }) =>
  state.community.postsPerPage;

export const selectSortBy = (state: { community: CommunityState }) =>
  state.community.sortBy;

export const selectCommentText = (state: { community: CommunityState }) =>
  state.community.commentText;

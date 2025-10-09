// Health Document slice for managing health document state
import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { HealthDocument } from '../api/healthDocumentApi';

interface HealthDocumentState {
    currentHealthDocument: HealthDocument | null;
    isLoading: boolean;
    hasHealthDocument: boolean;
    showHealthInfoModal: boolean;
}

const initialState: HealthDocumentState = {
    currentHealthDocument: null,
    isLoading: false,
    hasHealthDocument: false,
    showHealthInfoModal: false,
};

const healthDocumentSlice = createSlice({
    name: 'healthDocument',
    initialState,
    reducers: {
        setHealthDocument: (state, action: PayloadAction<HealthDocument>) => {
            state.currentHealthDocument = action.payload;
            state.hasHealthDocument = true;
            state.showHealthInfoModal = false;
        },
        clearHealthDocument: (state) => {
            state.currentHealthDocument = null;
            state.hasHealthDocument = false;
            state.showHealthInfoModal = false;
        },
        setHealthDocumentLoading: (state, action: PayloadAction<boolean>) => {
            state.isLoading = action.payload;
        },
        setShowHealthInfoModal: (state, action: PayloadAction<boolean>) => {
            state.showHealthInfoModal = action.payload;
        },
        setHasHealthDocument: (state, action: PayloadAction<boolean>) => {
            state.hasHealthDocument = action.payload;
        },
    },
});

export const {
    setHealthDocument,
    clearHealthDocument,
    setHealthDocumentLoading,
    setShowHealthInfoModal,
    setHasHealthDocument,
} = healthDocumentSlice.actions;

export default healthDocumentSlice.reducer;
import React, { useEffect, type ReactNode } from 'react';
import { useAppSelector, useAppDispatch } from '@/store/hooks';
import { useGetMyHealthDocumentQuery, useCreateHealthDocumentMutation } from '@/store/api/healthDocumentApi';
import { setHealthDocument, setShowHealthInfoModal, setHasHealthDocument } from '@/store/slices/healthDocumentSlice';
import { HealthInfoModal } from '@/components/modals';
import { useNavigate } from 'react-router-dom';

interface HealthDocumentGuardProps {
    children: ReactNode;
    shouldCheck?: boolean; // Để kiểm soát khi nào cần check
    excludePaths?: string[]; // Danh sách các path không cần check
}

const HealthDocumentGuard: React.FC<HealthDocumentGuardProps> = ({
    children,
    shouldCheck = true,
    excludePaths = ['/login', '/register', '/']
}) => {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    
    // Auth state
    const { isAuthenticated } = useAppSelector(state => state.auth);
    
    // Health document state
    const { showHealthInfoModal, hasHealthDocument, currentHealthDocument } = useAppSelector(state => state.healthDocument);
    
    // API hooks
    const { data: healthDocData, isLoading, error } = useGetMyHealthDocumentQuery(undefined, {
        skip: !isAuthenticated || !shouldCheck
    });
    
    const [createHealthDocument] = useCreateHealthDocumentMutation();

    // Check current path
    const currentPath = window.location.pathname;
    const shouldSkipCheck = excludePaths.includes(currentPath) || !shouldCheck || !isAuthenticated;

    useEffect(() => {
        if (shouldSkipCheck) {
            return;
        }

        // Nếu đã có health document trong state, không cần check nữa
        if (hasHealthDocument && currentHealthDocument) {
            return;
        }

        // Nếu API loading, chờ
        if (isLoading) {
            return;
        }
        console.log('HealthDocumentGuard: Checking health document status...', { healthDocData, error });
        // Nếu API trả về success và có data
        if (healthDocData?.status == 200 && healthDocData.data) {
            console.log('Health document found:', healthDocData.data);
            dispatch(setHealthDocument(healthDocData.data));
            dispatch(setHasHealthDocument(true));
            dispatch(setShowHealthInfoModal(false));
        } 
        // Nếu API trả về lỗi hoặc không có data (user chưa có health document)
        else if (error || (healthDocData?.status !== 200 || !healthDocData?.data)) {
            console.log('No health document found, showing modal');
            dispatch(setHasHealthDocument(false));
            dispatch(setShowHealthInfoModal(true));
        }
    }, [
        shouldSkipCheck,
        hasHealthDocument,
        currentHealthDocument,
        healthDocData,
        isLoading,
        error,
        dispatch
    ]);

    // Handle save health document
    const handleHealthInfoSave = async (healthData: any) => {
        try {
            const result = await createHealthDocument(healthData).unwrap();
            if (result.message === 'Tạo thành công!') {
                dispatch(setHealthDocument(result.data));
                dispatch(setHasHealthDocument(true));
                dispatch(setShowHealthInfoModal(false));
                console.log('Health document created successfully');
            }
        } catch (err: any) {
            console.error('Failed to save health info:', err);
        }
    };

    // Handle save and navigate
    const handleHealthInfoSaveAndNavigate = async (healthData: any) => {
        try {
            const result = await createHealthDocument(healthData).unwrap();
            if (result.message === 'Tạo thành công!') {
                dispatch(setHealthDocument(result.data));
                dispatch(setHasHealthDocument(true));
                dispatch(setShowHealthInfoModal(false));
                navigate('/health-tracking');
            }
        } catch (err: any) {
            console.error('Failed to save health info:', err);
        }
    };

    // Handle close modal
    const handleHealthInfoClose = () => {
        dispatch(setShowHealthInfoModal(false));
        // Có thể redirect về trang chủ nếu user đóng modal mà chưa tạo health document
        // navigate('/');
    };

    return (
        <>
            {children}
            
            {/* Health Info Modal */}
            <HealthInfoModal
                isOpen={showHealthInfoModal}
                onClose={handleHealthInfoClose}
                onSave={handleHealthInfoSave}
                onSaveAndNavigate={handleHealthInfoSaveAndNavigate}
            />
        </>
    );
};

export default HealthDocumentGuard;
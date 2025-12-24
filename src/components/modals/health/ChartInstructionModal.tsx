import React from 'react';
import ModalOverlay from '../ModalOverlay';
import {
    AcidUric,
    BloodSugarHungry,
    BloodSugar2Hours,
    BloodSugarHbA1c,
    BloodLipidCholesterol,
    BloodLipidHDL,
    BloodLipidLDL,
    BloodLipidTriglyceride,
    KidneyFunctionUre,
    KidneyFunctionCreatinine,
    LiverFunctionSGOT,
    LiverFunctionSGPT,
    BloodPressure
} from '@/components/health/chart-instruction';

interface ChartInstructionModalProps {
    isOpen: boolean;
    onClose: () => void;
    chartType: string;
    variant?: string;
}

const ChartInstructionModal: React.FC<ChartInstructionModalProps> = ({
    isOpen,
    onClose,
    chartType,
    variant
}) => {
    const renderInstructionContent = () => {
        switch (chartType) {
            case 'AcidUric':
                return <AcidUric />;

            case 'BloodSugar':
                if (variant === 'fasting') return <BloodSugarHungry />;
                if (variant === 'twoHours') return <BloodSugar2Hours />;
                if (variant === 'hba1c') return <BloodSugarHbA1c />;
                return <BloodSugarHungry />;

            case 'BloodLipid':
                if (variant === 'total') return <BloodLipidCholesterol />;
                if (variant === 'ldl') return <BloodLipidLDL />;
                if (variant === 'hdl') return <BloodLipidHDL />;
                if (variant === 'triglyceride') return <BloodLipidTriglyceride />;
                return <BloodLipidCholesterol />;

            case 'KidneyFunction':
                if (variant === 'creatinine') return <KidneyFunctionCreatinine />;
                if (variant === 'urea') return <KidneyFunctionUre />;
                return <KidneyFunctionCreatinine />;

            case 'LiverFunction':
                if (variant === 'ALT') return <LiverFunctionSGPT />;
                if (variant === 'AST') return <LiverFunctionSGOT />;
                return <LiverFunctionSGPT />;

            case 'BloodPressure':
                return <BloodPressure />;

            default:
                return (
                    <div className="p-6 text-center text-gray-500" style={{ fontSize: '14px' }}>
                        Hướng dẫn đọc biểu đồ chưa có sẵn cho chỉ số này.
                    </div>
                );
        }
    };

    return (
        <ModalOverlay isOpen={isOpen} onClose={onClose} maxWidth="max-w-md">
            <style>{`
        .chart-instruction-wrapper {
          padding: 16px;
          overflow-x: hidden !important;
        }
        .chart-instruction-wrapper * {
          font-size: 14px !important;
          line-height: 1.6 !important;
        }
        .chart-instruction-wrapper h1,
        .chart-instruction-wrapper h2,
        .chart-instruction-wrapper h3,
        .chart-instruction-wrapper h4 {
          font-size: 24px !important;
          line-height: 1.4 !important;
          margin-bottom: 12px !important;
          font-weight: 700 !important;
        }
        .chart-instruction-wrapper strong {
          font-weight: 600 !important;
        }
        .chart-instruction-wrapper .ant-collapse-header-text {
          font-size: 14px !important;
        }
        .chart-instruction-wrapper span {
          width: 40px !important;
          height: 40px !important;
          min-width: 40px !important;
          min-height: 40px !important;
        }
      `}</style>
            <div className="chart-instruction-wrapper max-h-[85vh] overflow-y-auto overflow-x-hidden">
                {renderInstructionContent()}
            </div>
        </ModalOverlay>
    );
};

export default ChartInstructionModal;

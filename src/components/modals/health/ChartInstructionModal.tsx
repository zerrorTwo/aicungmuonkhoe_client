
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
    BloodPressure,
    BMIAboveNineTeen,
    BMIFiveToTwelve,
    BMITwelveToNineTeen,
    BMIZeroToFive,
    BMI as BMIGeneral
} from '@/components/health/chart-instruction';
import { BMIAgeRange, BMIChildrenTabs } from '@/enum/health';

interface ChartInstructionModalProps {
    isOpen: boolean;
    onClose: () => void;
    chartType: string;
    variant?: string;
    bmiAgeRange?: BMIAgeRange;
    bmiTab?: BMIChildrenTabs;
}

export default function ChartInstructionModal({
    isOpen,
    onClose,
    chartType,
    variant,
    bmiAgeRange,
    bmiTab
}: ChartInstructionModalProps) {
    if (!isOpen) return null;

    const renderInstructionContent = () => {
        switch (chartType) {
            case 'AcidUric':
            case 'ACID_URIC':
                return <AcidUric />;

            case 'BloodSugar':
            case 'BLOOD_SUGAR':
                if (variant === 'fasting') return <BloodSugarHungry />;
                if (variant === 'twoHours') return <BloodSugar2Hours />;
                if (variant === 'hba1c') return <BloodSugarHbA1c />;
                return <BloodSugarHungry />;

            case 'BloodLipid':
            case 'BLOOD_LIPID':
                if (variant === 'total') return <BloodLipidCholesterol />;
                if (variant === 'ldl') return <BloodLipidLDL />;
                if (variant === 'hdl') return <BloodLipidHDL />;
                if (variant === 'triglyceride') return <BloodLipidTriglyceride />;
                return <BloodLipidCholesterol />;

            case 'KidneyFunction':
            case 'KIDNEY_FUNCTION':
                if (variant === 'creatinine') return <KidneyFunctionCreatinine />;
                return <KidneyFunctionUre />;

            case 'LiverFunction':
            case 'LIVER_FUNCTION':
                if (variant === 'ALT') return <LiverFunctionSGPT />;
                return <LiverFunctionSGOT />;

            case 'BloodPressure':
            case 'BLOOD_PRESSURE':
                return <BloodPressure />;

            case 'BMI':
                if (bmiAgeRange === BMIAgeRange.EQUAL_MORE_THAN_70 || bmiAgeRange === BMIAgeRange.FROM_20_LESS_THEN_70) {
                    return <BMIAboveNineTeen />;
                }
                if (bmiAgeRange === BMIAgeRange.FROM_12_LESS_THAN_20) {
                    return <BMITwelveToNineTeen />;
                }
                if (bmiAgeRange === BMIAgeRange.FROM_5_LESS_THAN_12) {
                    return <BMIFiveToTwelve />;
                }
                if (bmiAgeRange === BMIAgeRange.FROM_0_LESS_THAN_5) {
                    return <BMIZeroToFive bmiTab={bmiTab || BMIChildrenTabs.WeightHeight} />;
                }
                return <BMIGeneral />;

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



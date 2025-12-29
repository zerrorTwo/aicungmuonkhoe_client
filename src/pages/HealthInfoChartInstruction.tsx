import { useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import {
    AcidUric,
    BloodLipidCholesterol,
    BloodLipidHDL,
    BloodLipidLDL,
    BloodLipidTriglyceride,
    BloodPressure,
    BloodSugar2Hours,
    BloodSugarHbA1c,
    BloodSugarHungry,
    KidneyFunctionCreatinine,
    KidneyFunctionUre,
    LiverFunctionSGOT,
    LiverFunctionSGPT
} from '@/components/health/chart-instruction';
import { HealthIndex } from '@/enum/health';

export default function HealthInfoChartInstruction() {
    const [searchParams] = useSearchParams();

    const component = useMemo(() => {
        const type = searchParams.get('type') as HealthIndex;
        const tab = searchParams.get('tab');

        if (!type) {
            return null;
        }

        switch (type) {
            case HealthIndex.BloodPressure: {
                return <BloodPressure />;
            }

            case HealthIndex.BloodSugar: {
                if (tab === 'HUNGRY') {
                    return <BloodSugarHungry />;
                }
                if (tab === '2_HOURS') {
                    return <BloodSugar2Hours />;
                }
                if (tab === 'HBA1C') {
                    return <BloodSugarHbA1c />;
                }
                break;
            }

            case HealthIndex.KidneyFunction: {
                if (tab === 'URE') {
                    return <KidneyFunctionUre />;
                }
                if (tab === 'CREA') {
                    return <KidneyFunctionCreatinine />;
                }
                break;
            }

            case HealthIndex.LiverFunction: {
                if (tab === 'SGOT') {
                    return <LiverFunctionSGOT />;
                }
                if (tab === 'SGPT') {
                    return <LiverFunctionSGPT />;
                }
                break;
            }

            case HealthIndex.BloodLipid: {
                if (tab === 'CHOL') {
                    return <BloodLipidCholesterol />;
                }
                if (tab === 'LDL') {
                    return <BloodLipidLDL />;
                }
                if (tab === 'HDL') {
                    return <BloodLipidHDL />;
                }
                if (tab === 'TRI') {
                    return <BloodLipidTriglyceride />;
                }
                return null;
            }

            case HealthIndex.AcidUric: {
                return <AcidUric />;
            }

            default:
                return null;
        }

        return null;
    }, [searchParams]);

    return (
        <div className="min-h-screen bg-slate-50">
            <Header />
            <main className="container mx-auto px-4 py-8">
                <h1 className="text-3xl font-bold text-center mb-6 text-emerald-700">
                    Hướng dẫn đọc biểu đồ
                </h1>
                {component}
            </main>
            <Footer />
        </div>
    );
}

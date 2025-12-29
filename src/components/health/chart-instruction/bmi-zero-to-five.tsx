/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import Collapse from '@/components/common/Collapse';
import { BMIChildrenTabs } from '@/enum/health';
import BMIDetailZeroToFiveHeight from '../chart-instruction-detail/bmi-zero-to-five-height';
import BMIDetailZeroToFiveWeight from '../chart-instruction-detail/bmi-zero-to-five-weight';
import BMIDetailZeroToFiveWeightHeight from '../chart-instruction-detail/bmi-zero-to-five-weight-height';
import { isMobile } from 'react-device-detect';

type Props = {
    bmiTab: BMIChildrenTabs;
};

export default function BMIZeroToFive({ bmiTab }: Props) {
    return (
        <div css={rootStyles}>
            {!isMobile && <div css={headerStyles}>Hướng dẫn đọc biểu đồ</div>}
            <div css={basicGuideInfoStyles(bmiTab)}>
                <div>
                    <span />
                    {bmiTab === BMIChildrenTabs.Height
                        ? 'Bé bị Suy dinh dưỡng thấp còi, mức độ nặng.'
                        : bmiTab === BMIChildrenTabs.Weight
                            ? 'Suy dinh dưỡng nhẹ cân, mức độ nặng'
                            : 'Suy dinh dưỡng gầy còm, mức độ nặng'}
                </div>
                <div>
                    <span />
                    {bmiTab === BMIChildrenTabs.Height
                        ? 'Bé bị Suy dinh dưỡng thấp còi.'
                        : bmiTab === BMIChildrenTabs.Weight
                            ? 'Suy dinh dưỡng nhẹ cân, mức độ vừa'
                            : 'Suy dinh dưỡng gầy còm, mức độ vừa'}
                </div>
                <div>
                    <span />
                    {bmiTab === BMIChildrenTabs.Height
                        ? 'Bé phát triển Chiều cao/chiều dài bình thường.'
                        : bmiTab === BMIChildrenTabs.Weight
                            ? 'Cân nặng bình thường'
                            : 'Bình thường'}
                </div>
                <div>
                    <span />
                    {bmiTab === BMIChildrenTabs.Height
                        ? 'Bé phát triển Chiều cao/chiều dài cao hơn so với chuẩn.'
                        : bmiTab === BMIChildrenTabs.Weight
                            ? 'Có nguy cơ thừa cân'
                            : 'Thừa cân'}
                </div>
                <div>
                    <span />
                    {bmiTab === BMIChildrenTabs.Height
                        ? 'Bé phát triển Chiều cao/chiều dài rất cao, cao hơn so với chuẩn, cần cho trẻ đi khám để kiểm tra về rối loạn nội tiết.'
                        : bmiTab === BMIChildrenTabs.Weight
                            ? 'Có nguy cơ thừa cân'
                            : 'Béo phì'}
                </div>
            </div>
            <div css={detailGuideStyles}>
                {isMobile ? (
                    <Collapse
                        label={
                            bmiTab === BMIChildrenTabs.Height
                                ? 'Hướng dẫn đọc biểu đồ Chiều dài theo tuổi'
                                : bmiTab === BMIChildrenTabs.Weight
                                    ? 'Hướng dẫn đọc biểu đồ Cân nặng theo tuổi'
                                    : 'Hướng dẫn đọc biểu đồ Cân nặng theo chiều dài'
                        }
                        content={
                            bmiTab === BMIChildrenTabs.Height ? (
                                <BMIDetailZeroToFiveHeight />
                            ) : bmiTab === BMIChildrenTabs.Weight ? (
                                <BMIDetailZeroToFiveWeight />
                            ) : (
                                <BMIDetailZeroToFiveWeightHeight />
                            )
                        }
                        boldActivatedLabel={false}
                    />
                ) : (
                    <div css={desktopStyles}>
                        <div>
                            {bmiTab === BMIChildrenTabs.Height
                                ? 'Hướng dẫn đọc biểu đồ Chiều dài theo tuổi'
                                : bmiTab === BMIChildrenTabs.Weight
                                    ? 'Hướng dẫn đọc biểu đồ Cân nặng theo tuổi'
                                    : 'Hướng dẫn đọc biểu đồ Cân nặng theo chiều dài'}
                        </div>
                        {bmiTab === BMIChildrenTabs.Height ? (
                            <BMIDetailZeroToFiveHeight />
                        ) : bmiTab === BMIChildrenTabs.Weight ? (
                            <BMIDetailZeroToFiveWeight />
                        ) : (
                            <BMIDetailZeroToFiveWeightHeight />
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}

const rootStyles = css`
  padding: 1.6rem 0;
  max-height: ${isMobile ? 'unset' : '65vh'};
  overflow: auto;
  margin: 0 -2.4rem;
  padding: 0 2.4rem;
`;

const headerStyles = css`
  font-size: 3.2rem;
  line-height: 4.4rem;
  font-weight: 700;
  text-align: center;
  color: var(--text-label-color);
`;

const basicGuideInfoStyles = (tab: BMIChildrenTabs) => css`
  display: flex;
  flex-direction: column;
  font-size: ${isMobile ? '1.4rem' : '1.8rem'};

  & > div {
    padding-top: ${isMobile ? '0.8rem' : '1.6rem'};
    gap: 1.2rem;
    display: flex;
    align-items: center;

    span {
      width: ${isMobile ? '2.4rem' : '4rem'};
      height: ${isMobile ? '2.4rem' : '4rem'};
      border-radius: 50%;
      flex-shrink: 0;
    }

    &:nth-of-type(1) > span {
      background-color: ${tab === BMIChildrenTabs.WeightHeight
        ? '#00A9F0CC'
        : '#a4ddf5cc'};
    }

    &:nth-of-type(2) > span {
      background-color: ${tab === BMIChildrenTabs.WeightHeight
        ? '#33C3FFCC'
        : '#fecf8bcc'};
    }

    &:nth-of-type(3) > span {
      background-color: #99e18ccc;
    }

    &:nth-of-type(4) > span {
      background-color: #faa781cc;
    }

    &:nth-of-type(5) > span {
      background-color: #eb5447cc;
    }
  }
`;

const detailGuideStyles = css`
  padding-top: ${isMobile ? '0.8rem' : '1.6rem'};
`;

const desktopStyles = css`
  & > div:first-of-type {
    border-radius: 0.8rem;
    padding: 1.6rem;
    margin-bottom: 1.6rem;
    border: 1px solid #ebebeb;
    font-size: 1.8rem;
  }
`;

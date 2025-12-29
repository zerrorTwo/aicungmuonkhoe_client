/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import Collapse from '@/components/common/Collapse';
import BMIDetailAboveNineTeen from '@/components/health/chart-instruction-detail/bmi-above-nineteen';
import { isMobile } from 'react-device-detect';

export default function BMIAboveNineTeen() {
    return (
        <div css={rootStyles}>
            {!isMobile && <div css={headerStyles}>Hướng dẫn đọc biểu đồ</div>}
            <div css={basicGuideInfoStyles}>
                <div>
                    <span /> Gầy độ III
                </div>
                <div>
                    <span /> Gầy độ II
                </div>
                <div>
                    <span /> Gầy độ I
                </div>
                <div>
                    <span /> Bình thường
                </div>
                <div>
                    <span /> Tiền béo phì
                </div>
                <div>
                    <span /> Béo phì độ I
                </div>
                <div>
                    <span /> Béo phì độ II
                </div>
                <div>
                    <span /> Béo phì độ III
                </div>
            </div>
            <div css={detailGuideStyles}>
                {isMobile ? (
                    <Collapse
                        label='Hướng dẫn chi tiết đọc biểu đồ chỉ số BMI'
                        content={<BMIDetailAboveNineTeen />}
                        boldActivatedLabel={false}
                    />
                ) : (
                    <div css={desktopStyles}>
                        <div>Hướng dẫn chi tiết đọc biểu đồ chỉ số BMI</div>
                        <BMIDetailAboveNineTeen />
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

const basicGuideInfoStyles = css`
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
    }

    &:nth-of-type(1) > span {
      background-color: #00a9f0cc;
    }

    &:nth-of-type(2) > span {
      background-color: #33c3ffcc;
    }

    &:nth-of-type(3) > span {
      background-color: #a4ddf5cc;
    }

    &:nth-of-type(4) > span {
      background-color: #99e18ccc;
    }

    &:nth-of-type(5) > span {
      background-color: #ffe666cc;
    }

    &:nth-of-type(6) > span {
      background-color: #fecf8bcc;
    }

    &:nth-of-type(7) > span {
      background-color: #faa781cc;
    }

    &:nth-of-type(8) > span {
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

/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import Collapse from '@/components/common/Collapse';
import { isMobile } from 'react-device-detect';
import BMIDetail from '../chart-instruction-detail/bmi';

export default function BMI() {
    return (
        <div css={rootStyles}>
            {!isMobile && <div css={headerStyles}>Hướng dẫn đọc biểu đồ</div>}
            <div css={basicGuideInfoStyles}>
                <div>
                    <span style={{ backgroundColor: '#99e18ccc' }} /> Bình thường
                </div>
                <div>
                    <span style={{ backgroundColor: '#fecf8bcc' }} /> Thừa cân
                </div>
                <div>
                    <span style={{ backgroundColor: '#ff9999cc' }} /> Béo phì
                </div>
                <div>
                    <span style={{ backgroundColor: '#b3d9ffcc' }} /> Gầy
                </div>
            </div>
            <div css={detailGuideStyles}>
                {isMobile ? (
                    <Collapse
                        label='Hướng dẫn chi tiết đọc biểu đồ chỉ số BMI'
                        content={<BMIDetail />}
                        boldActivatedLabel={false}
                    />
                ) : (
                    <div css={desktopStyles}>
                        <div>Hướng dẫn chi tiết đọc biểu đồ chỉ số BMI</div>
                        <BMIDetail />
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

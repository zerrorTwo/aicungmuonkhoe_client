/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import Collapse from '@/components/common/Collapse';
import { isMobile } from 'react-device-detect';
import BloodLipidHDLDetail from '../chart-instruction-detail/blood-lipid-hdl';

export default function BloodLipidHDL() {
  return (
    <div css={rootStyles}>
      {!isMobile && <div css={headerStyles}>Hướng dẫn đọc biểu đồ</div>}
      <div css={basicGuideInfoStyles}>
        <div>
          <span /> Thấp hơn bình thường
        </div>
        <div>
          <span /> Bình thường
        </div>
      </div>
      <div css={detailGuideStyles}>
        {isMobile ? (
          <Collapse
            label='Hướng dẫn chi tiết đọc biểu đồ chỉ số Cholesterol loại HDL'
            content={<BloodLipidHDLDetail />}
            boldActivatedLabel={false}
          />
        ) : (
          <div css={desktopStyles}>
            <div>Hướng dẫn chi tiết đọc biểu đồ chỉ số Cholesterol loại HDL</div>
            <BloodLipidHDLDetail />
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
      background-color: #a4ddf5cc;
    }

    &:nth-of-type(2) > span {
      background-color: #99e18ccc;
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

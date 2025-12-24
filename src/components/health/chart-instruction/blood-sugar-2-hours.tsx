/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import Collapse from '@/components/common/Collapse';
import { isMobile } from 'react-device-detect';
import BloodSugarDetail2Hours from '../chart-instruction-detail/blood-sugar-2-hours';

export default function BloodSugar2Hours() {
  return (
    <div css={rootStyles}>
      {!isMobile && <div css={headerStyles}>Hướng dẫn đọc biểu đồ</div>}
      <div css={basicGuideInfoStyles}>
        <div>
          <span /> Không thuộc Tiền đái tháo đường/Đái tháo đường
        </div>
        <div>
          <span /> Tiền đái tháo đường
        </div>
        <div>
          <span /> Đái tháo đường
        </div>
      </div>
      <div css={detailGuideStyles}>
        {isMobile ? (
          <Collapse
            label='Hướng dẫn chi tiết đọc biểu đồ chỉ số đường huyết sau 2 giờ uống'
            content={<BloodSugarDetail2Hours />}
            boldActivatedLabel={false}
          />
        ) : (
          <div css={desktopStyles}>
            <div>Hướng dẫn chi tiết đọc biểu đồ chỉ số đường huyết sau 2 giờ uống</div>
            <BloodSugarDetail2Hours />
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
      background-color: #99e18ccc;
    }

    &:nth-of-type(2) > span {
      background-color: #fecf8bcc;
    }

    &:nth-of-type(3) > span {
      background-color: #faa781cc;
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

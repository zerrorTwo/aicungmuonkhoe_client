/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import { isMobile } from 'react-device-detect';

export default function BloodPressureDetail() {
  return (
    <div css={rootStyles}>
      <div css={itemStyles}>
        <strong>Huyết áp là gì?</strong>
        <br />
        Huyết áp là áp lực của dòng máu tác động lên thành động mạch khi tim bơm máu đi nuôi cơ thể. Huyết áp được thể hiện bằng hai chỉ số:
        <ul style={{ paddingLeft: '20px', margin: '8px 0' }}>
          <li><strong>Huyết áp tâm thu (số trên):</strong> Áp lực khi tim co bóp để bơm máu.</li>
          <li><strong>Huyết áp tâm trương (số dưới):</strong> Áp lực khi tim nghỉ ngơi giữa các nhịp đập.</li>
        </ul>
      </div>
      <div css={itemStyles}>
        <strong>Tác động đến cơ thể:</strong>
        <br />
        - <strong>Huyết áp cao:</strong> Làm tăng gánh nặng cho tim và mạch máu, dẫn đến nguy cơ đột quỵ, suy tim, nhồi máu cơ tim và suy thận.
        <br />
        - <strong>Huyết áp thấp:</strong> Có thể gây chóng mặt, ngất xỉu, thiếu máu não và mệt mỏi kéo dài.
      </div>
      <div css={itemStyles}>
        Các khoảng tham chiếu của{' '}
        <strong>biểu đồ theo dõi chỉ số Huyết áp</strong> được căn cứ theo
        Quyết định số 3192/QĐ-BYT về Hướng dẫn chẩn đoán và điều trị
        tăng huyết áp của Bộ Y tế và dựa theo tư vấn của Trường
        Đại học Y tế Công cộng.
      </div>
      <div css={itemStyles}>
        Biểu đồ theo dõi chỉ số Huyết áp có trục tung (trục thẳng đứng) là giá
        trị huyết áp tâm thu và tâm trương đo được và trục hoành (trục nằm ngang) là
        ngày/tháng/năm tiến hành kiểm tra.
      </div>
      <div css={itemStyles}>
        Chỉ số Huyết áp của bạn trong mỗi lần đo sẽ được hiển thị bằng cột màu
        thể hiện khoảng giữa huyết áp tâm thu và tâm trương.
      </div>
      <div css={itemStyles}>
        Vị trí của các cột biểu thị giá trị Huyết áp của bạn sẽ có ý nghĩa
        như sau:
      </div>
      <div css={basicGuideInfoStyles}>
        <div>
          <span />
          <div>
            Nếu giá trị Huyết áp tâm thu <strong>{'<'}120 mmHg</strong> VÀ
            Huyết áp tâm trương <strong>{'<'}80 mmHg</strong>: Huyết áp của bạn
            hiện được phân loại <span>Bình thường.</span>
          </div>
        </div>
        <div>
          <span />
          <div>
            Nếu giá trị Huyết áp tâm thu <strong>≥120 mmHg</strong> HOẶC
            Huyết áp tâm trương <strong>≥80 mmHg</strong>: Huyết áp của bạn
            hiện được phân loại <span>Cao hơn bình thường.</span>
          </div>
        </div>
      </div>
    </div>
  );
}

const rootStyles = css`
  font-size: ${isMobile ? '1.4rem' : '1.8rem'};
`;

const itemStyles = css`
  padding-bottom: 1.2rem;
`;

const basicGuideInfoStyles = css`
  display: flex;
  flex-direction: column;

  & > div {
    padding-top: ${isMobile ? '0.8rem' : '1.6rem'};
    gap: 1.2rem;
    display: flex;
    align-items: center;

    span {
      width: ${isMobile ? '2.4rem' : '4rem'};
      height: ${isMobile ? '2.4rem' : '4rem'};
      min-width: ${isMobile ? '2.4rem' : '4rem'};
      min-height: ${isMobile ? '2.4rem' : '4rem'};
      border-radius: 50%;
    }

    &:nth-of-type(1) > span {
      background-color: #99e18ccc;
    }

    &:nth-of-type(1) > div > span {
      color: #4cca35;
      font-weight: 700;
    }

    &:nth-of-type(2) > span {
      background-color: #fecf8bcc;
    }

    &:nth-of-type(2) > div > span {
      color: #fd9602;
      font-weight: 700;
    }
  }
`;

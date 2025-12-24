/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import { isMobile } from 'react-device-detect';

export default function KidneyFunctionUreDetail() {
    return (
        <div css={rootStyles}>
            <div css={itemStyles}>
                Các khoảng tham chiếu của{' '}
                <strong>biểu đồ theo dõi chỉ số Ure</strong> được căn cứ theo
                Quyết định số 4069/QĐ-BYT về Hướng dẫn chẩn đoán và điều trị
                bệnh thận mạn của Bộ Y tế và dựa theo tư vấn của Trường
                Đại học Y tế Công cộng.
            </div>
            <div css={itemStyles}>
                Biểu đồ theo dõi chỉ số Ure có trục tung (trục thẳng đứng) là giá
                trị Ure trong máu đo được và trục hoành (trục nằm ngang) là
                ngày/tháng/năm tiến hành kiểm tra.
            </div>
            <div css={itemStyles}>
                Chỉ số Ure của bạn trong mỗi lần đo sẽ được hiển thị bằng hình
                chấm tròn.
            </div>
            <div css={itemStyles}>
                Vị trí của những điểm biểu thị giá trị Ure của bạn sẽ có ý nghĩa
                như sau:
            </div>
            <div css={basicGuideInfoStyles}>
                <div>
                    <span />
                    <div>
                        Nếu giá trị Ure nằm trong khu vực màu xanh dương (Chỉ số{' '}
                        <strong>{'<'}2,5 mmol/L</strong>): Giá trị Ure của bạn
                        hiện được phân loại <span>Thấp hơn bình thường.</span>
                    </div>
                </div>
                <div>
                    <span />
                    <div>
                        Nếu giá trị Ure nằm trong khu vực màu xanh lá (Chỉ số
                        trong khoảng <strong>2,5 - 7,5 mmol/L</strong>): Giá trị Ure của
                        bạn hiện được phân loại <span>Bình thường.</span>
                    </div>
                </div>
                <div>
                    <span />
                    <div>
                        Nếu giá trị Ure nằm trong khu vực màu cam (Chỉ số{' '}
                        <strong>{'>'} 7,5 mmol/L</strong>): Giá trị Ure của bạn hiện
                        được phân loại <span>Cao hơn bình thường.</span>
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
      background-color: #a4ddf5cc;
    }

    &:nth-of-type(1) > div > span {
      color: #1aa8e3;
      font-weight: 700;
    }

    &:nth-of-type(2) > span {
      background-color: #99e18ccc;
    }

    &:nth-of-type(2) > div > span {
      color: #4cca35;
      font-weight: 700;
    }

    &:nth-of-type(3) > span {
      background-color: #fecf8bcc;
    }

    &:nth-of-type(3) > div > span {
      color: #fd9602;
      font-weight: 700;
    }
  }
`;

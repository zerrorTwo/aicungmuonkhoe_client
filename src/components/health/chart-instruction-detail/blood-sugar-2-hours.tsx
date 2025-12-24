/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import { isMobile } from 'react-device-detect';

export default function BloodSugarDetail2Hours() {
    return (
        <div css={rootStyles}>
            <div css={itemStyles}>
                Các khoảng tham chiếu của{' '}
                <strong>biểu đồ theo dõi chỉ số Đường huyết sau 2 giờ uống</strong> được căn
                cứ theo Quyết định số 3087/QĐ-BYT về Hướng dẫn chẩn đoán và điều trị
                tiền đái tháo đường; Quyết định số 5481/QĐ-BYT về Hướng dẫn chẩn đoán và
                điều trị đái tháo đường típ 2 của Bộ Y tế và dựa theo tư vấn của Trường
                Đại học Y tế Công cộng.
            </div>
            <div css={itemStyles}>
                Biểu đồ theo dõi đường huyết sau 2 giờ uống có trục tung (trục thẳng đứng) là
                giá trị hàm lượng glucose huyết tương sau 2 giờ uống đo được và trục hoành
                (trục nằm ngang) là ngày/tháng/năm tiến hành kiểm tra.
            </div>
            <div css={itemStyles}>
                Chỉ số đường huyết sau 2 giờ uống của bạn trong mỗi lần đo sẽ được hiển thị
                bằng hình chấm tròn.
            </div>
            <div css={itemStyles}>
                Vị trí của những điểm biểu thị giá trị đường huyết sau 2 giờ uống của bạn sẽ có
                ý nghĩa như sau:
            </div>
            <div css={basicGuideInfoStyles}>
                <div>
                    <span />
                    <div>
                        Nếu giá trị glucose nằm trong khu vực màu xanh lá (Chỉ số glucose{' '}
                        <strong>{'<'}7,8 mmol/L</strong>): Giá trị glucose của bạn hiện được
                        phân loại <span>Không thuộc Tiền đái tháo đường/Đái tháo đường.</span>
                    </div>
                </div>
                <div>
                    <span />
                    <div>
                        Nếu giá trị glucose nằm trong khu vực màu cam (Chỉ số glucose trong
                        khoảng <strong>7,8 - 11,0 mmol/L</strong>): Giá trị glucose của bạn
                        hiện được phân loại <span>Tiền đái tháo đường.</span>
                    </div>
                </div>
                <div>
                    <span />
                    <div>
                        Nếu giá trị glucose nằm trong khu vực màu đỏ (Chỉ số glucose{' '}
                        <strong>≥11,1 mmol/L</strong>): Giá trị glucose của bạn hiện được phân
                        loại <span>Đái tháo đường.</span>
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

    &:nth-of-type(3) > span {
      background-color: #faa781cc;
    }

    &:nth-of-type(3) > div > span {
      color: #f5540a;
      font-weight: 700;
    }
  }
`;

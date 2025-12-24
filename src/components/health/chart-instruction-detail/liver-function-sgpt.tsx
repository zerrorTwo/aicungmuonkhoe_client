/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import { isMobile } from 'react-device-detect';

export default function LiverFunctionSGPTDetail() {
    return (
        <div css={rootStyles}>
            <div css={itemStyles}>
                Các khoảng tham chiếu của{' '}
                <strong>biểu đồ theo dõi chỉ số SGPT/ALT</strong> được căn cứ theo
                Quyết định số 3310/QĐ-BYT về Hướng dẫn chẩn đoán và điều trị
                bệnh gan nhiễm mỡ không do rượu của Bộ Y tế và dựa theo tư vấn của Trường
                Đại học Y tế Công cộng.
            </div>
            <div css={itemStyles}>
                Biểu đồ theo dõi chỉ số SGPT/ALT có trục tung (trục thẳng đứng) là giá
                trị SGPT/ALT trong máu đo được và trục hoành (trục nằm ngang) là
                ngày/tháng/năm tiến hành kiểm tra.
            </div>
            <div css={itemStyles}>
                Chỉ số SGPT/ALT của bạn trong mỗi lần đo sẽ được hiển thị bằng hình
                chấm tròn.
            </div>
            <div css={itemStyles}>
                Vị trí của những điểm biểu thị giá trị SGPT/ALT của bạn sẽ có ý nghĩa
                như sau:
            </div>
            <div css={genderStyles(1)}>
                ♂ Đối với Nam:
            </div>
            <div css={basicGuideInfoStyles}>
                <div>
                    <span />
                    <div>
                        Nếu giá trị SGPT/ALT nằm trong khu vực màu xanh lá (Chỉ số{' '}
                        <strong>{'<'}40 U/L</strong>): Giá trị SGPT/ALT của bạn
                        hiện được phân loại <span>Bình thường.</span>
                    </div>
                </div>
                <div>
                    <span />
                    <div>
                        Nếu giá trị SGPT/ALT nằm trong khu vực màu cam (Chỉ số{' '}
                        <strong>≥40 U/L</strong>): Giá trị SGPT/ALT của bạn hiện
                        được phân loại <span>Cao hơn bình thường.</span>
                    </div>
                </div>
            </div>
            <div css={genderStyles(2)}>
                ♀ Đối với Nữ:
            </div>
            <div css={basicGuideInfoStyles}>
                <div>
                    <span />
                    <div>
                        Nếu giá trị SGPT/ALT nằm trong khu vực màu xanh lá (Chỉ số{' '}
                        <strong>{'<'}31 U/L</strong>): Giá trị SGPT/ALT của bạn
                        hiện được phân loại <span>Bình thường.</span>
                    </div>
                </div>
                <div>
                    <span />
                    <div>
                        Nếu giá trị SGPT/ALT nằm trong khu vực màu cam (Chỉ số{' '}
                        <strong>≥31 U/L</strong>): Giá trị SGPT/ALT của bạn hiện
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

const genderStyles = (type: number) => css`
  display: flex;
  align-items: center;
  font-weight: 700;
  margin-top: ${type === 1 ? 0 : '1.2rem'};
  gap: ${isMobile ? '0.4rem' : '0.8rem'};
  font-size: ${isMobile ? '1.6rem' : '1.8rem'};
`;

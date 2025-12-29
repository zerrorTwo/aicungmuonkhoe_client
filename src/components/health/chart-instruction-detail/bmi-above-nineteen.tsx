/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import { isMobile } from 'react-device-detect';

export default function BMIDetailAboveNineTeen() {
    return (
        <div css={rootStyles}>
            <div css={itemStyles}>
                Các khoảng tham chiếu của <strong>biểu đồ theo dõi chỉ số BMI</strong>{' '}
                được căn cứ theo hướng dẫn Tổ chức Y tế Thế giới (WHO) và dựa theo tư
                vấn của Trường Đại học Y tế Công cộng. Cách thức đọc biểu đồ theo dõi
                chỉ số BMI như sau:
            </div>
            <div css={itemStyles}>
                Biểu đồ theo dõi chỉ số BMI có trục tung (trục thẳng đứng) là giá trị
                BMI (đơn vị kg/m²) và trục hoành (trục nằm ngang) là ngày/tháng/năm tiến
                hành kiểm tra.
            </div>
            <div css={itemStyles}>
                Chỉ số BMI trong mỗi lần đo sẽ được hiển thị bằng hình chấm tròn.
            </div>
            <div css={itemStyles}>
                Vị trí của những điểm biểu thị giá trị BMI sẽ có ý nghĩa như sau:
            </div>
            <div css={basicGuideInfoStyles}>
                <div>
                    <span />
                    <div>
                        Nếu giá trị BMI nằm trong khu vực màu xanh dương đậm (Chỉ số BMI{' '}
                        <strong>{'<'}16 kg/m²</strong>): Giá trị BMI của bạn được phân loại
                        là <span>Gầy độ III</span>
                    </div>
                </div>
                <div>
                    <span />
                    <div>
                        Nếu giá trị BMI nằm trong khu vực màu xanh dương (Chỉ số BMI trong
                        khoảng <strong>16 - 16,99 kg/m²</strong>): Giá trị BMI của bạn được
                        phân loại là <span>Gầy độ II</span>
                    </div>
                </div>
                <div>
                    <span />
                    <div>
                        Nếu giá trị BMI nằm trong khu vực màu xanh dương nhạt (Chỉ số BMI
                        trong khoảng <strong>17 - 18,49 kg/m²</strong>): Giá trị BMI của bạn
                        được phân loại là <span>Gầy độ I</span>
                    </div>
                </div>
                <div>
                    <span />
                    <div>
                        Nếu giá trị BMI nằm trong khu vực màu xanh lá (Chỉ số BMI trong
                        khoảng <strong>18,5 - 24,99 kg/m²</strong>): Giá trị BMI của bạn
                        được phân loại là <span>Bình thường</span>
                    </div>
                </div>
                <div>
                    <span />
                    <div>
                        Nếu giá trị BMI nằm trong khu vực màu vàng (Chỉ số BMI trong khoảng{' '}
                        <strong>25 - 29,99 kg/m²</strong>): Giá trị BMI của bạn được phân
                        loại là <span>Tiền béo phì</span>
                    </div>
                </div>
                <div>
                    <span />
                    <div>
                        Nếu giá trị BMI nằm trong khu vực màu cam nhạt (Chỉ số BMI trong
                        khoảng <strong>30 - 34,99 kg/m²</strong>): Giá trị BMI của bạn được
                        phân loại là <span>Béo phì độ I</span>
                    </div>
                </div>
                <div>
                    <span />
                    <div>
                        Nếu giá trị BMI nằm trong khu vực màu cam đậm (Chỉ số BMI trong
                        khoảng <strong>35 - 39,99 kg/m²</strong>): Giá trị BMI của bạn được
                        phân loại là <span>Béo phì độ II</span>
                    </div>
                </div>
                <div>
                    <span />
                    <div>
                        Nếu giá trị BMI nằm trong khu vực màu đỏ (Chỉ số BMI trong khoảng{' '}
                        <strong>≥40 kg/m²</strong>): Giá trị BMI của bạn được phân loại là{' '}
                        <span>Béo phì độ III</span>
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
      background-color: #00a9f0cc;
    }

    &:nth-of-type(1) > div > span {
      color: #00a9f0cc;
      font-weight: 700;
    }

    &:nth-of-type(2) > span {
      background-color: #00adf5;
    }

    &:nth-of-type(2) > div > span {
      color: #00adf5;
      font-weight: 700;
    }

    &:nth-of-type(3) > span {
      background-color: #a4ddf5cc;
    }

    &:nth-of-type(3) > div > span {
      color: #a4ddf5cc;
      font-weight: 700;
    }

    &:nth-of-type(4) > span {
      background-color: #99e18ccc;
    }

    &:nth-of-type(4) > div > span {
      color: #99e18ccc;
      font-weight: 700;
    }

    &:nth-of-type(5) > span {
      background-color: #ffe666cc;
    }

    &:nth-of-type(5) > div > span {
      color: #ffe666cc;
      font-weight: 700;
    }

    &:nth-of-type(6) > span {
      background-color: #fecf8bcc;
    }

    &:nth-of-type(6) > div > span {
      color: #fecf8bcc;
      font-weight: 700;
    }

    &:nth-of-type(7) > span {
      background-color: #faa781cc;
    }

    &:nth-of-type(7) > div > span {
      color: #faa781cc;
      font-weight: 700;
    }

    &:nth-of-type(8) > span {
      background-color: #eb5447cc;
    }

    &:nth-of-type(8) > div > span {
      color: #eb5447cc;
      font-weight: 700;
    }
  }
`;

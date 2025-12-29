/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import { isMobile } from 'react-device-detect';

export default function AcidUricDetail() {
  return (
    <div css={rootStyles}>
      <div css={itemStyles}>
        <strong>Axit Uric là gì?</strong>
        <br />
        Axit uric là sản phẩm thừa được tạo ra khi cơ thể phân hủy purin - một chất có trong tế bào cơ thể và nhiều loại thực phẩm (như thịt đỏ, hải sản, bia rượu). Đa phần axit uric hòa tan trong máu và được thận đào thải qua nước tiểu.
      </div>
      <div css={itemStyles}>
        <strong>Tác động đến cơ thể:</strong>
        <br />
        - <strong>Nồng độ cao:</strong> Khi axit uric tăng cao và không được đào thải kịp, nó có thể kết tinh thành các tinh thể urat sắc nhọn lắng đọng tại khớp gây bệnh Gút (Gout) với các cơn đau dữ dội, hoặc lắng đọng tại thận gây sỏi thận.
        <br />
        - <strong>Nồng độ thấp:</strong> Ít gặp, nhưng có thể liên quan đến một số tình trạng rối loạn chức năng gan hoặc thận, hoặc do chế độ ăn quá nghèo đạm.
      </div>
      <div css={itemStyles}>
        Các khoảng tham chiếu của{' '}
        <strong>biểu đồ theo dõi chỉ số Axit uric</strong> được căn cứ theo
        Quyết định số 7603/QĐ-BYT; Quyết định số 361/QĐ-BYT về Hướng dẫn chẩn
        đoán và điều trị các bệnh xương khớp của Bộ Y tế và dựa theo tư vấn của
        Trường Đại học Y tế Công cộng. Cách thức đọc biểu đồ theo dõi chỉ số
        Axit uric như sau:
      </div>
      <div css={itemStyles}>
        Biểu đồ theo dõi chỉ số Axit uric có trục tung (trục thẳng đứng) là giá
        trị Axit uric trong máu đo được và trục hoành (trục nằm ngang) là
        ngày/tháng/năm tiến hành kiểm tra.
      </div>
      <div css={itemStyles}>
        Chỉ số Axit uric của bạn trong mỗi lần đo sẽ được hiển thị bằng hình
        chấm tròn.
      </div>
      <div css={itemStyles}>
        Vị trí của những điểm biểu thị giá trị Axit uric của bạn sẽ có ý nghĩa
        như sau:
      </div>
      <div css={genderStyles(1)}>
        ♂ Đối với Nam:
      </div>
      <div css={basicGuideInfoStyles}>
        <div>
          <span />
          <div>
            Nếu giá trị Axit uric nằm trong khu vực màu xanh dương (Chỉ số Axit
            uric <strong>{'<'}180 µmol/L</strong>): Giá trị Axit uric của bạn
            hiện được phân loại <span>Thấp hơn bình thường.</span>
          </div>
        </div>
        <div>
          <span />
          <div>
            Nếu giá trị Axit uric nằm trong khu vực màu xanh lá (Chỉ số Axit
            uric nằm trong khoảng <strong>180 - 420 µmol/L</strong>): Giá trị
            Axit uric của bạn hiện được phân loại <span>Bình thường.</span>
          </div>
        </div>
        <div>
          <span />
          <div>
            Nếu giá trị Axit uric nằm trong khu vực màu cam (Chỉ số Axit uric{' '}
            <strong>{'>'} 420 µmol/L</strong>): Giá trị Axit uric của bạn hiện
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
            Nếu giá trị Axit uric nằm trong khu vực màu xanh dương (Chỉ số Axit
            uric <strong>{'<'}150 µmol/L</strong>): Giá trị Axit uric của bạn
            hiện được phân loại <span>Thấp hơn bình thường.</span>
          </div>
        </div>
        <div>
          <span />
          <div>
            Nếu giá trị Axit uric nằm trong khu vực màu xanh lá (Chỉ số Axit
            uric nằm trong khoảng <strong>150 - 360 µmol/L</strong>): Giá trị
            Axit uric của bạn hiện được phân loại <span>Bình thường.</span>
          </div>
        </div>
        <div>
          <span />
          <div>
            Nếu giá trị Axit uric nằm trong khu vực màu cam (Chỉ số Axit uric{' '}
            <strong>{'>'} 360 µmol/L</strong>): Giá trị Axit uric của bạn hiện
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

const genderStyles = (type: number) => css`
  display: flex;
  align-items: center;
  font-weight: 700;
  margin-top: ${type === 1 ? 0 : '1.2rem'};
  gap: ${isMobile ? '0.4rem' : '0.8rem'};
  font-size: ${isMobile ? '1.6rem' : '1.8rem'};
`;

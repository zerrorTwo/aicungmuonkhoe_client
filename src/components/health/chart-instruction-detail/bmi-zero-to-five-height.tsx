/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import { isMobile } from 'react-device-detect';

export default function BMIDetailZeroToFiveHeight() {
    return (
        <div css={rootStyles}>
            <div css={itemStyles}>
                Các khoảng tham chiếu của{' '}
                <strong>biểu đồ theo dõi chiều dài/ chiều cao theo tuổi </strong>được
                căn cứ theo dữ liệu đánh giá tình trạng dinh dưỡng của trẻ em cho lứa
                tuổi từ sơ sinh đến dưới 5 tuổi dựa vào Z-Score của Tổ chức Y tế Thế
                giới (WHO) và dựa theo tư vấn của Trường Đại học Y tế Công cộng. Cách
                thức đọc biểu đồ theo dõi chiều dài/ chiều cao theo tuổi như sau:
            </div>
            <div css={itemStyles}>
                Biểu đồ theo dõi chiều dài theo tuổi có trục tung (trục thẳng đứng) là
                giá trị chiều dài của trẻ (đơn vị centimet) và trục hoành (trục nằm
                ngang) thể hiện số tháng tuổi của trẻ. Với mỗi giá trị chiều dài/chiều
                cao và tháng tuổi của trẻ tại một thời điểm, biểu đồ sẽ hiển thị một
                điểm trên lưới tăng trưởng của biểu đồ. Các điểm này khi nối với nhau sẽ
                tạo thành đường đồ thị thể hiện xu thế tăng trưởng của trẻ.
            </div>
            <div css={itemStyles}>
                Vị trí của những điểm biểu thị trạng thái tăng trưởng của trẻ so với
                đường trung bình và z-score sẽ có ý nghĩa như sau:
            </div>
            <div css={basicGuideInfoStyles}>
                <div>
                    <span />
                    <div>
                        <strong>Dưới -3SD</strong> (viết tắt -3 trên biểu đồ): Bé bị{' '}
                        <span>Suy dinh dưỡng thấp còi, mức độ nặng.</span>
                    </div>
                </div>
                <div>
                    <span />
                    <div>
                        <strong>Từ -3SD đến -2SD</strong> (viết tắt -3 đến -2 trên biểu đồ):
                        Bé bị <span>Suy dinh dưỡng thấp còi.</span>
                    </div>
                </div>
                <div>
                    <span />
                    <div>
                        <strong>Từ -2SD đến 2SD</strong> (viết tắt -2 đến 2 trên biểu đồ):
                        Bé phát triển <span> Chiều cao/chiều dài bình thường.</span>
                    </div>
                </div>
                <div>
                    <span />
                    <div>
                        <strong>Từ 2SD đến 3SD</strong> (viết tắt 2 đến 3 trên biểu đồ): Bé
                        phát triển <span>Chiều cao/chiều dài cao hơn so với chuẩn.</span>
                    </div>
                </div>
                <div>
                    <span />
                    <div>
                        <strong>Trên 3SD</strong> (viết tắt 3 trên biểu đồ): Bé phát triển{' '}
                        <span>Chiều cao/chiều dài rất cao, cao hơn so với chuẩn, cần cho trẻ đi khám để kiểm tra về rối loạn nội tiết.</span>
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
      background-color: #fecf8bcc;
    }

    &:nth-of-type(2) > div > span {
      color: #fd9602;
      font-weight: 700;
    }

    &:nth-of-type(3) > span {
      background-color: #99e18ccc;
    }

    &:nth-of-type(3) > div > span {
      color: #4cca35;
      font-weight: 700;
    }

    &:nth-of-type(4) > span {
      background-color: #faa781cc;
    }

    &:nth-of-type(4) > div > span {
      color: #f5540a;
      font-weight: 700;
    }

    &:nth-of-type(5) > span {
      background-color: #eb5447cc;
    }

    &:nth-of-type(5) > div > span {
      color: #e52a1a;
      font-weight: 700;
    }
  }
`;

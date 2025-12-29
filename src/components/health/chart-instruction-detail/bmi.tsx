/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import { isMobile } from 'react-device-detect';

export default function BMIDetail() {
    return (
        <div css={rootStyles}>
            <div css={sectionStyles}>
                <h3>Chỉ số BMI là gì?</h3>
                <p>
                    BMI (Body Mass Index - Chỉ số khối cơ thể) là một chỉ số đánh giá mức độ
                    cân nặng phù hợp với chiều cao của cơ thể. BMI được tính bằng công thức:
                </p>
                <div css={formulaStyles}>
                    BMI = Cân nặng (kg) / [Chiều cao (m)]²
                </div>
            </div>

            <div css={sectionStyles}>
                <h3>Phân loại BMI theo WHO (Người lớn)</h3>
                <table css={tableStyles}>
                    <thead>
                        <tr>
                            <th>Phân loại</th>
                            <th>BMI (kg/m²)</th>
                            <th>Nguy cơ sức khỏe</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>Gầy</td>
                            <td>&lt; 18.5</td>
                            <td>Tăng nguy cơ suy dinh dưỡng</td>
                        </tr>
                        <tr>
                            <td>Bình thường</td>
                            <td>18.5 - 24.9</td>
                            <td>Thấp</td>
                        </tr>
                        <tr>
                            <td>Thừa cân</td>
                            <td>25.0 - 29.9</td>
                            <td>Tăng nhẹ</td>
                        </tr>
                        <tr>
                            <td>Béo phì độ I</td>
                            <td>30.0 - 34.9</td>
                            <td>Tăng vừa</td>
                        </tr>
                        <tr>
                            <td>Béo phì độ II</td>
                            <td>35.0 - 39.9</td>
                            <td>Tăng cao</td>
                        </tr>
                        <tr>
                            <td>Béo phì độ III</td>
                            <td>≥ 40.0</td>
                            <td>Rất cao</td>
                        </tr>
                    </tbody>
                </table>
            </div>

            <div css={sectionStyles}>
                <h3>Phân loại BMI cho trẻ em và thanh thiếu niên</h3>
                <p>
                    Đối với trẻ em và thanh thiếu niên (dưới 19 tuổi), BMI được đánh giá
                    dựa trên biểu đồ tăng trưởng theo độ tuổi và giới tính, sử dụng các
                    đường cong phân vị (percentile) của WHO.
                </p>
                <ul>
                    <li><strong>Gầy:</strong> BMI &lt; phân vị thứ 5</li>
                    <li><strong>Bình thường:</strong> BMI từ phân vị thứ 5 đến &lt; phân vị thứ 85</li>
                    <li><strong>Thừa cân:</strong> BMI từ phân vị thứ 85 đến &lt; phân vị thứ 95</li>
                    <li><strong>Béo phì:</strong> BMI ≥ phân vị thứ 95</li>
                </ul>
            </div>

            <div css={sectionStyles}>
                <h3>Lưu ý khi sử dụng BMI</h3>
                <ul>
                    <li>BMI không phân biệt giữa khối lượng mỡ và khối lượng cơ</li>
                    <li>Vận động viên có thể có BMI cao do khối lượng cơ lớn</li>
                    <li>Người cao tuổi có thể có BMI thấp hơn do mất khối lượng cơ</li>
                    <li>BMI chỉ là một trong nhiều chỉ số đánh giá sức khỏe</li>
                    <li>Nên kết hợp với các chỉ số khác như vòng eo, tỷ lệ mỡ cơ thể</li>
                </ul>
            </div>

            <div css={sectionStyles}>
                <h3>Cách đọc biểu đồ BMI</h3>
                <ul>
                    <li>Trục ngang (X): Thời gian ghi nhận chỉ số</li>
                    <li>Trục dọc (Y): Giá trị BMI (kg/m²)</li>
                    <li>Màu sắc điểm dữ liệu thể hiện phân loại BMI</li>
                    <li>Đường nối giữa các điểm cho thấy xu hướng thay đổi BMI theo thời gian</li>
                </ul>
            </div>
        </div>
    );
}

const rootStyles = css`
  font-family: 'Roboto', sans-serif;
  line-height: 1.6;
`;

const sectionStyles = css`
  margin-bottom: ${isMobile ? '1.6rem' : '2.4rem'};

  h3 {
    font-size: ${isMobile ? '1.6rem' : '2rem'};
    font-weight: 700;
    color: #138678;
    margin-bottom: ${isMobile ? '0.8rem' : '1.2rem'};
  }

  p {
    font-size: ${isMobile ? '1.4rem' : '1.6rem'};
    margin-bottom: ${isMobile ? '0.8rem' : '1.2rem'};
    color: #333;
  }

  ul {
    padding-left: ${isMobile ? '2rem' : '2.4rem'};
    
    li {
      font-size: ${isMobile ? '1.4rem' : '1.6rem'};
      margin-bottom: ${isMobile ? '0.4rem' : '0.8rem'};
      color: #333;
    }
  }
`;

const formulaStyles = css`
  background-color: #f5f5f5;
  padding: ${isMobile ? '1.2rem' : '1.6rem'};
  border-radius: 0.8rem;
  text-align: center;
  font-size: ${isMobile ? '1.6rem' : '2rem'};
  font-weight: 600;
  color: #138678;
  margin: ${isMobile ? '1.2rem 0' : '1.6rem 0'};
`;

const tableStyles = css`
  width: 100%;
  border-collapse: collapse;
  margin-top: ${isMobile ? '1.2rem' : '1.6rem'};
  font-size: ${isMobile ? '1.2rem' : '1.4rem'};

  th, td {
    border: 1px solid #ddd;
    padding: ${isMobile ? '0.8rem' : '1.2rem'};
    text-align: left;
  }

  th {
    background-color: #138678;
    color: white;
    font-weight: 600;
  }

  tbody tr:nth-of-type(even) {
    background-color: #f9f9f9;
  }

  tbody tr:hover {
    background-color: #f0f0f0;
  }
`;

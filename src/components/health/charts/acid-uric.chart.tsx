/** @jsxImportSource @emotion/react */
import { SIMPLE_DATE_FORMAT } from '@/constants/common.constant';
import type { Conclusion } from '@/types/health';
import { getMaxValue } from '@/utils/health';
import { css } from '@emotion/react';
import dayjs from 'dayjs';
import type {
  CustomSeriesRenderItemAPI,
  CustomSeriesRenderItemParams,
  EChartsOption
} from 'echarts';
import ReactECharts from 'echarts-for-react';
import { useEffect, useMemo, useRef, useState } from 'react';
import { isMobile } from 'react-device-detect';
// Removed: import { useAppSelector } from '@/store/hooks';
import {
  convertDecimalDotToComma,
  createSteppedArray,
  fillDatesToTwelve
} from '@/utils/common';

type AcidUricChartProps = {
  loading: boolean;
  conclusionList: Conclusion[];
  hiddenRange?: boolean;
  gender?: 'nam' | 'nu'; // Added gender prop
};

export default function AcidUricChart({
  loading,
  conclusionList,
  hiddenRange,
  gender = 'nam' // Default to male
}: AcidUricChartProps) {

  const eChartsRef = useRef<ReactECharts | null>(null);
  const [chartWidth, setChartWidth] = useState(0);
  const [startIndex, setStartIndex] = useState(0);

  // Removed gender calculation from Redux state
  // const gender = useMemo(() => {
  //   return getGender(healthDocument);
  // }, [healthDocument]);

  const rangeDate = useMemo(() => {
    if (!Array.isArray(conclusionList)) {
      return fillDatesToTwelve([]);
    }

    const actualDates = conclusionList.map((item) =>
      dayjs(item.date).format(SIMPLE_DATE_FORMAT)
    );

    const filledDates = fillDatesToTwelve(actualDates);

    const actualDatesSet = new Set(actualDates);

    return filledDates.map((date) => {
      return actualDatesSet.has(date) ? date : '';
    });
  }, [conclusionList]);

  const data = useMemo(() => {
    if (!conclusionList || !conclusionList.length) {
      return [];
    }
    return conclusionList.map((item) => item.value);
  }, [conclusionList]);

  const dataWithEmpty = useMemo(() => {
    if (!Array.isArray(conclusionList)) {
      return rangeDate.map(() => null);
    }

    return rangeDate.map((date) => {
      if (date === '') {
        return null;
      }

      const item = conclusionList.find(
        (d) => dayjs(d.date).format(SIMPLE_DATE_FORMAT) === date
      );

      return item ? item : null;
    });
  }, [conclusionList, rangeDate]);

  useEffect(() => {
    if (eChartsRef.current) {
      const chartInstance = eChartsRef.current.getEchartsInstance();
      setChartWidth(chartInstance.getWidth());
    }
  }, []);

  useEffect(() => {
    if (eChartsRef.current) {
      const chartInstance = eChartsRef.current.getEchartsInstance();
      if (loading) {
        chartInstance.showLoading('default', {
          text: '',
          color: '#c23531',
          maskColor: 'rgba(255, 255, 255, 0.8)',
          zlevel: 0
        });
      } else {
        chartInstance.hideLoading();
      }
    }
  }, [loading]);

  useEffect(() => {
    setStartIndex(Math.max(0, (conclusionList?.length ?? 0) - 12));
  }, [conclusionList?.length]);

  const handleZoomChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newStartIndex = Number(event.target.value);
    setStartIndex(newStartIndex);
  };

  const yAxisGridLineData = useMemo(() => {
    return createSteppedArray(0, getMaxValue(data, 50, 500, 50), 50);
  }, [data]);

  const option: EChartsOption = {
    tooltip: {
      confine: true,
      trigger: 'item',
      axisPointer: {
        type: 'none'
      },
      formatter: function (params: any) {
        return `
              <div style="font-family: 'Roboto'; color: #333; font-size: ${isMobile ? '12px' : '18px'}; line-height: 140%;">
                  <div>Axit uric: <span style="font-weight: 700;">${convertDecimalDotToComma(params.data.value, 1)} µmol/L</span></div>
              </div>`;
      },
      // < div > Mức: < span style = "color: ${params.data.color}; font-weight: 700;" > ${ params.data.type }</span></div >
      borderColor: '#13ECD2',
      borderWidth: 2,
      borderRadius: 8,
      position: function (_point, _params, _dom, rect, size) {
        const [tooltipW, tooltipH] = size.contentSize;
        const [chartW] = size.viewSize;

        const plotLeft = isMobile ? 60 : 110;
        const plotRight = isMobile ? 5 : 10;
        const plotWidth = chartW - plotLeft - plotRight;

        let x = rect!.x + rect!.width / 2 - tooltipW / 2;
        x = Math.max(plotLeft, Math.min(x, plotLeft + plotWidth - tooltipW));

        const y = rect!.y - tooltipH - 30;
        return [x, y];
      }
    },
    xAxis: {
      type: 'category',
      data: rangeDate,
      boundaryGap: true,
      axisLabel: {
        interval: 0,
        rotate: isMobile ? 45 : 0,
        fontFamily: 'Roboto',
        fontSize: isMobile ? 10 : 16,
        fontWeight: 500
      },
      axisTick: {
        show: false
      },
      name: 'Ngày/tháng/năm',
      nameLocation: 'middle',
      nameTextStyle: {
        fontSize: isMobile ? 14 : 18,
        fontWeight: 'bold',
        color: '#138678',
        fontFamily: 'Roboto',
        padding: [0, 0, 0, chartWidth - (isMobile ? 175 : 275)]
      },
      nameGap: hiddenRange ? 38 : isMobile ? 56 : 52
    },
    yAxis: {
      type: 'value',
      min: 0,
      max: getMaxValue(data, 50, 500, 50),
      interval: 50,
      axisLine: {
        show: true
      },
      axisLabel: {
        fontFamily: 'Roboto',
        fontSize: isMobile ? 14 : 18,
        fontWeight: 500
      },
      name: 'Chỉ số Axit uric (µmol/L)',
      nameLocation: 'middle',
      nameTextStyle: {
        fontSize: isMobile ? 14 : 32,
        fontWeight: 'bold',
        color: '#138678',
        fontFamily: 'Roboto'
      },
      nameGap: isMobile ? 34 : 58
    },
    grid: {
      left: isMobile ? 55 : 100,
      top: 20,
      right: 16
    },
    series: [
      {
        data: dataWithEmpty,
        type: 'line',
        lineStyle: {
          color: '#9747ff',
          width: 2
        },
        itemStyle: {
          color: '#9747ff',
          borderColor: '#fff',
          borderWidth: 2
        },
        symbol: 'circle',
        symbolSize: isMobile ? 8 : 16,
        label: {
          show: true,
          position: 'top',
          color: '#000',
          fontSize: isMobile ? 8 : 18,
          fontWeight: 700,
          formatter: function (value: any) {
            return convertDecimalDotToComma(value.data.value, 1);
          },
          fontFamily: 'Roboto',
          offset: [0, 5]
        },
        markArea: {
          silent: true,
          data: [
            [
              {
                yAxis: 0,
                itemStyle: { color: '#bfe3f5' },
                label: {
                  show: true,
                  position: 'insideRight',
                  color: '#829da9',
                  fontSize: isMobile ? 12 : 18,
                  formatter: 'Thấp hơn bình thường',
                  fontFamily: 'Roboto',
                  offset: [0, 7]
                }
              },
              {
                yAxis: gender === 'nam' ? 180 : 150
              }
            ],
            [
              {
                yAxis: gender === 'nam' ? 180 : 150,
                itemStyle: { color: '#bae5aa' },
                label: {
                  show: true,
                  position: 'insideRight',
                  color: '#829da9',
                  fontSize: isMobile ? 12 : 18,
                  formatter: 'Bình thường',
                  fontFamily: 'Roboto',
                  offset: [0, -5]
                }
              },
              {
                yAxis: gender === 'nam' ? 420 : 360
              }
            ],
            [
              {
                yAxis: gender === 'nam' ? 420 : 360,
                itemStyle: { color: '#f8daa9' },
                label: {
                  show: true,
                  position: 'insideRight',
                  color: '#829da9',
                  fontSize: isMobile ? 12 : 18,
                  formatter: 'Cao hơn bình thường',
                  fontFamily: 'Roboto'
                }
              },
              {
                yAxis: getMaxValue(data, 50, 500, 50)
              }
            ]
          ]
        }
      },
      {
        type: 'custom',
        renderItem: function (
          params: CustomSeriesRenderItemParams,
          api: CustomSeriesRenderItemAPI
        ) {
          const xValue = api.value(0);
          const coord = api.coord([xValue, 0]);
          const coordSys: any = params.coordSys;

          return {
            type: 'line',
            shape: {
              x1: coord[0],
              y1: coordSys.y,
              x2: coord[0],
              y2: coordSys.y + coordSys.height
            },
            style: {
              stroke: '#d6d6d6',
              lineWidth: 1,
              lineDash: [4, 4]
            },
            z: 0
          };
        },
        data: rangeDate.map((_date, index) => [index]),
        silent: true,
        z: 1
      },
      {
        type: 'custom',
        renderItem: function (
          params: CustomSeriesRenderItemParams,
          api: CustomSeriesRenderItemAPI
        ) {
          const point = api.value(0) as any;
          const coord = api.coord([0, point.value]);
          const coordSys: any = params.coordSys;

          if (point.index === 0 || point.index === point.total - 1) {
            return null;
          }

          return {
            type: 'line',
            shape: {
              x1: coordSys.x,
              y1: coord[1],
              x2: coordSys.x + coordSys.width,
              y2: coord[1]
            },
            style: {
              stroke: '#d6d6d6',
              lineWidth: 1,
              lineDash: [4, 4]
            },
            z: 0
          };
        },
        data: yAxisGridLineData.map((value, index) => [
          {
            value,
            index,
            total: yAxisGridLineData.length
          }
        ]),
        silent: true,
        z: 1
      }
    ],
    dataZoom: [
      {
        show: false,
        start: (startIndex / (conclusionList?.length ?? 1)) * 100,
        end: ((startIndex + 12) / (conclusionList?.length ?? 1)) * 100
      }
    ]
  };

  return (
    <div>
      <ReactECharts
        option={option}
        style={{
          borderTopLeftRadius: '1.6rem',
          borderTopRightRadius: '1.6rem',
          overflow: 'hidden',
          height: isMobile ? '30rem' : '40rem'
        }}
        ref={eChartsRef}
      />
      {!(hiddenRange || data.length <= 12) && (
        <div css={rangeStyles(chartWidth)}>
          <input
            type='range'
            min={0}
            max={(conclusionList?.length ?? 0) - 12}
            step={1}
            onChange={handleZoomChange}
          />
          <span>Kéo để xem thêm chỉ số trên biểu đồ</span>
        </div>
      )}
    </div>
  );
}

const rangeStyles = (chartWidth: number) => css`
  background-color: var(--white-color);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-end;
  padding-top: ${isMobile ? '0.8rem' : '1.6rem'};
  padding-right: 1.6rem;

  input {
    appearance: none;
    width: ${chartWidth - 72}px;
    height: ${isMobile ? '0.3rem' : '0.8rem'};
    background: #ddd;
    border-radius: 5px;
    outline: none;
    padding: 0;
    margin: 0;
    background: var(--primary-color);

    &::-webkit-slider-thumb {
      appearance: none;
      width: ${isMobile ? '2.4rem' : '8rem'};
      height: ${isMobile ? '1.2rem' : '2.4rem'};
      background: var(--primary-color);
      border-radius: 10rem;
      cursor: pointer;
    }

    &::-moz-range-thumb {
      appearance: none;
      width: 2.4rem;
      height: 1.2rem;
      background: var(--primary-color);
      border-radius: 10rem;
      cursor: pointer;
    }
  }

  span {
    padding-top: ${isMobile ? '0.6rem' : '1.6rem'};
    text-align: right;
    font-style: italic;
    font-size: ${isMobile ? '1rem' : '1.8rem'};
  }
`;

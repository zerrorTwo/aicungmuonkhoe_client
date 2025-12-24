import { SIMPLE_DATE_FORMAT } from '@/constants/common.constant';
import type { Conclusion } from '@/types/health';
import { createSteppedArray, fillDatesToTwelve } from '@/utils/common';
import { getMaxValue } from '@/utils/health';
import { css } from '@emotion/react';
import dayjs from 'dayjs';
import type { EChartsOption } from 'echarts';
import ReactECharts from 'echarts-for-react';
import React, {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
  useState
} from 'react';
import { isMobile } from 'react-device-detect';
import { BloodPressureTabs } from '@/enum/health';

type BloodPressureChartProps = {
  loading: boolean;
  type: BloodPressureTabs;
  conclusionList: Conclusion[];
  hiddenRange?: boolean;
};

const BloodPressureChart = forwardRef(
  ({ loading, conclusionList, hiddenRange }: BloodPressureChartProps, ref) => {
    const eChartsRef = useRef<ReactECharts | null>(null);
    const [chartWidth, setChartWidth] = useState(0);
    const [startIndex, setStartIndex] = useState(0);

    const rangeDate = useMemo(() => {
      if (!Array.isArray(conclusionList)) {
        return fillDatesToTwelve([]);
      }

      const actualDates = conclusionList.map((item) =>
        dayjs(item.date).format(SIMPLE_DATE_FORMAT)
      );
      const actualDatesSet = new Set(actualDates);

      const filledDates = fillDatesToTwelve(actualDates).map((date) => {
        return actualDatesSet.has(date) ? date : ``;
      });

      return filledDates;
    }, [conclusionList]);

    const chartData = useMemo(() => {
      if (!conclusionList || !Array.isArray(conclusionList)) {
        return [];
      }

      const actualDates = conclusionList.map((item) =>
        dayjs(item.date).format(SIMPLE_DATE_FORMAT)
      );
      const filledDates = fillDatesToTwelve(actualDates);

      const dataMap = new Map();
      conclusionList.forEach((item) => {
        const dateKey = dayjs(item.date).format(SIMPLE_DATE_FORMAT);
        dataMap.set(dateKey, item);
      });

      return filledDates.map((date) => {
        return dataMap.get(date) || null;
      });
    }, [conclusionList]);

    const upperLimitData = useMemo(() => {
      return chartData.map((item) =>
        item ? { item, value: item.valueSys } : { item: null, value: null }
      );
    }, [chartData]);

    const lowerLimitData = useMemo(() => {
      return chartData.map((item) =>
        item ? { item, value: item.valueDia } : { item: null, value: null }
      );
    }, [chartData]);

    const barData = useMemo(() => {
      return upperLimitData.map((upperLimit, index) => {
        const lowerLimit = lowerLimitData[index];
        return {
          value: upperLimit.value - lowerLimit.value,
          item: upperLimit.item,
          itemStyle: {
            color: upperLimit?.item?.color || 'var(--primary-color)'
          }
        };
      });
    }, [lowerLimitData, upperLimitData]);

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

    useImperativeHandle(ref, () => ({
      exportChart: () => {
        if (eChartsRef.current) {
          const echartInstance =
            eChartsRef.current.getEchartsInstance() as any;
          const image = echartInstance.getDataURL({
            type: 'png',
            pixelRatio: 2,
            backgroundColor: '#fff'
          });

          return image;
        }
      }
    }));

    const yAxisGridLineData = useMemo(() => {
      return createSteppedArray(
        40,
        getMaxValue(
          upperLimitData.map((item) => item.value),
          20,
          200,
          20
        ),
        20
      );
    }, [upperLimitData]);

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
                <div>Huyết áp: <span style="font-weight: 700;">${params.data.item.valueSys}/${params.data.item.valueDia} mmHg</span></div>
            </div>`;
        },
        // < div > Mức: < span style = "color: ${params.data.item.color}; font-weight: 700;" > ${ params.data.item.type }</span></div >
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
      backgroundColor: '#fff',
      yAxis: {
        type: 'value',
        min: 40,
        max: getMaxValue(
          upperLimitData.map((item) => item.value),
          20,
          200,
          20
        ),
        interval: 20,
        axisLine: {
          show: true
        },
        axisLabel: {
          fontFamily: 'Roboto',
          fontSize: isMobile ? 14 : 18,
          fontWeight: 500
        },
        name: 'Chỉ số Huyết áp (mmHg)',
        nameLocation: 'middle',
        nameTextStyle: {
          fontSize: isMobile ? 14 : 32,
          fontWeight: 'bold',
          color: '#138678',
          fontFamily: 'Roboto'
        },
        nameGap: isMobile ? 34 : 50
      },
      grid: {
        left: isMobile ? 55 : 100,
        top: 20,
        right: 16
      },
      series: [
        {
          name: 'Giới hạn trên',
          type: 'line',
          data: upperLimitData,
          smooth: true,
          lineStyle: {
            color: 'gray',
            width: 1
          },
          symbol: 'none',
          silent: true
        },
        {
          type: 'bar',
          stack: 'pressure',
          silent: true,
          label: {
            show: true,
            position: 'end',
            padding: [6, 0, 0, 0],
            fontWeight: 700,
            fontSize: isMobile ? 8 : 18
          },
          itemStyle: {
            borderColor: 'transparent',
            color: 'transparent'
          },
          emphasis: {
            itemStyle: {
              borderColor: 'transparent',
              color: 'transparent'
            }
          },
          data: lowerLimitData
        },
        {
          name: 'Huyết áp',
          type: 'bar',
          stack: 'pressure',
          label: {
            show: true,
            position: 'top',
            formatter: function (params) {
              const value = params.value as number;
              const index = params.dataIndex;
              return `${value + lowerLimitData[index].value}`;
            },
            fontWeight: 700,
            fontSize: isMobile ? 8 : 18,
            padding: [0, 0, -3, 0]
          },
          itemStyle: {
            borderRadius: 10
          },
          barWidth: hiddenRange ? 18 : isMobile ? 12 : 24,
          data: barData
        },
        {
          silent: true,
          name: 'Giới hạn dưới',
          type: 'line',
          data: lowerLimitData,
          smooth: true,
          lineStyle: {
            color: 'gray',
            width: 1
          },
          symbol: 'none'
        },
        {
          type: 'custom',
          renderItem: function (params, api) {
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
          z: 0
        },
        {
          type: 'custom',
          renderItem: function (params, api) {
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
          z: 0
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
            borderBottomLeftRadius: hiddenRange ? '1.6rem' : 0,
            borderBottomRightRadius: hiddenRange ? '1.6rem' : 0,
            overflow: 'hidden',
            height: hiddenRange ? '30rem' : isMobile ? '30rem' : '40rem',
            width: '100%'
          }}
          ref={eChartsRef}
        />
        {!(hiddenRange || (conclusionList?.length ?? 0) <= 12) && (
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
);

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

export default BloodPressureChart;

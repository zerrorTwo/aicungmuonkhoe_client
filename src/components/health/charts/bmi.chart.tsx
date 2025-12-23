/** @jsxImportSource @emotion/react */
import { useEffect, useMemo, useRef, useState } from 'react';
import { css } from '@emotion/react';
import ReactECharts from 'echarts-for-react';
import type {
  CustomSeriesRenderItemAPI,
  CustomSeriesRenderItemParams,
  EChartsOption
} from 'echarts';
import logoWHO from '@/assets/images/WHO-logo.png';
import { BMIAgeRange, BMIChildrenTabs } from '@/enum/health';
import {
  calculateBMI,
  calculateExactMonthAge012,
  filterBMIWeightHeightValues,
  getBMIDataByAge,
  getBMIWeightHeightMinMax,
  getGender,
  getHeightDataByAge,
  getMaxValue,
  getMaxXValueBMIWeightHeightChart,
  getWeightDataByAge
} from '@/utils/health';
import {
  BMI_CHART_COLOR,
  BMI_FEMALE_BY_AGE,
  BMI_LINE_COLOR,
  BMI_MALE_BY_AGE,
  HEIGHT_FEMALE_BY_AGE,
  HEIGHT_MALE_BY_AGE,
  WEIGHT_FEMALE_BY_AGE,
  WEIGHT_FEMALE_BY_HEIGHT,
  WEIGHT_MALE_BY_AGE,
  WEIGHT_MALE_BY_HEIGHT
} from '@/constants/health.constant';
import dayjs from 'dayjs';
import { DATE_FORMAT, SIMPLE_DATE_FORMAT } from '@/constants/common.constant';
import { isMobile } from 'react-device-detect';
import { useAppSelector } from '@/store/hooks';
import { watchGetSelfAccountState } from '@/store/slices/self-managed-account.slice';
import type { Conclusion } from '@/types/health';
import {
  convertDecimalDotToComma,
  createSteppedArray,
  fillDatesToTwelve,
  rangeByStep,
  roundDownToNearest5
} from '@/utils/common';

type BMIChartProps = {
  loading: boolean;
  ageRange?: BMIAgeRange;
  age: number;
  activeTab: BMIChildrenTabs;
  conclusionList: Conclusion[];
  hiddenRange?: boolean;
};

export default function BMIChart({
  loading,
  ageRange,
  age,
  activeTab,
  conclusionList,
  hiddenRange
}: BMIChartProps) {
  const healthDocument = useAppSelector(watchGetSelfAccountState);

  const eChartsRef = useRef<ReactECharts | null>(null);
  const [chartWidth, setChartWidth] = useState(0);
  const [startIndex, setStartIndex] = useState(0);
  const [chartOption, setChartOption] = useState<EChartsOption>({});
  const [chartKey, setChartKey] = useState(0);

  const gender = useMemo(() => {
    return getGender(healthDocument);
  }, [healthDocument]);

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

  const data = useMemo(() => {
    if (!conclusionList || !conclusionList?.length) {
      return [];
    }

    if (ageRange === BMIAgeRange.FROM_0_LESS_THAN_5) {
      if (activeTab === BMIChildrenTabs.Height) {
        return conclusionList.map((item) => ({
          ...item,
          value: item.valueHeight
        }));
      }

      if (
        activeTab === BMIChildrenTabs.Weight ||
        activeTab === BMIChildrenTabs.WeightHeight
      ) {
        return conclusionList.map((item) => ({
          ...item,
          value: item.valueWeight
        }));
      }
    }

    return conclusionList.map((item) => {
      const weight = item?.valueWeight ?? 0;
      const height = item.valueHeight ?? 0;
      const bmi = weight && height ? calculateBMI(weight, height) : '0';
      return {
        ...item,
        value: isFinite(+bmi) ? +bmi : 0
      };
    });
  }, [activeTab, ageRange, conclusionList]);

  const chartData = useMemo(() => {
    if (
      ageRange === BMIAgeRange.FROM_0_LESS_THAN_5 &&
      activeTab === BMIChildrenTabs.WeightHeight
    ) {
      const grouped = filterBMIWeightHeightValues(data);

      return grouped
        .map((item) => ({ ...item, value: [item.valueHeight, item.value] }))
        .sort((a, b) => a.value[0] - b.value[0]);
    }

    if (
      ageRange !== BMIAgeRange.FROM_20_LESS_THEN_70 &&
      ageRange !== BMIAgeRange.EQUAL_MORE_THAN_70
    ) {
      if (healthDocument?.dob) {
        const grouped = data.reduce((acc: Map<number, any>, item) => {
          const ageMonth = calculateExactMonthAge012(
            healthDocument.dob!,
            item.date!
          );

          const startMonth = startIndex * 12;
          const endMonth = (startIndex + 1) * 12 + 1;

          if (ageMonth < startMonth || ageMonth >= endMonth) {
            return acc;
          }

          const relativeMonth = ageMonth - startMonth;
          const existing = acc.get(relativeMonth);

          if (!existing || dayjs(item.date).isAfter(dayjs(existing.date))) {
            acc.set(relativeMonth, item);
          }
          return acc;
        }, new Map());

        return Array.from(grouped.entries())
          .map(([relativeMonth, item]) => ({
            ...item,
            value: [relativeMonth, item.value]
          }))
          .sort((a, b) => a.value[0] - b.value[0]);
      }
    }

    return data;
  }, [activeTab, ageRange, data, healthDocument?.dob, startIndex]);

  const chartDataWithEmpty = useMemo(() => {
    return rangeDate.map((date) => {
      if (date === '') {
        return null;
      }

      const item = chartData.find(
        (d) => dayjs(d.date).format(SIMPLE_DATE_FORMAT) === date
      );

      return item ? item : null;
    });
  }, [chartData, rangeDate]);

  const { min, max } = getBMIWeightHeightMinMax(chartData);

  const dataByAge = useMemo(() => {
    if (
      ageRange === BMIAgeRange.FROM_0_LESS_THAN_5 ||
      ageRange === BMIAgeRange.FROM_0_LESS_THAN_2 ||
      ageRange === BMIAgeRange.FROM_2_LESS_THAN_5
    ) {
      switch (activeTab) {
        case BMIChildrenTabs.Weight:
          return getWeightDataByAge(gender, startIndex);
        case BMIChildrenTabs.Height:
          return getHeightDataByAge(gender, startIndex);
        case BMIChildrenTabs.WeightHeight:
          return getBMIDataByAge(gender, startIndex);
      }
    }

    return getBMIDataByAge(gender, startIndex);
  }, [activeTab, ageRange, gender, startIndex]);

  const xAxisLength = useMemo(() => {
    switch (ageRange) {
      case BMIAgeRange.FROM_0_LESS_THAN_5: {
        if (activeTab === BMIChildrenTabs.WeightHeight) {
          return (
            Math.floor(
              (getMaxXValueBMIWeightHeightChart(min, max) -
                roundDownToNearest5(min)) /
              5
            ) + 1
          );
        }

        return 13;
      }
      case BMIAgeRange.FROM_5_LESS_THAN_12:
      case BMIAgeRange.FROM_12_LESS_THAN_20:
        return 13;
      default:
        return conclusionList?.length;
    }
  }, [activeTab, ageRange, conclusionList?.length, max, min]);

  const xAxisLimit = useMemo(() => {
    if (
      ageRange === BMIAgeRange.FROM_0_LESS_THAN_5 &&
      activeTab !== BMIChildrenTabs.WeightHeight
    ) {
      return 13;
    }

    if (
      ageRange === BMIAgeRange.FROM_5_LESS_THAN_12 ||
      ageRange === BMIAgeRange.FROM_12_LESS_THAN_20
    ) {
      return 13;
    }

    return 12;
  }, [activeTab, ageRange]);

  const xAxis = useMemo(() => {
    switch (ageRange) {
      case BMIAgeRange.FROM_0_LESS_THAN_5: {
        return {
          boundaryGap: false,
          type:
            activeTab === BMIChildrenTabs.WeightHeight ? 'value' : 'category',
          data: Array.from({ length: xAxisLength }, (_, i) => {
            if (activeTab === BMIChildrenTabs.WeightHeight) {
              return i * 5 + Math.floor(min / 5) * 5;
            }

            return i;
          }),
          min:
            activeTab === BMIChildrenTabs.WeightHeight
              ? roundDownToNearest5(min)
              : undefined,
          max:
            activeTab === BMIChildrenTabs.WeightHeight
              ? getMaxXValueBMIWeightHeightChart(min, max)
              : undefined,
          interval: 5,
          minInterval: 5,
          axisLine: {
            show: false
          },
          splitLine: {
            show: false
          },
          axisTick: {
            show: false
          },
          axisLabel: {
            fontFamily: 'Roboto',
            fontSize: isMobile ? 12 : 18,
            fontWeight: 500,
            interval: 0,
            formatter: function (value: number) {
              if (activeTab === BMIChildrenTabs.WeightHeight) {
                return value;
              } else {
                if (Number(value) === 0) return `{ bold | ${startIndex} tuổi } `;
                if (Number(value) === 12)
                  return `{ bold | ${startIndex + 1} tuổi } `;
              }

              return value;
            },
            rich: {
              bold: {
                fontFamily: 'Roboto',
                fontSize: isMobile ? 10 : 20,
                fontWeight: 'bold',
                color: '#000'
              }
            }
          },
          name:
            activeTab === BMIChildrenTabs.WeightHeight
              ? 'Chiều cao (cm)'
              : 'Tháng tuổi',
          nameLocation: 'middle',
          nameTextStyle: {
            fontSize: isMobile ? 14 : 18,
            fontWeight: 'bold',
            color: '#138678',
            fontFamily: 'Roboto',
            padding: [
              isMobile ? -25 : 0,
              0,
              0,
              chartWidth - (isMobile ? 140 : 200)
            ]
          },
          nameGap: isMobile ? 56 : 52
        };
      }
      case BMIAgeRange.FROM_5_LESS_THAN_12:
      case BMIAgeRange.FROM_12_LESS_THAN_20:
        return {
          boundaryGap: false,
          type: 'category',
          data: Array.from({ length: 13 }, (_, i) => i),
          axisLine: {
            show: true
          },
          splitLine: {
            show: false
          },
          axisTick: {
            show: false
          },
          axisLabel: {
            fontFamily: 'Roboto',
            fontSize: isMobile ? 12 : 18,
            fontWeight: 500,
            interval: 0,
            formatter: function (value: string) {
              if (Number(value) === 0) return `{ bold | ${startIndex} tuổi } `;
              if (Number(value) === 12) return `{ bold | ${startIndex + 1} tuổi } `;
              return value;
            },
            rich: {
              bold: {
                fontFamily: 'Roboto',
                fontSize: isMobile ? 10 : 20,
                fontWeight: 'bold',
                color: '#000'
              }
            }
          },

          name: 'Tháng tuổi',
          nameLocation: 'middle',
          nameTextStyle: {
            fontSize: isMobile ? 14 : 18,
            fontWeight: 'bold',
            color: '#138678',
            fontFamily: 'Roboto',
            padding: [
              isMobile ? -25 : 0,
              0,
              0,
              chartWidth - (isMobile ? 140 : 200)
            ]
          },
          nameGap: isMobile ? 56 : 52
        };
      case BMIAgeRange.FROM_20_LESS_THEN_70:
      case BMIAgeRange.EQUAL_MORE_THAN_70:
        return {
          type: 'category',
          data: rangeDate,
          boundaryGap: true,
          axisLabel: {
            interval: 0,
            rotate: isMobile ? 45 : 0,
            fontFamily: 'Roboto',
            fontSize: isMobile ? 10 : 20,
            fontWeight: 500
          },
          axisLine: {
            show: true
          },
          splitLine: {
            show: false
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
            padding: [
              isMobile ? 0 : 0,
              0,
              0,
              chartWidth - (isMobile ? 175 : 250)
            ]
          },
          nameGap: isMobile ? 56 : 52
        };
    }
  }, [
    activeTab,
    ageRange,
    chartWidth,
    max,
    min,
    rangeDate,
    xAxisLength,
    startIndex
  ]);

  const yAxisValue = useMemo(() => {
    switch (ageRange) {
      case BMIAgeRange.FROM_0_LESS_THAN_5: {
        if (activeTab === BMIChildrenTabs.WeightHeight) {
          return {
            min: 0,
            max: getMaxValue(
              chartData
                .map((item) => item.valueWeight)
                .filter((val) => typeof val === 'number' && isFinite(val)),
              2,
              32,
              5
            ),
            interval: 2
          };
        }

        if (activeTab === BMIChildrenTabs.Weight) {
          const weightValues = chartData
            .map((item) => item.valueWeight)
            .filter((val) => typeof val === 'number' && isFinite(val));
          return {
            min: 0,
            max: getMaxValue(weightValues, 2, 32, 5),
            interval: 2
          };
        }

        const heightValues = chartData
          .map((item) => item.valueHeight)
          .filter((val) => typeof val === 'number' && isFinite(val));
        return {
          min: 40,
          max: getMaxValue(heightValues, 5, 125, 5),
          interval: 5
        };
      }
      case BMIAgeRange.FROM_5_LESS_THAN_12:
      case BMIAgeRange.FROM_12_LESS_THAN_20:
        return {
          min: 10,
          max: dataByAge.length
            ? getMaxValue(
              chartData
                .map((item) => item.value[1])
                .filter((val) => typeof val === 'number' && isFinite(val)),
              2,
              38,
              15
            )
            : 30,
          interval: 2
        };
      case BMIAgeRange.FROM_20_LESS_THEN_70:
      case BMIAgeRange.EQUAL_MORE_THAN_70:
        return {
          min: 0,
          max: getMaxValue(
            chartData
              .map((item) => item.value)
              .filter((val) => typeof val === 'number' && isFinite(val)),
            5,
            50,
            15
          ),
          interval: 5
        };
      default:
        return {
          min: 0,
          max: getMaxValue(
            chartData
              .map((item) => item.value)
              .filter((val) => typeof val === 'number' && isFinite(val)),
            5,
            50,
            15
          ),
          interval: 5
        };
    }
  }, [activeTab, ageRange, chartData, dataByAge]);

  const backgroundData = useMemo(() => {
    if (
      ageRange === BMIAgeRange.FROM_0_LESS_THAN_5 ||
      ageRange === BMIAgeRange.FROM_5_LESS_THAN_12 ||
      ageRange === BMIAgeRange.FROM_12_LESS_THAN_20
    ) {
      return Array.from({ length: 6 }).map((_, index) => {
        let data: any[] = [];
        let markLineData: any[] = [];

        if (ageRange === BMIAgeRange.FROM_0_LESS_THAN_5) {
          switch (activeTab) {
            case BMIChildrenTabs.WeightHeight: {
              const rawData =
                gender === 'nam'
                  ? WEIGHT_MALE_BY_HEIGHT
                  : WEIGHT_FEMALE_BY_HEIGHT;

              data = rawData
                .filter((it) =>
                  rangeByStep(
                    min,
                    getMaxXValueBMIWeightHeightChart(min, max)
                  ).includes(it.key)
                )
                .map((item, idx) => {
                  return index === 5
                    ? [idx * 5 + Math.floor(min / 5) * 5, yAxisValue.max]
                    : [idx * 5 + Math.floor(min / 5) * 5, item.value[index]];
                });

              markLineData = [{ yAxis: data[data.length - 1][1] }];
              break;
            }
            case BMIChildrenTabs.Weight: {
              const rawData =
                gender === 'nam' ? WEIGHT_MALE_BY_AGE : WEIGHT_FEMALE_BY_AGE;
              data = rawData
                .filter((it) =>
                  Array.from(
                    { length: 13 },
                    (_, i) => i + startIndex * 12
                  ).includes(it.key)
                )
                .map((item, idx) => {
                  return index === 5
                    ? [idx, yAxisValue.max]
                    : [idx, item.value[index]];
                });

              markLineData = dataByAge.length
                ? [
                  {
                    yAxis:
                      index === 5
                        ? yAxisValue.max
                        : dataByAge[dataByAge.length - 1].value[index]
                  }
                ]
                : [];
              break;
            }
            case BMIChildrenTabs.Height: {
              const rawData =
                gender === 'nam' ? HEIGHT_MALE_BY_AGE : HEIGHT_FEMALE_BY_AGE;
              data = rawData
                .filter((it) =>
                  Array.from(
                    { length: 13 },
                    (_, i) => i + startIndex * 12
                  ).includes(it.key)
                )
                .map((item, idx) => {
                  return index === 5
                    ? [idx, yAxisValue.max]
                    : [idx, item.value[index]];
                });

              markLineData = dataByAge.length
                ? [
                  {
                    yAxis:
                      index === 5
                        ? yAxisValue.max
                        : dataByAge[dataByAge.length - 1].value[index]
                  }
                ]
                : [];
              break;
            }
          }
        } else if (
          ageRange === BMIAgeRange.FROM_5_LESS_THAN_12 ||
          ageRange === BMIAgeRange.FROM_12_LESS_THAN_20
        ) {
          const rawData =
            gender === 'nam' ? BMI_MALE_BY_AGE : BMI_FEMALE_BY_AGE;
          data = rawData
            .filter((it) =>
              Array.from(
                { length: 13 },
                (_, i) => i + startIndex * 12
              ).includes(it.key)
            )
            .map((item, idx) => {
              return index === 5
                ? [idx, yAxisValue.max]
                : [idx, item.value[index]];
            });
          markLineData = dataByAge.length
            ? [
              {
                yAxis:
                  index === 5
                    ? yAxisValue.max
                    : dataByAge[dataByAge.length - 1].value[index]
              }
            ]
            : [];
        } else {
          const rawData =
            gender === 'nam' ? BMI_MALE_BY_AGE : BMI_FEMALE_BY_AGE;

          data = rawData
            .filter((it) =>
              Array.from({ length: 13 }, (_, i) => 60 + i).includes(it.key)
            )
            .map((item, idx) => {
              return index === 5
                ? [idx, yAxisValue.max]
                : [idx, item.value[index]];
            });

          markLineData = dataByAge.length
            ? [
              {
                yAxis:
                  index === 5
                    ? yAxisValue.max
                    : dataByAge[dataByAge.length - 1].value[index]
              }
            ]
            : [];
        }
        return {
          type: 'line' as const,
          smooth: true,
          symbol: 'none',
          lineStyle: { color: BMI_LINE_COLOR[index], width: 1 },
          areaStyle: { color: BMI_CHART_COLOR[index] },
          data,
          z: 5 - index,
          markLine: {
            silent: true,
            symbol: ['none', 'none'],
            label: {
              show: true,
              position: 'end',
              formatter: function () {
                if (
                  ageRange === BMIAgeRange.FROM_5_LESS_THAN_12 ||
                  ageRange === BMIAgeRange.FROM_12_LESS_THAN_20
                ) {
                  if (index === 0) return -3;
                  if (index === 1) return -2;
                  if (index === 2) return '  0';
                  if (index === 3) return '  1';
                  if (index === 4) return '  2';
                } else {
                  if (index === 0) return -3;
                  if (index === 1) return -2;
                  if (index === 2) return ' 0';
                  if (index === 3) return '  2';
                  if (index === 4) return ' 3';
                }
              },
              fontWeight: 'bold',
              fontSize: isMobile ? 8 : 12,
              color: index === 5 ? 'rgba(0,0,0,0)' : BMI_LINE_COLOR[index]
            },
            lineStyle: {
              type: 'solid' as const,
              color: 'rgba(0,0,0,0)'
            },
            data: markLineData
          }
        };
      });
    }

    return [];
  }, [
    activeTab,
    ageRange,
    dataByAge,
    gender,
    max,
    min,
    startIndex,
    yAxisValue.max
  ]);

  const handleZoomChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newStartIndex = Number(event.target.value);
    setStartIndex(newStartIndex);
  };

  const xAxisGridLineData = useMemo(() => {
    if (
      ageRange === BMIAgeRange.FROM_20_LESS_THEN_70 ||
      ageRange === BMIAgeRange.EQUAL_MORE_THAN_70
    ) {
      return rangeDate.map((_date, index) => [index]);
    }

    return Array.from({ length: xAxisLength }, (_, i) => {
      if (
        ageRange === BMIAgeRange.FROM_0_LESS_THAN_5 &&
        activeTab === BMIChildrenTabs.WeightHeight
      ) {
        return [i * 5 + Math.floor(min / 5) * 5];
      }

      return [i];
    });
  }, [activeTab, ageRange, min, rangeDate, xAxisLength]);

  const yAxisGridLineData = useMemo(() => {
    return createSteppedArray(
      yAxisValue.min,
      yAxisValue.max,
      yAxisValue.interval
    );
  }, [yAxisValue]);

  const minValue = useMemo(() => {
    if (
      ageRange === BMIAgeRange.FROM_0_LESS_THAN_5 &&
      (activeTab === BMIChildrenTabs.Weight ||
        activeTab === BMIChildrenTabs.Height ||
        activeTab === BMIChildrenTabs.WeightHeight)
    ) {
      return 0;
    } else if (
      ageRange === BMIAgeRange.FROM_5_LESS_THAN_12 ||
      ageRange === BMIAgeRange.FROM_12_LESS_THAN_20
    ) {
      return 5;
    } else {
      const value = Math.min(0, xAxisLength - 12);
      return value;
    }
  }, [ageRange, activeTab, xAxisLength]);

  useEffect(() => {
    if (
      (ageRange === BMIAgeRange.FROM_0_LESS_THAN_5 &&
        (activeTab === BMIChildrenTabs.Weight ||
          activeTab === BMIChildrenTabs.Height)) ||
      ageRange === BMIAgeRange.FROM_5_LESS_THAN_12 ||
      ageRange === BMIAgeRange.FROM_12_LESS_THAN_20
    ) {
      setStartIndex(age);
    } else {
      setStartIndex(0);
    }
  }, [activeTab, age, ageRange, minValue, xAxisLength]);

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
    const option: EChartsOption = {
      tooltip: {
        confine: true,
        trigger: 'item',
        axisPointer: {
          type: 'none'
        },
        formatter: function (params: any) {
          let unit = 'kg/m²';
          let title = 'BMI';
          if (ageRange === BMIAgeRange.FROM_0_LESS_THAN_5) {
            if (activeTab === BMIChildrenTabs.Height) {
              unit = 'cm';
              title = 'Chiều cao';
            } else if (activeTab === BMIChildrenTabs.Weight) {
              unit = 'kg';
              title = 'Cân nặng';
            } else if (activeTab === BMIChildrenTabs.WeightHeight) {
              unit = 'kg/m²';
              title = 'BMI';
            }
          }

          return `
  < div style = "font-family: 'Roboto'; color: #333; font-size: ${isMobile ? '12px' : '18px'}; line-height: 140%;" >
    ${ageRange === BMIAgeRange.FROM_0_LESS_THAN_5 ||
              ageRange === BMIAgeRange.FROM_5_LESS_THAN_12 ||
              ageRange === BMIAgeRange.FROM_12_LESS_THAN_20
              ? `<div>Ngày đo: <span style="font-weight: 700;">${dayjs(params.data.date).format(DATE_FORMAT)}</span></div>`
              : ''
            }
                <div>${title}: <span style="font-weight: 700;">${convertDecimalDotToComma(ageRange !== BMIAgeRange.FROM_20_LESS_THEN_70 && ageRange !== BMIAgeRange.EQUAL_MORE_THAN_70 ? params.data.value[1] : params.data.value, 1)} ${unit}</span></div>
                <div style="word-break: break-word; white-space: normal;">Mức: <span style="color: ${params.data.color}; font-weight: 700;">${params.data.type}</span></div>
            </div > `;
        },
        borderColor: '#13ECD2',
        borderWidth: 2,
        borderRadius: 8,
        position: function (
          _point: any,
          _params: any,
          _dom: any,
          rect: any,
          size: any
        ) {
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
      xAxis: (xAxis ?? {
        boundaryGap: false,
        type: 'category' as const,
        data: Array.from({ length: 13 }, (_, i) => i),
        axisLine: {
          show: false
        },
        splitLine: {
          show: false
        },
        axisTick: {
          show: false
        },
        axisLabel: {
          fontFamily: 'Roboto',
          fontSize: isMobile ? 12 : 18,
          fontWeight: 500,
          interval: 0,
          formatter: function (value: string) {
            if (Number(value) === 0) return `{ bold | ${age} tuổi } `;
            if (Number(value) === 12) return `{ bold | ${age + 1} tuổi } `;
            return value;
          },
          rich: {
            bold: {
              fontFamily: 'Roboto',
              fontSize: isMobile ? 10 : 200,
              fontWeight: 'bold',
              color: '#000'
            }
          }
        },
        name: 'Tháng tuổi',
        nameLocation: 'middle',
        nameTextStyle: {
          fontSize: isMobile ? 14 : 32,
          fontWeight: 'bold',
          color: '#138678',
          fontFamily: 'Roboto',
          padding: [
            isMobile ? -25 : 0,
            0,
            0,
            chartWidth - (isMobile ? 140 : 200)
          ]
        },
        nameGap: hiddenRange ? 38 : isMobile ? 56 : 52
      }) as any,
      yAxis: {
        type: 'value',
        ...yAxisValue,
        splitLine: {
          show: false
        },
        axisLine: {
          show: false
        },
        axisTick: {
          show: false
        },
        axisLabel: {
          fontFamily: 'Roboto',
          fontSize: isMobile ? 14 : 18,
          fontWeight: 500
        },
        name:
          ageRange !== BMIAgeRange.FROM_0_LESS_THAN_5 &&
            ageRange !== BMIAgeRange.FROM_0_LESS_THAN_2 &&
            ageRange !== BMIAgeRange.FROM_2_LESS_THAN_5
            ? 'Chỉ số BMI (kg/m²)'
            : activeTab === BMIChildrenTabs.Height
              ? 'Chiều cao (cm)'
              : 'Cân nặng (kg)',
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
        top: isMobile ? 20 : 60,
        bottom: isMobile
          ? ageRange === BMIAgeRange.FROM_20_LESS_THEN_70 ||
            ageRange === BMIAgeRange.EQUAL_MORE_THAN_70
            ? 70
            : 45
          : 100,
        right: isMobile ? 22 : 45
      },
      series: [
        ...(backgroundData as any),
        {
          data: chartDataWithEmpty,
          z: 10,
          type: 'line' as const,
          connectNulls: true,
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
              let result = value.data.value;

              if (
                ageRange !== BMIAgeRange.FROM_20_LESS_THEN_70 &&
                ageRange !== BMIAgeRange.EQUAL_MORE_THAN_70
              ) {
                if (
                  ageRange === BMIAgeRange.FROM_0_LESS_THAN_5 &&
                  activeTab === BMIChildrenTabs.WeightHeight &&
                  value.data.value[0] === roundDownToNearest5(min)
                ) {
                  return '';
                } else {
                  if (value.data.value[0] === 0) {
                    return '';
                  }
                }
                result = value.data.value[1];
              }

              return convertDecimalDotToComma(result);
            },
            fontFamily: 'Roboto',
            offset: [0, 5]
          },
          markArea: {
            silent: true,
            data:
              ageRange === BMIAgeRange.FROM_20_LESS_THEN_70 ||
                ageRange === BMIAgeRange.EQUAL_MORE_THAN_70
                ? [
                  [
                    {
                      yAxis: 0,
                      itemStyle: { color: '#5FB7EE' },
                      label: {
                        show: true,
                        position: 'insideRight',
                        color: '#829da9',
                        fontSize: isMobile ? 8 : 16,
                        formatter: 'Gầy độ III',
                        fontFamily: 'Roboto',
                        offset: [0, 7]
                      }
                    },
                    {
                      yAxis: 16
                    }
                  ],
                  [
                    {
                      yAxis: 16,
                      itemStyle: { color: '#7BCCFA' },
                      label: {
                        show: true,
                        position: 'insideTopRight',
                        color: '#829da9',
                        fontSize: isMobile ? 8 : 16,
                        formatter: 'Gầy độ II',
                        fontFamily: 'Roboto',
                        offset: [0, -5]
                      }
                    },
                    {
                      yAxis: 17
                    }
                  ],
                  [
                    {
                      yAxis: 17,
                      itemStyle: { color: '#BFE3F5' },
                      label: {
                        show: true,
                        position: 'insideRight',
                        color: '#829da9',
                        fontSize: isMobile ? 8 : 16,
                        formatter: 'Gầy độ I',
                        fontFamily: 'Roboto'
                      }
                    },
                    {
                      yAxis: 18.5
                    }
                  ],
                  [
                    {
                      yAxis: 18.5,
                      itemStyle: { color: '#B9E5A9' },
                      label: {
                        show: true,
                        position: 'insideRight',
                        color: '#829da9',
                        fontSize: isMobile ? 8 : 16,
                        formatter: 'Bình thường',
                        fontFamily: 'Roboto',
                        offset: [0, 7]
                      }
                    },
                    {
                      yAxis: 25
                    }
                  ],
                  [
                    {
                      yAxis: 25,
                      itemStyle: { color: '#FCEC92' },
                      label: {
                        show: true,
                        position: 'insideRight',
                        color: '#829da9',
                        fontSize: isMobile ? 8 : 16,
                        formatter: 'Tiền béo phì',
                        fontFamily: 'Roboto',
                        offset: [0, -5]
                      }
                    },
                    {
                      yAxis: 30
                    }
                  ],
                  [
                    {
                      yAxis: 30,
                      itemStyle: { color: '#F8DAA9' },
                      label: {
                        show: true,
                        position: 'insideRight',
                        color: '#829da9',
                        fontSize: isMobile ? 8 : 16,
                        formatter: 'Béo phì độ I',
                        fontFamily: 'Roboto'
                      }
                    },
                    {
                      yAxis: 35
                    }
                  ],
                  [
                    {
                      yAxis: 35,
                      itemStyle: { color: '#F1BC9F' },
                      label: {
                        show: true,
                        position: 'insideRight',
                        color: '#829da9',
                        fontSize: isMobile ? 8 : 16,
                        formatter: 'Béo phì độ II',
                        fontFamily: 'Roboto',
                        offset: [0, 7]
                      }
                    },
                    {
                      yAxis: 40
                    }
                  ],
                  [
                    {
                      yAxis: 40,
                      itemStyle: { color: '#E07D70' },
                      label: {
                        show: true,
                        position: 'insideRight',
                        color: '#829da9',
                        fontSize: isMobile ? 8 : 16,
                        formatter: 'Béo phì độ III',
                        fontFamily: 'Roboto',
                        offset: [0, -5]
                      }
                    },
                    {
                      yAxis: getMaxValue(
                        data.map((item) => item.value),
                        5,
                        50,
                        15
                      )
                    }
                  ]
                ]
                : undefined
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
          data: xAxisGridLineData,
          silent: true,
          z: 10
        },
        {
          type: 'custom',
          renderItem: function (
            params: CustomSeriesRenderItemParams,
            api: CustomSeriesRenderItemAPI
          ) {
            const index = api.value(0) as any;
            const coord = api.coord([
              0,
              index * yAxisValue.interval + yAxisValue.min
            ]);
            const coordSys: any = params.coordSys;

            if (index === 0 || index === yAxisGridLineData.length - 1) {
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
          data: yAxisGridLineData.map((_, index) => [index]),
          encode: {
            y: 0
          },
          silent: true,
          z: 11
        }
      ],
      dataZoom: [
        {
          show: false,
          xAxisIndex: 0,
          start:
            ageRange === BMIAgeRange.FROM_20_LESS_THEN_70 ||
              ageRange === BMIAgeRange.EQUAL_MORE_THAN_70
              ? (startIndex / conclusionList?.length) * 100
              : undefined,
          end:
            ageRange === BMIAgeRange.FROM_20_LESS_THEN_70 ||
              ageRange === BMIAgeRange.EQUAL_MORE_THAN_70
              ? ((startIndex + 12) / conclusionList?.length) * 100
              : undefined,
          startValue: (ageRange === BMIAgeRange.FROM_0_LESS_THAN_5 &&
            activeTab === BMIChildrenTabs.WeightHeight
            ? xAxisGridLineData[startIndex]
            : undefined) as any,
          endValue: (ageRange === BMIAgeRange.FROM_0_LESS_THAN_5 &&
            activeTab === BMIChildrenTabs.WeightHeight
            ? xAxisGridLineData[startIndex + 12 - 1]
            : 12) as any
        }
      ]
    };
    setChartOption(option);
  }, [
    activeTab,
    age,
    ageRange,
    backgroundData,
    chartWidth,
    xAxisLength,
    data,
    rangeDate,
    startIndex,
    xAxis,
    yAxisValue,
    hiddenRange,
    yAxisGridLineData,
    chartDataWithEmpty,
    xAxisLimit,
    xAxisGridLineData,
    min,
    conclusionList?.length
  ]);

  useEffect(() => {
    setChartKey((prev) => prev + 1);
  }, [activeTab, ageRange]);

  const showZoomSlider = useMemo(() => {
    if (
      ageRange === BMIAgeRange.FROM_0_LESS_THAN_5 &&
      (activeTab === BMIChildrenTabs.Weight ||
        activeTab === BMIChildrenTabs.Height)
    ) {
      return age;
    }
    if (
      ageRange === BMIAgeRange.FROM_5_LESS_THAN_12 ||
      ageRange === BMIAgeRange.FROM_12_LESS_THAN_20
    ) {
      return age;
    }
    return xAxisLength - 12;
  }, [ageRange, activeTab, age, xAxisLength]);

  const checkZoomSlider = useMemo(() => {
    if (hiddenRange) {
      return false;
    }
    if (
      ageRange === BMIAgeRange.FROM_0_LESS_THAN_5 &&
      (activeTab === BMIChildrenTabs.Weight ||
        activeTab === BMIChildrenTabs.Height)
    ) {
      if (age === 0) {
        return false;
      }
      return true;
    }
    if (
      ageRange === BMIAgeRange.FROM_5_LESS_THAN_12 ||
      ageRange === BMIAgeRange.FROM_12_LESS_THAN_20
    ) {
      return true;
    }
    if (xAxisLength > xAxisLimit) {
      return true;
    }
    return false;
  }, [ageRange, activeTab, hiddenRange, xAxisLength, xAxisLimit, age]);

  return (
    <div css={rootStyles}>
      <div css={logoStyles}>
        Theo <img src={logoWHO} />
      </div>
      <ReactECharts
        key={chartKey}
        option={chartOption}
        style={{
          borderTopLeftRadius: '1.6rem',
          borderTopRightRadius: '1.6rem',
          overflow: 'hidden',
          height: isMobile ? '30rem' : '40rem',
          top: isMobile ? 0 : '2rem'
        }}
        ref={eChartsRef}
      />
      {checkZoomSlider && (
        <div css={rangeStyles(chartWidth)}>
          <input
            type='range'
            min={minValue}
            max={showZoomSlider}
            step={1}
            value={startIndex}
            onChange={handleZoomChange}
          />
          <span>Kéo để xem thêm chỉ số trên biểu đồ</span>
        </div>
      )}
    </div>
  );
}

const rootStyles = css`
position: relative;
`;

const logoStyles = css`
position: absolute;
top: ${isMobile ? 0 : '1.6rem'};
right: ${isMobile ? '2rem' : '1.8rem'};
display: flex;
align - items: center;
gap: 0.4rem;
font - size: ${isMobile ? '1rem' : '1.8rem'};
font - style: italic;

  img {
  height: ${isMobile ? '1.7rem' : '4rem'};
  width: auto;
}
`;

const rangeStyles = (chartWidth: number) => css`
background - color: var(--white - color);
display: flex;
flex - direction: column;
justify - content: center;
align - items: flex - end;
padding - top: ${isMobile ? '0.8rem' : '1.6rem'};
padding - right: 1.6rem;

  input {
  appearance: none;
  width: ${chartWidth - 72} px;
  height: ${isMobile ? '0.3rem' : '0.8rem'};
  background: #ddd;
  border - radius: 5px;
  outline: none;
  padding: 0;
  margin: 0;
  background: var(--primary - color);

    &:: -webkit - slider - thumb {
    appearance: none;
    width: ${isMobile ? '2.4rem' : '8rem'};
    height: ${isMobile ? '1.2rem' : '2.4rem'};
    background: var(--primary - color);
    border - radius: 10rem;
    cursor: pointer;
  }

    &:: -moz - range - thumb {
    appearance: none;
    width: 2.4rem;
    height: 1.2rem;
    background: var(--primary - color);
    border - radius: 10rem;
    cursor: pointer;
  }
}

  span {
  padding - top: ${isMobile ? '0.6rem' : '1.6rem'};
  text - align: right;
  font - style: italic;
  font - size: ${isMobile ? '1rem' : '1.8rem'};
}
`;

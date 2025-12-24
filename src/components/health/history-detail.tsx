import { css } from '@emotion/react';
import { Clock, Flag, FileText, Lightbulb } from 'lucide-react';
import dayjs from 'dayjs';
import { DATE_FORMAT, TIME_FORMAT } from '@/constants/common.constant';
import { isMobile } from 'react-device-detect';
import { getHealthModelLabel, getHealthModelUnit } from '@/utils/health';
import { convertDecimalDotToComma } from '@/utils/common';
import type { Conclusion } from '@/types/health';

type Diagnosis = any;
type HealthTabs = string;

type HistoryDetailProps = {
  item: Conclusion;
  diagnosis?: Diagnosis;
  tab?: HealthTabs;
};

export default function HistoryDetail({ item, tab }: HistoryDetailProps) {
  const getValue = () => {
    if (tab === 'WEIGHT' || tab === 'WEIGHT_HEIGHT') {
      return item.valueWeight ?? 0;
    } else if (tab === 'HEIGHT') {
      return item.valueHeight ?? 0;
    } else {
      return item.value ?? 0;
    }
  };

  return item ? (
    <div css={rootStyles}>
      <div css={headerStyles}>Chi tiết chỉ số</div>
      <div css={historyItemStyles}>
        <div css={historyItemHeaderStyles}>
          <div>
            <Clock size={24} />
            {tab === 'HOME'
              ? `${dayjs(item.time, 'HH:mm').format(TIME_FORMAT)}, ${dayjs(item.date).format(DATE_FORMAT)}`
              : dayjs(item.date).format(DATE_FORMAT)}
          </div>
        </div>
        <div css={historyStatContainerStyles}>
          {tab === 'HOSPITAL' || tab === 'HOME' ? (
            <div css={historyStatStyles(tab)}>
              <div>
                <span>{getHealthModelLabel(tab)[0]}</span>
                <div>
                  {convertDecimalDotToComma(item.valueSys ?? 0)}
                  <span>mmHg</span>
                </div>
              </div>
              <span css={lineStyles} />
              <div>
                <span>{getHealthModelLabel(tab)[1]}</span>
                <div>
                  {convertDecimalDotToComma(item.valueDia ?? 0)}
                  <span>mmHg</span>
                </div>
              </div>
            </div>
          ) : (
            <div css={historyStatStyles(tab)}>
              <div>
                <span>{getHealthModelLabel(tab)[0]}</span>
                <div>
                  {convertDecimalDotToComma(getValue())}
                  <span>{getHealthModelUnit(tab)}</span>
                </div>
              </div>
            </div>
          )}

          {item.model === 'BMI' && (
            <div css={flagStyles(item.color ?? '#000')}>
              <Flag size={isMobile ? 20 : 24} />
              {item.type}
            </div>
          )}
        </div>
      </div>
      <div css={summaryStyles}>
        <div>
          <FileText size={isMobile ? 40 : 56} />
          Kết luận
        </div>
        <div dangerouslySetInnerHTML={{ __html: item.conclusion }} />
      </div>

      <div css={summaryStyles}>
        <div>
          <Lightbulb size={isMobile ? 40 : 56} />
          Khuyến nghị
        </div>
        <div dangerouslySetInnerHTML={{ __html: item.recommend }} />
      </div>
    </div>
  ) : null;
}

const rootStyles = css`
  display: flex;
  flex-direction: column;
  gap: 1.6rem;
  max-height: ${isMobile ? '100vh' : 'unset'};
  
  ${isMobile && css`
    overflow-y: auto;
    scrollbar-width: none;
    -ms-overflow-style: none;
    
    &::-webkit-scrollbar {
      display: none;
    }
  `}
`;

const headerStyles = css`
  color: var(--text-label-color);
  font-size: ${isMobile ? '1.8rem' : '3.2rem'};
  font-weight: 700;
  line-height: ${isMobile ? '2.2rem' : '4.5rem'};
  text-align: center;
`;

const historyItemStyles = css`
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 1.2rem;
  border-radius: 1.6rem;
  box-shadow: 0px 1px 4px 0px #0000001a;
  margin-top: ${isMobile ? '1.6rem' : 0};
  background-color: var(--sub-background-color);
  flex: 1 1 calc(50% - 2.4rem);
`;

const historyItemHeaderStyles = css`
  display: flex;
  align-items: center;
  justify-content: ${isMobile ? 'flex-end' : 'flex-start'};

  & > div:nth-of-type(1) {
    display: flex;
    align-items: center;
    gap: ${isMobile ? '0.4rem' : '0.8rem'};
    font-weight: 500;
    color: var(--gray-color);
    font-size: ${isMobile ? '1.4rem' : '1.8rem'};

    svg {
      width: 2.4rem;
      height: 2.4rem;
    }
  }
`;

const historyStatContainerStyles = css`
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 1.6rem;
  margin-top: 1.6rem;
  background-color: var(--white-color);
  border-radius: ${isMobile ? '1.2rem' : '1.6rem'};
`;

const historyStatStyles = (tab?: HealthTabs) => css`
  display: flex;
  align-items: center;

  & > div {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    flex: 1;
    gap: ${isMobile ? 0 : '1.6rem'};

    & > span:first-of-type {
      font-size: ${isMobile ? '1.2rem' : '1.6rem'};
      font-weight: 700;
      color: var(--gray-color);
      line-height: 1.6rem;
    }

    & > div:last-of-type {
      font-size: ${isMobile ? '2rem' : '3.2rem'};
      line-height: ${isMobile ? '2.2rem' : '4.2rem'};
      font-weight: 700;
      color: ${isMobile ? 'var(--text-color)' : 'var(--text-label-color)'};
      margin-top: 0.4rem;

      span {
        font-size: ${tab === 'HOSPITAL' || tab === 'HOME'
    ? isMobile
      ? '1.4rem'
      : '1.8rem'
    : isMobile
      ? '2rem'
      : '3.2rem'};
        padding-left: 0.3rem;
      }
    }
  }
`;

const lineStyles = css`
  height: 5.1rem;
  width: 1px;
  background-color: var(--light-black-color);
`;

const flagStyles = (color: string) => css`
  display: flex;
  align-items: center;
  gap: 0.8rem;
  font-weight: 700;
  line-height: 2.5rem;
  font-size: ${isMobile ? '1.4rem' : '1.8rem'};
  color: ${color};
  padding-top: 0.8rem;

  svg {
    width: ${isMobile ? '2rem' : '2.4rem'};
    height: ${isMobile ? '2rem' : '2.4rem'};
    flex-shrink: 0;

    path {
      fill: ${color};
      stroke: ${color};
    }
  }
`;

const summaryStyles = css`
  display: flex;
  flex-direction: column;
  padding: 1.6rem 2.4rem;
  gap: ${isMobile ? '0.8rem' : '2.4rem'};
  border: 1px solid var(--light-black-color);
  border-radius: 1.6rem;

  & > div:nth-of-type(1) {
    display: flex;
    align-items: center;
    font-size: ${isMobile ? '1.4rem' : '2.4rem'};
    font-weight: 700;
    color: var(--text-color);
    gap: 1rem;

    & > svg {
      width: ${isMobile ? '4rem' : '5.6rem'};
      height: ${isMobile ? '4rem' : '5.6rem'};
    }
  }

  & > div:nth-of-type(2) {
    font-size: ${isMobile ? '1.4rem' : '1.8rem'};
  }
`;

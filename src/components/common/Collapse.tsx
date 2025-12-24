/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import { Collapse as AntCollapse } from 'antd';
import { type ReactNode, useEffect, useState } from 'react';
import { isMobile } from 'react-device-detect';

type Props = {
  label: ReactNode;
  content?: ReactNode;
  Icon?: React.FC<React.SVGProps<SVGSVGElement>>;
  boldActivatedLabel?: boolean;
  height?: string;
  active?: boolean;
};

export default function Collapse({
  label,
  content,
  Icon,
  boldActivatedLabel = true,
  height = '4.8rem',
  active = false,
}: Props) {
  const [activeKey, setActiveKey] = useState<string[]>([]);

  const items = [
    {
      key: '1',
      label: Icon ? (
        <div css={labelStyles}>
          <Icon width={40} height={40} /> {label}
        </div>
      ) : (
        label
      ),
      children: content
    }
  ];

  const handleCollapseChange = (keys: string | string[]) => {
    setActiveKey(Array.isArray(keys) ? keys : [keys]);
  };

  useEffect(() => {
    setActiveKey(active ? ['1'] : []);
  }, [active]);

  return (
    <AntCollapse
      activeKey={activeKey}
      items={items}
      css={rootStyles(boldActivatedLabel, height)}
      expandIconPosition='end'
      expandIcon={() => (
        <svg
          css={arrowIconStyles(activeKey.includes('1'))}
          width="20"
          height="20"
          viewBox="0 0 20 20"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M5 7.5L10 12.5L15 7.5"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      )}
      onChange={handleCollapseChange}
    />
  );
}

const rootStyles = (boldActivatedLabel: boolean, height: string) => css`
  margin-bottom: ${isMobile ? '1rem' : '1.6rem'};
  .ant-collapse-header {
    padding: ${isMobile ? '0.8rem' : '1.6rem'} !important;
    align-items: center !important;
    height: ${height};
  }

  .ant-collapse-arrow {
    display: none;
  }

  .ant-collapse-item {
    background-color: var(--white-color) !important;
    border-radius: 0.8rem !important;
  }

  .ant-collapse-header-text {
    font-size: ${isMobile ? '1.4rem' : '1.8rem'} !important;
  }

  .ant-collapse-item.ant-collapse-item-active {
    background-color: #f5f7fa !important;
    .ant-collapse-header-text {
      font-weight: ${boldActivatedLabel ? '700 !important' : 400};
    }
  }
`;

const labelStyles = css`
  display: flex;
  align-items: center;
  gap: 0.8rem;
`;

const arrowIconStyles = (isActive: boolean) => css`
  rotate: ${isActive ? '180deg' : '0deg'};
  transition: rotate 0.5s ease-in-out;
  width: 2rem;
  height: 2rem;
`;

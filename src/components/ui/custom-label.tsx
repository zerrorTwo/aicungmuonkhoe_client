/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import type { ReactNode } from 'react';

type LabelProps = {
  label: string;
  icon?: ReactNode;
  required?: boolean;
  tooltip?: ReactNode;
  tooltipOffset?: {
    x: number;
    y: number;
  };
  arrowOffset?: {
    x: number;
    y: number;
  };
  bold?: boolean;
  displayMode?: 'portal' | 'sheet' | 'modal';
  title?: string;
};

export default function CustomLabel({
  label,
  icon,
  required = false,
  tooltip,
  bold = false
}: LabelProps) {
  return (
    <div css={rootStyles(bold)}>
      {icon}
      {label}
      {required && <span> *</span>}
      {/* TODO: Add Tooltip component if needed */}
      {tooltip && <span css={tooltipStyles} title={typeof tooltip === 'string' ? tooltip : undefined}>ℹ️</span>}
    </div>
  );
}

const rootStyles = (bold: boolean) => css`
  font-weight: ${bold ? '700' : '400'};
  font-family: inherit;
  position: relative;
  display: flex;
  align-items: center;
  gap: 0.4rem;
  line-height: 140%;

  svg {
    width: 1.8rem;
    height: 1.8rem;
  }

  span {
    color: #ff4d4f;
  }
`;

const tooltipStyles = css`
  cursor: help;
  margin-left: 0.4rem;
`;

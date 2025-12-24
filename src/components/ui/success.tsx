/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import { Button } from 'antd';
import { isMobile } from 'react-device-detect';
import type { ReactNode } from 'react';

type SuccessProps = {
  label: string;
  content?: string | ReactNode;
  iconType?: string;
  confirmButtonText?: string;
  onConfirm?: () => void;
};

export default function Success({
  label,
  content,
  iconType,
  confirmButtonText,
  onConfirm
}: SuccessProps) {
  return (
    <div css={rootStyles}>
      <div css={headerStyles}>{label}</div>
      {/* TODO: Add chatbot SVG icons based on iconType */}
      {iconType && <div css={iconPlaceholderStyles}>🤖</div>}
      {content && <div css={contentStyles}>{content}</div>}
      {confirmButtonText && onConfirm && (
        <Button
          css={buttonStyles}
          shape="round"
          type="primary"
          size="large"
          onClick={onConfirm}
        >
          {confirmButtonText}
        </Button>
      )}
    </div>
  );
}

const rootStyles = css`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 2rem;
`;

const headerStyles = css`
  font-weight: 800;
  font-size: ${isMobile ? '1.8rem' : '3.2rem'};
  color: rgba(0, 0, 0, 0.88);
  padding-bottom: 1.6rem;
  text-align: center;
`;

const iconPlaceholderStyles = css`
  font-size: ${isMobile ? '8rem' : '12rem'};
  line-height: 1;
`;

const contentStyles = css`
  padding-top: 1.6rem;
  font-size: ${isMobile ? '1.4rem' : '1.8rem'};
  text-align: center;
`;

const buttonStyles = css`
  margin-top: 1.6rem;
  width: 80%;
  max-width: 300px;
  text-align: center;
`;

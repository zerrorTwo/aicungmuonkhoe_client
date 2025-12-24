import { Avatar as AntAvatar } from "antd"
import type { AvatarProps } from "antd"
import { css } from "@emotion/react"

// Base Avatar – chỉ re-export
export const Avatar = AntAvatar
export const AvatarImage = AntAvatar

// AvatarFallback với CSS custom
export const AvatarFallback = ({
  children,
  className,
  ...props
}: AvatarProps & { className?: string }) => {
  const customStyles = css`
    display: flex;
    align-items: center;
    justify-content: center;
    background: linear-gradient(
      135deg,
      #10b981,
      #34d399
    ); /* gradient xanh ngọc */
    color: white;
    font-weight: 700;
    font-size: 1.5rem; /* text-2xl */
    border-radius: 50%;
    overflow: hidden;
  `

  return (
    <AntAvatar
      {...props}
      className={`${className ?? ""}`}
      css={customStyles} // Nếu dùng Emotion
    >
      {children}
    </AntAvatar>
  )
}

export type { AvatarProps }

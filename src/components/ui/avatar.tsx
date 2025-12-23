// Re-export Ant Design Avatar as custom Avatar for compatibility
import { Avatar as AntAvatar } from 'antd';
import type { AvatarProps } from 'antd';

export const Avatar = AntAvatar;
export const AvatarImage = AntAvatar; // Ant Design uses src prop
export const AvatarFallback = ({ children, ...props }: any) => (
  <AntAvatar {...props}>{children}</AntAvatar>
);

export type { AvatarProps };

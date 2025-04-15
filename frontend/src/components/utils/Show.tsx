import { ReactNode } from 'react';

type Props = {
  children: ReactNode;
  when: boolean;
  fallback?: ReactNode;
};
export const Show = ({ children, when, fallback }: Props) => {
  if (when) return <>{children}</>;
  if (fallback) return <>{fallback}</>;

  return null;
};

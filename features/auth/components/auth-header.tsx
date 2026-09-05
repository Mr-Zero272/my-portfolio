import type { ReactNode } from 'react';

interface AuthHeaderProps {
  title: string;
  subtitle?: ReactNode;
}

export const AuthHeader = ({ title, subtitle }: AuthHeaderProps) => {
  return (
    <div className="flex flex-col items-center gap-2 text-center">
      <h1 className="text-2xl font-bold">{title}</h1>
      {subtitle ? (
        <p className="text-muted-foreground text-sm text-balance">{subtitle}</p>
      ) : null}
    </div>
  );
};

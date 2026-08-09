import type { ReactNode } from 'react';

import { Button } from '@/components/ui/button';

export interface ErrorStateProps {
  title: string;
  description: string;
  retryLabel: string;
  onRetry: () => void;
  icon?: ReactNode;
}

export function ErrorState(props: ErrorStateProps) {
  const { title, description, retryLabel, onRetry, icon } = props;

  return (
    <div
      role="alert"
      className="border-destructive/30 bg-destructive/5 flex flex-col items-center gap-3 rounded-xl border p-8 text-center"
    >
      {icon && (
        <span aria-hidden="true" className="text-destructive [&_svg]:size-6">
          {icon}
        </span>
      )}
      <p className="text-destructive font-medium">{title}</p>
      <p className="text-muted-foreground text-sm">{description}</p>
      <Button type="button" variant="outline" onClick={onRetry}>
        {retryLabel}
      </Button>
    </div>
  );
}

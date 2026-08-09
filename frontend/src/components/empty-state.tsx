import type { ReactNode } from 'react';

export interface EmptyStateProps {
  title: string;
  description: string;
  icon?: ReactNode;
}

export function EmptyState(props: EmptyStateProps) {
  const { title, description, icon } = props;

  return (
    <div className="border-border text-muted-foreground flex flex-col items-center gap-2 rounded-xl border border-dashed p-8 text-center">
      {icon && (
        <span aria-hidden="true" className="text-muted-foreground/60 [&_svg]:size-6">
          {icon}
        </span>
      )}
      <p className="text-foreground font-medium">{title}</p>
      <p className="text-sm">{description}</p>
    </div>
  );
}

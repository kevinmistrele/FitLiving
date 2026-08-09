import { Activity } from 'lucide-react';

import { cn } from '@/lib/utils';

export interface AppLogoProps {
  className?: string;
}

// Wordmark + mark used wherever the app needs to identify itself (sidebar header, login
// screen) — no image asset, just the brand color already defined in src/styles.css.
export function AppLogo(props: AppLogoProps) {
  const { className } = props;

  return (
    <div className={cn('flex items-center gap-2', className)}>
      <span
        aria-hidden="true"
        className="bg-primary text-primary-foreground flex size-8 shrink-0 items-center justify-center rounded-lg"
      >
        <Activity className="size-4.5" />
      </span>
      <span className="font-heading text-foreground text-lg leading-none font-semibold tracking-tight">
        FitLiving
      </span>
    </div>
  );
}

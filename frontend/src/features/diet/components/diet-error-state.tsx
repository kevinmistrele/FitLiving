import { Button } from '@/components/ui/button';

export interface DietErrorStateProps {
  title: string;
  description: string;
  retryLabel: string;
  onRetry: () => void;
}

export function DietErrorState(props: DietErrorStateProps) {
  const { title, description, retryLabel, onRetry } = props;

  return (
    <div
      role="alert"
      className="border-destructive/30 bg-destructive/5 flex flex-col items-center gap-3 rounded-xl border p-8 text-center"
    >
      <p className="text-destructive font-medium">{title}</p>
      <p className="text-muted-foreground text-sm">{description}</p>
      <Button type="button" variant="outline" onClick={onRetry}>
        {retryLabel}
      </Button>
    </div>
  );
}

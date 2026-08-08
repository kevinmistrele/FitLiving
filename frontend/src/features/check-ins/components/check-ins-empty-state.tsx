export interface CheckInsEmptyStateProps {
  title: string;
  description: string;
}

export function CheckInsEmptyState(props: CheckInsEmptyStateProps) {
  const { title, description } = props;

  return (
    <div className="border-border text-muted-foreground flex flex-col items-center gap-2 rounded-xl border border-dashed p-8 text-center">
      <p className="text-foreground font-medium">{title}</p>
      <p className="text-sm">{description}</p>
    </div>
  );
}

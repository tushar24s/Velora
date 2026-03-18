const ProductSkeleton = () => (
  <div className="surface-card-strong overflow-hidden p-3">
    <div className="aspect-[4/4.8] animate-pulse rounded-[18px] bg-[rgba(var(--surface-muted),0.88)]" />
    <div className="mt-4 space-y-2.5">
      <div className="h-3 w-20 animate-pulse rounded-full bg-[rgba(var(--surface-muted),0.88)]" />
      <div className="h-6 w-3/4 animate-pulse rounded-full bg-[rgba(var(--surface-muted),0.88)]" />
      <div className="h-4 w-1/2 animate-pulse rounded-full bg-[rgba(var(--surface-muted),0.88)]" />
      <div className="h-11 w-full animate-pulse rounded-[16px] bg-[rgba(var(--surface-muted),0.88)]" />
    </div>
  </div>
);

export default ProductSkeleton;

const EmptyState = ({ title, description, action }) => (
  <div className="surface-card mx-auto max-w-2xl px-6 py-10 text-center">
    <h3 className="font-display text-2xl font-semibold tracking-[-0.04em]">{title}</h3>
    <p className="mx-auto mt-3 max-w-xl text-soft">{description}</p>
    {action ? <div className="mt-6">{action}</div> : null}
  </div>
);

export default EmptyState;

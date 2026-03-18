const SectionHeading = ({ eyebrow, title, description, align = "left", action = null }) => (
  <div
    className={`flex flex-col gap-2.5 ${
      align === "center" ? "items-center text-center" : "sm:flex-row sm:items-end sm:justify-between sm:gap-6"
    }`}
  >
    <div className={align === "center" ? "max-w-2xl space-y-3" : "max-w-2xl space-y-3"}>
      {eyebrow ? <span className="eyebrow">{eyebrow}</span> : null}
      <div className="space-y-2">
        <h2 className="font-display text-[1.9rem] font-semibold leading-[1.05] tracking-[-0.04em] sm:text-4xl">
          {title}
        </h2>
        {description ? (
          <p className="max-w-2xl text-sm leading-6 text-soft sm:text-base sm:leading-7">
            {description}
          </p>
        ) : null}
      </div>
    </div>
    {action}
  </div>
);

export default SectionHeading;

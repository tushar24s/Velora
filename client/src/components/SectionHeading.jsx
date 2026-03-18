const SectionHeading = ({ eyebrow, title, description, align = "left", action = null }) => (
  <div
    className={`flex flex-col gap-3 ${
      align === "center" ? "items-center text-center" : "sm:flex-row sm:items-end sm:justify-between sm:gap-6"
    }`}
  >
    <div className={align === "center" ? "max-w-2xl space-y-3" : "max-w-2xl space-y-3"}>
      {eyebrow ? <span className="eyebrow">{eyebrow}</span> : null}
      <div className="space-y-2">
        <h2 className="font-display text-3xl font-semibold tracking-[-0.04em] sm:text-4xl">
          {title}
        </h2>
        {description ? <p className="max-w-2xl text-[15px] leading-7 text-soft sm:text-base">{description}</p> : null}
      </div>
    </div>
    {action}
  </div>
);

export default SectionHeading;

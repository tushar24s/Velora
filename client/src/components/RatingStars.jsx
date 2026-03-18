import { Star } from "lucide-react";

const RatingStars = ({ rating = 0, reviews }) => (
  <div className="flex items-center gap-2">
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((value) => (
        <Star
          key={value}
          className={`h-4 w-4 ${
            rating >= value - 0.4
              ? "fill-amber-400 text-amber-400"
              : "fill-transparent text-stone-300 dark:text-stone-600"
          }`}
        />
      ))}
    </div>
    <span className="text-xs font-medium text-soft">
      {rating.toFixed(1)}
      {typeof reviews === "number" ? ` (${reviews})` : ""}
    </span>
  </div>
);

export default RatingStars;


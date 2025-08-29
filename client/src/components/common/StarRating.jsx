import { useState } from "react";
import { Star } from "lucide-react";

const StarRating = ({ rating = 0, onRate, interactive = false }) => {
  const [hover, setHover] = useState(null);
  const [selected, setSelected] = useState(rating);

  const safeRating = Number(rating) || 0;
  const displayRating = interactive ? (hover || selected) : safeRating;

  const handleClick = (value) => {
    if (!interactive) return;
    setSelected(value);
    if (onRate) onRate(value); // callback API call trigger
  };

  return (
    <div className="flex items-center">
      {[1, 2, 3, 4, 5].map((i) => (
        <Star
          key={i}
          onMouseEnter={() => interactive && setHover(i)}
          onMouseLeave={() => interactive && setHover(null)}
          onClick={() => handleClick(i)}
          className={`inline-block w-6 h-6 ${interactive && "cursor-pointer"} transition-colors duration-150 ${
            i <= displayRating ? "fill-yellow-500 text-yellow-500" : "text-gray-300"
          }`}
        />
      ))}
      {!interactive && (
        <span className="ml-2 text-sm text-gray-600">({safeRating.toFixed(1)})</span>
      )}
    </div>
  );
};

export default StarRating;

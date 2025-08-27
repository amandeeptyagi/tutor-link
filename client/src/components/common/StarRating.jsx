import { Star } from "lucide-react";

const StarRating = ({ rating }) => {
    const safeRating = Number(rating) || 0;
  const stars = [];
  for (let i = 1; i <= 5; i++) {
    stars.push(
      <Star
        key={i}
        className={`inline-block w-5 h-5 ${
          i <= Math.round(safeRating) ? "fill-yellow-500 text-yellow-500" : "text-gray-300"
        }`}
      />
    );
  }

  return (
    <div className="flex items-center">
      {stars}
      <span className="ml-2 text-sm text-gray-600">({safeRating.toFixed(1)})</span>
    </div>
  );
};
export default StarRating;

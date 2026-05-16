import { Star } from 'lucide-react';

export default function StarRating({ rating = 0, onRate, readonly = false }) {
  const stars = [1, 2, 3, 4, 5];

  return (
    <div className="flex items-center gap-1">
      {stars.map((star) => (
        <button
          key={star}
          onClick={() => !readonly && onRate && onRate(star)}
          disabled={readonly}
          className={`${readonly ? 'cursor-default' : 'cursor-pointer hover:scale-110'} transition-transform focus:outline-none`}
        >
          <Star
            className={`w-5 h-5 ${
              star <= rating ? 'fill-yellow-400 text-yellow-400' : 'fill-transparent text-slate-600'
            }`}
          />
        </button>
      ))}
      <span className="text-sm font-medium text-slate-300 ml-2">
        {rating > 0 ? rating.toFixed(1) : 'Not rated'}
      </span>
    </div>
  );
}

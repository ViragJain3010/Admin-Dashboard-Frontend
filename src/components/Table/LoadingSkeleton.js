const shimmer =
  'before:absolute before:inset-0 before:-translate-x-full before:animate-[shimmer_2s_infinite] before:bg-gradient-to-r before:from-transparent before:via-white/60 before:to-transparent';

export function LoadingSkeleton() {
    return(
        <div className="relative w-full overflow-hidden">
        <div className="w-full space-y-4">
          <div
            className={`h-10 w-full rounded-md bg-muted before:absolute before:inset-0 before:-translate-x-full before:animate-[shimmer_2s_infinite] before:bg-gradient-to-r before:from-transparent before:via-white/60 before:to-transparent`}
          />
          {[...Array(5)].map((_, i) => (
            <div
              key={i}
              className={`h-16 w-full rounded-md bg-muted before:absolute before:inset-0 before:-translate-x-full before:animate-[shimmer_2s_infinite] before:bg-gradient-to-r before:from-transparent before:via-white/60 before:to-transparent`}
            />
          ))}
        </div>
      </div>
    )
};
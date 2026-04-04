const OnboardingLoading = () => {
  return (
    <div className="min-h-screen px-6 flex flex-col items-center">
      <div className="w-full max-w-2xl">

        {/* Header skeleton */}
        <div className="text-center mb-10 flex flex-col items-center gap-3">
          <div className="h-5 w-24 rounded-full bg-white/5 animate-pulse" />
          <div className="h-12 w-72 rounded-xl bg-white/5 animate-pulse mt-1" />
          <div className="h-12 w-56 rounded-xl bg-white/5 animate-pulse" />
          <div className="h-4 w-80 rounded-full bg-white/5 animate-pulse mt-2" />
        </div>

        {/* Role cards skeleton */}
        <div className="grid grid-cols-2 gap-4 w-full">
          {[0, 1].map((i) => (
            <div
              key={i}
              className="rounded-2xl p-4 sm:p-8 border border-white/5 bg-[#0f0f11] flex flex-col justify-start gap-5"
            >
              {/* Icon */}
              <div className="w-11 h-11 rounded-xl bg-white/5 animate-pulse" />
              {/* Title */}
              <div className="flex flex-col gap-2">
                <div className="h-5 w-32 rounded-lg bg-white/5 animate-pulse" />
                {/* Description lines */}
                <div className="h-3.5 w-full rounded-full bg-white/5 animate-pulse mt-1" />
                <div className="h-3.5 w-4/5 rounded-full bg-white/5 animate-pulse" />
                <div className="h-3.5 w-3/5 rounded-full bg-white/5 animate-pulse" />
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
};

export default OnboardingLoading;
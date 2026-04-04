export default function Loading() {
  return (
    <section className="relative min-h-screen grid grid-cols-1 lg:grid-cols-5 px-4 sm:px-8 pt-28 sm:pt-32 pb-20 overflow-hidden animate-pulse">
      
      {/* LEFT */}
      <div className="col-span-full lg:col-span-3 flex flex-col items-center justify-center text-center gap-6">
        
        {/* Badge */}
        <div className="h-6 w-40 bg-amber-400/10 rounded-full" />

        {/* Heading */}
        <div className="space-y-3">
          <div className="h-10 sm:h-12 lg:h-14 w-[80%] mx-auto bg-white/10 rounded" />
          <div className="h-10 sm:h-12 lg:h-14 w-[60%] mx-auto bg-amber-400/10 rounded" />
        </div>

        {/* Description */}
        <div className="space-y-2 mt-4 max-w-xl w-full">
          <div className="h-4 w-full bg-white/10 rounded" />
          <div className="h-4 w-5/6 mx-auto bg-white/10 rounded" />
          <div className="h-4 w-4/6 mx-auto bg-white/10 rounded" />
        </div>

        {/* Buttons */}
        <div className="flex gap-4 mt-8">
          <div className="h-12 w-36 bg-amber-400/10 rounded-lg" />
          <div className="h-12 w-44 bg-white/10 rounded-lg" />
        </div>

        {/* Avatars + text */}
        <div className="flex items-center gap-4 mt-10">
          
          {/* Avatar stack */}
          <div className="flex">
            {[...Array(4)].map((_, i) => (
              <div
                key={i}
                className={`w-8 h-8 rounded-full bg-white/10 border-2 border-[#0a0a0b] ${
                  i > 0 ? "-ml-2" : ""
                }`}
              />
            ))}
          </div>

          {/* Text */}
          <div className="h-4 w-56 bg-white/10 rounded" />
        </div>
      </div>

      {/* RIGHT */}
      <div className="col-span-full lg:col-span-2 flex items-center justify-center mt-12 lg:mt-0">
        
        {/* Code demo placeholder */}
        <div className="w-full max-w-md h-75 sm:h-87.5 lg:h-100 bg-white/5 border border-white/10 rounded-2xl" />
      </div>
    </section>
  );
}
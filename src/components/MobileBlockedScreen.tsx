import { Lock, Smartphone, Monitor } from "lucide-react";

const MobileBlockedScreen = () => {
  return (
    <div className="flex flex-col h-[calc(100dvh-112px)] w-full font-sans bg-linear-to-br from-primary/30 via-secondary/30 to-secondary/30 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-64 h-64 bg-primary/30 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse"></div>
        <div
          className="absolute bottom-20 right-10 w-72 h-72 bg-secondary/30 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse"
          style={{ animationDelay: "1s" }}
        ></div>
        <div
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-secondary/30 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"
          style={{ animationDelay: "2s" }}
        ></div>
      </div>

      {/* Main content */}
      <div className="relative z-10 flex flex-col items-center justify-center flex-1 px-6 text-center">
        {/* Icon container with animation */}
        <div className="relative mb-8">
          <div className="absolute inset-0 bg-linear-to-br from-primary/30 to-secondary/30 rounded-full blur-2xl opacity-30 animate-pulse"></div>
          <div className="relative bg-white rounded-full p-8 shadow-2xl">
            <Lock className="w-16 h-16 text-secondary/30" strokeWidth={1.5} />
          </div>
        </div>

        {/* Heading */}
        <h1 className="text-3xl font-bold text-gray-900 mb-4 tracking-tight">
          Desktop Only
        </h1>

        {/* Description */}
        <p className="text-lg text-gray-600 mb-8 max-w-md leading-relaxed">
          This experience is optimized for larger screens. Please switch to a
          desktop or tablet device to continue.
        </p>

        {/* Device icons */}
        <div className="flex items-center gap-6 mb-8">
          <div className="flex flex-col items-center gap-2 opacity-40">
            <div className="bg-gray-100 rounded-2xl p-4">
              <Smartphone className="w-8 h-8 text-gray-400" strokeWidth={1.5} />
            </div>
            <span className="text-xs text-gray-500 font-medium">Mobile</span>
          </div>

          <div className="flex items-center">
            <div className="w-12 h-0.5 bg-linear-to-r from-gray-300 to-secondary/30"></div>
            <div className="w-3 h-3 bg-secondary/30 rounded-full mx-1"></div>
            <div className="w-12 h-0.5 bg-linear-to-r from-secondary/30 to-secondary/30"></div>
          </div>

          <div className="flex flex-col items-center gap-2">
            <div className="bg-linear-to-br from-secondary/30 to-primary/30 rounded-2xl p-4 shadow-lg">
              <Monitor className="w-8 h-8 text-white" strokeWidth={1.5} />
            </div>
            <span className="text-xs text-secondary/30 font-semibold">
              Desktop
            </span>
          </div>
        </div>

        {/* Additional info */}
        <div className="bg-white/60 backdrop-blur-sm rounded-2xl px-6 py-4 max-w-sm border border-white/40 shadow-lg">
          <p className="text-sm text-gray-600">
            <span className="font-semibold text-gray-900">Pro tip:</span> For
            the best experience, use a screen width of at least 768px
          </p>
        </div>
      </div>

      {/* Bottom decorative element */}
      <div className="relative z-10 pb-6 px-6">
        <div className="flex justify-center gap-2">
          <div className="w-2 h-2 rounded-full bg-secondary/30 animate-pulse"></div>
          <div
            className="w-2 h-2 rounded-full bg-primary/30 animate-pulse"
            style={{ animationDelay: "0.3s" }}
          ></div>
          <div
            className="w-2 h-2 rounded-full bg-secondary/30 animate-pulse"
            style={{ animationDelay: "0.6s" }}
          ></div>
        </div>
      </div>
    </div>
  );
};

export default MobileBlockedScreen;

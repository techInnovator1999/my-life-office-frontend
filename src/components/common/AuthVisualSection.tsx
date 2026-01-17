'use client'

/**
 * AuthVisualSection Component
 * 
 * Reusable visual section for authentication pages (login, signup, etc.)
 * Displays a gradient background with marketing content and feature list
 */

export function AuthVisualSection() {
  return (
    <div className="relative hidden w-0 lg:block lg:w-[50%]">
      {/* Clean Gradient Background - Using primary button color */}
      <div className="absolute inset-0 h-full w-full bg-gradient-to-br from-[#307fef] via-[#2563eb] to-[#1e40af]"></div>

      {/* Vertically Centered Content */}
      <div className="absolute inset-0 flex flex-col justify-center p-16 xl:p-24">
        <div className="max-w-xl text-white">
          {/* Badge */}
          <div className="mb-6 inline-flex rounded-full border border-white/30 bg-white/10 px-5 py-2 backdrop-blur-sm">
            <span className="flex items-center gap-2 text-sm font-semibold tracking-wide">
              <span className="material-symbols-outlined text-base">
                auto_awesome
              </span>
              <span>Trusted by 10,000+ businesses</span>
            </span>
          </div>
          
          {/* Main Heading */}
          <h2 className="mb-6 text-5xl font-black leading-tight tracking-tight lg:text-6xl">
            Unlock your{" "}
            <span className="text-white/90">
              sales potential.
            </span>
          </h2>
          
          {/* Description */}
          <p className="mb-10 text-lg font-normal text-white/90 max-w-lg leading-relaxed">
            Join the next generation of Lead & Opportunity Management.
            Transform how you connect with customers today.
          </p>
          
          {/* Feature List */}
          <div className="flex flex-col gap-4 max-w-md">
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-white/10 backdrop-blur-sm flex items-center justify-center border border-white/20">
                <span className="material-symbols-outlined text-white text-[20px]">
                  analytics
                </span>
              </div>
              <div>
                <h3 className="font-semibold text-white mb-1">Smart Analytics</h3>
                <p className="text-sm text-white/80">Track your growth with live data and insights</p>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-white/10 backdrop-blur-sm flex items-center justify-center border border-white/20">
                <span className="material-symbols-outlined text-white text-[20px]">
                  bolt
                </span>
              </div>
              <div>
                <h3 className="font-semibold text-white mb-1">Real-time Sync</h3>
                <p className="text-sm text-white/80">Save time with intelligent automation</p>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-white/10 backdrop-blur-sm flex items-center justify-center border border-white/20">
                <span className="material-symbols-outlined text-white text-[20px]">
                  security
                </span>
              </div>
              <div>
                <h3 className="font-semibold text-white mb-1">Enterprise Security</h3>
                <p className="text-sm text-white/80">Bank-level security for your data</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

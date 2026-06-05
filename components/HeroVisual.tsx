"use client";

import { CheckCircle, Zap, Shield } from "lucide-react";

export default function HeroVisual() {
  return (
    <div className="hidden lg:flex items-center justify-center">
      <div className="relative w-full aspect-square perspective">
        {/* Premium black background with subtle grain */}
        <div className="absolute inset-0 bg-gradient-to-br from-black via-neutral-950 to-black rounded-3xl overflow-hidden">
          {/* Subtle texture overlay */}
          <div
            className="absolute inset-0 opacity-5"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
            }}
          ></div>
        </div>

        {/* Outer glass panel with reflection */}
        <div className="absolute inset-0 rounded-3xl border border-white/10 shadow-2xl" />
        <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-white/5 to-white/2 backdrop-blur-3xl" />

        {/* Content container with depth */}
        <div className="relative h-full p-12 flex flex-col items-center justify-between">
          {/* Top: Brand indicator */}
          <div className="w-full text-center">
            <div className="inline-block">
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-white/15 bg-white/5 backdrop-blur-sm">
                <div className="w-2 h-2 rounded-full bg-white/70"></div>
                <span className="text-xs font-light tracking-widest text-white/70">PREMIUM SERVICE</span>
              </div>
            </div>
          </div>

          {/* Center: Device and tools composition */}
          <div className="flex-1 flex items-center justify-center relative w-full">
            {/* Background glow - very subtle */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-64 h-64 bg-white/3 rounded-full blur-3xl" />
            </div>

            {/* Premium black repair mat - central element */}
            <div className="relative w-80 h-80">
              {/* Outer mat edge with reflection */}
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-neutral-800 via-neutral-900 to-black border border-neutral-700/30 shadow-2xl">
                {/* Inner mat surface with subtle reflection */}
                <div className="absolute inset-2 rounded-2xl bg-gradient-to-br from-neutral-900/60 via-black to-black" />

                {/* Matte surface detail */}
                <div
                  className="absolute inset-0 rounded-2xl opacity-10"
                  style={{
                    backgroundImage: `linear-gradient(45deg, transparent 30%, rgba(255,255,255,0.1) 50%, transparent 70%)`
                  }}
                />
              </div>

              {/* Floating device silhouette - minimal, elegant */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="relative w-32 h-64">
                  {/* Device glass shine */}
                  <div className="absolute inset-0 rounded-3xl border border-white/20 shadow-lg" style={{
                    boxShadow: `
                      0 0 60px rgba(255,255,255,0.08),
                      0 0 120px rgba(0,0,0,0.6),
                      inset -1px -1px 20px rgba(0,0,0,0.4),
                      inset 1px 1px 20px rgba(255,255,255,0.1)
                    `,
                    background: `linear-gradient(135deg, rgba(255,255,255,0.05) 0%, rgba(0,0,0,0.3) 100%)`
                  }} />

                  {/* Device body definition */}
                  <div className="absolute inset-0 rounded-3xl border border-white/10" />

                  {/* Notch detail */}
                  <div className="absolute top-4 left-1/2 -translate-x-1/2 w-16 h-6 rounded-full border border-white/5 bg-black" />

                  {/* Screen area highlight */}
                  <div className="absolute inset-4 rounded-2xl border border-white/8 bg-gradient-to-br from-white/3 to-black/20" />

                  {/* Reflection on glass */}
                  <div
                    className="absolute top-0 left-1/4 w-12 h-24 rounded-full blur-2xl opacity-20"
                    style={{
                      background: `linear-gradient(180deg, rgba(255,255,255,0.3) 0%, transparent 100%)`
                    }}
                  />
                </div>
              </div>

              {/* Minimal tools - geometric, precise */}
              {/* Top left screwdriver */}
              <div className="absolute -top-8 -left-12 w-32 h-2 rounded-full"
                style={{
                  background: `linear-gradient(90deg, transparent, rgba(200,200,200,0.4), rgba(200,200,200,0.2), transparent)`,
                  transform: `rotate(-35deg)`,
                  boxShadow: `0 4px 12px rgba(0,0,0,0.5)`
                }} />

              {/* Bottom right tool */}
              <div className="absolute -bottom-6 -right-8 w-28 h-1.5 rounded-full"
                style={{
                  background: `linear-gradient(90deg, transparent, rgba(200,200,200,0.3), transparent)`,
                  transform: `rotate(25deg)`,
                  boxShadow: `0 3px 10px rgba(0,0,0,0.4)`
                }} />

              {/* Small precision tool accent */}
              <div className="absolute top-1/3 -right-6 w-1 h-8 rounded-full bg-gradient-to-b from-white/40 to-white/10 shadow-lg" />
            </div>

            {/* Floating status cards - premium indicators */}
            {/* Status card 1 - Diagnosis */}
            <div className="absolute top-20 right-8 w-48 p-4 rounded-xl border border-white/15 bg-white/5 backdrop-blur-md shadow-2xl transform hover:scale-105 transition-transform duration-300"
              style={{
                animation: `float 3s ease-in-out infinite`,
                animationDelay: `0s`
              }}>
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center flex-shrink-0 border border-white/10">
                  <CheckCircle className="w-4 h-4 text-white/70" />
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-light tracking-widest text-white/60 uppercase">Diagnosis</p>
                  <p className="text-sm font-light text-white/90 mt-1">Complete</p>
                </div>
              </div>
            </div>

            {/* Status card 2 - Condition */}
            <div className="absolute bottom-24 right-12 w-48 p-4 rounded-xl border border-white/15 bg-white/5 backdrop-blur-md shadow-2xl transform hover:scale-105 transition-transform duration-300"
              style={{
                animation: `float 3s ease-in-out infinite`,
                animationDelay: `0.5s`
              }}>
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center flex-shrink-0 border border-white/10">
                  <Zap className="w-4 h-4 text-white/70" />
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-light tracking-widest text-white/60 uppercase">Battery</p>
                  <p className="text-sm font-light text-white/90 mt-1">Excellent</p>
                </div>
              </div>
            </div>

            {/* Status card 3 - Assurance */}
            <div className="absolute bottom-20 left-8 w-48 p-4 rounded-xl border border-white/15 bg-white/5 backdrop-blur-md shadow-2xl transform hover:scale-105 transition-transform duration-300"
              style={{
                animation: `float 3s ease-in-out infinite`,
                animationDelay: `1s`
              }}>
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center flex-shrink-0 border border-white/10">
                  <Shield className="w-4 h-4 text-white/70" />
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-light tracking-widest text-white/60 uppercase">Warranty</p>
                  <p className="text-sm font-light text-white/90 mt-1">12 months</p>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom: Service commitment */}
          <div className="w-full text-center space-y-4">
            <div className="h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />
            <p className="text-xs font-light tracking-widest text-white/60">READY FOR COLLECTION</p>
            <p className="text-sm font-light text-white/80">Same-day service · Professional care · 12-month guarantee</p>
          </div>
        </div>

        {/* Premium corner accents */}
        <div className="absolute top-6 left-6 w-12 h-12 border-l border-t border-white/20 rounded-tl-2xl pointer-events-none" />
        <div className="absolute bottom-6 right-6 w-12 h-12 border-r border-b border-white/20 rounded-br-2xl pointer-events-none" />

        {/* Subtle edge lighting */}
        <div className="absolute inset-0 rounded-3xl pointer-events-none"
          style={{
            boxShadow: `
              inset 0 0 60px rgba(255,255,255,0.02),
              inset -1px -1px 2px rgba(0,0,0,0.5)
            `
          }} />
      </div>

      {/* Float animation */}
      <style>{`
        @keyframes float {
          0%, 100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-12px);
          }
        }
      `}</style>
    </div>
  );
}

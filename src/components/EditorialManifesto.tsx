/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Compass, ShieldCheck, Heart, AlertTriangle, ChevronRight, Share2, Users } from 'lucide-react';

export default function EditorialManifesto() {
  const [activeTab, setActiveTab] = useState<number>(0);

  const pillars = [
    {
      title: "Logistics vs. Vulnerability",
      subtitle: "Why low costs aren't the primary metric",
      problem: "Traditional apps group experiences by low prices, high-speed bookings, or photogenic spots. They assume a universal standard of safety and mobility.",
      solution: "For a solo woman, true safety dictates logistics. A boutique hostel that is $20 cheaper but located down a dark, unmonitored lane is a net negative. We prioritize the safety of the access path, evening taxi reliability, and the security of host locks first.",
      icon: ShieldCheck,
      color: "border-rose-200 bg-rose-50/50 text-rose-750"
    },
    {
      title: "Anonymous Review Bias",
      subtitle: "Who claims a street or neighborhood is 'perfectly fine'?",
      problem: "Standard forums feature anonymous reviewers proclaiming that a neighborhood is '100% safe to wander around.' These reviews often fail to account for the unique vulnerabilities solo women face, particularly at night.",
      solution: "We provide gender-specific safety metrics voted exclusively by verified solo female travelers. We break safety down into granular aspects: Catcall Index, Evening Lighting Quality, Solo Transit Comfort, and Active Bystander Helpfulness.",
      icon: AlertTriangle,
      color: "border-amber-200 bg-amber-50/50 text-amber-700"
    },
    {
      title: "The Isolation Vulnerability",
      subtitle: "Generic mixers and social groups carry pressure",
      problem: "Social mixers and general hook-up travel apps can feel overwhelming or lead to unsolicited advances, leaving solo women isolated or guarded.",
      solution: "A trusted, verified female-only peer match matching forum. Connect to other solo women in the same city specifically to split a taxi, share a meal after 8 PM, or walk together through historic quarters during dusk. High trust, zero pressure.",
      icon: Users,
      color: "border-blue-200 bg-blue-50/50 text-blue-700"
    },
    {
      title: "Passive Information vs. Active Guard",
      subtitle: "A digital brochure won't keep you secure",
      problem: "Standard travel apps act as static lists. If a solo traveler encounters catcalls, feels followed, or fails to return to her hotel on time, the app is entirely unresponsive.",
      solution: "An active companion. We integrate dynamic Safety Check-in Timers that alert designated travel buddies if you don't check back in. We also provide direct 1-tap localized tourist police SOS buttons that work offline and generate immediate translation copy.",
      icon: Compass,
      color: "border-emerald-200 bg-emerald-50/50 text-emerald-700"
    }
  ];

  return (
    <div className="bg-white rounded-2xl border border-stone-100 p-6 md:p-8 shadow-sm">
      <div className="max-w-3xl mx-auto text-center mb-8">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-rose-50 text-rose-700 mb-3 border border-rose-100">
          <Heart className="w-3 h-3 fill-rose-600" /> The Travel Safety Gap
        </span>
        <h2 className="font-sans text-3xl font-semibold tracking-tight text-stone-900 mb-4">
          Why Traditional Travel Apps Fail Women
        </h2>
        <p className="text-stone-600 text-base leading-relaxed">
          The global travel industry was engineered for generic travelers, treating safety as an afterthought rather than a core foundation. A women-first travel experience replaces generic itinerary planning with extreme transparency, active peer-safety networks, and real security infrastructure.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center mt-12">
        {/* Left Side: Dynamic Selectors */}
        <div className="lg:col-span-5 space-y-4">
          {pillars.map((pillar, idx) => {
            const IconComponent = pillar.icon;
            const isSelected = activeTab === idx;
            return (
              <button
                key={idx}
                onClick={() => setActiveTab(idx)}
                className={`w-full text-left p-4 rounded-xl border transition-all duration-300 flex items-start gap-4 ${
                  isSelected 
                    ? 'border-stone-900 bg-stone-900 text-white shadow-md shadow-stone-900/10 scale-[1.02]' 
                    : 'border-stone-200 bg-stone-50/50 hover:bg-stone-50 text-stone-800'
                }`}
              >
                <div className={`p-2 rounded-lg shrink-0 ${isSelected ? 'bg-stone-800 text-rose-300' : 'bg-white text-stone-600 border border-stone-100'}`}>
                  <IconComponent className="w-5 h-5" />
                </div>
                <div className="min-w-0 pr-2">
                  <h3 className="font-sans font-semibold text-sm leading-snug">{pillar.title}</h3>
                  <p className={`text-xs mt-1 truncate ${isSelected ? 'text-stone-300' : 'text-stone-500'}`}>
                    {pillar.subtitle}
                  </p>
                </div>
                <ChevronRight className={`w-4 h-4 mt-1 ml-auto shrink-0 transition-transform ${isSelected ? 'translate-x-1 text-rose-300' : 'text-stone-400'}`} />
              </button>
            );
          })}
        </div>

        {/* Right Side: Tab Detail Panel */}
        <div className="lg:col-span-7 bg-stone-50 rounded-2xl border border-stone-200/60 p-6 md:p-8 min-h-[350px] flex flex-col justify-between">
          <div>
            <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border text-xs font-semibold mb-6 ${pillars[activeTab].color}`}>
              {React.createElement(pillars[activeTab].icon, { className: "w-4 h-4" })}
              {pillars[activeTab].title}
            </div>
            
            <div className="space-y-6">
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-rose-600 mb-2">The Structural Industry Gap:</h4>
                <p className="text-stone-700 text-sm md:text-base font-sans leading-relaxed">
                  {pillars[activeTab].problem}
                </p>
              </div>

              <div className="border-t border-stone-200/80 pt-5">
                <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-700 mb-2">Our Women-First Solution:</h4>
                <p className="text-stone-800 text-sm md:text-base font-sans leading-relaxed italic bg-emerald-50/30 border-l-2 border-emerald-500 pl-3 py-1 rounded-r-lg">
                  "{pillars[activeTab].solution}"
                </p>
              </div>
            </div>
          </div>

          <div className="mt-8 pt-4 border-t border-stone-200/50 flex items-center justify-between text-xs text-stone-500">
            <span>Focus: High-Trust Travel Architecture</span>
            <div className="flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
              <span>Fully Solved Below</span>
            </div>
          </div>
        </div>
      </div>

      {/* Quote Banner */}
      <div className="mt-12 p-6 rounded-2xl bg-rose-50/40 border border-rose-100/60 text-center">
        <p className="font-serif text-stone-800 text-md md:text-lg italic leading-relaxed">
          "When a website asks a solo woman traveler to register, she shouldn't just be signing up for a cheaper hotel room. She should be signing into an active, protective community of verified sisters watching her back in real-time."
        </p>
        <span className="block mt-3 text-xs font-semibold uppercase tracking-wider text-rose-700">
          — Manifesto for High-Trust Solo Flight, 2026
        </span>
      </div>
    </div>
  );
}

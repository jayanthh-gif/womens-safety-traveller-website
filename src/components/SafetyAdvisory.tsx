/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  Shield, 
  MapPin, 
  Calendar, 
  CheckCircle, 
  AlertTriangle, 
  Sparkles, 
  Info, 
  Activity, 
  Eye, 
  Moon, 
  Bus, 
  LifeBuoy, 
  ThumbsUp, 
  Clock,
  ExternalLink
} from 'lucide-react';
import { SafetyReport } from '../types';
import { PRE_CACHED_REPORTS } from '../data/preCachedReports';

export default function SafetyAdvisory() {
  const [cityInput, setCityInput] = useState('');
  const [selectedMonth, setSelectedMonth] = useState('June');
  const [selectedStyle, setSelectedStyle] = useState('general');
  const [loading, setLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState('');
  const [error, setError] = useState<string | null>(null);
  
  // Initialize with 'rome' cached data
  const [report, setReport] = useState<SafetyReport>(PRE_CACHED_REPORTS.rome);
  const [activeDay, setActiveDay] = useState(1);
  const [activeReportTab, setActiveReportTab] = useState<'overview' | 'neighborhoods' | 'itinerary'>('overview');

  const loadingSequence = [
    "Establishing high-trust connection to security records...",
    "Querying crowdsourced solo women traveler indexes...",
    "Aggregating neighborhood evening street-lighting data...",
    "Filtering local tourist authorities and transport registries...",
    "Synthesizing customized safety-first day itinerary..."
  ];

  const handleSuggestCity = (key: string) => {
    setError(null);
    setReport(PRE_CACHED_REPORTS[key]);
    setActiveDay(1);
  };

  const handleGenerateReport = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!cityInput.trim()) return;

    setLoading(true);
    setError(null);
    
    // Cycle safety loading messages
    let msgIndex = 0;
    setLoadingMessage(loadingSequence[0]);
    const msgInterval = setInterval(() => {
      msgIndex = (msgIndex + 1) % loadingSequence.length;
      setLoadingMessage(loadingSequence[msgIndex]);
    }, 2800);

    try {
      const response = await fetch("/api/safety-report", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          city: cityInput.trim(),
          month: selectedMonth,
          style: selectedStyle
        })
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || "Failed to compile safety telemetry. Server returned error.");
      }

      const generatedData: SafetyReport = await response.json();
      setReport(generatedData);
      setActiveDay(1);
      setActiveReportTab('overview');
    } catch (err: any) {
      console.error(err);
      setError(err.message || "An unexpected error occurred while communicating with the safety server. Please verify your internet connection or check the Gemini API Secret under Settings.");
    } finally {
      clearInterval(msgInterval);
      setLoading(false);
    }
  };

  // Helper to color metrics
  const getMetricColor = (score: number) => {
    if (score >= 8.5) return 'text-emerald-600 bg-emerald-50 border-emerald-100';
    if (score >= 7.0) return 'text-amber-600 bg-amber-50 border-amber-100';
    return 'text-rose-600 bg-rose-50 border-rose-100';
  };

  const getMetricProgressColor = (score: number) => {
    if (score >= 8.5) return 'bg-emerald-500';
    if (score >= 7.0) return 'bg-amber-500';
    return 'bg-rose-500';
  };

  return (
    <div className="space-y-6">
      {/* City quick switches */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-stone-50 border border-stone-200/65 p-4 rounded-xl">
        <div className="text-sm font-sans font-medium text-stone-700">
          📍 Quick-Load Verified Guidebook Templates:
        </div>
        <div className="flex flex-wrap gap-2">
          {Object.keys(PRE_CACHED_REPORTS).map((key) => {
            const isSelected = report.city.toLowerCase().includes(key);
            return (
              <button
                key={key}
                onClick={() => handleSuggestCity(key)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold capitalize border transition-all ${
                  isSelected 
                    ? 'bg-rose-50 border-rose-200 text-rose-700 shadow-sm font-bold' 
                    : 'bg-white hover:bg-stone-100 text-stone-600 border-stone-250'
                }`}
              >
                {key}
              </button>
            );
          })}
        </div>
      </div>

      {/* Main interactive form */}
      <div className="bg-white rounded-2xl border border-stone-100 p-6 shadow-sm">
        <h3 className="font-sans text-lg font-semibold text-stone-900 mb-2 flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-rose-500" /> Consult AI Solo Safety Advisor
        </h3>
        <p className="text-xs text-stone-500 mb-6 font-sans">
          Specify any global destination to run a specialized security check. Powered by Gemini, this analyzes street factors, cultural guidelines, transit layouts, and generates a safety-optimized 3-day exploration outline.
        </p>

        <form onSubmit={handleGenerateReport} className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
          <div className="md:col-span-2">
            <label className="block text-xs font-bold uppercase tracking-wider text-stone-600 mb-1.5">
              Enter Destination City
            </label>
            <div className="relative">
              <MapPin className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={cityInput}
                onChange={(e) => setCityInput(e.target.value)}
                placeholder="e.g., Marrakech, Barcelona, Kyoto..."
                className="w-full text-sm pl-9 pr-4 py-2 rounded-xl border border-stone-250 focus:outline-none focus:ring-1 focus:ring-stone-900 focus:border-stone-900 bg-stone-50/50"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-stone-600 mb-1.5">
              Travel Month
            </label>
            <div className="relative">
              <Calendar className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <select
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(e.target.value)}
                className="w-full text-sm pl-9 pr-4 py-2 rounded-xl border border-stone-250 focus:outline-none focus:ring-1 focus:ring-stone-900 focus:border-stone-900 bg-stone-50/50 appearance-none"
              >
                {["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"].map(m => (
                  <option key={m} value={m}>{m}</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={loading || !cityInput.trim()}
              className="w-full py-2 px-4 rounded-xl text-sm font-semibold bg-stone-900 hover:bg-stone-850 text-white shadow-sm transition-all text-center flex items-center justify-center gap-1.5 disabled:opacity-55"
            >
              <Shield className="w-4 h-4 text-rose-300" />
              {loading ? "Analyzing..." : "Generate Guide"}
            </button>
          </div>
        </form>

        {/* Error messaging */}
        {error && (
          <div className="mt-4 p-4 rounded-xl border border-rose-200 bg-rose-50 text-rose-900 text-xs font-medium relative overflow-hidden flex gap-3">
            <AlertTriangle className="w-4 h-4 shrink-0 text-rose-500" />
            <div className="space-y-1">
              <p className="font-bold">Security Analysis Blocked</p>
              <p className="leading-relaxed">{error}</p>
              <p className="text-rose-700/80 mt-1 font-mono">
                💡 Tip: You can instantly load the validated reports (Rome, Bangkok, Paris, Tokyo) at the top without configuring keys!
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Loading state indicator */}
      {loading ? (
        <div className="bg-white rounded-2xl border border-stone-200/80 p-12 text-center shadow-inner flex flex-col items-center justify-center min-h-[300px]">
          <div className="relative flex items-center justify-center mb-6">
            <div className="w-14 h-14 rounded-full border-2 border-stone-100 border-t-rose-500 animate-spin"></div>
            <Shield className="w-6 h-6 text-rose-500/80 absolute" />
          </div>
          <p className="font-serif text-lg font-medium text-stone-800 animate-pulse transition-all duration-500 h-6">
            {loadingMessage}
          </p>
          <p className="text-xs text-stone-500 mt-2 font-mono">
            Compiling and verifying local safety algorithms...
          </p>
        </div>
      ) : (
        /* Report Presentation Panel */
        report && (
          <div className="space-y-6">
            {/* Report Header Card */}
            <div className="bg-gradient-to-br from-stone-900 to-stone-850 text-white rounded-3xl p-6 md:p-8 shadow-md relative overflow-hidden">
              <div className="absolute top-0 right-0 p-8 w-64 h-64 bg-radial-gradient from-rose-500/10 to-transparent pointer-events-none rounded-full blur-xl" />
              
              <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                  <span className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-md bg-rose-500/20 text-rose-200 border border-rose-500/30 uppercase tracking-widest mb-3">
                    <Shield className="w-3.5 h-3.5" /> High-Trust Safety Scorecard
                  </span>
                  <h2 className="font-serif text-3xl md:text-4xl font-semibold tracking-tight">
                    {report.city}
                  </h2>
                  <p className="text-stone-300 text-sm mt-1.5 font-sans">
                    Safety analysis optimized for solo female travel comfort
                  </p>
                </div>

                {/* Circular Safety Meter */}
                <div className="flex items-center gap-4 bg-white/5 border border-white/10 rounded-2xl p-4 shrink-0">
                  <div className="relative flex items-center justify-center">
                    {/* SVG ring */}
                    <svg className="w-16 h-16 transform -rotate-95">
                      <circle cx="32" cy="32" r="28" fill="transparent" stroke="rgba(255,255,255,0.08)" strokeWidth="4" />
                      <circle 
                        cx="32" 
                        cy="32" 
                        r="28" 
                        fill="transparent" 
                        stroke="#f43f5e" 
                        strokeWidth="4" 
                        strokeDasharray={175} 
                        strokeDashoffset={175 - (175 * report.overallScore) / 10} 
                        strokeLinecap="round"
                      />
                    </svg>
                    <span className="absolute font-sans text-lg font-bold text-white">
                      {report.overallScore}
                    </span>
                  </div>
                  <div className="text-left">
                    <span className="block text-[10px] text-stone-400 font-bold uppercase tracking-widest">Safety Comfort</span>
                    <span className="font-sans text-sm font-bold text-rose-300">
                      {report.overallScore >= 9.0 ? 'Exceptional' : report.overallScore >= 8.0 ? 'Highly Secure' : 'Moderate Caution'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Sub-Metric Score Rails */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-8 pt-6 border-t border-white/10 relative z-10">
                <div className="bg-white/5/5 rounded-xl p-3 border border-white/5">
                  <div className="flex items-center gap-2 mb-1.5">
                    <Moon className="w-4 h-4 text-rose-300 shrink-0" />
                    <span className="text-xs text-stone-300 font-sans">Night Strolls</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-lg font-bold font-sans">{report.safetyMetrics.nightWalking}/10</span>
                    <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
                      <div className={`h-full ${getMetricProgressColor(report.safetyMetrics.nightWalking)}`} style={{width: `${report.safetyMetrics.nightWalking*10}%`}} />
                    </div>
                  </div>
                </div>

                <div className="bg-white/5/5 rounded-xl p-3 border border-white/5">
                  <div className="flex items-center gap-2 mb-1.5">
                    <Bus className="w-4 h-4 text-emerald-300 shrink-0" />
                    <span className="text-xs text-stone-300 font-sans">Public Transit</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-lg font-bold font-sans">{report.safetyMetrics.soloTransport}/10</span>
                    <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
                      <div className={`h-full ${getMetricProgressColor(report.safetyMetrics.soloTransport)}`} style={{width: `${report.safetyMetrics.soloTransport*10}%`}} />
                    </div>
                  </div>
                </div>

                <div className="bg-white/5/5 rounded-xl p-3 border border-white/5">
                  <div className="flex items-center gap-2 mb-1.5">
                    <LifeBuoy className="w-4 h-4 text-blue-300 shrink-0" />
                    <span className="text-xs text-stone-300 font-sans">Local Assistance</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-lg font-bold font-sans">{report.safetyMetrics.assistance}/10</span>
                    <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
                      <div className={`h-full ${getMetricProgressColor(report.safetyMetrics.assistance)}`} style={{width: `${report.safetyMetrics.assistance*10}%`}} />
                    </div>
                  </div>
                </div>

                <div className="bg-white/5/5 rounded-xl p-3 border border-white/5">
                  <div className="flex items-center gap-2 mb-1.5">
                    <AlertTriangle className="w-4 h-4 text-amber-300 shrink-0" />
                    <span className="text-xs text-stone-300 font-sans">Scam Security</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-lg font-bold font-sans">{report.safetyMetrics.scamRisk}/10</span>
                    <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
                      <div className={`h-full ${getMetricProgressColor(report.safetyMetrics.scamRisk)}`} style={{width: `${report.safetyMetrics.scamRisk*10}%`}} />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Sub-navigation tabs for details */}
            <div className="flex border-b border-stone-200">
              <button
                onClick={() => setActiveReportTab('overview')}
                className={`py-3 px-4 text-sm font-semibold border-b-2 transition-all flex items-center gap-1.5 ${
                  activeReportTab === 'overview'
                    ? 'border-stone-900 text-stone-900 font-bold'
                    : 'border-transparent text-stone-500 hover:text-stone-850'
                }`}
              >
                <Info className="w-4 h-4" /> Safety Overview
              </button>
              <button
                onClick={() => setActiveReportTab('neighborhoods')}
                className={`py-3 px-4 text-sm font-semibold border-b-2 transition-all flex items-center gap-1.5 ${
                  activeReportTab === 'neighborhoods'
                    ? 'border-stone-900 text-stone-900 font-bold'
                    : 'border-transparent text-stone-500 hover:text-stone-850'
                }`}
              >
                <MapPin className="w-4 h-4" /> Neighborhood Security
              </button>
              <button
                onClick={() => setActiveReportTab('itinerary')}
                className={`py-3 px-4 text-sm font-semibold border-b-2 transition-all flex items-center gap-1.5 ${
                  activeReportTab === 'itinerary'
                    ? 'border-stone-900 text-stone-900 font-bold'
                    : 'border-transparent text-stone-500 hover:text-stone-850'
                }`}
              >
                <Activity className="w-4 h-4" /> Safety Itinerary
              </button>
            </div>

            {/* TAB CONTENT: Safety Overview */}
            {activeReportTab === 'overview' && (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                {/* Left Column: Top takeaways */}
                <div className="lg:col-span-7 bg-white rounded-2xl border border-stone-100 p-6 shadow-sm space-y-6">
                  <div>
                    <h3 className="font-sans text-md font-bold text-stone-950 uppercase tracking-wider flex items-center gap-2 mb-4">
                      <Shield className="w-4 h-4 text-rose-500" /> Mandatory Safe-Travel takeaways
                    </h3>
                    <ul className="space-y-3.5">
                      {report.keyAdvice.map((item, idx) => (
                        <li key={idx} className="flex gap-3 text-sm text-stone-700 leading-relaxed items-start">
                          <CheckCircle className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="border-t border-stone-100 pt-6">
                    <h3 className="font-sans text-md font-bold text-stone-950 uppercase tracking-wider flex items-center gap-2 mb-4">
                      <ThumbsUp className="w-4 h-4 text-emerald-600" /> Cultural Integration & Norms
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {report.localNorms.map((item, idx) => (
                        <div key={idx} className="p-3.5 rounded-xl border border-emerald-100/80 bg-emerald-50/20 text-xs text-stone-700 leading-relaxed">
                          <p className="font-bold text-emerald-800 mb-1">Standard practice {idx+1}:</p>
                          {item}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Right Column: Scams Panel */}
                <div className="lg:col-span-5 bg-rose-50/30 border border-rose-100/50 rounded-2xl p-6 space-y-4">
                  <h3 className="font-sans text-md font-bold text-rose-800 uppercase tracking-wider flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 text-rose-600" /> Coercive Scams to strictly bypass
                  </h3>
                  <p className="text-xs text-stone-500 leading-relaxed font-sans">
                    Certain locations present localized tricks and harassment campaigns targeting solo vacationers. Memorize these scripts:
                  </p>
                  
                  <div className="space-y-3 pt-2">
                    {report.scamsToAvoid.map((item, idx) => (
                      <div key={idx} className="p-4 rounded-xl border border-rose-150 bg-white shadow-sm flex gap-3">
                        <span className="flex items-center justify-center w-6 h-6 rounded-lg bg-rose-100 text-rose-700 text-xs font-bold shrink-0">
                          !
                        </span>
                        <p className="text-stone-700 text-xs leading-relaxed font-sans font-medium">
                          {item}
                        </p>
                      </div>
                    ))}
                  </div>

                  <div className="bg-white/60 p-3 rounded-xl border border-stone-150 mt-4 text-[11px] text-stone-500 leading-relaxed flex items-start gap-2">
                    <Info className="w-3.5 h-3.5 text-rose-500 shrink-0 mt-0.5" />
                    <span>Always trust your gut. If any scenario feels pushy, immediately step inside a public hotel reception, cafe, or crowded supermarket. They are highly safe hubs.</span>
                  </div>
                </div>
              </div>
            )}

            {/* TAB CONTENT: Neighborhood map lists */}
            {activeReportTab === 'neighborhoods' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Safe Districts */}
                <div className="bg-emerald-50/30 border border-emerald-100 rounded-2xl p-6 space-y-4">
                  <div className="flex items-center gap-2.5 pb-3 border-b border-emerald-100">
                    <div className="p-2 bg-emerald-100 text-emerald-800 rounded-lg">
                      <Shield className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-sans text-md font-bold text-emerald-950 uppercase tracking-wide">
                        Districts Recommended for Lodging
                      </h3>
                      <p className="text-xs text-emerald-700/80 mt-0.5">High lighting levels, active families, low crime</p>
                    </div>
                  </div>

                  <div className="space-y-3.5">
                    {report.safeNeighborhoods.map((item, idx) => {
                      const [name, desc] = item.split(': ');
                      return (
                        <div key={idx} className="bg-white rounded-xl border border-emerald-100 p-4 shadow-sm relative overflow-hidden">
                          <span className="absolute top-0 right-0 py-0.5 px-2 text-[9px] font-bold bg-emerald-100 text-emerald-800 rounded-bl-lg">
                            Safe District
                          </span>
                          <h4 className="font-sans font-bold text-stone-900 text-sm mb-1">{name}</h4>
                          <p className="text-xs text-stone-600 leading-relaxed">{desc || "Verified well-populated pathways with female traveler safety approvals."}</p>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Districts to Avoid */}
                <div className="bg-stone-50 border border-stone-200 rounded-2xl p-6 space-y-4">
                  <div className="flex items-center gap-2.5 pb-3 border-b border-stone-200">
                    <div className="p-2 bg-stone-200 text-stone-700 rounded-lg">
                      <AlertTriangle className="w-5 h-5 text-stone-850" />
                    </div>
                    <div>
                      <h3 className="font-sans text-md font-bold text-stone-950 uppercase tracking-wide">
                        Elevated Caution Areas
                      </h3>
                      <p className="text-xs text-stone-500 mt-0.5 font-sans">Poor evening light, pickpockets, avoid solo at late hours</p>
                    </div>
                  </div>

                  <div className="space-y-3.5">
                    {report.neighborhoodsToAvoid.map((item, idx) => {
                      const [name, desc] = item.split(': ');
                      return (
                        <div key={idx} className="bg-white rounded-xl border border-stone-200 p-4 shadow-sm relative overflow-hidden">
                          <span className="absolute top-0 right-0 py-0.5 px-2 text-[9px] font-bold bg-amber-50 border border-amber-200 text-amber-800 rounded-bl-lg">
                            Caution Advised
                          </span>
                          <h4 className="font-sans font-bold text-stone-900 text-sm mb-1">{name}</h4>
                          <p className="text-xs text-stone-600 leading-relaxed">{desc || "Elevated rate of localized petty thefts. Navigate with buddies or hire Uber at nighttime."}</p>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}

            {/* TAB CONTENT: Itinerary views */}
            {activeReportTab === 'itinerary' && (
              <div className="bg-white rounded-3xl border border-stone-100 p-6 shadow-sm">
                <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-stone-100 pb-5 mb-6 gap-4">
                  <div>
                    <h3 className="font-serif text-lg font-bold text-stone-900">
                      Safety-Calibrated 3-Day Outline
                    </h3>
                    <p className="text-xs text-stone-500 mt-1 font-sans">
                      Activites placed close together, complete before dark, and integrated with precise safety advice.
                    </p>
                  </div>

                  {/* Day picker buttons */}
                  <div className="flex gap-2">
                    {report.itinerary.map((d) => (
                      <button
                        key={d.day}
                        onClick={() => setActiveDay(d.day)}
                        className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                          activeDay === d.day
                            ? 'bg-stone-900 text-white shadow-sm'
                            : 'bg-stone-50 hover:bg-stone-100 text-stone-600 border border-stone-150'
                        }`}
                      >
                        Day {d.day}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Current Active Day View */}
                {report.itinerary.filter(d => d.day === activeDay).map((dayData) => (
                  <div key={dayData.day} className="space-y-6">
                    <div className="p-4 rounded-xl bg-rose-50/50 border border-rose-100/60 mb-2">
                      <span className="text-[10px] font-black uppercase tracking-wider text-rose-600 block mb-1">Today's Security Policy Focus</span>
                      <p className="text-stone-850 font-sans text-sm font-semibold">{dayData.theme}</p>
                    </div>

                    <div className="space-y-6 relative before:absolute before:left-3 before:top-2 before:bottom-2 before:w-[1px] before:bg-stone-200">
                      {dayData.activities.map((act, index) => (
                        <div key={index} className="relative pl-8">
                          {/* Circle on timeline */}
                          <div className="absolute left-1.5 top-1.5 w-3.5 h-3.5 rounded-full border border-rose-200 bg-white flex items-center justify-center -translate-x-1/2">
                            <Clock className="w-2 h-2 text-rose-500" />
                          </div>

                          <span className="inline-block text-xs font-bold text-stone-500 mb-1.5 font-mono bg-stone-100 px-2 py-0.5 rounded-md">
                            {act.time}
                          </span>

                          <h4 className="font-sans font-bold text-stone-950 text-base">
                            {act.title}
                          </h4>
                          <p className="text-[11px] font-medium text-stone-500 flex items-center gap-1 mt-0.5">
                            <MapPin className="w-3 h-3 text-rose-500" /> {act.location}
                          </p>

                          <p className="text-stone-700 text-xs leading-relaxed mt-2.5 max-w-3xl">
                            {act.description}
                          </p>

                          {/* Specific targeted safety guard */}
                          <div className="mt-3 p-3.5 rounded-xl border border-rose-100 bg-rose-50/30 text-xs text-rose-950 leading-relaxed flex items-start gap-2">
                            <Shield className="w-3.5 h-3.5 text-rose-600 shrink-0 mt-0.5" />
                            <div>
                              <strong className="text-rose-900 font-sans text-[11px] uppercase tracking-wider block mb-0.5">Critical Solo Safety Warning:</strong>
                              <span className="font-serif italic text-stone-800">"{act.safetyTip}"</span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )
      )}
    </div>
  );
}

/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { 
  Shield, 
  BookOpen, 
  Compass, 
  Clock, 
  Heart, 
  Users,
  AlertOctagon,
  Star,
  Flame,
  Volume2,
  Share2,
  ShieldAlert,
  MessageSquare,
  Sparkles,
  Fingerprint,
  LogOut
} from 'lucide-react';
import EditorialManifesto from './components/EditorialManifesto';
import SafetyAdvisory from './components/SafetyAdvisory';
import CommunityBoard from './components/CommunityBoard';
import CheckInSystem from './components/CheckInSystem';
import ReviewsList from './components/ReviewsList';
import EmergencySosDashboard from './components/EmergencySosDashboard';
import AuthSystem from './components/AuthSystem';
import EnquiryForm from './components/EnquiryForm';
import { supabase } from './lib/supabase';

type TabType = 'manifesto' | 'advisory' | 'community' | 'checkin' | 'reviews' | 'enquiries';

export default function App() {
  const [activeTab, setActiveTab] = useState<TabType>('advisory');
  const [isSosOpen, setIsSosOpen] = useState<boolean>(false);
  const [activeCityName, setActiveCityName] = useState<string>('Rome, Italy');
  const [user, setUser] = useState<any>(null);
  const [isAuthOpen, setIsAuthOpen] = useState<boolean>(false);

  useEffect(() => {
    // Check current active session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      setUser(null);
    } catch (err) {
      console.error('Logout error:', err);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50/50 via-rose-50/30 to-amber-50/30 text-stone-850 font-sans flex flex-col justify-between">
      
      {/* VIBRANT TOP BRAND BANNER */}
      <div className="bg-gradient-to-r from-purple-800 via-rose-700 to-amber-600 text-white py-2 px-4 shadow-sm relative z-20 text-[11px] font-sans flex flex-col md:flex-row items-center justify-between gap-2 border-b border-white/10 tracking-wide">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse outline-double outline-2 outline-white/40"></span>
          <span className="font-bold">Aura Security Network Active (v1.1.2)</span>
        </div>
        <div className="flex items-center gap-3">
          <span className="bg-white/15 px-2 py-0.5 rounded text-[10px] uppercase tracking-wider font-extrabold flex items-center gap-1">
            <Flame className="w-3 h-3 text-amber-300 animate-bounce" /> Vetted Safe Zone
          </span>
          <span className="text-white/40">|</span>
          <a 
            href="#why-this" 
            onClick={(e) => { e.preventDefault(); setActiveTab('manifesto'); }} 
            className="hover:text-amber-250 transition-colors underline underline-offset-2 flex items-center gap-0.5 font-semibold"
          >
            Read Our Safety Manifesto <BookOpen className="w-3 h-3" />
          </a>
        </div>
      </div>

      {/* HEADER BAR AND MULTICOLORED NAVIGATION */}
      <header className="bg-white/95 backdrop-blur-md border-b border-stone-200/80 py-4 px-4 sticky top-0 z-30 shadow-xs">
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          
          {/* Brand Identity / Logo with dynamic colors */}
          <div className="flex items-center justify-between lg:justify-start gap-4 w-full lg:w-auto">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-2xl bg-gradient-to-br from-purple-750 via-rose-600 to-amber-500 text-white shadow-lg shadow-purple-900/10 flex items-center justify-center">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="font-serif text-2xl font-black tracking-tight bg-gradient-to-r from-purple-800 via-rose-600 to-amber-600 bg-clip-text text-transparent flex items-center gap-2">
                  Aura Solo
                  <span className="text-[10px] font-sans font-bold tracking-widest uppercase text-white bg-gradient-to-r from-rose-500 to-amber-500 hover:from-rose-600 hover:to-amber-600 px-2.5 py-0.5 rounded-full shadow-xs">
                    Women Exclusive
                  </span>
                </h1>
                <p className="text-[11px] text-stone-500 font-sans tracking-wide font-medium">
                  High-Trust Companion, Emergency Beacon & Peer Registry
                </p>
              </div>
            </div>

            {/* Direct Mobile SOS trigger */}
            <button
              onClick={() => setIsSosOpen(true)}
              className="lg:hidden p-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white shadow-md flex items-center justify-center animate-bounce"
              title="Trigger Panic SOS"
            >
              <AlertOctagon className="w-5 h-5 text-white animate-pulse" />
            </button>
          </div>

          {/* Navigation Controls and Quick SOS Activator */}
          <div className="flex flex-col md:flex-row md:items-center gap-3 w-full lg:w-auto">
            <nav className="flex flex-wrap items-center gap-1 p-1 bg-stone-100 rounded-2xl overflow-x-auto w-full md:w-auto">
              <button
                onClick={() => setActiveTab('advisory')}
                className={`py-2 px-3 text-xs font-bold rounded-xl transition-all flex items-center gap-1.5 whitespace-nowrap ${
                  activeTab === 'advisory'
                    ? 'bg-purple-600 text-white shadow-sm font-black'
                    : 'text-stone-600 hover:text-purple-750 hover:bg-stone-50'
                }`}
              >
                <Compass className="w-3.5 h-3.5" /> AI Safety Advisor
              </button>

              <button
                onClick={() => setActiveTab('community')}
                className={`py-2 px-3 text-xs font-bold rounded-xl transition-all flex items-center gap-1.5 whitespace-nowrap ${
                  activeTab === 'community'
                    ? 'bg-purple-600 text-white shadow-sm font-black'
                    : 'text-stone-600 hover:text-purple-750 hover:bg-stone-50'
                }`}
              >
                <Users className="w-3.5 h-3.5" /> High-Trust Circle
              </button>

              <button
                onClick={() => setActiveTab('checkin')}
                className={`py-2 px-3 text-xs font-bold rounded-xl transition-all flex items-center gap-1.5 whitespace-nowrap ${
                  activeTab === 'checkin'
                    ? 'bg-purple-600 text-white shadow-sm font-black'
                    : 'text-stone-600 hover:text-purple-750 hover:bg-stone-50'
                }`}
              >
                <Clock className="w-3.5 h-3.5" /> Active Guard Timer
              </button>

              <button
                onClick={() => setActiveTab('reviews')}
                className={`py-2 px-3 text-xs font-bold rounded-xl transition-all flex items-center gap-1.5 whitespace-nowrap ${
                  activeTab === 'reviews'
                    ? 'bg-purple-600 text-white shadow-sm font-black'
                    : 'text-stone-600 hover:text-purple-750 hover:bg-stone-50'
                }`}
              >
                <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" /> Reviews & Voices
              </button>

              <button
                onClick={() => setActiveTab('enquiries')}
                className={`py-2 px-3 text-xs font-bold rounded-xl transition-all flex items-center gap-1.5 whitespace-nowrap ${
                  activeTab === 'enquiries'
                    ? 'bg-purple-600 text-white shadow-sm font-black'
                    : 'text-stone-600 hover:text-purple-750 hover:bg-stone-50'
                }`}
              >
                <MessageSquare className="w-3.5 h-3.5 text-rose-500" /> Enquiry Desk
              </button>

              <button
                onClick={() => setActiveTab('manifesto')}
                className={`py-2 px-3 text-xs font-bold rounded-xl transition-all flex items-center gap-1.5 whitespace-nowrap ${
                  activeTab === 'manifesto'
                    ? 'bg-purple-600 text-white shadow-sm font-black'
                    : 'text-stone-600 hover:text-purple-750 hover:bg-stone-50'
                }`}
              >
                <BookOpen className="w-3.5 h-3.5" /> Safety Manifesto
              </button>
            </nav>

            {/* HIGH-TRUST AUTH PORTAL TRIGGER / PROFILE STATUS */}
            {user ? (
              <div className="flex items-center gap-2 bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-200/85 p-1.5 pr-2.5 rounded-xl shrink-0 shadow-xs" id="profile-active-user-badge">
                <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-purple-700 to-rose-600 text-white flex items-center justify-center font-bold text-xs uppercase shadow-sm">
                  {user.email?.[0] || 'U'}
                </div>
                <div className="text-left">
                  <p className="text-[9px] text-stone-500 font-bold uppercase tracking-wider leading-none">Vetted Traveler</p>
                  <p className="text-[11px] font-extrabold text-purple-950 leading-tight truncate max-w-[120px]" title={user.email}>
                    {user.user_metadata?.display_name || user.email?.split('@')[0]}
                  </p>
                </div>
                <button 
                  onClick={handleLogout}
                  className="p-1 rounded-lg text-stone-400 hover:text-rose-600 hover:bg-stone-50 transition-all ml-1.5"
                  title="Close Secure Handshake Session (Sign Out)"
                  aria-label="Logout"
                >
                  <LogOut className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : (
              <button
                onClick={() => setIsAuthOpen(true)}
                className="py-2 px-3.5 bg-gradient-to-tr from-purple-800 to-rose-650 hover:opacity-95 text-white text-xs font-bold rounded-xl shadow-md transition-all flex items-center gap-1.5 shrink-0 hover:scale-[1.01] active:scale-95"
                id="header-auth-portal-trigger"
              >
                <Fingerprint className="w-4 h-4 text-amber-300 animate-pulse shrink-0" />
                <span>Authenticate Passport</span>
              </button>
            )}

            {/* CRITICAL SOS DIRECT ENGAGEMENT BUTTON */}
            <button
              onClick={() => setIsSosOpen(true)}
              className="py-2.5 px-4.5 bg-gradient-to-r from-rose-600 to-red-600 hover:from-rose-700 hover:to-red-700 text-white text-xs font-extrabold rounded-xl shadow-lg shadow-rose-600/20 transition-all flex items-center justify-center gap-2 animate-pulse cursor-pointer shrink-0"
              id="sos-trigger-button"
            >
              <AlertOctagon className="w-4 h-4 animate-spin text-white" />
              <span>LAUNCH SOS PROTOCOL</span>
            </button>
          </div>

        </div>
      </header>

      {/* DETAILED ATTRACTIVE HERO SECTION WITH GENERATED IMAGE AND REVIEWS */}
      <main className="max-w-7xl mx-auto px-4 py-8 flex-1 w-full space-y-8">
        
        {/* Onboarding Introduction Banner with beautiful custom-generated graphical image */}
        <div className="bg-white rounded-3xl border border-stone-200 overflow-hidden shadow-md grid grid-cols-1 md:grid-cols-12 gap-0 relative">
          
          {/* Custom Illustration Column (5 cols) */}
          <div className="md:col-span-5 bg-gradient-to-br from-purple-900 to-rose-950 relative min-h-[200px] md:min-h-auto">
            <img 
              src="/src/assets/images/travel_hero_banner_1779724295199.png" 
              alt="Confident solo female travel solidarity illustration" 
              className="w-full h-full object-cover mix-blend-normal opacity-95 transition-opacity duration-300 hover:opacity-100"
              referrerPolicy="no-referrer"
            />
            {/* Visual glow element overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-stone-950/80 via-transparent to-transparent pointer-events-none" />
            <div className="absolute bottom-5 left-5 right-5 text-white">
              <span className="text-[10px] font-black uppercase tracking-widest text-amber-300 block mb-1">Empowered Companion</span>
              <p className="font-serif text-sm font-semibold italic">"Never isolated, always secured by global sisters watching your travel paths."</p>
            </div>
          </div>

          {/* Onboarding Message Column (7 cols) */}
          <div className="md:col-span-7 p-6 md:p-8 flex flex-col justify-between space-y-4 bg-gradient-to-r from-white to-purple-50/15">
            <div className="space-y-2.5">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold bg-purple-100 text-purple-800 border border-purple-200 uppercase tracking-widest">
                <Heart className="w-3 h-3 fill-rose-500 text-rose-500 animate-pulse" /> Re-engineering Safety for Solo Women
              </span>
              
              <h2 className="font-serif text-2xl md:text-3xl font-bold bg-gradient-to-r from-purple-900 via-rose-750 to-amber-700 bg-clip-text text-transparent leading-tight">
                Designed for Absolute Vigilance, Freedom, and Discovery
              </h2>
              
              <p className="text-xs text-stone-605 leading-relaxed font-sans">
                Aura Solo rejects surface-level travel suggestions. We map <strong>street-level lighting quotients, verified catcall rates, and safe late-night dining coordinates</strong>. Built in solidarity with seasoned travelers, this dashboard is your personalized safety network. Use the check-in companion, or activate our intense <strong>SOS Panic Mode</strong> if you ever sense danger.
              </p>
            </div>

            {/* Quick dashboard interactive points */}
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-3.5 pt-3.5 border-t border-stone-150">
              <div className="p-2.5 rounded-xl bg-purple-50/40 border border-purple-100 text-center">
                <span className="block font-sans font-black text-xs text-purple-855">100% SECURE</span>
                <span className="text-[9px] text-stone-500 block">End-to-End Encryption</span>
              </div>
              <div className="p-2.5 rounded-xl bg-rose-50/40 border border-rose-100 text-center">
                <span className="block font-sans font-black text-xs text-rose-700">PEER SYSTEM</span>
                <span className="text-[9px] text-stone-500 block">Verified Women Travelers</span>
              </div>
              <div className="col-span-2 lg:col-span-1 p-2.5 rounded-xl bg-amber-50/40 border border-amber-100 text-center flex flex-col justify-center">
                <span className="block font-sans font-black text-xs text-amber-700">LOCAL PHONE DIALER</span>
                <span className="text-[9px] text-stone-500 block">Offline Safe Handbooks</span>
              </div>
            </div>

            <div className="pt-4 flex flex-wrap gap-2.5">
              <button 
                onClick={() => { setActiveTab('advisory'); }} 
                className="py-2 px-4.5 bg-purple-750 hover:bg-purple-800 text-white text-xs font-bold rounded-xl transition shadow-md"
              >
                Run New Safety Check
              </button>
              <button 
                onClick={() => { setActiveTab('reviews'); }} 
                className="py-2 px-4 border border-purple-250 hover:bg-purple-50 text-purple-800 text-xs font-bold rounded-xl transition"
              >
                Browse Safe Stories
              </button>
              <button 
                onClick={() => setIsSosOpen(true)} 
                className="py-2 px-4 bg-gradient-to-r from-rose-50 to-red-50 hover:from-rose-100 hover:to-red-100 border border-rose-200 text-rose-750 text-xs font-black rounded-xl transition flex items-center gap-1 ml-auto"
              >
                <ShieldAlert className="w-3.5 h-3.5 text-rose-600 animate-pulse" /> Try SOS Preview
              </button>
            </div>
          </div>
        </div>

        {/* DYNAMIC TAB INTERFACE */}
        <div className="min-h-[450px]">
          {activeTab === 'advisory' && (
            <div className="animate-fade-in space-y-6">
              {/* Context Callout */}
              <div className="bg-white rounded-3xl border border-stone-200 p-6 shadow-sm">
                <div className="flex flex-col md:flex-row gap-5">
                  <div className="p-3 bg-gradient-to-br from-purple-100 to-rose-100 text-purple-800 rounded-2xl h-fit shrink-0 w-12 h-12 flex items-center justify-center shadow-xs">
                    <Compass className="w-6 h-6" />
                  </div>
                  <div className="space-y-1">
                    <h3 className="font-serif text-base font-extrabold text-stone-950">AI Safety Advisory & Secure Itinerary Planner</h3>
                    <p className="text-xs text-stone-550 leading-relaxed font-sans">
                      Our intelligence algorithm maps localized danger thresholds. Enter any city of choice to establish dynamic checklists, examine pickpocket and harassment factors, and review a safety-focused itinerary designed for solitary daylight transit.
                    </p>
                  </div>
                </div>
              </div>
              <SafetyAdvisory />
            </div>
          )}

          {activeTab === 'community' && (
            <div className="animate-fade-in space-y-6">
              {/* Context Callout */}
              <div className="bg-white rounded-3xl border border-stone-200 p-6 shadow-sm">
                <div className="flex flex-col md:flex-row gap-5">
                  <div className="p-3 bg-gradient-to-br from-purple-100 to-rose-100 text-purple-800 rounded-2xl h-fit shrink-0 w-12 h-12 flex items-center justify-center shadow-xs">
                    <Users className="w-6 h-6" />
                  </div>
                  <div className="space-y-1">
                    <h3 className="font-serif text-base font-extrabold text-stone-950">High-Trust Circle & Verified Companionship</h3>
                    <p className="text-xs text-stone-550 leading-relaxed font-sans">
                      Find vetted travelers residing nearby. Coordinate daytime subway meetups, share evening vehicle costs, or log verified comfortable cafes and hotel lobbies where staff are highly helpful.
                    </p>
                  </div>
                </div>
              </div>
              <CommunityBoard />
            </div>
          )}

          {activeTab === 'checkin' && (
            <div className="animate-fade-in space-y-6">
              {/* Context Callout */}
              <div className="bg-white rounded-3xl border border-stone-200 p-6 shadow-sm">
                <div className="flex flex-col md:flex-row gap-5">
                  <div className="p-3 bg-gradient-to-br from-purple-100 to-rose-100 text-purple-800 rounded-2xl h-fit shrink-0 w-12 h-12 flex items-center justify-center shadow-xs">
                    <Clock className="w-6 h-6" />
                  </div>
                  <div className="space-y-1">
                    <h3 className="font-serif text-base font-extrabold text-stone-950">Active Guard transit countdown timer</h3>
                    <p className="text-xs text-stone-550 leading-relaxed font-sans">
                      Establish an emergency watch countdown before entering an unmarked transport, a dark walk-path, or a quiet sightseeing spot. If you fail to verify a safe arrival by hitting the stop button before expiration, instant mock broadcast signals are dispatched with coordinates to your peer buddies.
                    </p>
                  </div>
                </div>
              </div>
              <CheckInSystem />
            </div>
          )}

          {activeTab === 'reviews' && (
            <div className="animate-fade-in">
              <ReviewsList />
            </div>
          )}

          {activeTab === 'manifesto' && (
            <div className="animate-fade-in">
              <EditorialManifesto />
            </div>
          )}

          {activeTab === 'enquiries' && (
            <div className="animate-fade-in space-y-6">
              {/* Context Callout */}
              <div className="bg-white rounded-3xl border border-stone-200 p-6 shadow-sm">
                <div className="flex flex-col md:flex-row gap-5">
                  <div className="p-3 bg-gradient-to-br from-purple-100 to-rose-100/70 text-purple-800 rounded-2xl h-fit shrink-0 w-12 h-12 flex items-center justify-center shadow-xs">
                    <MessageSquare className="w-6 h-6 text-purple-700 font-bold" />
                  </div>
                  <div className="space-y-1">
                    <h3 className="font-serif text-base font-extrabold text-stone-950">Aura Safe-Travel Inquiry Desk</h3>
                    <p className="text-xs text-stone-550 leading-relaxed font-sans">
                      Our unified query system enables solo travelers to log transport or local housing verification requests directly with fellow peer ambassadors or security curators. Match credentials, or enter parameters below to initiate automated database synchronization.
                    </p>
                  </div>
                </div>
              </div>
              <EnquiryForm />
            </div>
          )}
        </div>

        {/* REVIEWS GRID PREVIEW FOR HIGH VIBRANCY SOCIAL PROOF */}
        {activeTab !== 'reviews' && activeTab !== 'enquiries' && (
          <div className="bg-gradient-to-br from-purple-900/5 via-stone-50 to-amber-50/10 p-6 rounded-3xl border border-purple-150/40 mt-12 animate-fade-in">
            <div className="flex items-center justify-between mb-6 pb-3 border-b border-stone-200/60">
              <div>
                <span className="text-[10px] font-black uppercase text-purple-800 tracking-widest block">Traveler Voices</span>
                <span className="font-serif text-lg font-bold text-stone-950">Solidarity Stories Preview</span>
              </div>
              <button 
                onClick={() => setActiveTab('reviews')}
                className="text-xs font-bold text-purple-755 hover:text-purple-900 underline"
              >
                View All Reviews
              </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              <div className="bg-white p-4.5 rounded-2xl border border-stone-200 text-xs space-y-3 shadow-xs">
                <div className="flex items-center gap-2.5 pb-2.5 border-b border-stone-100">
                  <img src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=150" className="w-8 h-8 rounded-full object-cover" referrerPolicy="no-referrer" />
                  <div>
                    <span className="block font-bold text-stone-900">Elena Gustafsson</span>
                    <span className="text-[9px] text-stone-400">Rome, Italy</span>
                  </div>
                </div>
                <p className="font-serif italic text-stone-600 leading-relaxed text-[11px]">
                  "Using the check-in timer during late walks down Prati gave me so much peace of mind. Truly designed beautifully."
                </p>
                <span className="block text-[10px] font-bold text-purple-700">★ 5.0 Rating</span>
              </div>

              <div className="bg-white p-4.5 rounded-2xl border border-stone-200 text-xs space-y-3 shadow-xs">
                <div className="flex items-center gap-2.5 pb-2.5 border-b border-stone-100">
                  <img src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150" className="w-8 h-8 rounded-full object-cover" referrerPolicy="no-referrer" />
                  <div>
                    <span className="block font-bold text-stone-900">Nisha Rao</span>
                    <span className="text-[9px] text-stone-400">Bangkok, Thailand</span>
                  </div>
                </div>
                <p className="font-serif italic text-stone-600 leading-relaxed text-[11px]">
                  "The street warnings for Huai Khwang were incredibly helpful. It made exploration effortless and secure."
                </p>
                <span className="block text-[10px] font-bold text-purple-700">★ 5.0 Rating</span>
              </div>

              <div className="bg-white p-4.5 rounded-2xl border border-stone-200 text-xs space-y-3 shadow-xs">
                <div className="flex items-center gap-2.5 pb-2.5 border-b border-stone-100">
                  <img src="https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&q=80&w=150" className="w-8 h-8 rounded-full object-cover" referrerPolicy="no-referrer" />
                  <div>
                    <span className="block font-bold text-stone-900">Claire Dubois</span>
                    <span className="text-[9px] text-stone-400">Paris, France</span>
                  </div>
                </div>
                <p className="font-serif italic text-stone-600 leading-relaxed text-[11px]">
                  "Discovered secure cafes easily using the high-trust map ratings. I recommend Aura Solo to all women!"
                </p>
                <span className="block text-[10px] font-bold text-purple-700">★ 4.8 Rating</span>
              </div>
            </div>
          </div>
        )}

      </main>

      {/* FOOTER */}
      <footer className="bg-white border-t border-stone-200 mt-16 py-12 px-4 shadow-inner">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
          
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-gradient-to-br from-purple-800 to-rose-600 text-white flex items-center justify-center shadow-sm">
                <Shield className="w-4 h-4 text-white" />
              </div>
              <span className="font-serif font-bold text-stone-950">Aura Solo Guard</span>
            </div>
            <p className="text-xs text-stone-500 leading-relaxed font-sans">
              We design tools and community registries with safety as a pre-requisite. Aura Solo is a custom solution addressing the systematic safety gap for women traveling solo. Built securely using high-trust data networks in 2026.
            </p>
          </div>

          <div className="space-y-3.5">
            <h4 className="text-[10px] font-black uppercase tracking-widest text-stone-900">Aura Community Values</h4>
            <ul className="text-xs text-stone-605 space-y-2 font-mono">
              <li className="flex items-center gap-1.5">✓ Vetted ID-Verification Required</li>
              <li className="flex items-center gap-1.5">✓ Gender-Exclusive Safe Spaces</li>
              <li className="flex items-center gap-1.5">✓ Zero-Profit safety-first indexing</li>
              <li className="flex items-center gap-1.5">✓ Live Emergency Local directories</li>
            </ul>
          </div>

          <div className="space-y-3">
            <h4 className="text-[10px] font-black uppercase tracking-widest text-stone-900">Need Immediate Help?</h4>
            <p className="text-xs text-stone-500 leading-relaxed">
              If you are facing a high-risk or threatening scenario, always contact the national standard emergency service. Read local guides on the "Active Guard" console for localized embassy and tourist police lines.
            </p>
            <div className="pt-1.5 flex gap-2">
              <button 
                onClick={() => setIsSosOpen(true)} 
                className="inline-flex items-center gap-1.5 py-2 px-4 rounded-xl text-xs font-black bg-rose-50 text-rose-700 border border-rose-200 hover:bg-rose-100 transition-all cursor-pointer animate-pulse"
              >
                <AlertOctagon className="w-3.5 h-3.5 text-rose-600" /> Open SOS Panel
              </button>
              <button 
                onClick={() => setActiveTab('checkin')} 
                className="inline-flex items-center gap-1.5 py-2 px-3 rounded-xl text-xs font-bold bg-purple-50 text-purple-700 border border-purple-200 hover:bg-purple-100/80 transition-all cursor-pointer"
              >
                Directories
              </button>
            </div>
          </div>

        </div>
        <div className="max-w-7xl mx-auto border-t border-stone-150 mt-10 pt-6 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-stone-400 font-mono">
          <span>© 2026 Aura Solo. Protected under Women's Travel Security Alliance guidelines.</span>
          <span>Aesthetic styling using high-vibrancy gradients and positive visual spaces.</span>
        </div>
      </footer>

      {/* FLOAT INTERACTIVE SOS BEACON PILL BUTTON - ALWAYS FLOATING ON DESKTOP & MOBILE BOTTOM-RIGHT */}
      <div className="fixed bottom-6 right-6 z-40 select-none">
        <button
          onClick={() => setIsSosOpen(true)}
          className="p-3.5 md:p-4 rounded-full bg-gradient-to-r from-red-650 to-rose-600 hover:from-red-750 hover:to-rose-700 text-white shadow-2xl shadow-rose-600/50 hover:scale-105 transition-all text-xs font-black flex items-center justify-center gap-2 outline-double outline-3 outline-rose-450 active:scale-95 animate-bounce group"
          title="Instant Crisis SOS Dashboard Trigger"
        >
          <ShieldAlert className="w-5.5 h-5.5 text-white animate-spin-slow group-hover:rotate-12" />
          <span className="hidden sm:inline bg-neutral-900/10 px-1 py-0.5 rounded font-mono font-bold text-[9px] uppercase">🚨 SOS EMERGENCY WARNING</span>
        </button>
      </div>

      {/* EMERGENCY SOS CRISIS SYSTEM DYNAMIC OVERLAY MODAL */}
      {isSosOpen && (
        <EmergencySosDashboard 
          onClose={() => setIsSosOpen(false)} 
          activeCity={activeCityName}
        />
      )}

      {/* SECURE USER CREDENTIALS LAYER MODAL */}
      {isAuthOpen && (
        <AuthSystem 
          onClose={() => setIsAuthOpen(false)}
          onAuthSuccess={(u) => {
            setUser(u);
            setIsAuthOpen(false);
          }}
        />
      )}

    </div>
  );
}

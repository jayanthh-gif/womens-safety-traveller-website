/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Star, ThumbsUp, MapPin, CheckCircle, Quote, Heart, Database, Plus } from 'lucide-react';
import { getSupabaseReviews, insertSupabaseReview, isSupabaseConfigured, supabase } from '../lib/supabase';

interface Review {
  id: string;
  name: string;
  country: string;
  avatar: string;
  city: string;
  rating: number;
  date: string;
  title: string;
  content: string;
  safetyFocus: string;
  tag: string;
  helpfulCount: number;
  hasUpvoted?: boolean;
}

const INITIAL_REVIEWS: Review[] = [
  {
    id: "rev-1",
    name: "Elena Gustafsson",
    country: "Stockholm, Sweden",
    avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=150",
    city: "Rome, Italy",
    rating: 5,
    date: "May 22, 2026",
    title: "Aura's walking timer gave me complete peace of mind in Monti!",
    content: "I used the Active Guard timer while walking back to my hostel in the Monti district past 11 PM. Knowing that Sarah and Claire would get a notification if I didn't click 'I am safe' meant I didn't feel isolated or anxious. The neighborhood was actually lovely and well-lit, but having that safety net was everything.",
    safetyFocus: "Night Illumination & Companion Sync",
    tag: "Solo Night Walks",
    helpfulCount: 84
  },
  {
    id: "rev-2",
    name: "Nisha Rao",
    country: "New Delhi, India",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150",
    city: "Bangkok, Thailand",
    rating: 5,
    date: "May 18, 2026",
    title: "Best street-level advice. Skipped all untrusted transport!",
    content: "The Catcall Index and scam warnings for Huai Khwang in Bangkok were spot on. I loaded the guide and saw warnings about unbooked taxis. I immediately used Grab and stayed in the families-heavy safe zones Aura suggested. Felt completely empowered and in control of my trip!",
    safetyFocus: "Scam Detection & Transit Safety",
    tag: "Vetted Transit Only",
    helpfulCount: 56
  },
  {
    id: "rev-3",
    name: "Akiyo Sato",
    country: "Osaka, Japan",
    avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=150",
    city: "Paris, France",
    rating: 4,
    date: "May 15, 2026",
    title: "Split evening taxi costs with an amazing sister!",
    content: "I connected with Zoe on the High-Trust Circle page. We were both exploring Belleville and didn't want to walk through the metro stations alone after dark. We split a vetted taxi back and had a marvelous dinner! Aura turns scary situations into secure sisterly friendships.",
    safetyFocus: "Peer-to-Peer Safe Transit Match",
    tag: "Buddy Match Approved",
    helpfulCount: 112
  },
  {
    id: "rev-4",
    name: "Chloe Henderson",
    country: "California, USA",
    avatar: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&q=80&w=150",
    city: "Tokyo, Japan",
    rating: 5,
    date: "May 25, 2026",
    title: "The local language emergency cards are genius!",
    content: "When my phone began running low on battery, I pulled up the pre-rendered Japanese emergency card from the active guard. Showing that polite Japanese phrase directly to a station manager got me escorted straight to a secure ladies-only carriage. Aura literally thought of everything.",
    safetyFocus: "Localized Flash Cards & Rapid Response",
    tag: "Emergency Support",
    helpfulCount: 97
  }
];

export default function ReviewsList() {
  const [reviews, setReviews] = useState<Review[]>(() => {
    const cached = localStorage.getItem('aura_safety_reviews');
    return cached ? JSON.parse(cached) : INITIAL_REVIEWS;
  });

  const [supabaseConnected, setSupabaseConnected] = useState<boolean>(false);
  const [isSyncing, setIsSyncing] = useState<boolean>(false);
  const [authUser, setAuthUser] = useState<any>(null);

  // Form states
  const [showAddForm, setShowAddForm] = useState(false);
  const [newName, setNewName] = useState('');
  const [newCountry, setNewCountry] = useState('Toronto, Canada');
  const [newCity, setNewCity] = useState('Rome, Italy');
  const [newRating, setNewRating] = useState(5);
  const [newTitle, setNewTitle] = useState('');
  const [newContent, setNewContent] = useState('');
  const [newSafetyFocus, setNewSafetyFocus] = useState('Walking Lights & Group Sync');
  const [newTag, setNewTag] = useState('Solo Transit Safety');

  useEffect(() => {
    localStorage.setItem('aura_safety_reviews', JSON.stringify(reviews));
  }, [reviews]);

  // Auth User Sync
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        setAuthUser(session.user);
        setNewName(session.user.user_metadata?.display_name || session.user.email?.split('@')[0] || '');
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        setAuthUser(session.user);
        setNewName(session.user.user_metadata?.display_name || session.user.email?.split('@')[0] || '');
      } else {
        setAuthUser(null);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  // Load from Supabase on start
  useEffect(() => {
    async function loadReviews() {
      if (!isSupabaseConfigured()) return;
      try {
        const dbReviews = await getSupabaseReviews();
        if (dbReviews && dbReviews.length > 0) {
          setReviews(prev => {
            const merged = [...dbReviews];
            prev.forEach(p => {
              if (!merged.some(m => m.id === p.id)) {
                merged.push(p);
              }
            });
            return merged;
          });
          setSupabaseConnected(true);
        } else if (dbReviews !== null) {
          setSupabaseConnected(true);
        }
      } catch (err) {
        console.warn('Supabase reviews load failure:', err);
      }
    }
    loadReviews();
  }, []);

  const handleHelpfulClick = (id: string) => {
    setReviews(prev => {
      const updated = prev.map(rev => {
        if (rev.id === id) {
          const alreadyUpvoted = rev.hasUpvoted;
          const updatedRev = {
            ...rev,
            helpfulCount: alreadyUpvoted ? rev.helpfulCount - 1 : rev.helpfulCount + 1,
            hasUpvoted: !alreadyUpvoted
          };
          if (supabaseConnected) {
            insertSupabaseReview(updatedRev);
          }
          return updatedRev;
        }
        return rev;
      });
      localStorage.setItem('aura_safety_reviews', JSON.stringify(updated));
      return updated;
    });
  };

  const handleCreateReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim() || !newTitle.trim() || !newContent.trim()) return;

    const newReview: Review = {
      id: `rev-${Date.now()}`,
      name: newName,
      country: newCountry,
      avatar: "https://images.unsplash.com/photo-154405313-94ddf0286df2?auto=format&fit=crop&q=80&w=150",
      city: newCity,
      rating: Number(newRating),
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      title: newTitle,
      content: newContent,
      safetyFocus: newSafetyFocus,
      tag: newTag,
      helpfulCount: 1,
      hasUpvoted: false
    };

    setIsSyncing(true);
    if (isSupabaseConfigured()) {
      await insertSupabaseReview(newReview);
    }

    setReviews(prev => {
      const updated = [newReview, ...prev];
      localStorage.setItem('aura_safety_reviews', JSON.stringify(updated));
      return updated;
    });
    setIsSyncing(false);

    // Reset Form
    setNewName('');
    setNewTitle('');
    setNewContent('');
    setShowAddForm(false);
  };

  return (
    <div className="space-y-6">
      {/* Supabase Reviews Sync Banner */}
      <div className={`p-4 rounded-2xl border flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs leading-relaxed ${
        supabaseConnected 
          ? 'bg-purple-50/70 border-purple-200 text-purple-800' 
          : 'bg-stone-50/85 border-stone-200 text-stone-605'
      }`}>
        <div className="flex items-center gap-2.5">
          <div className={`p-2 rounded-xl shrink-0 ${
            supabaseConnected ? 'bg-purple-100 text-purple-700' : 'bg-stone-100 text-stone-600'
          }`}>
            <Database className="w-4 h-4" />
          </div>
          <div>
            <p className="font-extrabold flex items-center gap-1.5 text-stone-900">
              Reviews Integrator: {supabaseConnected ? 'Supabase Sync Connected' : 'Local Sandbox Storage'}
              {supabaseConnected && <span className="w-2 h-2 rounded-full bg-purple-500 animate-ping" />}
            </p>
            <p className="text-[10.5px] text-stone-500 font-medium">
              {supabaseConnected 
                ? 'Your reviews are successfully backed up to your live cloud database.' 
                : 'Seeded sandbox active. Custom reviews will persist in your browser cache.'}
            </p>
          </div>
        </div>
        
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="py-1.5 px-3.5 bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs rounded-xl shadow-xs transition-all flex items-center gap-1 shrink-0 self-start sm:self-auto"
        >
          <Plus className="w-3.5 h-3.5 text-white" /> Write Review
        </button>
      </div>

      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-800 border border-amber-200 uppercase tracking-widest mb-2.5">
            <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" /> Travelers' Solidarity Network
          </span>
          <h2 className="font-serif text-2xl font-bold tracking-tight text-stone-900">
            Real Reviews, Real Sisterhood
          </h2>
          <p className="text-xs text-stone-550 max-w-xl font-sans mt-0.5">
            Read verified safety evaluations and active transit logs reported directly by your fellow global explorers. No generic hotel affiliate clickbait here.
          </p>
        </div>
        
        {/* Statistics highlights */}
        <div className="flex gap-4 bg-white/60 p-3 rounded-2xl border border-stone-200/80 shrink-0">
          <div className="text-center px-2">
            <span className="block font-sans font-black text-xl text-purple-650">4.9★</span>
            <span className="text-[10px] text-stone-500 font-bold uppercase tracking-wide">Avg Travel Score</span>
          </div>
          <div className="w-[1px] bg-stone-200 h-8 self-center"></div>
          <div className="text-center px-2">
            <span className="block font-sans font-black text-xl text-rose-600">12,650+</span>
            <span className="text-[10px] text-stone-500 font-bold uppercase tracking-wide">Verified Safe Check-ins</span>
          </div>
        </div>
      </div>

      {/* SUBMIT REVIEW EXPANDED DRAWER/FORM */}
      {showAddForm && (
        <div className="bg-gradient-to-br from-purple-50/40 to-stone-100/50 rounded-2xl border border-purple-200 p-6 shadow-md animate-fade-in">
          <div className="flex justify-between items-center mb-4">
            <h4 className="font-serif text-base font-bold text-stone-900">
              Submit your solo traveler safety experience
            </h4>
            <button 
              onClick={() => setShowAddForm(false)}
              className="text-stone-400 hover:text-stone-850 text-xs"
            >
              [Cancel]
            </button>
          </div>
          
          <form onSubmit={handleCreateReview} className="grid grid-cols-1 md:grid-cols-12 gap-4">
            <div className="md:col-span-4">
              <label className="block text-[10px] font-bold uppercase tracking-wider text-stone-600 mb-1">Your Name</label>
              <input 
                type="text" 
                value={newName} 
                onChange={e => setNewName(e.target.value)} 
                placeholder="e.g. Chloe Henderson" 
                required
                className="w-full text-xs border border-stone-200 p-2 rounded-lg bg-white"
              />
            </div>

            <div className="md:col-span-4">
              <label className="block text-[10px] font-bold uppercase tracking-wider text-stone-600 mb-1">Your Hometown/Country</label>
              <input 
                type="text" 
                value={newCountry} 
                onChange={e => setNewCountry(e.target.value)} 
                placeholder="e.g. California, USA" 
                required
                className="w-full text-xs border border-stone-200 p-2 rounded-lg bg-white"
              />
            </div>

            <div className="md:col-span-4">
              <label className="block text-[10px] font-bold uppercase tracking-wider text-stone-600 mb-1">Visited City</label>
              <input 
                type="text" 
                value={newCity} 
                onChange={e => setNewCity(e.target.value)} 
                placeholder="e.g. Rome, Italy" 
                required
                className="w-full text-xs border border-stone-200 p-2 rounded-lg bg-white"
              />
            </div>

            <div className="md:col-span-4">
              <label className="block text-[10px] font-bold uppercase tracking-wider text-stone-600 mb-1">Safety Focus Spotlight</label>
              <input 
                type="text" 
                value={newSafetyFocus} 
                onChange={e => setNewSafetyFocus(e.target.value)} 
                placeholder="e.g. Night Lighting, Taxi validation" 
                required
                className="w-full text-xs border border-stone-200 p-2 rounded-lg bg-white"
              />
            </div>

            <div className="md:col-span-4">
              <label className="block text-[10px] font-bold uppercase tracking-wider text-stone-600 mb-1">Topic Category Hashtag</label>
              <input 
                type="text" 
                value={newTag} 
                onChange={e => setNewTag(e.target.value)} 
                placeholder="Solo Night Walks" 
                required
                className="w-full text-xs border border-stone-200 p-2 rounded-lg bg-white"
              />
            </div>

            <div className="md:col-span-4">
              <label className="block text-[10px] font-bold uppercase tracking-wider text-stone-600 mb-1">Safety Rating (1-5)</label>
              <select 
                value={newRating} 
                onChange={e => setNewRating(Number(e.target.value))}
                className="w-full text-xs border border-stone-200 p-2 rounded-lg bg-white"
              >
                <option value="5">⭐⭐⭐⭐⭐ Phenomenal Safety</option>
                <option value="4">⭐⭐⭐⭐ Fully Secure</option>
                <option value="3">⭐⭐⭐ Standard</option>
                <option value="2">⭐⭐ Under-lit / Caution Required</option>
              </select>
            </div>

            <div className="md:col-span-12">
              <label className="block text-[10px] font-bold uppercase tracking-wider text-stone-600 mb-1">Review Title</label>
              <input 
                type="text" 
                value={newTitle} 
                onChange={e => setNewTitle(e.target.value)} 
                placeholder="e.g. Aura's walkpath guides saved me completely!" 
                required
                className="w-full text-xs border border-stone-200 p-2 rounded-lg bg-white mb-1"
              />
            </div>

            <div className="md:col-span-12">
              <label className="block text-[10px] font-bold uppercase tracking-wider text-stone-600 mb-1">Your Detailed Experience ( lighting, staff, safe exits, transport )</label>
              <textarea 
                value={newContent} 
                onChange={e => setNewContent(e.target.value)} 
                placeholder="Detail the layout walkways, hospitality or support options you uncovered..." 
                required
                rows={3}
                className="w-full text-xs border border-stone-200 p-2 rounded-lg bg-white"
              />
            </div>

            <div className="md:col-span-12 flex justify-end">
              <button 
                type="submit" 
                disabled={isSyncing}
                className="w-full md:w-auto py-2 px-6 bg-purple-650 hover:bg-purple-750 text-white font-bold rounded-xl text-xs transition-all"
              >
                {isSyncing ? 'Publishing to Cloud Datastore...' : 'Publish safety evaluation'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Review Cards Grid */}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {reviews.map((rev) => (
          <div 
            key={rev.id} 
            className="bg-white rounded-2xl border-2 border-stone-100 p-6 shadow-sm hover:shadow-md hover:border-purple-200 transition-all duration-300 relative flex flex-col justify-between"
            id={`review-${rev.id}`}
          >
            <div>
              {/* Card top banner/tags */}
              <div className="flex items-center justify-between gap-2 mb-4">
                <span className="inline-flex items-center gap-1 text-[10px] font-bold bg-purple-50 text-purple-700 border border-purple-100 px-2 py-0.5 rounded-md font-mono">
                  # {rev.tag}
                </span>
                <span className="text-[10px] text-stone-400 font-mono italic">
                  {rev.date}
                </span>
              </div>

              {/* Reviewer identity block */}
              <div className="flex items-center gap-3.5 pb-4 border-b border-stone-100 mb-4">
                <div className="relative">
                  <img 
                    src={rev.avatar} 
                    alt={rev.name} 
                    className="w-12 h-12 rounded-full border-2 border-purple-100 object-cover shrink-0"
                    referrerPolicy="no-referrer"
                  />
                  <span className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-500 text-white rounded-full flex items-center justify-center text-[8px] font-bold border border-white">
                    ✓
                  </span>
                </div>
                <div>
                  <h4 className="font-sans font-extrabold text-stone-900 text-sm flex items-center gap-1">
                    {rev.name}
                    <CheckCircle className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  </h4>
                  <p className="text-[10px] text-stone-500">From {rev.country}</p>
                </div>
              </div>

              {/* City location badge & stars */}
              <div className="flex items-center justify-between mb-3">
                <span className="inline-flex items-center gap-1 text-xs font-bold text-rose-800 bg-rose-50 border border-rose-100/60 px-2.5 py-1 rounded-lg">
                  <MapPin className="w-3.5 h-3.5 text-rose-500" /> {rev.city}
                </span>
                <div className="flex text-amber-400 select-none">
                  {Array(rev.rating).fill(null).map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                  ))}
                </div>
              </div>

              {/* Quote details */}
              <div className="relative pl-6 py-2.5">
                <Quote className="w-5 h-5 text-purple-200/60 absolute left-0 top-0 flip-x" />
                <h5 className="font-sans font-bold text-stone-900 text-xs mb-1.5">
                  "{rev.title}"
                </h5>
                <p className="text-xs text-stone-605 font-serif italic leading-relaxed">
                  {rev.content}
                </p>
              </div>
            </div>

            {/* Quality control footer bar */}
            <div className="border-t border-stone-100 pt-4 mt-6 flex items-center justify-between text-xs">
              <span className="text-[10px] font-bold text-stone-500 uppercase tracking-wider font-sans">
                🛡️ Focus: <strong className="text-purple-650">{rev.safetyFocus}</strong>
              </span>

              <button
                onClick={() => handleHelpfulClick(rev.id)}
                className={`py-1.5 px-3.5 rounded-xl text-xs font-extrabold flex items-center gap-1.5 transition-all border ${
                  rev.hasUpvoted
                    ? 'bg-purple-150 border-purple-300 text-purple-800'
                    : 'bg-stone-50/50 hover:bg-stone-100/80 text-stone-600 border-stone-250'
                }`}
              >
                <ThumbsUp className="w-3.5 h-3.5" /> 
                <span>Helpful ({rev.helpfulCount})</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Sisterhood Guarantee Callout */}
      <div className="p-5 rounded-2xl bg-gradient-to-r from-purple-100/40 via-rose-50/40 to-amber-50/40 border border-purple-150/60 flex flex-col md:flex-row items-center justify-between gap-4 mt-6">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-full bg-purple-100 text-purple-700 shrink-0">
            <Heart className="w-5 h-5 fill-purple-600" />
          </div>
          <div>
            <h4 className="font-sans font-bold text-sm text-stone-900">Are you currently traveling solo or resting post-flight?</h4>
            <p className="text-xs text-stone-550 leading-relaxed max-w-xl">
              Upload your walking paths, evaluate hotel reception hospitality, or log catcall areas to keep this network extremely reliable and robust for the next traveler.
            </p>
          </div>
        </div>
        <button 
          onClick={() => {
            setShowAddForm(true);
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          className="py-2 px-4 bg-purple-650 hover:bg-purple-700 text-white font-bold text-xs rounded-xl shadow-md transition-all shrink-0"
        >
          Write a Safety Review
        </button>
      </div>
    </div>
  );
}

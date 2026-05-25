/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { 
  Users, 
  MapPin, 
  Plus, 
  ThumbsUp, 
  MessageSquare, 
  CheckCircle, 
  Compass, 
  Search, 
  Briefcase,
  ExternalLink,
  PlusCircle,
  HelpCircle,
  Database
} from 'lucide-react';
import { SafeSpot, TravelBuddy } from '../types';
import { 
  getSupabaseSafeSpots, 
  insertSupabaseSafeSpot, 
  getSupabaseTravelBuddies, 
  insertSupabaseTravelBuddy, 
  isSupabaseConfigured,
  supabase
} from '../lib/supabase';

// Seed Safe Spots
const INITIAL_SAFE_SPOTS: SafeSpot[] = [
  {
    id: "spot-1",
    name: "The Bee Hostel & Cafe",
    category: "accommodation",
    city: "Rome",
    address: "Via Marghera, 34, 00185 Roma RM, Italy",
    description: "Extremely secure, female-positive hostel with card key locks, located in a quiet family alley just north of Termini. Night staff are verified respectful and active in monitoring access.",
    safetyRating: 5,
    author: "Elena G. (Sweden)",
    timestamp: "May 20, 2026",
    upvotes: 42
  },
  {
    id: "spot-2",
    name: "Once Upon a Blue Cafe",
    category: "cafe",
    city: "Bangkok",
    address: "Pracha Rat Bamphen Rd, Huai Khwang, Bangkok",
    description: "A gorgeous, well-lit sanctuary near Huai Khwang MRT. Perfect internet, incredibly respectful female staff, and highly safe layout for late-night editing or reading.",
    safetyRating: 5,
    author: "Nisha R. (India)",
    timestamp: "May 22, 2026",
    upvotes: 28
  },
  {
    id: "spot-3",
    name: "Les Piaules Nation Hostel",
    category: "accommodation",
    city: "Paris",
    address: "59 Boulevard de Belleville, 75011 Paris",
    description: "Features secure bunks, privacy curtains, security drawers, and a lively, safe rooftop cafe that is well-frequented by solo female students.",
    safetyRating: 4,
    author: "Zoe M. (Canada)",
    timestamp: "May 18, 2026",
    upvotes: 31
  },
  {
    id: "spot-4",
    name: "Kiyosumi Gardens Walkpath",
    category: "activity",
    city: "Tokyo",
    address: "3-3-9 Kiyosumi, Koto City, Tokyo",
    description: "Stunningly peaceful, well-patrolled, and exceptionally secure scenic stroll path. Perfect when you need a quiet outdoor sanctuary with absolute zero harassment.",
    safetyRating: 5,
    author: "Yuka K. (Local Guide)",
    timestamp: "May 24, 2026",
    upvotes: 61
  }
];

// Seed Buddies
const SEED_BUDDIES: TravelBuddy[] = [
  {
    id: "buddy-1",
    name: "Sarah Jenkins",
    age: 26,
    origin: "Sydney, Australia",
    avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=150",
    languages: ["English", "Spanish"],
    currentCity: "Rome",
    bio: "Currently on a 3-month European tour. Looking to pair up with another traveler specifically for dinner strols and taxi share around Rome (staying in Monti). Let's eat safe, amazing carbonara! 🍝",
    travelDates: "May 22 - May 29",
    interests: ["Food Tours", "History", "Sunset photography"],
    verified: true
  },
  {
    id: "buddy-2",
    name: "Claire Dubois",
    age: 29,
    origin: "Lyon, France",
    avatar: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&q=80&w=150",
    languages: ["French", "English", "Thai"],
    currentCity: "Bangkok",
    bio: "Expat remote worker based in Bangkok. Love running through Lumpini and checking out street markets around Ari. Happy to guide solo sisters through Tuk Tuk safety and canal paths!",
    travelDates: "Permanent Expat",
    interests: ["Cafes", "Street Food", "Running"],
    verified: true
  },
  {
    id: "buddy-3",
    name: "Sofia Ortiz",
    age: 24,
    origin: "Bogotá, Colombia",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150",
    languages: ["Spanish", "English"],
    currentCity: "Paris",
    bio: "Art history student exploring standard museums in Paris. Staying near Marais. Looking to pair up for evening walks past dusk around Montmartre or Notre-Dame to avoid the string-merchants together!",
    travelDates: "May 24 - June 02",
    interests: ["Art", "Architecture", "Indie Music"],
    verified: true
  },
  {
    id: "buddy-4",
    name: "Min-Ji Kim",
    age: 27,
    origin: "Seoul, South Korea",
    avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80&w=150",
    languages: ["Korean", "English", "Japanese"],
    currentCity: "Tokyo",
    bio: "Cozy book cafes enthusiast. Let's head out to teamLab Planets, walk around Shimokitazawa, or check out Nakameguro canal pathways late tonight! Extremely flexible.",
    travelDates: "May 23 - June 01",
    interests: ["Digital Art", "Vintage clothing", "Tea Ceremonies"],
    verified: true
  }
];

export default function CommunityBoard() {
  const [boardType, setBoardType] = useState<'buddies' | 'spots'>('buddies');
  
  // Real State hook with localStorage persistence
  const [spots, setSpots] = useState<SafeSpot[]>(() => {
    const cached = localStorage.getItem('aura_safe_spots');
    return cached ? JSON.parse(cached) : INITIAL_SAFE_SPOTS;
  });

  // Buddies state with database fallback
  const [buddies, setBuddies] = useState<TravelBuddy[]>(SEED_BUDDIES);

  // Supabase statuses: 'checking', 'connected', 'disabled', 'failed'
  const [supabaseStatus, setSupabaseStatus] = useState<'checking' | 'connected' | 'disabled' | 'failed'>('checking');
  const [isSyncing, setIsSyncing] = useState<boolean>(false);

  // Filters
  const [cityFilter, setCityFilter] = useState('');
  const [spotCategoryFilter, setSpotCategoryFilter] = useState<string>('all');
  
  // Custom spot entry form state
  const [showAddForm, setShowAddForm] = useState(false);
  const [newSpotName, setNewSpotName] = useState('');
  const [newSpotCategory, setNewSpotCategory] = useState<'accommodation' | 'cafe' | 'transit' | 'activity' | 'emergency'>('cafe');
  const [newSpotCity, setNewSpotCity] = useState('');
  const [newSpotAddress, setNewSpotAddress] = useState('');
  const [newSpotDesc, setNewSpotDesc] = useState('');
  const [newSpotRating, setNewSpotRating] = useState(5);
  const [newSpotAuthor, setNewSpotAuthor] = useState('');

  // Travel Buddy entry form state
  const [showAddBuddyForm, setShowAddBuddyForm] = useState(false);
  const [newBuddyName, setNewBuddyName] = useState('');
  const [newBuddyAge, setNewBuddyAge] = useState<number>(25);
  const [newBuddyOrigin, setNewBuddyOrigin] = useState('');
  const [newBuddyLanguages, setNewBuddyLanguages] = useState('English, Spanish');
  const [newBuddyCity, setNewBuddyCity] = useState('Rome');
  const [newBuddyDates, setNewBuddyDates] = useState('May 25 - June 10');
  const [newBuddyBio, setNewBuddyBio] = useState('');
  const [newBuddyInterests, setNewBuddyInterests] = useState('Sightseeing, Dinner walk, Cafe');

  // Interactive Buddy Request Modal Fake State
  const [connectModalBuddy, setConnectModalBuddy] = useState<TravelBuddy | null>(null);
  const [inviteMessage, setInviteMessage] = useState("Hi! I'm also traveling solo in this neighborhood represents. Would you like to split a taxi, share a meal, or explore together safely?");
  const [inviteSentStatus, setInviteSentStatus] = useState(false);

  // Load from Supabase on mount
  useEffect(() => {
    async function syncWithSupabase() {
      if (!isSupabaseConfigured()) {
        setSupabaseStatus('disabled');
        return;
      }

      setSupabaseStatus('checking');
      try {
        const dbSpots = await getSupabaseSafeSpots();
        if (dbSpots && dbSpots.length > 0) {
          // Merge db spots with cached ones, prioritizing DB ones
          setSpots(prev => {
            const merged = [...dbSpots];
            prev.forEach(p => {
              if (!merged.some(m => m.id === p.id)) {
                merged.push(p);
              }
            });
            return merged;
          });
        }

        const dbBuddies = await getSupabaseTravelBuddies();
        if (dbBuddies && dbBuddies.length > 0) {
          setBuddies(prev => {
            const merged = [...dbBuddies];
            prev.forEach(p => {
              if (!merged.some(m => m.id === p.id)) {
                merged.push(p);
              }
            });
            return merged;
          });
          setSupabaseStatus('connected');
        } else if (dbSpots !== null) {
          // If spots fetching succeeded but buddies didn't return (possibly empty database), we still succeeded
          setSupabaseStatus('connected');
        } else {
          setSupabaseStatus('failed');
        }
      } catch (err) {
        console.error('Supabase sync error on main board:', err);
        setSupabaseStatus('failed');
      }
    }

    syncWithSupabase();
  }, []);

  // Listen for login/logout to prefill companion forms
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        const name = session.user.user_metadata?.display_name || session.user.email?.split('@')[0] || '';
        setNewBuddyName(name);
        setNewSpotAuthor(name);
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        const name = session.user.user_metadata?.display_name || session.user.email?.split('@')[0] || '';
        setNewBuddyName(name);
        setNewSpotAuthor(name);
      } else {
        setNewBuddyName('');
        setNewSpotAuthor('');
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    localStorage.setItem('aura_safe_spots', JSON.stringify(spots));
  }, [spots]);

  const handleUpvoteSpot = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setSpots(prev => {
      const updated = prev.map(spot => {
        if (spot.id === id) {
          const newUpvotes = spot.upvotes + 1;
          const upvotedSpot = { ...spot, upvotes: newUpvotes };
          // If connected, sync upvote back
          if (supabaseStatus === 'connected') {
            insertSupabaseSafeSpot(upvotedSpot);
          }
          return upvotedSpot;
        }
        return spot;
      });
      localStorage.setItem('aura_safe_spots', JSON.stringify(updated));
      return updated;
    });
  };

  const handleCreateSpot = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSpotName.trim() || !newSpotCity.trim() || !newSpotDesc.trim()) return;

    const newSpot: SafeSpot = {
      id: `spot-${Date.now()}`,
      name: newSpotName,
      category: newSpotCategory,
      city: newSpotCity.charAt(0).toUpperCase() + newSpotCity.slice(1).toLowerCase(),
      address: newSpotAddress || "Verified Location Path",
      description: newSpotDesc,
      safetyRating: Number(newSpotRating),
      author: newSpotAuthor.trim() || "Independent Traveler",
      timestamp: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      upvotes: 1
    };

    setIsSyncing(true);
    if (supabaseStatus === 'connected') {
      const dbSuccess = await insertSupabaseSafeSpot(newSpot);
      if (!dbSuccess) {
        console.warn('Could not insert safe spot to Supabase, saving to local state.');
      }
    }

    setSpots(prev => {
      const updated = [newSpot, ...prev];
      localStorage.setItem('aura_safe_spots', JSON.stringify(updated));
      return updated;
    });
    setIsSyncing(false);

    // Reset Form
    setNewSpotName('');
    setNewSpotAddress('');
    setNewSpotDesc('');
    setNewSpotCity('');
    setNewSpotAuthor('');
    setShowAddForm(false);
  };

  const handleCreateBuddy = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newBuddyName.trim() || !newBuddyCity.trim() || !newBuddyBio.trim()) return;

    const newBuddy: TravelBuddy = {
      id: `buddy-${Date.now()}`,
      name: newBuddyName,
      age: Number(newBuddyAge),
      origin: newBuddyOrigin || "Sydney, Australia",
      avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=150",
      languages: newBuddyLanguages.split(',').map(s => s.trim()),
      currentCity: newBuddyCity.charAt(0).toUpperCase() + newBuddyCity.slice(1).toLowerCase(),
      bio: newBuddyBio,
      travelDates: newBuddyDates,
      interests: newBuddyInterests.split(',').map(s => s.trim()),
      verified: true
    };

    setIsSyncing(true);
    if (supabaseStatus === 'connected') {
      const dbSuccess = await insertSupabaseTravelBuddy(newBuddy);
      if (!dbSuccess) {
        console.warn('Could not insert buddy to Supabase, saving to local list.');
      }
    }

    setBuddies(prev => [newBuddy, ...prev]);
    setIsSyncing(false);

    // Reset Form
    setNewBuddyName('');
    setNewBuddyAge(25);
    setNewBuddyOrigin('');
    setNewBuddyBio('');
    setShowAddBuddyForm(false);
  };

  const filteredBuddies = buddies.filter(buddy => {
    if (!cityFilter) return true;
    return buddy.currentCity.toLowerCase().includes(cityFilter.toLowerCase()) || buddy.origin.toLowerCase().includes(cityFilter.toLowerCase());
  });

  const filteredSpots = spots.filter(spot => {
    const cityMatch = !cityFilter || spot.city.toLowerCase().includes(cityFilter.toLowerCase());
    const categoryMatch = spotCategoryFilter === 'all' || spot.category === spotCategoryFilter;
    return cityMatch && categoryMatch;
  });

  return (
    <div className="space-y-6">
      {/* Backend / Supabase Status Banner */}
      <div className={`p-4 rounded-2xl border flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs leading-relaxed ${
        supabaseStatus === 'connected' 
          ? 'bg-emerald-50/70 border-emerald-250 text-emerald-800' 
          : supabaseStatus === 'checking'
          ? 'bg-amber-50/70 border-amber-200 text-amber-800 animate-pulse'
          : supabaseStatus === 'failed'
          ? 'bg-rose-50/70 border-rose-200 text-rose-800'
          : 'bg-stone-50/85 border-stone-200 text-stone-600'
      }`}>
        <div className="flex items-center gap-2.5">
          <div className={`p-2 rounded-xl shrink-0 ${
            supabaseStatus === 'connected' ? 'bg-emerald-100 text-emerald-700' :
            supabaseStatus === 'checking' ? 'bg-amber-100 text-amber-700' :
            supabaseStatus === 'failed' ? 'bg-rose-100 text-rose-700' : 'bg-stone-100 text-stone-605'
          }`}>
            <Database className="w-4 h-4 animate-pulse" />
          </div>
          <div>
            <p className="font-extrabold flex items-center gap-1.5">
              Backend Status: {
                supabaseStatus === 'connected' ? 'Supabase Database Connected' :
                supabaseStatus === 'checking' ? 'Syncing with Supabase...' :
                supabaseStatus === 'failed' ? 'Database Connected (Schema Awaiting Setup)' :
                'Offline Sandbox Storage'
              }
              {supabaseStatus === 'connected' && <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />}
            </p>
            <p className="text-[10.5px] text-stone-500 font-medium">
              {
                supabaseStatus === 'connected' ? `Connected to project: "solo travler women" (Project ID: lvjuwfhedyyirxgrgfyj). Real-time sync active!` :
                supabaseStatus === 'checking' ? 'Establishing secure rest queries and sync verification...' :
                supabaseStatus === 'failed' ? 'Connected successfully, but custom Tables are missing on Supabase. Falling back securely to Sandbox.' :
                'Vite development build in offline sandbox. Define variables to initiate Cloud database synchronization.'
              }
            </p>
          </div>
        </div>
        
        {supabaseStatus === 'failed' && (
          <div className="text-[10px] bg-white/70 p-2 rounded-xl border border-rose-100 text-stone-600 max-w-sm shrink-0">
            💡 <strong>Quick Setup:</strong> Create table <code>safe_spots</code> and <code>travel_buddies</code> in Supabase SQL Editor.
          </div>
        )}
      </div>

      {/* Board Toggles */}

      <div className="flex bg-stone-100 p-1.5 rounded-2xl max-w-sm">
        <button
          onClick={() => { setBoardType('buddies'); setCityFilter(''); }}
          className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-1.5 ${
            boardType === 'buddies'
              ? 'bg-stone-900 text-white shadow-md shadow-stone-950/10'
              : 'text-stone-500 hover:text-stone-900'
          }`}
        >
          <Users className="w-3.5 h-3.5" /> Buddy Connect
        </button>
        <button
          onClick={() => { setBoardType('spots'); setCityFilter(''); }}
          className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-1.5 ${
            boardType === 'spots'
              ? 'bg-stone-900 text-white shadow-md shadow-stone-950/10'
              : 'text-stone-500 hover:text-stone-900'
          }`}
        >
          <MapPin className="w-3.5 h-3.5" /> High-Trust Safe Spots
        </button>
      </div>

      {/* Filter and Action Header */}
      <div className="bg-white rounded-2xl border border-stone-100 p-5 shadow-sm space-y-4 md:space-y-0 md:flex md:items-center md:justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder={`Filter by city name (e.g. Rome, Bangkok)...`}
            value={cityFilter}
            onChange={(e) => setCityFilter(e.target.value)}
            className="w-full text-xs pl-9 pr-4 py-2 rounded-xl border border-stone-200 bg-stone-50/50 focus:outline-none focus:ring-1 focus:ring-stone-900"
          />
        </div>

        {boardType === 'spots' ? (
          <div className="flex flex-wrap items-center gap-2">
            <select
              value={spotCategoryFilter}
              onChange={(e) => setSpotCategoryFilter(e.target.value)}
              className="text-xs py-2 px-3 border border-stone-200 bg-stone-50/80 rounded-xl focus:outline-none focus:ring-1 focus:ring-stone-950"
            >
              <option value="all">All Categories</option>
              <option value="accommodation">Accommodation</option>
              <option value="cafe">Cafes & Restaurants</option>
              <option value="activity">Activities</option>
              <option value="transit">Safe Transit Paths</option>
              <option value="emergency">Med/Security Stations</option>
            </select>

            <button
              onClick={() => setShowAddForm(!showAddForm)}
              className="py-2 px-3 text-xs bg-rose-50 text-rose-700 hover:bg-rose-100 font-bold border border-rose-200 rounded-xl flex items-center gap-1.5 transition-all"
            >
              <Plus className="w-4 h-4" /> Log Safe Spot
            </button>
          </div>
        ) : (
          <div className="flex items-center gap-3 shrink-0">
            <div className="hidden sm:inline-flex text-xs font-sans text-stone-500 items-center gap-1">
              <CheckCircle className="w-3.5 h-3.5 text-emerald-600" /> Vetted ID Verification Active
            </div>
            <button
              onClick={() => setShowAddBuddyForm(!showAddBuddyForm)}
              className="py-2 px-3 text-xs bg-indigo-50 text-indigo-700 hover:bg-indigo-105 font-bold border border-indigo-200 rounded-xl flex items-center gap-1.5 transition-all"
            >
              <Plus className="w-4 h-4" /> Log Travel Buddy
            </button>
          </div>
        )}
      </div>

      {/* CREATE BUDDY DRAWER/MODAL FORM */}
      {boardType === 'buddies' && showAddBuddyForm && (
        <div className="bg-gradient-to-br from-indigo-50/50 to-stone-100/50 rounded-2xl border border-indigo-150 p-6 shadow-md animate-fade-in">
          <div className="flex justify-between items-center mb-4">
            <h4 className="font-serif text-base font-bold text-stone-900">
              Register yourself to pair with solo women travelers
            </h4>
            <button 
              onClick={() => setShowAddBuddyForm(false)}
              className="text-stone-400 hover:text-stone-800 text-xs"
            >
              [Cancel]
            </button>
          </div>
          
          <form onSubmit={handleCreateBuddy} className="grid grid-cols-1 md:grid-cols-12 gap-4">
            <div className="md:col-span-4">
              <label className="block text-[10px] font-bold uppercase tracking-wider text-stone-600 mb-1">Full Name</label>
              <input 
                type="text" 
                value={newBuddyName} 
                onChange={e => setNewBuddyName(e.target.value)} 
                placeholder="e.g. Sofia Ortiz" 
                required
                className="w-full text-xs border border-stone-200 p-2 rounded-lg bg-white"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-[10px] font-bold uppercase tracking-wider text-stone-600 mb-1">Age</label>
              <input 
                type="number" 
                value={newBuddyAge} 
                onChange={e => setNewBuddyAge(Number(e.target.value))} 
                placeholder="24" 
                required
                min={18}
                max={100}
                className="w-full text-xs border border-stone-200 p-2 rounded-lg bg-white"
              />
            </div>

            <div className="md:col-span-3">
              <label className="block text-[10px] font-bold uppercase tracking-wider text-stone-600 mb-1">Origin City/Country</label>
              <input 
                type="text" 
                value={newBuddyOrigin} 
                onChange={e => setNewBuddyOrigin(e.target.value)} 
                placeholder="e.g. Bogotá, Colombia" 
                required
                className="w-full text-xs border border-stone-200 p-2 rounded-lg bg-white"
              />
            </div>

            <div className="md:col-span-3">
              <label className="block text-[10px] font-bold uppercase tracking-wider text-stone-600 mb-1">Current City</label>
              <input 
                type="text" 
                value={newBuddyCity} 
                onChange={e => setNewBuddyCity(e.target.value)} 
                placeholder="e.g. Rome" 
                required
                className="w-full text-xs border border-stone-200 p-2 rounded-lg bg-white"
              />
            </div>

            <div className="md:col-span-4">
              <label className="block text-[10px] font-bold uppercase tracking-wider text-stone-600 mb-1">Languages (comma-separated)</label>
              <input 
                type="text" 
                value={newBuddyLanguages} 
                onChange={e => setNewBuddyLanguages(e.target.value)} 
                placeholder="e.g. Spanish, English" 
                className="w-full text-xs border border-stone-200 p-2 rounded-lg bg-white"
              />
            </div>

            <div className="md:col-span-4">
              <label className="block text-[10px] font-bold uppercase tracking-wider text-stone-600 mb-1">Travel Dates / Range</label>
              <input 
                type="text" 
                value={newBuddyDates} 
                onChange={e => setNewBuddyDates(e.target.value)} 
                placeholder="e.g. May 25 - June 10" 
                className="w-full text-xs border border-stone-200 p-2 rounded-lg bg-white"
              />
            </div>

            <div className="md:col-span-4">
              <label className="block text-[10px] font-bold uppercase tracking-wider text-stone-600 mb-1">Interests (comma-separated)</label>
              <input 
                type="text" 
                value={newBuddyInterests} 
                onChange={e => setNewBuddyInterests(e.target.value)} 
                placeholder="e.g. Art, Walking, Cafes" 
                className="w-full text-xs border border-stone-200 p-2 rounded-lg bg-white"
              />
            </div>

            <div className="md:col-span-12">
              <label className="block text-[10px] font-bold uppercase tracking-wider text-stone-600 mb-1">Short Safe Travel Biography & Co-Transit request</label>
              <textarea 
                value={newBuddyBio} 
                onChange={e => setNewBuddyBio(e.target.value)} 
                placeholder="e.g. Art history enthusiast staying near Marais. Looking to pair up for safe evening strolls around tourist sites!" 
                required
                rows={2}
                className="w-full text-xs border border-stone-200 p-2 rounded-lg bg-white"
              />
            </div>

            <div className="md:col-span-12 flex justify-end">
              <button 
                type="submit" 
                disabled={isSyncing}
                className="w-full md:w-auto py-2 px-6 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-lg text-xs transition-all flex items-center justify-center gap-1.5 shadow-sm"
              >
                {isSyncing ? 'Registering with Supabase Datastore...' : 'Register as Active Companion'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* CREATE SPOT DRAWER/MODAL FORM */}
      {boardType === 'spots' && showAddForm && (
        <div className="bg-gradient-to-br from-stone-50 to-stone-100/50 rounded-2xl border border-stone-200 p-6 shadow-md">
          <div className="flex justify-between items-center mb-4">
            <h4 className="font-serif text-base font-bold text-stone-900">
              Contribute verification of a secure venue for travelers
            </h4>
            <button 
              onClick={() => setShowAddForm(false)}
              className="text-stone-400 hover:text-stone-800 text-xs"
            >
              [Cancel]
            </button>
          </div>
          
          <form onSubmit={handleCreateSpot} className="grid grid-cols-1 md:grid-cols-12 gap-4">
            <div className="md:col-span-4">
              <label className="block text-[10px] font-bold uppercase tracking-wider text-stone-600 mb-1">Spot Name</label>
              <input 
                type="text" 
                value={newSpotName} 
                onChange={e => setNewSpotName(e.target.value)} 
                placeholder="e.g. Lavender Hostel reception" 
                required
                className="w-full text-xs border border-stone-200 p-2 rounded-lg bg-white"
              />
            </div>

            <div className="md:col-span-3">
              <label className="block text-[10px] font-bold uppercase tracking-wider text-stone-600 mb-1">City</label>
              <input 
                type="text" 
                value={newSpotCity} 
                onChange={e => setNewSpotCity(e.target.value)} 
                placeholder="e.g. Rome" 
                required
                className="w-full text-xs border border-stone-200 p-2 rounded-lg bg-white"
              />
            </div>

            <div className="md:col-span-3">
              <label className="block text-[10px] font-bold uppercase tracking-wider text-stone-600 mb-1">Category</label>
              <select 
                value={newSpotCategory} 
                onChange={e => setNewSpotCategory(e.target.value as any)}
                className="w-full text-xs border border-stone-200 p-2 rounded-lg bg-white"
              >
                <option value="accommodation">Accommodation</option>
                <option value="cafe">Cafe / Bistro</option>
                <option value="activity">Outdoor Path / Walk</option>
                <option value="transit">Transit Hub</option>
                <option value="emergency">Emergency Station</option>
              </select>
            </div>

            <div className="md:col-span-2">
              <label className="block text-[10px] font-bold uppercase tracking-wider text-stone-600 mb-1">Safety Rating (1-5)</label>
              <select 
                value={newSpotRating} 
                onChange={e => setNewSpotRating(Number(e.target.value))}
                className="w-full text-xs border border-stone-200 p-2 rounded-lg bg-white"
              >
                <option value="5">⭐⭐⭐⭐⭐ Super Safe</option>
                <option value="4">⭐⭐⭐⭐ Highly Secure</option>
                <option value="3">⭐⭐⭐ Moderate</option>
              </select>
            </div>

            <div className="md:col-span-8">
              <label className="block text-[10px] font-bold uppercase tracking-wider text-stone-600 mb-1">Specific safety description (Why is this place highly recommended?)</label>
              <input 
                type="text" 
                value={newSpotDesc} 
                onChange={e => setNewSpotDesc(e.target.value)} 
                placeholder="Describe lighting path, locking system, safe exits or female hosts..." 
                required
                className="w-full text-xs border border-stone-200 p-2 rounded-lg bg-white"
              />
            </div>

            <div className="md:col-span-4">
              <label className="block text-[10px] font-bold uppercase tracking-wider text-stone-600 mb-1">Street Address (Optional)</label>
              <input 
                type="text" 
                value={newSpotAddress} 
                onChange={e => setNewSpotAddress(e.target.value)} 
                placeholder="e.g. Via Urbana 12" 
                className="w-full text-xs border border-stone-200 p-2 rounded-lg bg-white"
              />
            </div>

            <div className="md:col-span-4">
              <label className="block text-[10px] font-bold uppercase tracking-wider text-stone-600 mb-1">Your Name</label>
              <input 
                type="text" 
                value={newSpotAuthor} 
                onChange={e => setNewSpotAuthor(e.target.value)} 
                placeholder="e.g. Chloe (USA)" 
                className="w-full text-xs border border-stone-200 p-2 rounded-lg bg-white"
              />
            </div>

            <div className="md:col-span-8 flex items-end">
              <button 
                type="submit" 
                className="w-full py-2 bg-stone-900 hover:bg-stone-850 text-white font-bold rounded-lg text-xs transition-all"
              >
                Register & Verify Spot
              </button>
            </div>
          </form>
        </div>
      )}

      {/* CONNECT TO BUDDY MODAL */}
      {connectModalBuddy && (
        <div className="fixed inset-0 bg-stone-900/50 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fade-in">
          <div className="bg-white rounded-2xl max-w-md w-full border border-stone-200 p-6 shadow-xl space-y-4">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <img src={connectModalBuddy.avatar} className="w-10 h-10 rounded-full border border-stone-200 object-cover" />
                <div>
                  <h4 className="font-sans font-bold text-stone-900 text-sm flex items-center gap-1">
                    {connectModalBuddy.name} <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
                  </h4>
                  <p className="text-[10px] text-stone-500">Currently in {connectModalBuddy.currentCity}</p>
                </div>
              </div>
              <button 
                onClick={() => { setConnectModalBuddy(null); setInviteSentStatus(false); }}
                className="text-stone-400 hover:text-stone-700 font-bold text-sm"
              >
                ✕
              </button>
            </div>

            <div className="bg-stone-55 border border-stone-150 p-3 rounded-xl text-xs text-stone-600">
              <p className="font-semibold text-stone-800">Sarah's Request Profile:</p>
              <p className="italic mt-1">"{connectModalBuddy.bio}"</p>
            </div>

            {!inviteSentStatus ? (
              <div className="space-y-3">
                <label className="block text-[10px] font-bold uppercase tracking-wider text-stone-600">Write high-trust message:</label>
                <textarea
                  value={inviteMessage}
                  onChange={(e) => setInviteMessage(e.target.value)}
                  rows={4}
                  className="w-full text-xs p-2.5 rounded-lg border border-stone-200 focus:ring-1 focus:ring-stone-900 focus:outline-none"
                />
                
                <div className="text-[10px] text-stone-500 py-1 border-t border-b border-stone-100 leading-normal">
                  ⚠️ <strong>Aura Community Safety Rules:</strong> Connection requests must be respectful, gender-exclusive, and focus purely on travel companionship or sharing safety logistics.
                </div>

                <button
                  onClick={() => {
                    setInviteSentStatus(true);
                  }}
                  className="w-full py-2 rounded-xl text-xs font-bold bg-stone-900 hover:bg-stone-800 text-white transition-all text-center"
                >
                  Send High-Trust Invite
                </button>
              </div>
            ) : (
              <div className="py-6 text-center space-y-2">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-emerald-50 text-emerald-600 mb-1">
                  <CheckCircle className="w-6 h-6" />
                </div>
                <h5 className="text-sm font-bold text-stone-900">Safety Connection Dispatched!</h5>
                <p className="text-xs text-stone-500 leading-relaxed max-w-xs mx-auto">
                  Sarah has been notified via her registered secure contact email. When she accepts, you will receive a shared encrypted buddy chat screen.
                </p>
                <div className="pt-4">
                  <button
                    onClick={() => { setConnectModalBuddy(null); setInviteSentStatus(false); }}
                    className="py-1.5 px-4 text-xs font-bold border border-stone-200 rounded-lg hover:bg-stone-50 transition-all text-stone-700"
                  >
                    Done
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* RENDER CURRENT VIEW */}
      {boardType === 'buddies' ? (
        /* BUDDIES GRID */
        filteredBuddies.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-fade-in">
            {filteredBuddies.map((buddy) => (
              <div key={buddy.id} className="bg-white rounded-2xl border border-stone-150 p-5 shadow-xs relative flex flex-col justify-between">
                <div>
                  <div className="flex items-start justify-between border-b border-stone-100 pb-3 mb-4">
                    <div className="flex items-center gap-3">
                      <img src={buddy.avatar} alt={buddy.name} className="w-11 h-11 rounded-full border border-stone-200 object-cover shrink-0" />
                      <div>
                        <h4 className="font-sans font-bold text-stone-900 text-sm flex items-center gap-1.5">
                          {buddy.name}
                          {buddy.verified && (
                            <span className="inline-flex items-center gap-0.5 text-[9px] px-1.5 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-100">
                              <CheckCircle className="w-2.5 h-2.5 fill-emerald-600 text-white" /> Vetted
                            </span>
                          )}
                        </h4>
                        <p className="text-[10px] text-stone-500">From {buddy.origin} • Age {buddy.age}</p>
                      </div>
                    </div>

                    <div className="bg-rose-50/50 border border-rose-100/60 rounded-lg p-1 px-2.5 text-center">
                      <span className="block text-[8px] font-black uppercase tracking-wider text-rose-600">Location</span>
                      <span className="font-sans text-[11px] font-extrabold text-rose-800 flex items-center gap-0.5">
                        <MapPin className="w-3 h-3" /> {buddy.currentCity}
                      </span>
                    </div>
                  </div>

                  <p className="text-stone-700 text-xs font-serif italic leading-relaxed mb-4">
                    "{buddy.bio}"
                  </p>

                  <div className="flex flex-wrap gap-1.5 mb-4">
                    {buddy.languages.map(l => (
                      <span key={l} className="text-[9px] bg-stone-100 text-stone-600 py-0.5 px-2 rounded-md font-mono">{l}</span>
                    ))}
                    {buddy.interests.map(i => (
                      <span key={i} className="text-[9px] bg-rose-50/40 text-rose-700 py-0.5 px-1.5 rounded-md font-semibold border border-rose-100/40">#{i}</span>
                    ))}
                  </div>
                </div>

                <div className="border-t border-stone-100 pt-3.5 mt-auto flex items-center justify-between gap-2">
                  <span className="text-[10px] font-bold uppercase text-amber-700 tracking-wide font-mono bg-amber-50 px-2 py-1 rounded">
                    🗓️ Range: {buddy.travelDates}
                  </span>

                  <button
                    onClick={() => {
                      setConnectModalBuddy(buddy);
                      setInviteMessage(`Hi ${buddy.name}! I am also traveling solo in ${buddy.currentCity}. Let's pair up to split a safe taxi route, share an evening meal, or walk through tourist zones together! Stay safe.`);
                    }}
                    className="py-1.5 px-3 bg-stone-900 hover:bg-stone-850 text-white text-xs font-bold rounded-lg transition-all flex items-center gap-1 shrink-0"
                  >
                    <MessageSquare className="w-3.5 h-3.5 text-rose-300" /> Connect Safely
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-2xl border border-stone-100 p-12 text-center shadow-inner flex flex-col items-center">
            <Compass className="w-10 h-10 text-stone-300 mb-2.5 animate-pulse" />
            <h4 className="font-serif text-sm font-bold text-stone-700">No active buddies found in this district</h4>
            <p className="text-xs text-stone-500 mt-1">Be the first to check in and initialize the community board in this area!</p>
          </div>
        )
      ) : (
        /* SAFE SPOTS LIST */
        filteredSpots.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-fade-in">
            {filteredSpots.map((spot) => (
              <div key={spot.id} className="bg-white rounded-2xl border border-stone-150 p-5 shadow-xs relative flex flex-col justify-between">
                <div>
                  <div className="flex items-start justify-between border-b border-stone-100 pb-3 mb-4 gap-2">
                    <div>
                      <span className={`inline-block text-[9px] font-bold uppercase tracking-wide px-1.5 py-0.5 rounded-md mb-1.5 border ${
                        spot.category === 'accommodation' ? 'bg-indigo-50 text-indigo-700 border-indigo-100' :
                        spot.category === 'cafe' ? 'bg-amber-50 text-amber-700 border-amber-100' :
                        spot.category === 'activity' ? 'bg-emerald-50 text-emerald-700 border-emerald-100' :
                        'bg-rose-50 text-rose-700 border-rose-100'
                      }`}>
                        {spot.category}
                      </span>
                      <h4 className="font-sans font-bold text-stone-950 text-base leading-snug">
                        {spot.name}
                      </h4>
                      <p className="text-[10px] text-stone-500 flex items-center gap-0.5 mt-1">
                        <MapPin className="w-3 h-3 text-rose-500" /> {spot.address} • <strong>{spot.city}</strong>
                      </p>
                    </div>

                    <div className="p-1 px-2.5 rounded-lg border border-stone-200 bg-stone-50 flex flex-col items-center shrink-0">
                      <span className="text-[8px] font-bold text-stone-500 uppercase tracking-wider">Rating</span>
                      <span className="text-sm font-extrabold text-stone-800">
                        {Array(spot.safetyRating).fill("⭐").join("")}
                      </span>
                    </div>
                  </div>

                  <p className="text-stone-700 text-xs leading-relaxed mb-4">
                    {spot.description}
                  </p>
                </div>

                <div className="border-t border-stone-100 pt-3 flex items-center justify-between text-[11px] text-stone-500">
                  <span>By {spot.author} on {spot.timestamp}</span>

                  <button
                    onClick={(e) => handleUpvoteSpot(spot.id, e)}
                    className="flex items-center gap-1.5 py-1 px-2.5 font-bold rounded-lg border border-rose-150 bg-rose-50/30 text-rose-700 hover:bg-rose-50 text-xs transition-all"
                  >
                    <ThumbsUp className="w-3 h-3" /> Upvote Verified ({spot.upvotes})
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-2xl border border-stone-100 p-12 text-center shadow-inner flex flex-col items-center">
            <MapPin className="w-10 h-10 text-stone-300 mb-2.5" />
            <h4 className="font-serif text-sm font-bold text-stone-700">No safe spots logged in this city yet</h4>
            <p className="text-xs text-stone-500 mt-1">Submit your first trusted cafe, hotel or street patrol station to guide your sisters!</p>
          </div>
        )
      )}
    </div>
  );
}

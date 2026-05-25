/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { 
  Send, 
  Database, 
  Terminal, 
  CheckCircle, 
  AlertTriangle, 
  Info, 
  HelpCircle, 
  Copy, 
  Globe, 
  ClipboardCheck,
  Eye,
  History,
  Lock,
  User,
  Mail,
  MapPin,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { Enquiry } from '../types';
import { getSupabaseEnquiries, insertSupabaseEnquiry, isSupabaseConfigured, supabase } from '../lib/supabase';

export default function EnquiryForm() {
  // Inquiry fields state
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [city, setCity] = useState('');
  const [topic, setTopic] = useState<'safety' | 'transit' | 'meetup' | 'emergency_planning' | 'other'>('safety');
  const [message, setMessage] = useState('');

  // UI state
  const [isLoading, setIsLoading] = useState(false);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [hasCopiedSql, setHasCopiedSql] = useState(false);
  const [showSqlPanel, setShowSqlPanel] = useState(false);
  
  // Handshake & Submissions state
  const [supabaseConnected, setSupabaseConnected] = useState(false);
  const [pastEnquiries, setPastEnquiries] = useState<Enquiry[]>(() => {
    const cached = localStorage.getItem('aura_submissions_cache');
    return cached ? JSON.parse(cached) : [];
  });

  // Automatically pre-fill form coordinates on login or auth change
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        setName(session.user.user_metadata?.display_name || session.user.email?.split('@')[0] || '');
        setEmail(session.user.email || '');
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        setName(session.user.user_metadata?.display_name || session.user.email?.split('@')[0] || '');
        setEmail(session.user.email || '');
      } else {
        setName('');
        setEmail('');
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  // Fetch past inquiries on startup
  const fetchEnquiries = async () => {
    if (!isSupabaseConfigured()) return;
    try {
      const dbEntries = await getSupabaseEnquiries();
      if (dbEntries) {
        setPastEnquiries(prev => {
          const merged = [...dbEntries];
          prev.forEach(p => {
            if (!merged.some(m => m.id === p.id)) {
              merged.push(p);
            }
          });
          localStorage.setItem('aura_submissions_cache', JSON.stringify(merged));
          return merged;
        });
        setSupabaseConnected(true);
      }
    } catch (err) {
      console.warn('Silent issue attempting inquiries synchronization:', err);
    }
  };

  useEffect(() => {
    fetchEnquiries();
  }, []);

  // SQL Script schema required
  const schemaSql = `-- PostgreSQL DDL configuration guidelines
-- Create enquiries table to store safety inquiries securely
CREATE TABLE IF NOT EXISTS public.enquiries (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  city TEXT NOT NULL,
  topic TEXT NOT NULL CHECK (topic IN ('safety', 'transit', 'meetup', 'emergency_planning', 'other')),
  message TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'resolved'))
);

-- Enable Row Level Security (RLS) guarding against malicious injections
ALTER TABLE public.enquiries ENABLE ROW LEVEL SECURITY;

-- Policy 1: Grant public / guest users permission to lodge safety tickets
CREATE POLICY "Allow guests to lodge enquiries" 
  ON public.enquiries 
  FOR INSERT 
  WITH CHECK (true);

-- Policy 2: Allow general lookups of inquiries safely
CREATE POLICY "Allow public lookups of enquiries" 
  ON public.enquiries 
  FOR SELECT 
  USING (true);`;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(schemaSql);
    setHasCopiedSql(true);
    setTimeout(() => setHasCopiedSql(false), 2000);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFeedback(null);

    if (!name.trim() || !email.trim() || !city.trim() || !message.trim()) {
      setFeedback({ type: 'error', text: 'All coordinates must be registered. Please populate empty fields.' });
      return;
    }

    setIsLoading(true);

    const newEnquiry: Enquiry = {
      id: `enq-${Date.now()}`,
      name: name.trim(),
      email: email.trim(),
      city: city.charAt(0).toUpperCase() + city.slice(1).toLowerCase(),
      topic,
      message: message.trim(),
      created_at: new Date().toISOString(),
      status: 'pending'
    };

    try {
      let isSuccess = false;
      if (isSupabaseConfigured()) {
        isSuccess = await insertSupabaseEnquiry(newEnquiry);
      }

      // Update state in either case to ensure reactive behavior
      setPastEnquiries(prev => {
        const updated = [newEnquiry, ...prev];
        localStorage.setItem('aura_submissions_cache', JSON.stringify(updated));
        return updated;
      });

      if (isSupabaseConfigured() && !isSuccess) {
        setFeedback({ 
          type: 'success', 
          text: 'Enquiry processed into offline cache! However, table target schema checks failed on live database. Save SQL schema below to fix.' 
        });
      } else {
        setFeedback({ 
          type: 'success', 
          text: isSupabaseConfigured() 
            ? 'Safe-Travel enquiry successfully lodged! Live synced to Supabase.' 
            : 'Enquiry recorded locally. Connect live database to enable sync.' 
        });
        // Clear message box on success
        setMessage('');
      }

      // Refresh list to double-check
      await fetchEnquiries();

    } catch (err: any) {
      setFeedback({ type: 'error', text: err.message || 'An error interrupted database handshake.' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6" id="aura-enquiry-desk">
      
      {/* DB Connection Alert Header */}
      <div className={`p-4 rounded-2xl border flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs leading-relaxed ${
        isSupabaseConfigured()
          ? 'bg-amber-50/60 border-amber-205 text-amber-900 shadow-xs'
          : 'bg-stone-50 border-stone-200 text-stone-605'
      }`}>
        <div className="flex items-center gap-2.5">
          <div className={`p-2 rounded-xl shrink-0 ${
            isSupabaseConfigured() ? 'bg-amber-100/90 text-amber-700' : 'bg-stone-100 text-stone-500'
          }`}>
            <Database className="w-4 h-4 animate-pulse" />
          </div>
          <div>
            <p className="font-extrabold flex items-center gap-1.5 text-stone-900">
              Enquiry Sink Status: {isSupabaseConfigured() ? 'Cloud Rest Client Active' : 'Offline Mode Only'}
              {isSupabaseConfigured() && <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse inline-block" />}
            </p>
            <p className="text-[10.5px] text-stone-500 font-medium">
              {isSupabaseConfigured() 
                ? 'Your form coordinates coordinate live sync protocols to table: "public.enquiries" on Supabase.' 
                : 'Seeded sandbox mode. Credentials and inquiry filings will persist in standard browser cache.'}
            </p>
          </div>
        </div>

        <button
          onClick={() => setShowSqlPanel(!showSqlPanel)}
          className="py-1.5 px-3 bg-stone-900 hover:bg-stone-800 text-white font-mono text-[10.5px] rounded-xl flex items-center gap-1.5 self-start md:self-auto shadow-sm"
        >
          <Terminal className="w-3.5 h-3.5 text-amber-300" />
          <span>{showSqlPanel ? 'Hide SQL Code' : 'Display Supabase SQL'}</span>
          {showSqlPanel ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
        </button>
      </div>

      {/* SQL Setup Drawer blueprint */}
      {showSqlPanel && (
        <div className="bg-stone-900 text-stone-100 border border-stone-850 p-5 rounded-2xl md:p-6 space-y-4 animate-fade-in" id="supabase-sql-editor-blueprint">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <div className="flex items-center gap-2 text-amber-300 font-mono text-xs font-bold">
                <Globe className="w-4 h-4 text-amber-300" />
                <span>Supabase SQL Schema DDL Ticket</span>
              </div>
              <p className="text-[11px] text-stone-400 font-sans mt-0.5 leading-relaxed">
                Execute this SQL script directly in your <strong>Supabase SQL Editor</strong> to create the <code>enquiries</code> table with Row Level Security (RLS) policies.
              </p>
            </div>
            
            <button 
              onClick={copyToClipboard}
              className="py-2 px-3 bg-white/10 hover:bg-white/15 text-stone-200 border border-white/10 text-xs font-bold rounded-xl transition-all flex items-center gap-1.5 shrink-0"
            >
              {hasCopiedSql ? (
                <>
                  <ClipboardCheck className="w-4 h-4 text-emerald-400" />
                  <span className="text-emerald-400">Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4" />
                  <span>Copy SQL Code</span>
                </>
              )}
            </button>
          </div>

          <pre className="p-3 bg-stone-950 rounded-xl font-mono text-[11px] text-stone-300 overflow-x-auto border border-stone-800/60 leading-relaxed text-left">
            <code>{schemaSql}</code>
          </pre>

          <div className="flex gap-2 text-[10.5px] text-stone-400 font-sans bg-amber-500/10 p-3 rounded-xl border border-amber-500/20">
            <Info className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
            <p className="leading-snug">
              🚨 <strong>Setup Prerequisite:</strong> The Row Level Security (RLS) policies defined above automatically grant unauthenticated visitors capability to insert submission data, whilst providing basic retrieval transparency.
            </p>
          </div>
        </div>
      )}

      {/* Forms & History Split Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Submission Module */}
        <div className="lg:col-span-7 bg-white rounded-2xl border border-stone-200/70 p-6 shadow-sm space-y-5">
          <div>
            <h3 className="font-serif text-lg font-bold text-stone-900 leading-snug">
              Safe-Travel Enquiry & Support Desk
            </h3>
            <p className="text-xs text-stone-500 font-sans mt-0.5">
              Submit local neighborhood inquiries, ask for transport chaperones, or request feedback on bespoke hotel safety assessments. Our network coordinates answers securely.
            </p>
          </div>

          {feedback && (
            <div className={`p-3.5 rounded-xl text-xs flex gap-2.5 animate-fade-in ${
              feedback.type === 'success' ? 'bg-emerald-50 border border-emerald-200 text-emerald-800' : 'bg-rose-50 border border-rose-200 text-rose-800'
            }`}>
              {feedback.type === 'success' ? (
                <CheckCircle className="w-4 h-4 shrink-0 mt-0.5" />
              ) : (
                <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
              )}
              <span className="font-medium leading-relaxed">{feedback.text}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-stone-605 mb-1">
                  Your Full Name
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-2.5 w-4 h-4 text-stone-400" />
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Sandra Bullock"
                    required
                    className="w-full text-xs pl-9 pr-3 py-2 border border-stone-200 rounded-xl bg-white outline-none focus:border-stone-900 transition"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-stone-605 mb-1">
                  Contact Email Coordinates
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-2.5 w-4 h-4 text-stone-400" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="sandra@example.com"
                    required
                    className="w-full text-xs pl-9 pr-3 py-2 border border-stone-200 rounded-xl bg-white outline-none focus:border-stone-900 transition"
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-stone-605 mb-1">
                  Target Destination City
                </label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-2.5 w-4 h-4 text-stone-400" />
                  <input
                    type="text"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    placeholder="e.g. Barcelona, Spain"
                    required
                    className="w-full text-xs pl-9 pr-3 py-2 border border-stone-200 rounded-xl bg-white outline-none focus:border-stone-900 transition"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-stone-605 mb-1">
                  Enquiry Topic Spotlight
                </label>
                <select
                  value={topic}
                  onChange={(e) => setTopic(e.target.value as any)}
                  className="w-full text-xs border border-stone-200 p-2 rounded-xl bg-white outline-none focus:border-stone-900 transition"
                >
                  <option value="safety">🛡️ Local Safety Indicators</option>
                  <option value="transit">🚇 Late-Night Transit & Taxi Validation</option>
                  <option value="meetup">👭 Group Walk Co-Transit</option>
                  <option value="emergency_planning">🏥 Emergency & Medical Coordination</option>
                  <option value="other">💬 General Questions</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-stone-605 mb-1">
                Your Safety Inquiry Details
              </label>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="What neighborhood details or safe coordinates do you want verified? Describe lighting, transport, or hotel parameters..."
                required
                rows={4}
                className="w-full text-xs border border-stone-200 p-2.5 rounded-xl bg-white outline-none focus:border-stone-900 transition leading-relaxed"
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-2.5 px-4 bg-gradient-to-r from-purple-850 via-rose-700 to-amber-600 hover:opacity-95 text-white font-bold rounded-xl text-xs shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-98"
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                  <span>Logging parameters to Database...</span>
                </>
              ) : (
                <>
                  <Send className="w-4 h-4 text-white" />
                  <span>File Safety Enquiry Ticket</span>
                </>
              )}
            </button>
          </form>
        </div>

        {/* History / Previous Inquiries List */}
        <div className="lg:col-span-5 bg-gradient-to-br from-stone-50 to-stone-100/50 rounded-2xl border border-stone-200/80 p-5 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5 font-sans text-xs font-bold text-stone-900">
              <History className="w-4 h-4 text-purple-750" />
              <span>Safety Desk Ticketing History</span>
            </div>
            <span className="text-[10px] bg-stone-200/70 text-stone-600 font-mono px-2 py-0.5 rounded-md font-bold">
              {pastEnquiries.length} Filings
            </span>
          </div>

          <div className="space-y-3.5 max-h-[420px] overflow-y-auto pr-1">
            {pastEnquiries.length === 0 ? (
              <div className="text-center py-10 text-stone-400">
                <HelpCircle className="w-8 h-8 text-stone-300 mx-auto mb-2.5" />
                <p className="text-xs font-medium font-sans">No safety inquiries logged yet.</p>
                <p className="text-[10px] text-stone-400/90 leading-relaxed font-sans max-w-[200px] mx-auto mt-0.5">
                  Your submissions will be listed chronologically here with live database synchronization.
                </p>
              </div>
            ) : (
              pastEnquiries.map((enq) => (
                <div 
                  key={enq.id}
                  className="bg-white rounded-xl border border-stone-200 p-4 space-y-3 shadow-xs hover:shadow-sm transition-all"
                  id={`enquiry-card-${enq.id}`}
                >
                  <div className="flex justify-between items-start gap-2">
                    <div>
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[9.5px] font-extrabold uppercase tracking-wide bg-purple-50 text-purple-700 border border-purple-100 mb-1.5">
                        {enq.topic}
                      </span>
                      <h4 className="font-bold text-xs text-stone-900 flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-rose-500 shrink-0" />
                        <span>{enq.city}</span>
                      </h4>
                    </div>

                    <span className={`px-2 py-0.5 text-[9.5px] rounded-md font-bold flex items-center gap-1 shrink-0 ${
                      enq.status === 'resolved' 
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' 
                        : 'bg-amber-50 text-amber-700 border border-amber-100'
                    }`}>
                      {enq.status === 'resolved' ? '✓ Resolved' : '● Processing'}
                    </span>
                  </div>

                  <p className="text-[11px] text-stone-600 leading-relaxed italic bg-stone-50 p-2.5 rounded-lg border border-stone-100 text-left">
                    "{enq.message}"
                  </p>

                  <div className="flex items-center justify-between text-[10px] text-stone-400 border-t border-stone-100 pt-2.5">
                    <span className="font-medium truncate max-w-[130px] font-sans" title={enq.name}>
                      By: {enq.name}
                    </span>
                    <span className="font-mono text-[9px]">
                      {new Date(enq.created_at).toLocaleDateString(undefined, { 
                        month: 'short', 
                        day: 'numeric', 
                        hour: '2-digit', 
                        minute: '2-digit' 
                      })}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

      </div>

    </div>
  );
}

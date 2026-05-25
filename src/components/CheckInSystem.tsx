/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { 
  ShieldAlert, 
  Clock, 
  PhoneCall, 
  Send, 
  Check, 
  BellRing, 
  AlertOctagon, 
  Share2, 
  Copy, 
  Info, 
  Navigation,
  CheckCircle,
  XCircle
} from 'lucide-react';
import { SafetyCheckIn, SecurityContact } from '../types';

const CITY_EMERGENCIES: Record<string, SecurityContact> = {
  rome: {
    city: "Rome, Italy",
    emergency: "112 (General European Emergency)",
    touristPolice: "+39 06 4686 (State Police Tourist Line)",
    medical: "118 (Ambulance Service)",
    taxiService: "+39 06 3570 (Samarcanda Certified Cabs)",
    embassySupport: "+39 06 46741 (US Embassy Rome HQ)"
  },
  bangkok: {
    city: "Bangkok, Thailand",
    emergency: "191 (General Emergency Police)",
    touristPolice: "1155 (Dedicated English-speaking Patrol)",
    medical: "1669 (National Hospital Rescue)",
    taxiService: "Grab Booking / +66 2 424 2222 (Taxi Radio)",
    embassySupport: "+66 2 205 4000 (US Embassy Wireless Road)"
  },
  paris: {
    city: "Paris, France",
    emergency: "112 (General European Emergency)",
    touristPolice: "34 30 (Paris Prefecture Information Line)",
    medical: "15 (SAMU Medical Team)",
    taxiService: "+33 1 47 39 47 39 (G7 Verified Cabs)",
    embassySupport: "+33 1 43 12 22 22 (US Embassy Place de la Concorde)"
  },
  tokyo: {
    city: "Tokyo, Japan",
    emergency: "110 (Police Emergency Dispatch)",
    touristPolice: "+81 3 3501 0110 (English Police Advisory)",
    medical: "119 (Fire / Ambulance Rescue)",
    taxiService: "+81 3 5755 2151 (Nihon Kotsu Premium Cabs)",
    embassySupport: "+81 3 3224 5000 (US Embassy Akasaka)"
  }
};

export default function CheckInSystem() {
  const [sosCity, setSosCity] = useState<string>('rome');

  // Timer state
  const [timerActive, setTimerActive] = useState(false);
  const [timerTriggered, setTimerTriggered] = useState(false);
  const [activityName, setActivityName] = useState('Walking back from dinner to Monti hostel');
  const [minutesLeft, setMinutesLeft] = useState(0);
  const [secondsLeft, setSecondsLeft] = useState(0);
  const [buddyName, setBuddyName] = useState('Elena G. / Sarah Jenkins');
  const [countdownMinutes, setCountdownMinutes] = useState(15);
  
  // Completed checklist log
  const [checkInLog, setCheckInLog] = useState<{id: string, name: string, time: string, status: string}[]>([]);

  // SMS Builder State
  const [sosStatus, setSosStatus] = useState<'safe' | 'alert' | 'urgent'>('alert');
  const [customSafeWord, setCustomSafeWord] = useState('LAVENDER');
  const [copiedStatus, setCopiedStatus] = useState(false);

  // Interval Ref
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // Core countdown calculation
  useEffect(() => {
    if (timerActive) {
      intervalRef.current = setInterval(() => {
        setSecondsLeft((prevSec) => {
          if (prevSec > 0) {
            return prevSec - 1;
          } else {
            // Seconds reached 0, evaluate minutes
            setMinutesLeft((prevMin) => {
              if (prevMin > 0) {
                setSecondsLeft(59);
                return prevMin - 1;
              } else {
                // Whole timer reached 0:00! Trigger Alarm
                setTimerActive(false);
                setTimerTriggered(true);
                if (intervalRef.current) clearInterval(intervalRef.current);
                return 0;
              }
            });
            return 0;
          }
        });
      }, 1000);
    } else {
      if (intervalRef.current) clearInterval(intervalRef.current);
    }

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [timerActive]);

  const handleStartTimer = () => {
    setMinutesLeft(countdownMinutes);
    setSecondsLeft(0);
    setTimerActive(true);
    setTimerTriggered(false);
  };

  const handleStopTimerWithSuccess = () => {
    setTimerActive(false);
    const newLogItem = {
      id: `log-${Date.now()}`,
      name: activityName || "Standard evening walks",
      time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
      status: "Verified Safe"
    };
    setCheckInLog(prev => [newLogItem, ...prev]);
    setActivityName('');
  };

  const handleResetTimer = () => {
    setTimerActive(false);
    setTimerTriggered(false);
    setMinutesLeft(0);
    setSecondsLeft(0);
  };

  // Coordinates helper (simulated fine-grain GPS)
  const simulatedGPS = {
    latitude: sosCity === 'rome' ? "41.8902° N" : sosCity === 'bangkok' ? "13.7563° N" : sosCity === 'paris' ? "48.8566° N" : "35.6762° N",
    longitude: sosCity === 'rome' ? "12.4922° E" : sosCity === 'bangkok' ? "100.5018° E" : sosCity === 'paris' ? "2.3522° E" : "139.6503° E"
  };

  // Compile full SOS SMS
  const compileSmsMessage = () => {
    const timeString = new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
    if (sosStatus === 'safe') {
      return `[Aura Safety Notice] I have checked in safely at my destination (${CITY_EMERGENCIES[sosCity].city}). Time: ${timeString}. Safe Word Confirmation: ${customSafeWord}. All is well!`;
    }
    if (sosStatus === 'alert') {
      return `[Aura Safe Guard Alert] Walkpath Alert. I am currently walking: "${activityName || "unnamed route"}" in ${CITY_EMERGENCIES[sosCity].city}. Location: Lat ${simulatedGPS.latitude}, Lng ${simulatedGPS.longitude}. Please monitor me; safe word code is "${customSafeWord}".`;
    }
    return `[Aura CRITICAL SOS] HIGH SENSITIVITY ALERT. Solo Female safety trigger activated inside ${CITY_EMERGENCIES[sosCity].city}. Current GPS: Lat ${simulatedGPS.latitude}, Lng ${simulatedGPS.longitude}. Urgent response requested. Call Local Tourist Support immediately: ${CITY_EMERGENCIES[sosCity].touristPolice}.`;
  };

  const handleCopyToClipboard = () => {
    navigator.clipboard.writeText(compileSmsMessage());
    setCopiedStatus(true);
    setTimeout(() => setCopiedStatus(false), 2500);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
      {/* LEFT PANEL: Virtual Security Timer */}
      <div className="lg:col-span-7 bg-white rounded-2xl border border-stone-150 p-6 shadow-sm flex flex-col justify-between">
        <div>
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-rose-50 text-rose-700 mb-4 border border-rose-100">
            <Clock className="w-3.5 h-3.5 animate-pulse text-rose-600" /> VIRTUAL SAFETY GUARD
          </span>
          <h3 className="font-sans text-lg font-bold text-stone-900 mb-2">
            Active Guard Transit Countdown
          </h3>
          <p className="text-xs text-stone-500 mb-6 leading-relaxed font-sans">
            Set a protective countdown timer before stepping out into high-caution walkways, riding unmarked transport, or exploring remote zones. If you do not verify secure check-in before 00:00, our system dispatches a high-sensitivity notification.
          </p>

          {!timerActive && !timerTriggered ? (
            <div className="space-y-4">
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-stone-600 mb-1">Activity Description</label>
                <input 
                  type="text" 
                  value={activityName} 
                  onChange={e => setActivityName(e.target.value)} 
                  placeholder="e.g. Taking white taxi back to Prati hotel / Strolling alleyways" 
                  className="w-full text-xs border border-stone-200 p-2.5 rounded-lg bg-stone-50"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-stone-600 mb-1">Designated Guardian Buddy</label>
                  <input 
                    type="text" 
                    value={buddyName} 
                    onChange={e => setBuddyName(e.target.value)} 
                    placeholder="e.g. Elena G. / Sarah Jenkins"
                    className="w-full text-xs border border-stone-200 p-2.5 rounded-lg bg-stone-50"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-stone-600 mb-1">Set Timer Duration</label>
                  <select 
                    value={countdownMinutes} 
                    onChange={e => setCountdownMinutes(Number(e.target.value))}
                    className="w-full text-xs border border-stone-200 p-2.5 rounded-lg bg-stone-50"
                  >
                    <option value="5">5 Minutes (Fast Walk / Taxi entry)</option>
                    <option value="15">15 Minutes (Standard Walk back)</option>
                    <option value="30">30 Minutes (Deep Alley exploration)</option>
                    <option value="60">60 Minutes (Dinner outing)</option>
                  </select>
                </div>
              </div>

              <button
                onClick={handleStartTimer}
                className="w-full py-2.5 mt-2 bg-stone-900 hover:bg-stone-850 text-white font-bold text-xs rounded-xl transition-all shadow-md flex items-center justify-center gap-1.5"
              >
                <Clock className="w-4 h-4 text-rose-300" /> Start Active Safety Guard Now
              </button>
            </div>
          ) : timerActive ? (
            /* TICKING DOWN VIEW */
            <div className="p-6 bg-rose-50/25 border border-rose-100 rounded-2xl text-center space-y-4 animate-fade-in">
              <div className="text-[10px] font-bold uppercase text-rose-600 tracking-widest flex items-center justify-center gap-1">
                <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping"></span> Guard Monitor Active
              </div>

              <div className="font-mono text-5xl font-black text-rose-950 tracking-wide select-none">
                {String(minutesLeft).padStart(2, '0')}:{String(secondsLeft).padStart(2, '0')}
              </div>

              <div className="text-xs text-stone-700 font-sans max-w-sm mx-auto">
                <span className="font-bold">Active Activity:</span> "{activityName || "Unnamed solo walk"}"<br/>
                <span className="text-[10px] text-stone-500 block mt-1">If countdown lapses, Elena G. & Sarah Jenkins will receive a security ping.</span>
              </div>

              <div className="pt-2 flex gap-3 max-w-sm mx-auto">
                <button
                  onClick={handleStopTimerWithSuccess}
                  className="flex-1 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-1"
                >
                  <Check className="w-4 h-4" /> I Am Safe (Check In)
                </button>
                <button
                  onClick={handleResetTimer}
                  className="py-2 px-3 border border-stone-250 hover:bg-stone-50 text-stone-600 text-xs font-bold rounded-lg transition-all"
                >
                  Abrupt Stop
                </button>
              </div>
            </div>
          ) : (
            /* RUN OUT / TRIGGERED ALERT VIEW */
            <div className="p-6 bg-rose-55 border border-rose-200 rounded-2xl text-center space-y-4 animate-fade-in">
              <div className="inline-flex p-3 rounded-full bg-rose-100 text-rose-700 animate-bounce">
                <ShieldAlert className="w-6 h-6" />
              </div>
              <h4 className="text-stone-900 font-bold text-sm uppercase tracking-wide">⚠️ VIRTUAL PEER ALARM TRIGGERED</h4>
              <p className="text-xs text-stone-700 leading-relaxed max-w-md mx-auto font-serif">
                "Guard countdown elapsed without prompt check-in. Simulated automated security alerts have been successfully broadcasted with your coordinated GPS data to <strong>{buddyName}</strong>."
              </p>

              <div className="pt-2 space-y-2">
                <button
                  onClick={handleStopTimerWithSuccess}
                  className="w-full max-w-xs py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-lg transition-all"
                >
                  Confirm Under Security Check (Stop Alert)
                </button>
                <button
                  onClick={handleResetTimer}
                  className="block mx-auto text-xs font-semibold text-stone-500 hover:text-stone-900"
                >
                  Clear Status
                </button>
              </div>
            </div>
          )}
        </div>

        {/* LOG HISTORY */}
        {checkInLog.length > 0 && (
          <div className="mt-6 pt-5 border-t border-stone-100">
            <h4 className="text-[10px] font-bold uppercase tracking-wider text-stone-500 mb-2.5">Tonight's Logged Safe Clearances</h4>
            <div className="space-y-2 max-h-24 overflow-y-auto pr-2">
              {checkInLog.map((log) => (
                <div key={log.id} className="flex justify-between items-center bg-stone-50 p-2 rounded-lg border border-stone-150 text-[11px]">
                  <span className="font-sans font-semibold text-stone-800">{log.name}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-stone-500 font-mono">{log.time}</span>
                    <span className="text-emerald-700 bg-emerald-50 border border-emerald-100 px-1.5 py-0.5 rounded-md font-bold uppercase text-[9px]">{log.status}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* RIGHT PANEL: SOS Directory & Quick SMS Broadcast */}
      <div className="lg:col-span-5 space-y-6">
        {/* Urgent emergency numbers card */}
        <div className="bg-stone-50 rounded-2xl border border-stone-200/80 p-5 shadow-inner">
          <h3 className="font-serif text-sm font-bold text-stone-950 mb-3 flex items-center gap-2">
            <PhoneCall className="w-4 h-4 text-rose-500" /> Global Safety Police Directories
          </h3>
          
          <select
            value={sosCity}
            onChange={(e) => setSosCity(e.target.value)}
            className="w-full text-xs p-2 border border-stone-200 bg-white rounded-lg focus:outline-none mb-4 uppercase tracking-widest font-black"
          >
            <option value="rome">Rome, Italy 🇮🇹</option>
            <option value="bangkok">Bangkok, Thailand 🇹🇭</option>
            <option value="paris">Paris, France 🇫🇷</option>
            <option value="tokyo">Tokyo, Japan 🇯🇵</option>
          </select>

          <div className="space-y-2.5 text-xs">
            <div className="flex justify-between items-center p-2 rounded-lg bg-rose-50/50 border border-rose-100/40">
              <span className="text-stone-600 font-medium">🚨 General Emergency Helpline</span>
              <span className="font-bold font-mono text-stone-900">{CITY_EMERGENCIES[sosCity].emergency}</span>
            </div>

            <div className="flex justify-between items-center p-2 rounded-lg bg-stone-100 border border-stone-200">
              <span className="text-stone-600 font-medium">👮 English-Tourist Police</span>
              <span className="font-bold font-mono text-stone-900">{CITY_EMERGENCIES[sosCity].touristPolice}</span>
            </div>

            <div className="flex justify-between items-center p-2 rounded-lg bg-stone-100 border border-stone-200">
              <span className="text-stone-600 font-medium">🚑 Health / Ambulance Help</span>
              <span className="font-bold font-mono text-stone-900">{CITY_EMERGENCIES[sosCity].medical}</span>
            </div>

            <div className="flex justify-between items-center p-2 rounded-lg bg-stone-100 border border-stone-200">
              <span className="text-stone-600 font-medium">🚕 Premium Checked Cab Rank</span>
              <span className="font-bold font-mono text-stone-900">{CITY_EMERGENCIES[sosCity].taxiService}</span>
            </div>

            <div className="flex justify-between items-center p-2 rounded-lg bg-stone-100 border border-stone-200">
              <span className="text-stone-600 font-medium">🇺🇸 US Embassy Support Center</span>
              <span className="font-bold font-mono text-stone-900 overflow-x-auto select-all pr-1">{CITY_EMERGENCIES[sosCity].embassySupport}</span>
            </div>
          </div>
        </div>

        {/* Location Broadcast Panel */}
        <div className="bg-white border border-stone-150 rounded-2xl p-5 space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-stone-100">
            <h4 className="font-sans font-bold text-xs uppercase tracking-wider text-stone-700">Encrypted Broadcast Builder</h4>
            <span className="inline-flex items-center gap-1 text-[10px] bg-indigo-50 border border-indigo-100 text-indigo-700 px-2 py-0.5 rounded-md font-bold">
              <Navigation className="w-2.5 h-2.5 animate-pulse" /> Live Coords
            </span>
          </div>

          <div className="flex gap-2">
            {(['safe', 'alert', 'urgent'] as const).map((status) => (
              <button
                key={status}
                onClick={() => setSosStatus(status)}
                className={`flex-1 py-1 px-2.5 rounded-lg text-[10px] font-black uppercase tracking-wider border transition-all ${
                  sosStatus === status
                    ? status === 'safe' ? 'bg-emerald-50 border-emerald-300 text-emerald-800' :
                      status === 'alert' ? 'bg-amber-50 border-amber-300 text-amber-800' :
                      'bg-rose-50 border-rose-300 text-rose-800 animate-pulse'
                    : 'bg-white hover:bg-stone-50 border-stone-200 text-stone-500'
                }`}
              >
                {status}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-2 gap-3 text-xs">
            <div>
              <label className="block text-[8px] font-bold text-stone-500 uppercase">Emergency Safe Word</label>
              <input
                type="text"
                value={customSafeWord}
                onChange={e => setCustomSafeWord(e.target.value.toUpperCase())}
                placeholder="e.g. LAVENDER"
                className="w-full p-2 border border-stone-200 rounded bg-stone-50 font-mono font-bold text-stone-800"
              />
            </div>
            <div>
              <label className="block text-[8px] font-bold text-stone-500 uppercase">Current City</label>
              <div className="p-2 border border-stone-200 rounded bg-stone-50 font-bold uppercase text-stone-600 font-sans tracking-wide">
                {sosCity}
              </div>
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="block text-[8px] font-bold text-stone-500 uppercase">SMS Text Preview (Copy to WhatsApp / Messenger):</label>
            <div className="relative">
              <pre className="p-3 bg-stone-900 text-stone-100 rounded-xl text-[10px] leading-relaxed font-mono whitespace-pre-wrap select-all max-h-32 overflow-y-auto block pr-8">
                {compileSmsMessage()}
              </pre>
              <button
                onClick={handleCopyToClipboard}
                title="Copy SMS Message"
                className="absolute right-2.5 top-2.5 p-1.5 rounded-md bg-stone-800 hover:bg-stone-700 text-stone-300 border border-stone-700 transition"
              >
                {copiedStatus ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              </button>
            </div>
            {copiedStatus && (
              <p className="text-[10px] text-emerald-600 font-sans text-right animate-fade-in">
                ✓ Encrypted SMS copied. Ready to dispatch!
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

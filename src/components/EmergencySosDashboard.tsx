/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { 
  ShieldAlert, 
  Volume2, 
  MessageSquareDiff, 
  MapPin, 
  X, 
  AlertOctagon, 
  Radio, 
  PhoneCall, 
  QrCode, 
  Info,
  CheckCircle,
  Clock,
  VolumeX,
  PhoneOff
} from 'lucide-react';

interface EmergencySosDashboardProps {
  onClose: () => void;
  activeCity: string;
}

const LOCAL_TRANSLATIONS: Record<string, {
  language: string;
  emergencyPhrase: string;
  phonetic: string;
  meaning: string;
}> = {
  rome: {
    language: "Italian (Italiano)",
    emergencyPhrase: "AIUTO! Chiami la polizia immediatamente!",
    phonetic: "Ah-YOO-toh! Key-AH-mee lah poh-leet-SEE-ah eem-meh-dee-ah-tah-MEN-teh!",
    meaning: "HELP! Call the police immediately!"
  },
  bangkok: {
    language: "Thai (ภาษาไทย)",
    emergencyPhrase: "ช่วยด้วย! กรุณาโทรแจ้งตำรวจด่วน!",
    phonetic: "Chuay-duay! Gah-ru-nah toh jaeng dtam-ruat duan!",
    meaning: "HELP! Please call the police immediately!"
  },
  paris: {
    language: "French (Français)",
    emergencyPhrase: "AU SECOURS ! Appelez la police tout de suite !",
    phonetic: "Oh suh-COOR ! Ah-pleh lah poh-LEES too d'sweet !",
    meaning: "HELP! Call the police right now!"
  },
  tokyo: {
    language: "Japanese (日本語)",
    emergencyPhrase: "助けて！すぐに警察を呼んでください！",
    phonetic: "Tasukete! Sugu ni keisatsu o yonde kudasai!",
    meaning: "HELP! Please call the police immediately!"
  }
};

export default function EmergencySosDashboard({ onClose, activeCity }: EmergencySosDashboardProps) {
  const cityKey = activeCity.toLowerCase().includes('rome') ? 'rome' :
                  activeCity.toLowerCase().includes('bangkok') ? 'bangkok' :
                  activeCity.toLowerCase().includes('paris') ? 'paris' : 'tokyo';

  const [simulatedLat, setSimulatedLat] = useState<number>(cityKey === 'rome' ? 41.8902 : cityKey === 'bangkok' ? 13.7563 : cityKey === 'paris' ? 48.8566 : 35.6762);
  const [simulatedLng, setSimulatedLng] = useState<number>(cityKey === 'rome' ? 12.4922 : cityKey === 'bangkok' ? 100.5018 : cityKey === 'paris' ? 2.3522 : 139.6503);
  
  // States for sub-devices
  const [sirenPlaying, setSirenPlaying] = useState<boolean>(false);
  const [micRecording, setMicRecording] = useState<boolean>(true);
  const [recordingSeconds, setRecordingSeconds] = useState<number>(0);
  const [isFakeCallIncoming, setIsFakeCallIncoming] = useState<boolean>(false);
  const [fakeCallAnswered, setFakeCallAnswered] = useState<boolean>(false);
  const [showQr, setShowQr] = useState<boolean>(false);

  // Siren interval timing
  const [sirenColorToggle, setSirenColorToggle] = useState<boolean>(false);

  // Ref loops
  const recordIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const gpsIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const sirenIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Mic timer loop
  useEffect(() => {
    if (micRecording) {
      recordIntervalRef.current = setInterval(() => {
        setRecordingSeconds(prev => prev + 1);
      }, 1000);
    } else {
      if (recordIntervalRef.current) clearInterval(recordIntervalRef.current);
    }
    return () => {
      if (recordIntervalRef.current) clearInterval(recordIntervalRef.current);
    };
  }, [micRecording]);

  // GPS dynamic drifting to simulate real motion
  useEffect(() => {
    gpsIntervalRef.current = setInterval(() => {
      setSimulatedLat(prev => prev + (Math.random() - 0.5) * 0.0002);
      setSimulatedLng(prev => prev + (Math.random() - 0.5) * 0.0002);
    }, 2000);
    return () => {
      if (gpsIntervalRef.current) clearInterval(gpsIntervalRef.current);
    };
  }, []);

  // Flashing siren loop
  useEffect(() => {
    if (sirenPlaying) {
      sirenIntervalRef.current = setInterval(() => {
        setSirenColorToggle(prev => !prev);
      }, 500);
    } else {
      if (sirenIntervalRef.current) clearInterval(sirenIntervalRef.current);
    }
    return () => {
      if (sirenIntervalRef.current) clearInterval(sirenIntervalRef.current);
    };
  }, [sirenPlaying]);

  const toggleSiren = () => {
    setSirenPlaying(!sirenPlaying);
  };

  const handleTriggerFakeCall = () => {
    setIsFakeCallIncoming(true);
    setFakeCallAnswered(false);
  };

  const formatRecordingTime = (totalSecs: number) => {
    const mins = Math.floor(totalSecs / 60);
    const secs = totalSecs % 60;
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  const translation = LOCAL_TRANSLATIONS[cityKey];

  return (
    <div className={`fixed inset-0 z-50 flex items-center justify-center p-4 transition-all duration-300 ${
      sirenPlaying && sirenColorToggle 
        ? 'bg-rose-950/95 md:bg-rose-950/95' 
        : 'bg-stone-950/95 md:bg-stone-900/90'
    } backdrop-blur-md`}>
      
      {/* MASTER DASHBOARD CONTAINER */}
      <div className="bg-white rounded-3xl w-full max-w-4xl border border-stone-150 shadow-2xl flex flex-col md:flex-row overflow-hidden animate-fade-in relative max-h-[90vh] md:max-h-none overflow-y-auto md:overflow-visible">
        
        {/* LEFT COLUMN: LIVE SOS CRISIS OVERVIEW (35% width) */}
        <div className="bg-stone-900 text-stone-100 p-6 md:p-8 md:w-5/12 flex flex-col justify-between space-y-6 relative overflow-hidden">
          {/* Subtle noise decoration */}
          <div className="absolute inset-0 bg-radial-gradient from-rose-500/10 to-transparent opacity-40 pointer-events-none" />

          <div className="relative z-10 space-y-6">
            <div className="flex items-center justify-between">
              <span className="inline-flex items-center gap-1 text-[10px] bg-rose-500/20 text-rose-400 border border-rose-500/35 px-2.5 py-1 rounded-md font-bold uppercase tracking-wider animate-pulse">
                <Radio className="w-3.5 h-3.5" /> High-Sensitivity SOS Mode
              </span>
              <button 
                onClick={onClose}
                className="p-1 px-2.5 rounded-lg text-stone-400 hover:text-white bg-white/5 hover:bg-white/10 transition-colors md:hidden text-xs font-bold"
              >
                Close x
              </button>
            </div>

            <div className="space-y-2">
              <h3 className="font-sans text-2xl font-black text-white tracking-tight leading-none uppercase">
                Aura Guardian Protocol
              </h3>
              <p className="text-xs text-stone-400 leading-relaxed font-sans">
                A highly secure travel beacon mode mapping active location, surrounding security networks, and transit options.
              </p>
            </div>

            {/* Simulated Audio Cloud Recorder */}
            <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[10px] text-amber-305 font-bold uppercase tracking-wider flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-amber-500 animate-ping" /> Cloud Audio Recorder
                </span>
                <span className="font-mono text-xs font-bold text-amber-400">
                  {formatRecordingTime(recordingSeconds)}
                </span>
              </div>
              <p className="text-[10px] text-stone-300 leading-relaxed font-sans">
                Ambient micro-audio is currently simulated recording, encrypted, and backed up in local sandbox storage.
              </p>
              <div className="flex items-center justify-between gap-2.5">
                <div className="flex gap-1 h-3.5 items-end flex-grow px-1 select-none">
                  {Array(18).fill(null).map((_, i) => {
                    const h = micRecording ? Math.floor(Math.sin((recordingSeconds * 5) + i) * 6) + 10 : 3;
                    return (
                      <div 
                        key={i} 
                        className="bg-amber-400/80 rounded-sm flex-1 transition-all duration-300"
                        style={{ height: `${h}px` }}
                      />
                    );
                  })}
                </div>
                
                <button
                  onClick={() => setMicRecording(!micRecording)}
                  className={`py-1 px-2.5 rounded text-[10px] font-bold uppercase tracking-wider shrink-0 transition-colors ${
                    micRecording 
                      ? 'bg-amber-500 hover:bg-amber-600 text-stone-950' 
                      : 'bg-stone-800 hover:bg-stone-700 text-stone-300'
                  }`}
                >
                  {micRecording ? 'Pause Mic' : 'Record Mic'}
                </button>
              </div>
            </div>

            {/* Geolocation Telemetry */}
            <div className="p-4 rounded-2xl bg-white/5 border border-white/5 space-y-2 font-mono">
              <span className="block text-[9px] font-bold text-stone-400 uppercase tracking-widest">Active Safety Coordinates</span>
              <div className="space-y-1 text-xs">
                <div className="flex justify-between">
                  <span className="text-stone-400">Latitude:</span>
                  <span className="text-emerald-400 font-bold">{simulatedLat.toFixed(6)}° N</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-stone-400">Longitude:</span>
                  <span className="text-emerald-400 font-bold">{simulatedLng.toFixed(6)}° E</span>
                </div>
                <div className="flex justify-between text-[10px] text-stone-500 pt-0.5 border-t border-white/5">
                  <span>GPS Error:</span>
                  <span>± 2.4 meters Accuracy</span>
                </div>
              </div>
            </div>
          </div>

          {/* Core SOS footer details */}
          <div className="hidden md:flex flex-col gap-2 border-t border-white/10 pt-4 relative z-10">
            <div className="text-[9.5px] text-stone-500 leading-normal">
              Aura utilizes premium sandboxed emergency signals. We always advise prioritizing dialing national police operators directly if in critical danger.
            </div>
            <button 
              onClick={onClose}
              className="w-full py-2 bg-stone-800 hover:bg-stone-755 text-white font-bold text-xs rounded-xl border border-stone-700 transition"
            >
              Exit Safety Portal
            </button>
          </div>
        </div>

        {/* RIGHT COLUMN: INTERACTIVE TOOLS & ALARMS (65% width) */}
        <div className="p-6 md:p-8 md:w-7/12 space-y-6 flex flex-col justify-between">
          <div className="space-y-6">
            
            {/* Header containing name and title */}
            <div className="flex items-start justify-between border-b border-stone-100 pb-4">
              <div>
                <span className="text-[10px] font-black uppercase text-rose-600 tracking-wider flex items-center gap-1">
                  🌐 Target Area: {activeCity}
                </span>
                <h4 className="font-serif text-lg font-bold text-stone-950">
                  Instant Safety Tactics
                </h4>
              </div>
              <button 
                onClick={onClose}
                className="hidden md:inline-flex p-1.5 rounded-full hover:bg-stone-100 text-stone-400 hover:text-stone-700 transition-colors"
                title="Exit Alarm Mode"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* FLASH CARD FOR LOCAL BYSTANDERS: MASSIVE EMERGENCY TRANSLATION */}
            <div className="p-5 rounded-2xl bg-rose-50 border-2 border-rose-300 space-y-3.5 relative overflow-hidden shadow-xs">
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[9px] font-bold bg-rose-250 text-rose-800 border border-rose-200">
                🚨 Local Translator Card (Show To Strangers)
              </span>
              <div className="text-center space-y-2">
                <div className="text-3xl md:text-4xl font-extrabold text-rose-950 leading-tight font-serif tracking-tight select-all">
                  {translation?.emergencyPhrase}
                </div>
                <div className="text-xs text-rose-800 font-sans mt-1 bg-white/70 py-1.5 px-3 rounded-lg border border-rose-100 max-w-md mx-auto">
                  <span className="font-bold">Pronunciation Key:</span> {translation?.phonetic}
                </div>
                <div className="text-[10px] text-stone-500 font-mono italic uppercase tracking-wider">
                  Means: "{translation?.meaning}" in {translation?.language}
                </div>
              </div>
              <div className="text-[10px] text-stone-605 leading-normal text-center max-w-sm mx-auto font-sans">
                💡 <em>Tap and hold to display this in full screen. Show it directly to taxi drivers, hotel desks, store clerks, or passing police.</em>
              </div>
            </div>

            {/* ACTION TRIGGERS GRID: Alarm, Fake Call, emergency locator */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              
              {/* Deterrent Alarm */}
              <button
                onClick={toggleSiren}
                className={`flex flex-col items-center justify-center p-4 rounded-2xl border transition-all text-center group ${
                  sirenPlaying 
                    ? 'bg-rose-650 border-rose-600 text-white animate-pulse' 
                    : 'bg-white hover:bg-rose-50/30 border-stone-200 text-stone-850 hover:border-rose-150'
                }`}
              >
                <div className={`p-3 rounded-xl mb-2.5 transition-colors ${
                  sirenPlaying ? 'bg-rose-800 text-white' : 'bg-rose-50 text-rose-600'
                }`}>
                  {sirenPlaying ? <VolumeX className="w-6 h-6 animate-spin" /> : <Volume2 className="w-6 h-6" />}
                </div>
                <span className="font-sans font-bold text-xs uppercase tracking-wider block">
                  {sirenPlaying ? 'Mute Warning Siren' : 'Activate Alarm Siren'}
                </span>
                <span className={`text-[10px] mt-0.5 font-medium leading-tight ${sirenPlaying ? 'text-white' : 'text-stone-400'}`}>
                  {sirenPlaying ? 'SIMULATING LOUD AUDIO SIREN' : 'Sounds maximum high-volume audio alert'}
                </span>
              </button>

              {/* Fake Companion Call Generator */}
              <div className="bg-white border border-stone-200 rounded-2xl p-4 text-center flex flex-col justify-between items-center relative overflow-hidden">
                {!isFakeCallIncoming ? (
                  <div className="flex flex-col items-center justify-center h-full space-y-2 py-1">
                    <div className="p-3 bg-stone-50 text-stone-700 rounded-xl">
                      <PhoneCall className="w-6 h-6 text-stone-900" />
                    </div>
                    <span className="font-sans font-bold text-xs uppercase tracking-wider block">Simulate Safe Call</span>
                    <span className="text-[10px] text-stone-400 leading-tight">
                      Trigger a realistic mock incoming phone call specifically designed to extract yourself safely.
                    </span>
                    <button
                      onClick={handleTriggerFakeCall}
                      className="py-1 px-4 mt-2 bg-stone-950 hover:bg-stone-850 text-white text-[10px] font-bold rounded-lg transition-colors border border-stone-900 shadow-xs"
                    >
                      Call Me In 2 Secs
                    </button>
                  </div>
                ) : !fakeCallAnswered ? (
                  /* SIMULATED INCOMING SCREEN */
                  <div className="flex flex-col items-center justify-center w-full h-full space-y-3 py-1 bg-stone-950 text-white rounded-xl p-4 absolute inset-0 z-20 animate-fade-in animate-pulse">
                    <span className="text-[9px] font-black uppercase tracking-widest text-emerald-450">Incoming Guard Call</span>
                    <div className="text-sm font-black tracking-tight flex items-center gap-1.5">
                      Elena G. (Aura Security)
                    </div>
                    <p className="text-[9px] text-stone-400">Verifying safe passage coordinates...</p>
                    <div className="flex gap-2.5 w-full max-w-[160px] pt-1">
                      <button
                        onClick={() => {
                          setFakeCallAnswered(true);
                        }}
                        className="flex-1 py-1 px-1.5 bg-emerald-600 font-bold text-[10px] rounded-md text-white"
                      >
                        Accept
                      </button>
                      <button
                        onClick={() => {
                          setIsFakeCallIncoming(false);
                        }}
                        className="flex-1 py-1 px-1.5 bg-rose-600 font-bold text-[10px] rounded-md text-white"
                      >
                        Decline
                      </button>
                    </div>
                  </div>
                ) : (
                  /* CALL ACTIVE CONVERSATION SIMULATOR */
                  <div className="flex flex-col items-center justify-center w-full h-full space-y-2 py-2 bg-stone-950 text-white rounded-xl p-4 absolute inset-0 z-20 animate-fade-in">
                    <div className="flex items-center gap-1 text-[8px] font-bold bg-white/10 px-1.5 py-0.5 rounded text-emerald-400">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" /> Connection Live
                    </div>
                    <div className="text-xs font-black font-mono">00:{String(recordingSeconds % 60).padStart(2, '0')}</div>
                    
                    {/* Fake Script to read aloud */}
                    <div className="text-[8px] text-stone-300 font-serif leading-relaxed italic bg-white/5 p-2 rounded max-h-[70px] overflow-y-auto">
                      "Speak Aloud: 'Yes Elena, I am near the main street right now, meeting you in two minutes! Keep my track link open.'"
                    </div>

                    <button
                      onClick={() => {
                        setIsFakeCallIncoming(false);
                        setFakeCallAnswered(false);
                      }}
                      className="py-1 px-3 bg-rose-600 text-[9px] font-bold uppercase rounded-md text-white flex items-center justify-center gap-1"
                    >
                      <PhoneOff className="w-2.5 h-2.5" /> End Simulated Call
                    </button>
                  </div>
                )}
              </div>

            </div>

          </div>

          {/* Quick-sharing QR code overlay / localized info */}
          <div className="border-t border-stone-100 pt-5 mt-4 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-sans text-stone-500">
            <div className="flex items-center gap-2">
              <span className="flex items-center justify-center w-5 h-5 rounded-full bg-stone-105 text-stone-700 text-[10px] font-bold">
                i
              </span>
              <span>Your security contacts are Elena Gustafsson & Sarah Jenkins.</span>
            </div>

            <div className="flex gap-2">
              <button 
                onClick={() => setShowQr(!showQr)}
                className="py-1 px-3 border border-stone-250 select-none text-stone-600 text-xs font-semibold rounded-lg hover:bg-stone-50 transition-colors flex items-center gap-1"
              >
                <QrCode className="w-3.5 h-3.5 text-stone-500" /> Share Emergency Pass QR {showQr ? '[-]' : '[+]'}
              </button>
            </div>
            
            {showQr && (
              <div className="p-3 bg-white border border-stone-200 rounded-xl shadow-lg absolute right-6 bottom-16 z-30 flex flex-col items-center animate-fade-in w-40">
                <div className="w-32 h-32 bg-stone-50 border border-stone-150 rounded flex items-center justify-center font-mono text-[9px] text-center p-2">
                  [AURA SECURE TRAVEL PASS QR ENCRYPTED]
                </div>
                <span className="text-[8px] text-stone-400 block mt-1.5 uppercase font-bold">Access Code: {cityKey.toUpperCase()}112</span>
              </div>
            )}
          </div>

          <div className="md:hidden flex flex-col gap-2 pt-4">
            <button 
              onClick={onClose}
              className="w-full py-2.5 bg-rose-600 hover:bg-rose-700 font-bold text-xs rounded-xl text-white shadow-md transition-all uppercase tracking-wider"
            >
              Exit Safety Portal
            </button>
          </div>

        </div>

      </div>
    </div>
  );
}

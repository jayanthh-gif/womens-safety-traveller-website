/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { createClient } from '@supabase/supabase-js';
import { SafeSpot, TravelBuddy, Enquiry } from '../types';

// Parse and sanitize Supabase Endpoint Url
let rawUrl = ((import.meta as any).env?.VITE_SUPABASE_URL as string) || 'https://lvjuwfhedyyirxgrgfyj.supabase.co';
if (rawUrl.includes('/rest/v1')) {
  rawUrl = rawUrl.split('/rest/v1')[0];
}
rawUrl = rawUrl.trim();
if (rawUrl.endsWith('/')) {
  rawUrl = rawUrl.slice(0, -1);
}

const supabaseUrl = rawUrl;
const supabaseAnonKey = ((import.meta as any).env?.VITE_SUPABASE_ANON_KEY as string) || 'sb_publishable_4G7vayEB0LKbYdNHe5-J3g_xMom3k_A';

// Export verified client
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Utility status check for UI feedback
export function isSupabaseConfigured(): boolean {
  return !!supabaseUrl && !!supabaseAnonKey && !supabaseAnonKey.includes('placeholder');
}

/**
 * DB Sync for SAFE SPOTS
 */
export async function getSupabaseSafeSpots(): Promise<SafeSpot[] | null> {
  try {
    const { data, error } = await supabase
      .from('safe_spots')
      .select('*')
      .order('timestamp', { ascending: false });
    
    if (error) {
      console.warn('Supabase safe_spots read issue, using local storage fallback:', error.message);
      return null;
    }
    return data as SafeSpot[];
  } catch (err) {
    console.warn('Supabase safe_spots fetch error, fell back:', err);
    return null;
  }
}

export async function insertSupabaseSafeSpot(spot: SafeSpot): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('safe_spots')
      .insert([spot]);
    
    if (error) {
      console.error('Supabase write error:', error.message);
      return false;
    }
    return true;
  } catch (err) {
    console.error('Supabase save exception:', err);
    return false;
  }
}

/**
 * DB Sync for REVIEWS
 */
export async function getSupabaseReviews(): Promise<any[] | null> {
  try {
    const { data, error } = await supabase
      .from('reviews')
      .select('*')
      .order('date', { ascending: false });
    
    if (error) {
      console.warn('Supabase reviews read issue, using local storage:', error.message);
      return null;
    }
    return data;
  } catch (err) {
    console.warn('Supabase reviews fetch error:', err);
    return null;
  }
}

export async function insertSupabaseReview(review: any): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('reviews')
      .insert([review]);
    
    if (error) {
      console.error('Supabase review write issue:', error.message);
      return false;
    }
    return true;
  } catch (err) {
    console.error('Supabase review exception:', err);
    return false;
  }
}

/**
 * DB Sync for TRAVEL BUDDIES
 */
export async function getSupabaseTravelBuddies(): Promise<TravelBuddy[] | null> {
  try {
    const { data, error } = await supabase
      .from('travel_buddies')
      .select('*');
    
    if (error) {
      console.warn('Supabase travel_buddies read issue, using seeding:', error.message);
      return null;
    }
    return data as TravelBuddy[];
  } catch (err) {
    console.warn('Supabase travel_buddies error:', err);
    return null;
  }
}

export async function insertSupabaseTravelBuddy(buddy: TravelBuddy): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('travel_buddies')
      .insert([buddy]);
    if (error) {
      console.error('Supabase travel_buddies write error:', error.message);
      return false;
    }
    return true;
  } catch (err) {
    console.error('Supabase buddy save exception:', err);
    return false;
  }
}

/**
 * DB Sync for ENQUIRIES
 */
export async function getSupabaseEnquiries(): Promise<Enquiry[] | null> {
  try {
    const { data, error } = await supabase
      .from('enquiries')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) {
      console.warn('Supabase enquiries read issue:', error.message);
      return null;
    }
    return data as Enquiry[];
  } catch (err) {
    console.warn('Supabase enquiries error:', err);
    return null;
  }
}

export async function insertSupabaseEnquiry(enquiry: Enquiry): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('enquiries')
      .insert([enquiry]);
    if (error) {
      console.error('Supabase enquiries write error:', error.message);
      return false;
    }
    return true;
  } catch (err) {
    console.error('Supabase enquiry save exception:', err);
    return false;
  }
}

/**
 * DB Sync for OTP / Password Recovery Records
 */
export async function insertSupabaseOtp(email: string, code: string): Promise<boolean> {
  try {
    const expiredAt = new Date();
    expiredAt.setMinutes(expiredAt.getMinutes() + 15); // Valid for 15 minutes

    const otpData = {
      id: `otp-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      email: email.trim().toLowerCase(),
      otp_code: code,
      created_at: new Date().toISOString(),
      expires_at: expiredAt.toISOString(),
      verified: false
    };

    const { error } = await supabase
      .from('one_time_passwords')
      .insert([otpData]);

    if (error) {
      console.warn('Supabase OTP insert issue (continuing with local verification):', error.message);
      return false;
    }
    return true;
  } catch (err) {
    console.error('Supabase OTP except:', err);
    return false;
  }
}

export async function verifySupabaseOtp(email: string, code: string): Promise<boolean> {
  try {
    const { data, error } = await supabase
      .from('one_time_passwords')
      .select('*')
      .eq('email', email.trim().toLowerCase())
      .eq('otp_code', code)
      .eq('verified', false)
      .order('created_at', { ascending: false })
      .limit(1);

    if (error) {
      console.warn('Supabase OTP verification query warning:', error.message);
      return false;
    }

    if (data && data.length > 0) {
      const record = data[0];
      const expiry = new Date(record.expires_at).getTime();
      const now = new Date().getTime();

      if (now <= expiry) {
        // Mark as verified
        await supabase
          .from('one_time_passwords')
          .update({ verified: true })
          .eq('id', record.id);
        return true;
      }
    }
    return false;
  } catch (err) {
    console.warn('Supabase OTP verify error:', err);
    return false;
  }
}


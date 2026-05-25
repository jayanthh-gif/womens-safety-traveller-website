export interface SafeSpot {
  id: string;
  name: string;
  category: 'accommodation' | 'cafe' | 'transit' | 'activity' | 'emergency';
  city: string;
  address: string;
  description: string;
  safetyRating: number; // 1 to 5 stars
  author: string;
  timestamp: string;
  upvotes: number;
}

export interface TravelBuddy {
  id: string;
  name: string;
  age: number;
  origin: string;
  avatar: string;
  languages: string[];
  currentCity: string;
  bio: string;
  travelDates: string;
  interests: string[];
  verified: boolean;
}

export interface SafetyCheckIn {
  id: string;
  activity: string;
  durationMinutes: number;
  startedAt: string;
  endsAt: string;
  status: 'active' | 'completed' | 'alert_triggered';
  contacts: string[];
}

export interface SecurityContact {
  city: string;
  emergency: string;
  touristPolice: string;
  medical: string;
  taxiService: string;
  embassySupport: string;
}

export interface Enquiry {
  id: string;
  name: string;
  email: string;
  city: string;
  topic: 'safety' | 'transit' | 'meetup' | 'emergency_planning' | 'other';
  message: string;
  created_at: string;
  status: 'pending' | 'resolved';
}

export interface SafetyReport {
  city: string;
  overallScore: number;
  safetyMetrics: {
    nightWalking: number;
    soloTransport: number;
    assistance: number;
    scamRisk: number;
  };
  keyAdvice: string[];
  localNorms: string[];
  scamsToAvoid: string[];
  safeNeighborhoods: string[];
  neighborhoodsToAvoid: string[];
  itinerary: {
    day: number;
    theme: string;
    activities: {
      time: string;
      title: string;
      location: string;
      description: string;
      safetyTip: string;
    }[];
  }[];
}

import { SafetyReport } from "../types";

export const PRE_CACHED_REPORTS: Record<string, SafetyReport> = {
  rome: {
    city: "Rome, Italy",
    overallScore: 8.5,
    safetyMetrics: {
      nightWalking: 7.5,
      soloTransport: 8.5,
      assistance: 8.0,
      scamRisk: 6.0 // 10 is secure, so 6.0 indicates moderate risk of petty crime
    },
    keyAdvice: [
      "Pickpocketing is extremely common around Termini Station, Colosseum, and on Bus 64 (often nicknamed 'The Express for Pickpockets'). Keep bags in front.",
      "In restaurants, place your bag strap around your chair leg or on your lap, never hanging on the back of the chair or on the floor.",
      "If solo at night, stick to crowded, well-lit piazzas like Piazza Navona or Campo de' Fiori; avoid walking alone through Villa Borghese gardens after dusk.",
      "Use official taxi ranks inside marked orange or white cabs with a meter (Tariffa 1); avoid accepting rides from drivers standing outside waiting to solicit."
    ],
    localNorms: [
      "When visiting churches (Vatican, Pantheon, etc.), shoulders and knees must be covered. Carrying a light silk scarf in your bag is a perfect solution.",
      "Catcalling ('ciao bella') happens around tourist spots. Roman women cope by wearing dark glasses, walking with straight posture/intent, and ignoring them entirely."
    ],
    scamsToAvoid: [
      "The 'Rose/Bracelet' Scam: Men offering a 'free' rose or tying a friendship bracelet. If they place it on you, they will aggressively demand 5-20 Euros.",
      "Helpful Luggage Assistants: Random people at Termini Station offering to help you buy tickets or carry bags to train doors, then demanding a hefty tip."
    ],
    safeNeighborhoods: [
      "Trastevere: Bustling historical district. Very safe for evening dining due to vibrant, friendly street life.",
      "Prati: Upscale, residential neighborhood near the Vatican. Exceptionally clean and safe streets at midnight.",
      "Monti: High-trust bohemian neighborhood close to the Colosseum. Well-populated streets and cozy bistros."
    ],
    neighborhoodsToAvoid: [
      "Termini Station Surroundings: Avoid walking alone in the dark streets east and south of the main train station.",
      "Esquilino & Piazza Vittorio Emanuele: Darker parks and streets showing higher rates of loitering and minor altercations after midnight."
    ],
    itinerary: [
      {
        day: 1,
        theme: "Ancient Core & Well-Peopled Piazzas",
        activities: [
          {
            time: "09:00 AM - 12:00 PM",
            title: "Colosseum & Roman Forum",
            location: "Piazza del Colosseo",
            description: "Wander the ruins of the Roman Empire's beating heart. Book timed tickets well in advance.",
            safetyTip: "Pickpockets cluster at the Metro Colosseo exit. Wear your backpack on your chest and keep your hand resting on the zipper."
          },
          {
            time: "01:00 PM - 03:00 PM",
            title: "Authentic Lunch in Monti District",
            location: "Monti Neighborhood (Via Urbana)",
            description: "Enjoy handmade pasta at a quiet, female-friendly neighborhood trattoria away from heavy tourist noise.",
            safetyTip: "If dining outside, do not leave your phone resting on the table edge – passing scooters/pedestrians have been known to swipe them."
          },
          {
            time: "04:30 PM - 07:00 PM",
            title: "Sunset Walk to Trevi & Pantheon",
            location: "Historical Center",
            description: "Stroll through Piazza Navona, throw a coin in the Trevi Fountain, and explore the breathtaking Pantheon dome.",
            safetyTip: "The Trevi Fountain area is extremely cramped. This is a classic pickpocket spot. Avoid 'helpful travelers' offering to hold your camera."
          }
        ]
      },
      {
        day: 2,
        theme: "Art, Gardens & Sunset Dining",
        activities: [
          {
            time: "09:00 AM - 01:00 PM",
            title: "Vatican Museums & Basilica",
            location: "Vatican City State",
            description: "Climb Michelangelo's dome and marvel at the Sistine Chapel masterpiece.",
            safetyTip: "There are scam guides selling 'skip the line' tickets along the approach walls. Ignore them entirely and walk straight to the official line."
          },
          {
            time: "02:00 PM - 04:30 PM",
            title: "Borghese Gallery Stroll",
            location: "Villa Borghese Grounds",
            description: "View Bernini's spectacular marble sculptures in a refined palace museum.",
            safetyTip: "The Borghese Gardens are gorgeous but very secluded in parts. It is perfect during daylight, but exit the park before the sun sets."
          },
          {
            time: "06:30 PM - 09:30 PM",
            title: "Dinner & Wandering in Trastevere",
            location: "Trastevere Historic Quarter",
            description: "Explore narrow, ivy-draped medieval streets overflowing with safe, lively pizzerias, cafes, and street musicians.",
            safetyTip: "Trastevere is highly secure due to crowds. Standard rules apply: book an official MyTaxi app ride home if your hotel is not in the immediate area."
          }
        ]
      },
      {
        day: 3,
        theme: "Artisanal Views & Scenic Overlooks",
        activities: [
          {
            time: "10:00 AM - 12:30 PM",
            title: "Artisans of Tridente",
            location: "Via del Babuino & Spanish Steps area",
            description: "Browse tiny galleries, high fashion boutique shops, and authentic leather workshops in Rome's northern core.",
            safetyTip: "Beware of flower-sellers at the base of the Spanish Steps who will try to thrust a bouquet into your hand 'for free' then demand cash."
          },
          {
            time: "02:00 PM - 04:00 PM",
            title: "Orange Gardens Overlook",
            location: "Aventine Hill (Giardino degli Aranci)",
            description: "Walk up Aventine Hill to look through the famous Sovereign Military Order of Malta keyhole and sit under stone pine trees.",
            safetyTip: "Aventine Hill is quiet and upscale. The walk up is highly tranquil, but carry your own water bottle as public fountains can get isolated."
          }
        ]
      }
    ]
  },
  bangkok: {
    city: "Bangkok, Thailand",
    overallScore: 9.0,
    safetyMetrics: {
      nightWalking: 8.5,
      soloTransport: 9.0,
      assistance: 9.2,
      scamRisk: 5.5
    },
    keyAdvice: [
      "Thailand is incredibly safe regarding physical crime, but taxi, Tuk-Tuk, and temple scams are notoriously common.",
      "Always ask taxi drivers to turn on the meter ('Chai meter dai mai ka?'). If they refuse and negotiate a flat rate, politely exit and flag down another cab.",
      "Use the 'Grab' or 'Bolt' apps for booking rides. It registers your driver, logs GPS tracking, and blocks overcharging automatically.",
      "The Skytrain (BTS) and Subway (MRT) are sparkling clean, air-conditioned, well-monitored by security, and exceptionally safe for solo women at all hours."
    ],
    localNorms: [
      "Dress respectfully when visiting temples: shoulders, knees, and ankles must be covered. Slippers are fine, but you must remove shoes before entering temple chambers.",
      "Theravada Buddhist culture dictates that women must never touch a Buddhist monk or hand items directly to them. Place objects on a table or receiving cloth."
    ],
    scamsToAvoid: [
      "The 'Grand Palace is Closed' Scam: A polite, well-dressed local outside the palace approaches saying it is closed for a holiday and offers a cheap Tuk-Tuk ride to other temples. They will take you to gem/tailor shops that scam you.",
      "The Jet-Ski/Scooter Damage Scam: Renting scooters without taking photos, only for the owner to claim you scratched a fender and hold your passport hostage for massive cash."
    ],
    safeNeighborhoods: [
      "Sukhumvit (Phrom Phong / Thong Lor): Vibrant, pedestrian-friendly neighborhoods packed with foreign expats, upscale malls, sushi counters, and standard family hotels.",
      "Ari: Super quirky, hip, residential area. Packed with cute coffee houses, safe alleys, and extremely easy BTS access.",
      "Sathorn / Silom: Global business hub with constant foot traffic, standard brand hotels, and quick subway connectivity."
    ],
    neighborhoodsToAvoid: [
      "Khao San Road Surroundings after 2 AM: Becomes highly congested with heavily inebriated tourists. Petty thefts, drink-spiking, and aggressive vendors are common late at night.",
      "Quiet canals (khlongs) at dark: The walkpaths along canals can be narrow, unlit, and populated by packs of territorial stray street dogs (soi dogs)."
    ],
    itinerary: [
      {
        day: 1,
        theme: "Temples, Royal Golden Architecture & River Sails",
        activities: [
          {
            time: "08:30 AM - 11:30 AM",
            title: "Grand Palace & Wat Phra Kaew",
            location: "Na Phra Lan Road, Old Town",
            description: "Marvel at the sacred Emerald Buddha and gold-gilded spires of Thailand's royal court.",
            safetyTip: "Disregard any stranger on the street shouting 'Palace is closed!' Check the official gates yourself. Always bypass unsolicited Tuk-Tuk tours near the entrance."
          },
          {
            time: "12:00 PM - 02:00 PM",
            title: "Traditional Lunch near Tha Maharaj",
            location: "Tha Maharaj Riverside Mall",
            description: "Clean, air-conditioned spot along the Chao Phraya River offering safe street-style food and juices.",
            safetyTip: "A prime spot to rest and cool down. Keep your high-value backpack in your field of view; do not hang it over the back of high-traffic chairs."
          },
          {
            time: "03:30 PM - 05:30 PM",
            title: "Wat Arun (The Temple of Dawn)",
            location: "Thonburi (West side of River)",
            description: "Take the cheap 5-Baht cross-river public ferry to explore Wat Arun's iconic porcelain-mosaic spire.",
            safetyTip: "The steps of Wat Arun are incredibly steep. Walk down slowly and grab the handrails. Ferry boarding can be crowded – step firmly."
          }
        ]
      },
      {
        day: 2,
        theme: "Floating Journeys & Modern Sky Transit",
        activities: [
          {
            time: "09:00 AM - 01:00 PM",
            title: "Khlong Lat Mayom Floating Market",
            location: "Taling Chan Outskirts",
            description: "Ride a peaceful long-tail wooden boat through residential canals and sample delicious local pad thai cooked on boats.",
            safetyTip: "Wear a life vest during boat rides. Use official ticket counters inside the market docks rather than individual boat operators on the street."
          },
          {
            time: "03:00 PM - 06:00 PM",
            title: "Shopping & Cooling at IconSiam",
            location: "Chao Phraya River Banks",
            description: "Explore the giant high-end mall featuring an indoor floating market with artisan crafts and local snack stalls.",
            safetyTip: "Extremely secure with heavy security and cameras. Excellent place to find registered tourist desks or withdraw money from interior ATMs."
          }
        ]
      },
      {
        day: 3,
        theme: "Green Escapes & Hip Food Alleys",
        activities: [
          {
            time: "09:30 AM - 12:00 PM",
            title: "Lumpini Park Monitor Lizard Spotting",
            location: "Rama IV Road",
            description: "Stroll along shady running tracks and watch giant, gentle water monitor lizards swimming in the lakes.",
            safetyTip: "Highly recommended for female joggers. Keep to the paved paths and avoid stepping into deep brush where insects or snakes could reside."
          },
          {
            time: "01:00 PM - 04:30 PM",
            title: "Cafe Hopping in Ari District",
            location: "Paholyothin Soi 7 (Ari BTS)",
            description: "Explore Bangkok's trendiest neighborhood, packed with safe, colorful specialty cafes and artisan pastel bake shops.",
            safetyTip: "Motorcycles often speed down the narrow side-streets (sois) which lack sidewalks. Walk facing oncoming traffic and stay close to the wall."
          }
        ]
      }
    ]
  },
  paris: {
    city: "Paris, France",
    overallScore: 8.0,
    safetyMetrics: {
      nightWalking: 7.2,
      soloTransport: 7.8,
      assistance: 7.5,
      scamRisk: 5.0
    },
    keyAdvice: [
      "Paris is highly safe from hard violent crime, but pickpocketing and aggressive street sellers are prominent around major monuments.",
      "Keep zippers closed on the Metro, especially on high-tourist Line 1, Line 4, and RER B from the airport. Sit in middle carriages when boarding.",
      "Avoid signing petitions or accepting 'free' items from groups of teenagers around Sacré-Cœur, Notre-Dame, or Louvre gardens.",
      "If walked home late from dinner, avoid quiet alleys of the northern outer arrondissements (18th/19th) and take standard registered Uber rides."
    ],
    localNorms: [
      "Greet shopkeepers with a polite 'Bonjour Madame/Monsieur' when entering, and 'Merci, au revoir' upon exit. It establishes you as a respectful traveler.",
      "Avoid drinking coffee while walking – buy an espresso and sit at a sidewalk table. It helps you blend in with Parisian culture."
    ],
    scamsToAvoid: [
      "The 'Gold Ring' Scam: An older person pretends to pick up a gold ring from the ground in front of you, asks if you dropped it, then tries to force you to keep it for money.",
      "The Petition Scam: Girls holding clipboards asking 'Do you speak English?' to sign a petition for deaf/mute charities. While you sign, an accomplice pickpockets your coat."
    ],
    safeNeighborhoods: [
      "Saint-Germain-des-Prés (6th): Classic, secure, and incredibly elegant streets with bustling literary crowd and illuminated avenues.",
      "Le Marais (3rd/4th): Extremely fashionable, highly walkable residential center with active evening boutiques and excellent cafes.",
      "Passy (16th): Peaceful, safe residential district near the Eiffel Tower with high-end embassies and quiet avenues."
    ],
    neighborhoodsToAvoid: [
      "Gare du Nord & Gare de l'Est late at night: High rates of loitering, pickpockets, and aggressive solicitation around train station entrances.",
      "Châtelet-Les Halles Station exits after midnight: Large underground station corridors can feel isolated, attracting minor drug deals and rowdy crowds."
    ],
    itinerary: [
      {
        day: 1,
        theme: "Historic Island, Riverside & Bohemian Culture",
        activities: [
          {
            time: "09:30 AM - 12:00 PM",
            title: "Sainte-Chapelle & Île de la Cité",
            location: "Palais de Justice complex",
            description: "Marvel at the mind-blowing 13th-century gothic stained glass panes.",
            safetyTip: "Secure entrances require strict airport security. Keep jewelry modest to avoid attracting professional pickpocket eyes."
          },
          {
            time: "01:00 PM - 03:00 PM",
            title: "Chic Lunch in Le Marais",
            location: "Rue des Rosiers, Le Marais",
            description: "Join the lively queue for a legendary warm falafel in the heart of this safe, trendy neighborhood.",
            safetyTip: "The narrow lanes are tightly packed. Place your purse strap across your torso (crossbody style) with the zip-fastener in your hand."
          },
          {
            time: "04:30 PM - 07:00 PM",
            title: "Louvre Gardens & Seine Bookstore Walk",
            location: "Tuileries Gardens & Quai de Montebello",
            description: "Stroll along the historic green riverbanks and browse the green book boxes of traditional bouquinistes.",
            safetyTip: "Stay clear of individuals throwing seeds on you 'for a bird photo.' It is an aggressive attempt to extort money."
          }
        ]
      },
      {
        day: 2,
        theme: "Impressionist Masterpieces & Scenic Overlooks",
        activities: [
          {
            time: "09:30 AM - 12:30 PM",
            title: "Musée d'Orsay Art Museum",
            location: "Rue de la Légion d'Honneur",
            description: "Behold Monet, Van Gogh, and Renoir paintings inside an majestic converted Belle Époque railway structure.",
            safetyTip: "Bags must be checked in the cloakroom. Keep your cards, passport, and phone in a secure front pocket inside the gallery."
          },
          {
            time: "02:00 PM - 04:30 PM",
            title: "Montmartre Art Stroll",
            location: "Place du Tertre & Sacré-Cœur",
            description: "Wander through the winding cobblestone alleys of traditional artists and view Paris from the whitewashed dome.",
            safetyTip: "Avoid the stairways up to the church where 'string men' will try to tie threads on your fingers. Use the Montmartre Funicular (costs 1 metro ticket) for a safer approach."
          }
        ]
      },
      {
        day: 3,
        theme: "Architectural Wonders & Secret Alleys",
        activities: [
          {
            time: "10:00 AM - 12:30 PM",
            title: "Palais Garnier (Opera House)",
            location: "Place de l'Opéra",
            description: "Tour the golden grand staircase and red velvet auditorium that inspired the Phantom of the Opera.",
            safetyTip: "Opéra is a high-traffic metro hub. Escalate focus on your pockets when boarding or leaving the train doors."
          },
          {
            time: "02:00 PM - 04:30 PM",
            title: "Covered Passages Walk",
            location: "Passage des Panoramas & Galerie Vivienne",
            description: "Discover mysterious, elegant 19th-century glass-roofed shopping arcades packed with vintage stamps and old bookstalls.",
            safetyTip: "An excellent indoor, rain-free option. Perfect security due to private shopkeeper monitoring and low tourist noise."
          }
        ]
      }
    ]
  },
  tokyo: {
    city: "Tokyo, Japan",
    overallScore: 9.8,
    safetyMetrics: {
      nightWalking: 9.9,
      soloTransport: 9.8,
      assistance: 9.5,
      scamRisk: 8.5
    },
    keyAdvice: [
      "Tokyo is globally renowned as one of the single safest megacities for solo female travelers. Crime rate is remarkably low.",
      "Be aware of the Japanese 'nanpa' culture in nightlife areas (Shibuya/Shinjuku), which refers to young men trying to pick up women, but violence is extremely rare.",
      "Tokyo Metro features designated 'Women-Only' pink carriages during rush hours (usually 7:30 - 9:30 AM to combat packed trains). Look for pink symbols on the floors.",
      "The Tokyo Police offices ('Koban') are located near almost every subway exit. Officers are incredibly polite and can help with directions or minor issues."
    ],
    localNorms: [
      "Do not walk and eat at the same time; eat near the vending machine or convenience store where you bought the item.",
      "Keep speaking voices low on the trains. Set your mobile phone to silent ('manner mode') and avoid phone calls entirely in mass transit."
    ],
    scamsToAvoid: [
      "Kabukicho Tout Scams: In Roppongi and Shinjuku's Kabukicho nightlife hub, do not follow African or Japanese street touts who promise 'cheap drinks, no cover' at bars. They can spike drinks and run up thousands on your credit card."
    ],
    safeNeighborhoods: [
      "Ginza: Clean, upscale shopping district. Extremely luxurious and safe streets at all night hours.",
      "Yanaka: Old Tokyo residential district with low quiet alleys, family temples, and highly local, respectful neighborhood feel.",
      "Meguro / Nakameguro: Scenic residential canals surrounded by trendy boutique shops, cozy espresso cafes, and high-trust walkways."
    ],
    neighborhoodsToAvoid: [
      "Kabukicho (Shinjuku) Back Alleys beyond 2 AM: While still safer than almost any Western city, it is Tokyo's primary red-light district. Drunk crowds, host club touts, and rowdiness peak in the early hours."
    ],
    itinerary: [
      {
        day: 1,
        theme: "Ancient shrines, lush gardens & neon lights",
        activities: [
          {
            time: "09:00 AM - 11:30 AM",
            title: "Meiji Jingu Shrine & Yoyogi Park",
            location: "Harajuku, Shibuya",
            description: "Walk under giant cedar torii gates to Tokyo's grandest Shinto shrine.",
            safetyTip: "Extremely safe. Enjoy the deep quiet woods. Maintain low quiet tones to honor local worshippers."
          },
          {
            time: "01:00 PM - 04:00 PM",
            title: "Shopping and Sweet Cafes in Harajuku",
            location: "Takeshita Street & Omotesando Alleys",
            description: "Sample colorful rainbow cotton candy, artisan strawberry crepes, and explore cute, quiet design alleys.",
            safetyTip: "Takeshita is packed like a concert crowd. Just keep your wallet in your bag. Local shops are incredibly secure – you can leave a bag unattended on a chair without worry."
          },
          {
            time: "05:30 PM - 08:30 PM",
            title: "Shibuya Crossing & Dinner at a Conveyor Sushi",
            location: "Shibuya District",
            description: "Join thousands crossing the world's busiest intersection under giant glowing 3D screens.",
            safetyTip: "Shibuya is highly energetic but secure. It's an excellent place for solo dining since conveyor-sushi stalls (kaitenzushi) are naturally designed for single diners."
          }
        ]
      },
      {
        day: 2,
        theme: "Historical Old Tokyo & Traditional Crafts",
        activities: [
          {
            time: "09:30 AM - 12:30 PM",
            title: "Senso-ji Temple & Nakamise-dori",
            location: "Asakusa District",
            description: "Explore Tokyo’s oldest and most iconic Buddhist temple structure, entering through the Kaminarimon gate with its giant red lantern.",
            safetyTip: "Nakamise Street is very heavily populated with tourists. Enjoy the snacks, and buy temple fortunes. Highly safe and monitored."
          },
          {
            time: "02:00 PM - 05:00 PM",
            title: "Calm Yanaka Ginza Old Craft Alleys",
            location: "Yanaka Neighborhood",
            description: "Step back into the 1950s in a peaceful, winding old neighborhood. Feed local street cats and browse hand-painted tea cups.",
            safetyTip: "This is a quiet residential area. Locals are highly friendly. Beautiful place to take a tranquil afternoon stroll entirely solo and unannoyed."
          }
        ]
      },
      {
        day: 3,
        theme: "Modern waterfronts & electronic futuristic arcades",
        activities: [
          {
            time: "10:00 AM - 01:00 PM",
            title: "teamLab Planets Digital Museum",
            location: "Toyosu Waterfront",
            description: "Wade barefoot through water and navigate fields of digital hanging orchids in this brilliant interactive art space.",
            safetyTip: "You must go barefoot and walk on mirrored surfaces; wear shorts or trousers as skirts are unsuited due to reflective mirror floors (the museum offers free rental shorts if needed)."
          },
          {
            time: "02:30 PM - 05:30 PM",
            title: "Akihabara Electronic Town & Sega Arcades",
            location: "Akihabara District",
            description: "Explore multi-level retro gaming stores, anime shops, and crane-game arcades.",
            safetyTip: "Avoid 'maid cafes' advertised on the street by girls in elaborate costumes, which can charge excessive non-advertised sitting fees. Stick to highly-rated official cafes if interested."
          }
        ]
      }
    ]
  }
};

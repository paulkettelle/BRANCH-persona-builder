export interface PersonaData {
  // Step 1: Avatar
  avatarVariant: 1 | 2 | 3 | 4 | 5 | 6;
  
  // Step 2: Basic Info
  name: string;
  age: string;
  location: string;
  
  // Step 3: Professional Info
  jobTitle: string;
  industry: string;
  companySize: string;
  
  // Step 4: Goals
  primaryGoals: string[];
  
  // Step 5: Challenges
  challenges: string[];
  
  // Step 6: Behavior
  preferredChannels: string[];
  informationSources: string[];
  
  // Step 7: Quote/Bio
  quote: string;
  bio: string;
}

export const defaultPersonaData: PersonaData = {
  avatarVariant: 1,
  name: "",
  age: "",
  location: "",
  jobTitle: "",
  industry: "",
  companySize: "",
  primaryGoals: [],
  challenges: [],
  preferredChannels: [],
  informationSources: [],
  quote: "",
  bio: "",
};

export const goalOptions = [
  "Increase revenue",
  "Reduce costs",
  "Improve efficiency",
  "Grow market share",
  "Enhance customer experience",
  "Build brand awareness",
  "Develop new products",
  "Expand into new markets",
];

export const challengeOptions = [
  "Limited budget",
  "Lack of time",
  "Finding qualified leads",
  "Keeping up with technology",
  "Competition",
  "Talent acquisition",
  "Measuring ROI",
  "Scaling operations",
];

export const channelOptions = [
  "Email",
  "LinkedIn",
  "Twitter/X",
  "Industry events",
  "Webinars",
  "Phone calls",
  "In-person meetings",
  "Podcasts",
];

export const sourceOptions = [
  "Industry publications",
  "Peer recommendations",
  "Online research",
  "Social media",
  "Trade shows",
  "Analyst reports",
  "Vendor websites",
  "Case studies",
];

export const industryOptions = [
  "Technology",
  "Healthcare",
  "Finance",
  "Retail",
  "Manufacturing",
  "Education",
  "Real Estate",
  "Marketing & Advertising",
  "Legal",
  "Other",
];

export const companySizeOptions = [
  "1-9",
  "10-49",
  "50-149",
  "150-499",
  "500-1499",
  "1500+",
];

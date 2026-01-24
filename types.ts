
export enum LeadStatus {
  NEW = 'New',
  CONTACTED = 'Contacted',
  NEGOTIATING = 'Negotiating',
  WON = 'Won',
  LOST = 'Lost'
}

export interface BusinessOpportunity {
  id: string;
  name: string;
  location: string;
  phone?: string;
  email?: string;
  website?: string;
  ownerName?: string;
  ownerPhone?: string;
  gmbLink?: string;
  leadSource: 'Google Maps' | 'Yelp' | 'LinkedIn' | 'Instagram' | 'Facebook' | 'Yellow Pages' | 'Direct';
  socialLinks?: {
    linkedin?: string;
    instagram?: string;
    facebook?: string;
    yelp?: string;
  };
  currencySymbol: string;
  estimatedRevenue: number;
  businessSize: 'Boutique' | 'Growth' | 'Enterprise';
  needs: {
    website: boolean;
    seo: boolean;
    socialMedia: boolean;
    graphicDesign: boolean;
    gmbIssues: boolean;
  };
  analysis: string;
  serviceRecommendation: string;
  potentialValue: number;
}

export interface JobListing {
  id: string;
  title: string;
  company: string;
  location: string;
  description: string;
  source: 'LinkedIn' | 'Indeed' | 'Upwork' | 'Freelancer' | 'Other';
  sourceUrl: string;
  postedDate: string;
  estimatedBudget?: string;
  type: 'Freelance' | 'Contract' | 'Full-time';
}

export interface CRMLead extends BusinessOpportunity {
  status: LeadStatus;
  notes: string;
  createdAt: string;
  dealAmount?: number;
}

export interface GroundingSource {
  title: string;
  uri: string;
}

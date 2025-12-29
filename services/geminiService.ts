
import { GoogleGenAI, Type } from "@google/genai";
import { BusinessOpportunity, GroundingSource, JobListing } from "../types";

export const findLeads = async (query: string, location?: { latitude: number; longitude: number }): Promise<{ leads: BusinessOpportunity[], sources: GroundingSource[] }> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  const mapsResponse = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: `EXTENDED INTEL DISCOVERY: "${query}"
    
    CRITICAL TARGETS: 
    1. Identify active businesses in this sector and location.
    2. Check Google Maps and local directories for presence.
    3. Look for "Website: Missing" or "Unclaimed Profile" status.
    4. Provide initial list for deep-web verification.`,
    config: {
      tools: [{ googleMaps: {} }],
      toolConfig: {
        retrievalConfig: location ? {
          latLng: {
            latitude: location.latitude,
            longitude: location.longitude
          }
        } : undefined
      }
    }
  });

  const mapsText = mapsResponse.text;
  const initialSources: GroundingSource[] = (mapsResponse.candidates?.[0]?.groundingMetadata?.groundingChunks || [])
    .filter((chunk: any) => chunk.maps)
    .map((chunk: any) => ({
      title: chunk.maps.title,
      uri: chunk.maps.uri
    }));

  const verificationResponse = await ai.models.generateContent({
    model: "gemini-3-pro-preview",
    contents: `SYSTEM: MULTI-PLATFORM INTELLIGENCE ENGINE.
    
    INITIAL TARGETS:
    ${mapsText}
    
    MISSION: Perform a deep audit of these businesses using Google Search across these specific platforms:
    - YELP & YELLOW PAGES: Verify reviews, active status.
    - LINKEDIN: Find Owner/CEO names.
    - FINANCIAL INTEL: Estimate their current annual revenue.
    - BUSINESS SCALE: Categorize as 'Boutique', 'Growth', or 'Enterprise'.

    JSON SCHEMA:`,
    config: {
      tools: [{ googleSearch: {} }],
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            id: { type: Type.STRING },
            name: { type: Type.STRING },
            location: { type: Type.STRING },
            phone: { type: Type.STRING },
            ownerPhone: { type: Type.STRING },
            email: { type: Type.STRING },
            website: { type: Type.STRING },
            gmbLink: { type: Type.STRING },
            ownerName: { type: Type.STRING },
            currencySymbol: { type: Type.STRING },
            estimatedRevenue: { type: Type.NUMBER },
            businessSize: { type: Type.STRING, enum: ['Boutique', 'Growth', 'Enterprise'] },
            needs: {
              type: Type.OBJECT,
              properties: {
                website: { type: Type.BOOLEAN },
                seo: { type: Type.BOOLEAN },
                socialMedia: { type: Type.BOOLEAN },
                graphicDesign: { type: Type.BOOLEAN },
                gmbIssues: { type: Type.BOOLEAN },
              },
              required: ["website", "seo", "socialMedia", "graphicDesign", "gmbIssues"]
            },
            analysis: { type: Type.STRING },
            serviceRecommendation: { type: Type.STRING },
            potentialValue: { type: Type.NUMBER }
          },
          required: ["id", "name", "location", "currencySymbol", "needs", "analysis", "serviceRecommendation", "potentialValue", "estimatedRevenue", "businessSize"]
        }
      }
    }
  });

  const searchSources: GroundingSource[] = (verificationResponse.candidates?.[0]?.groundingMetadata?.groundingChunks || [])
    .filter((chunk: any) => chunk.web)
    .map((chunk: any) => ({
      title: chunk.web.title,
      uri: chunk.web.uri
    }));

  try {
    const jsonStr = (verificationResponse.text || "[]").trim();
    const cleanedJson = jsonStr.replace(/^```json\n?/, '').replace(/\n?```$/, '');
    const leads = JSON.parse(cleanedJson);
    
    const allSources = [...initialSources, ...searchSources];
    const uniqueSources = Array.from(new Set(allSources.map(s => s.uri)))
      .map(uri => allSources.find(s => s.uri === uri)!);

    return { leads, sources: uniqueSources };
  } catch (e) {
    return { leads: [], sources: initialSources };
  }
};

export const findJobs = async (query: string): Promise<{ jobs: JobListing[], sources: GroundingSource[] }> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  const response = await ai.models.generateContent({
    model: "gemini-3-pro-preview",
    contents: `MISSION: Scrape and aggregate REAL-TIME, VALID job openings for the query: "${query}".
    
    STRICT FOCUS: 
    1. Digital Marketing Services (SEO, Social Media Marketing, PPC, Content Marketing).
    2. Graphics Designing (Logo, UI/UX, Brand Identity).
    3. Web Development/Design.
    
    CHANNELS: Search specifically across LinkedIn, Indeed, Upwork, Glassdoor, and Freelancer.com.
    
    VALIDITY RULES:
    - ONLY return jobs that have a direct, valid URI/link found in the search results.
    - Exclude expired or archived listings.
    - Ensure the 'sourceUrl' is the absolute direct link to apply or view the job.
    - If a company is hiring freelancers directly on their career page, include it.
    
    REQUIRED DATA FORMAT:`,
    config: {
      tools: [{ googleSearch: {} }],
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            id: { type: Type.STRING },
            title: { type: Type.STRING, description: "Professional Job Title" },
            company: { type: Type.STRING, description: "Hiring Entity Name" },
            location: { type: Type.STRING, description: "City, Country or Remote" },
            description: { type: Type.STRING, description: "Detailed summary of marketing/design requirements" },
            source: { type: Type.STRING, enum: ['LinkedIn', 'Indeed', 'Upwork', 'Freelancer', 'Other'] },
            sourceUrl: { type: Type.STRING, description: "VERIFIED direct job link" },
            postedDate: { type: Type.STRING, description: "Date or relative time (e.g. 2 days ago)" },
            estimatedBudget: { type: Type.STRING, description: "Salary range or project budget if visible" },
            type: { type: Type.STRING, enum: ['Freelance', 'Contract', 'Full-time'] }
          },
          required: ["id", "title", "company", "location", "description", "source", "sourceUrl", "postedDate", "type"]
        }
      }
    }
  });

  const sources: GroundingSource[] = (response.candidates?.[0]?.groundingMetadata?.groundingChunks || [])
    .filter((chunk: any) => chunk.web)
    .map((chunk: any) => ({
      title: chunk.web.title,
      uri: chunk.web.uri
    }));

  try {
    const jsonStr = (response.text || "[]").trim();
    const cleanedJson = jsonStr.replace(/^```json\n?/, '').replace(/\n?```$/, '');
    const jobs = JSON.parse(cleanedJson);
    
    // Filter to ensure links are actually present and look valid
    const validJobs = jobs.filter((j: any) => j.sourceUrl && j.sourceUrl.startsWith('http'));
    
    return { jobs: validJobs, sources };
  } catch (e) {
    console.error("Job Intelligence Extraction Failed", e);
    return { jobs: [], sources };
  }
};

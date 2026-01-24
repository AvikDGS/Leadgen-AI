
import { GoogleGenAI } from "@google/genai";
import { BusinessOpportunity, GroundingSource, JobListing } from "../types.ts";

const extractJson = (text: string | undefined): any[] => {
  if (!text || text.trim().length === 0) return [];
  const blockRegex = /```(?:json)?\s*([\s\S]*?)\s*```/g;
  let matches;
  const candidates: string[] = [];
  while ((matches = blockRegex.exec(text)) !== null) candidates.push(matches[1].trim());
  const firstBracket = text.indexOf('[');
  const lastBracket = text.lastIndexOf(']');
  if (firstBracket !== -1 && lastBracket !== -1) candidates.push(text.substring(firstBracket, lastBracket + 1).trim());
  candidates.push(text.trim());
  for (const candidate of candidates) {
    if (!candidate) continue;
    try {
      const parsed = JSON.parse(candidate);
      if (Array.isArray(parsed)) return parsed;
      if (typeof parsed === 'object' && parsed !== null) {
        const list = parsed.leads || parsed.jobs || parsed.results || parsed.data || [];
        if (Array.isArray(list)) return list;
      }
    } catch (e) {}
    let fixed = candidate.replace(/[^}\]]+$/, '');
    const attempts = [fixed, fixed + ']', fixed + '}]', fixed + '}}]'];
    for (const attempt of attempts) {
      try {
        const parsed = JSON.parse(attempt);
        if (Array.isArray(parsed)) return parsed;
        if (typeof parsed === 'object' && parsed !== null) {
          const list = parsed.leads || parsed.jobs || parsed.results || parsed.data || [];
          if (Array.isArray(list)) return list;
        }
      } catch (err) {}
    }
  }
  return [];
};

const getAI = () => {
  const apiKey = typeof process !== 'undefined' && process.env.API_KEY ? process.env.API_KEY : '';
  return new GoogleGenAI({ apiKey });
};

export const findLeads = async (query: string, location?: { latitude: number; longitude: number }): Promise<{ leads: BusinessOpportunity[], sources: GroundingSource[] }> => {
  const ai = getAI();
  const discoveryResponse = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: `MISSION: CROSS-PLATFORM LEAD EXTRACTION.
    Query: "${query}"
    Target Area: ${location ? `Lat ${location.latitude}, Lng ${location.longitude}` : 'Specified in query'}
    ACTION: Find businesses across Google Maps, Yelp, and industry-specific directories. Identify entities with digital vulnerabilities.
    OUTPUT: A list of business names, locations, and discovery sources.`,
    config: {
      tools: [{ googleMaps: {} }],
      toolConfig: {
        retrievalConfig: location ? { latLng: { latitude: location.latitude, longitude: location.longitude } } : undefined
      }
    }
  });

  const discoveryData = discoveryResponse.text;
  const initialSources: GroundingSource[] = (discoveryResponse.candidates?.[0]?.groundingMetadata?.groundingChunks || [])
    .filter((chunk: any) => chunk.maps)
    .map((chunk: any) => ({ title: chunk.maps.title, uri: chunk.maps.uri }));

  const harvestResponse = await ai.models.generateContent({
    model: "gemini-3-flash-preview", 
    contents: `Synthesize leads from: ${discoveryData}. For each, find LinkedIn, IG, FB, Yelp profiles, missing contact info, and revenue estimates.
    MANDATORY OUTPUT: RAW JSON ARRAY ONLY.
    SCHEMA: [{ "id": "uuid", "name": "string", "location": "string", "phone": "string", "ownerPhone": "string", "email": "string", "website": "string", "gmbLink": "string", "leadSource": "string", "socialLinks": { "linkedin": "url", "instagram": "url", "facebook": "url", "yelp": "url" }, "ownerName": "string", "currencySymbol": "$", "estimatedRevenue": number, "businessSize": "Boutique", "needs": { "website": bool, "seo": bool, "socialMedia": bool, "graphicDesign": bool, "gmbIssues": bool }, "analysis": "audit string", "serviceRecommendation": "service name", "potentialValue": number }]`,
    config: { tools: [{ googleSearch: {} }] }
  });

  const leads = extractJson(harvestResponse.text);
  const searchSources: GroundingSource[] = (harvestResponse.candidates?.[0]?.groundingMetadata?.groundingChunks || [])
    .filter((chunk: any) => chunk.web)
    .map((chunk: any) => ({ title: chunk.web.title, uri: chunk.web.uri }));

  const allSources = [...initialSources, ...searchSources];
  const uniqueSources = Array.from(new Set(allSources.map(s => s.uri))).map(uri => allSources.find(s => s.uri === uri)!);
  return { leads, sources: uniqueSources };
};

export const findJobs = async (query: string): Promise<{ jobs: JobListing[], sources: GroundingSource[] }> => {
  const ai = getAI();
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: `Find 20+ job openings for: "${query}". Return ONLY a raw JSON array of objects.`,
    config: { tools: [{ googleSearch: {} }] }
  });
  const jobs = extractJson(response.text);
  const sources: GroundingSource[] = (response.candidates?.[0]?.groundingMetadata?.groundingChunks || [])
    .filter((chunk: any) => chunk.web)
    .map((chunk: any) => ({ title: chunk.web.title, uri: chunk.web.uri }));
  return { jobs, sources };
};

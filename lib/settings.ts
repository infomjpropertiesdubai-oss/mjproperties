// Hardcoded company settings since no database table exists
export interface CompanySettings {
  id: string
  company_name: string
  company_phone: string
  company_email: string
  company_address: string
  whatsapp: string
  created_at: string
  updated_at: string
}

// Hardcoded company settings
const HARDCODED_SETTINGS: CompanySettings = {
  id: "1",
  company_name: "MJ Properties",
  company_phone: "+971 58 842 4517",
  company_email: "contact@mjproperties.ae",
  company_address: "Iris Bay Tower- Office: 38, 17th Floor - Al Mustaqbal St - Business Bay - Dubai - UAE",
  whatsapp: "+971588424517",
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString()
}

// Cache for settings (in-memory cache)
let settingsCache: CompanySettings | null = null
let cacheTimestamp: number = 0
const CACHE_DURATION = 5 * 60 * 1000 // 5 minutes

/**
 * Get company settings (hardcoded)
 */
export async function getCompanySettings(): Promise<CompanySettings | null> {
  // Return hardcoded settings
  return HARDCODED_SETTINGS
}

/**
 * Get cached company settings (for client components)
 */
export async function getCachedCompanySettings(): Promise<CompanySettings | null> {
  const now = Date.now()
  
  // Check if cache is valid
  if (settingsCache && (now - cacheTimestamp) < CACHE_DURATION) {
    return settingsCache
  }
  
  // Get fresh settings
  const settings = await getCompanySettings()
  
  // Update cache
  settingsCache = settings
  cacheTimestamp = now
  
  return settings
}

/**
 * Update company settings (not implemented since using hardcoded values)
 */
export async function updateCompanySettings(
  id: string, 
  updates: Partial<CompanySettings>
): Promise<{ data: CompanySettings | null; error: string | null }> {
  // Since we're using hardcoded settings, we'll just return the current settings
  // In a real implementation, this would update the database
  console.warn("updateCompanySettings called but using hardcoded settings")
  
  return {
    data: HARDCODED_SETTINGS,
    error: null
  }
}

/**
 * Clear settings cache
 */
export function clearSettingsCache(): void {
  settingsCache = null
  cacheTimestamp = 0
}

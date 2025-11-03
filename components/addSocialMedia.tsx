import { SOCIAL_MEDIA } from "@/lib/team-members";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Plus, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";

export interface SocialMediaEntry {
  id: string;
  platform: string;
  url: string;
  error?: string;
  dbId?: string; // Database ID for existing entries
}

interface AddSocialMediaProps {
  onDataChange?: (entries: SocialMediaEntry[]) => void;
  initialEntries?: SocialMediaEntry[];
}

// Helper function to map database platform names to capitalized display names
function capitalizePlatform(platform: string): string {
  if (!platform) return '';
  
  const platformMap: Record<string, string> = {
    'facebook': 'Facebook',
    'linkedin': 'LinkedIn',
    'twitter': 'Twitter',
    'instagram': 'Instagram',
    'youtube': 'YouTube',
    'tiktok': 'TikTok',
    'whatsapp': 'WhatsApp',
    'telegram': 'Telegram',
    'pinterest': 'Pinterest'
  };
  
  const lowerPlatform = platform.toLowerCase();
  return platformMap[lowerPlatform] || platform.charAt(0).toUpperCase() + platform.slice(1);
}

export function AddSocialMedia({ onDataChange, initialEntries = [] }: AddSocialMediaProps) {
  const [entries, setEntries] = useState<SocialMediaEntry[]>([]);
  const prevInitialEntriesRef = useRef<string>('');

  const getPlaceholder = useCallback((platform: string) => {
    const lowerPlatform = platform.toLowerCase();
    if (lowerPlatform === 'whatsapp') {
      return '+1234567890 or https://wa.me/...';
    } else if (lowerPlatform === 'telegram') {
      return '@username or +1234567890 or https://t.me/...';
    } else if (lowerPlatform === 'tiktok') {
      return 'https://www.tiktok.com/... or @username';
    }
    return 'https://...';
  }, []);
  
  const validateUrl = useCallback((platform: string, url: string): string | undefined => {
    if (!url || !url.trim()) {
      return 'URL is required';
    }
    
    const lowerPlatform = platform.toLowerCase();
    const trimmedUrl = url.trim();
    
    // Special handling for WhatsApp and Telegram - allow phone numbers and usernames
    if (lowerPlatform === 'whatsapp' || lowerPlatform === 'telegram') {
      // Check if it's a phone number
      const phoneRegex = /^\+?[1-9]\d{8,14}$/;
      if (phoneRegex.test(trimmedUrl)) {
        return undefined; // Valid phone number
      }
      
      // Check if it's a username (starts with @ or alphanumeric)
      const usernameRegex = /^@?[a-zA-Z0-9_]{3,}$/;
      if (usernameRegex.test(trimmedUrl)) {
        return undefined; // Valid username
      }
      
      // Check if it's a valid URL
      const urlPatterns: Record<string, RegExp> = {
        whatsapp: /^(https?:\/\/)?(wa\.me|whatsapp\.com)/i,
        telegram: /^(https?:\/\/)?(t\.me|telegram\.org)/i,
      };
      const pattern = urlPatterns[lowerPlatform];
      if (pattern && pattern.test(trimmedUrl)) {
        return undefined; // Valid URL
      }
      
      return `Invalid ${platform} format. Use a phone number (e.g., +1234567890), username, or URL`;
    }
    
    // For other platforms, require http:// or https://
    const basicUrlRegex = /^https?:\/\/.+/
    if (!basicUrlRegex.test(trimmedUrl)) {
      return 'URL must start with http:// or https://';
    }
    
    // Platform-specific patterns
    const patterns: Record<string, RegExp> = {
      facebook: /^(https?:\/\/)?(www\.)?(facebook\.com|fb\.com)/i,
      linkedin: /^(https?:\/\/)?(www\.)?linkedin\.com/i,
      twitter: /^(https?:\/\/)?(www\.)?(twitter\.com|x\.com)/i,
      instagram: /^(https?:\/\/)?(www\.)?instagram\.com/i,
      youtube: /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be)/i,
      tiktok: /^(https?:\/\/)?(www\.)?tiktok\.com/i,
      pinterest: /^(https?:\/\/)?(www\.)?pinterest\.com/i,
    };
    
    // Check platform-specific pattern
    const pattern = patterns[lowerPlatform];
    if (pattern && !pattern.test(trimmedUrl)) {
      return `Invalid ${platform} URL format`;
    }
    
    return undefined;
  }, []);

  const handleAddEntry = useCallback(() => {
    setEntries(prevEntries => {
      const newEntry: SocialMediaEntry = {
        id: Date.now().toString(),
        platform: '',
        url: ''
      };
      const updated = [...prevEntries, newEntry];
      onDataChange?.(updated);
      return updated;
    });
  }, [onDataChange]);

  const handleRemoveEntry = useCallback((id: string) => {
    setEntries(prevEntries => {
      const updated = prevEntries.filter(entry => entry.id !== id);
      onDataChange?.(updated);
      return updated;
    });
  }, [onDataChange]);


  const handleUrlChange = useCallback((id: string, url: string) => {
    setEntries(prevEntries => {
      const entry = prevEntries.find(e => e.id === id);
      const error = entry && entry.platform ? validateUrl(entry.platform, url) : undefined;
      
      const updated = prevEntries.map(e => 
        e.id === id ? { ...e, url, error } : e
      );
      onDataChange?.(updated);
      return updated;
    });
  }, [onDataChange, validateUrl]);
  
  const handlePlatformChange = useCallback((id: string, platform: string) => {
    setEntries(prevEntries => {
      const updated = prevEntries.map(entry => {
        if (entry.id === id) {
          const newEntry = { ...entry, platform };
          // Re-validate URL with new platform
          const error = newEntry.url ? validateUrl(platform, newEntry.url) : undefined;
          return { ...newEntry, error };
        }
        return entry;
      });
      onDataChange?.(updated);
      return updated;
    });
  }, [onDataChange, validateUrl]);

  const socialMediaOptions = useMemo(() => {
    return Object.entries(SOCIAL_MEDIA).map(([key, platform]) => (
      <SelectItem key={key} value={platform.name}>
        {platform.name}
      </SelectItem>
    ));
  }, []);

  // Initialize or update entries from initialEntries (but only when data actually changes)
  useEffect(() => {
    const currentStr = JSON.stringify(initialEntries);
    
    // If this is the first time OR the data actually changed
    if (currentStr !== prevInitialEntriesRef.current) {
      // Normalize platform names to capitalized format
      const normalized = initialEntries.map(entry => ({
        ...entry,
        platform: capitalizePlatform(entry.platform)
      }));
      
      setEntries(normalized);
      prevInitialEntriesRef.current = currentStr;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialEntries]);

  return (
    <div>
      <h3 className="text-mj-gold font-semibold mb-4">Social Media Links</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {entries.map((entry, index) => (
          <div key={entry.id} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex flex-col gap-2">
              <Label htmlFor={`platform-${entry.id}`} className="text-mj-white/80 pl-2">
                Platform
              </Label>
              <Select value={entry.platform} onValueChange={(value) => handlePlatformChange(entry.id, value)}>
                <SelectTrigger className="bg-mj-dark border-mj-gold/30 text-mj-white focus:border-mj-gold focus:ring-mj-gold/20 w-full">
                  <SelectValue placeholder="Select platform" />
                </SelectTrigger>
                <SelectContent className="bg-mj-dark border-mj-gold/30">
                  {socialMediaOptions}
                </SelectContent>
              </Select>
            </div>
            
            <div className="flex flex-col gap-2">
              <Label htmlFor={`url-${entry.id}`} className="text-mj-white/80 pl-2">
                Link
              </Label>
              <div className="flex flex-col gap-1">
                <div className="flex gap-2">
                  <Input
                    id={`url-${entry.id}`}
                    type="text"
                    placeholder={getPlaceholder(entry.platform)}
                    value={entry.url}
                    onChange={(e) => handleUrlChange(entry.id, e.target.value)}
                    className={`bg-mj-dark border-mj-gold/30 text-mj-white focus:border-mj-gold focus:ring-mj-gold/20 ${
                      entry.error ? 'border-red-500' : ''
                    }`}
                  />
                  <Button
                    onClick={() => handleRemoveEntry(entry.id)}
                    variant="outline"
                    size="icon"
                    type="button"
                    className="border-mj-gold text-mj-gold hover:bg-mj-gold shrink-0"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
                {entry.error && (
                  <p className="text-xs text-red-500 pl-2">{entry.error}</p>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="flex flex-row gap-2">
      <Button
        onClick={handleAddEntry}
        type="button"
        variant="outline"
        className="mt-4 border-mj-gold text-mj-gold hover:bg-mj-gold "
      >
        <Plus className="h-4 w-4 mr-2" />
        Add Social Media Link
      </Button>
      </div>
    </div>
  )
}

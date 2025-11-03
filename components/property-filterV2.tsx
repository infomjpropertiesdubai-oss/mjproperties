"use client"
import { Filter, X, ChevronDown, Search } from "lucide-react";
import { Button } from "./ui/button";
import { useState, memo, useCallback, useEffect, useMemo } from "react";
import Slider from '@mui/material/Slider';
import Box from '@mui/material/Box';
import CustomDropdown from "./ui/customDropdown";
import { COMMON_AMENITIES, COMMON_FEATURES, PROPERTY_TYPES } from "@/lib/properties";
import { Checkbox } from "./ui/checkbox";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "./ui/sheet";
import { useIsMobile } from "@/hooks/use-mobile";
import { Input } from "./ui/input";
import { usePriceRange } from "@/hooks/use-price-range";
import { useFilters } from "@/lib/filter-context";
import { Skeleton } from "./ui/skeleton";
import { formatLargeNumber } from "@/lib/utils";

// Static location data
const locations = [
  "Downtown Dubai",
  "Dubai Marina", 
  "Business Bay",
  "JBR",
  "Palm Jumeirah",
  "Jumeirah Village Circle",
  "Dubai Hills Estate",
  "City Walk",
  "DIFC",
  "Bluewaters Island",
];

// Bedroom and bathroom options
const bedroomOptions = ["Studio", "1", "2", "3", "4", "5+"];
const bathroomOptions = ["1", "2", "3", "4", "5+"];

// ✅ Memoized reusable filter section
const CheckboxSection = memo(function CheckboxSection({
  title,
  items,
  selectedItems,
  onItemChange,
}: {
  title: string;
  items: string[];
  selectedItems: string[];
  onItemChange: (item: string) => void;
}) {
  const [isOpen, setIsOpen] = useState(false)

  const selectedCount = selectedItems.length

  return (
    <div className="flex flex-col gap-2">
      <button
        type="button"
        className="flex items-center justify-between w-full px-2 py-1 rounded hover:bg-mj-teal/40"
        onClick={() => setIsOpen((v) => !v)}
        aria-expanded={isOpen}
        aria-controls={`section-${title}`}
      >
        <span className="text-mj-gold text-sm font-semibold">{title}{selectedCount ? ` (${selectedCount})` : ""}</span>
        <ChevronDown className={`h-4 w-4 text-mj-gold transition-transform ${isOpen ? "rotate-180" : "rotate-0"}`} />
      </button>
      {isOpen ? (
        <div id={`section-${title}`} className="pl-2">
          {items.map((item) => (
            <div key={item} className="flex flex-row items-center gap-2">
              <Checkbox 
                id={item} 
                checked={selectedItems.includes(item)}
                onCheckedChange={() => onItemChange(item)}
              />
              <label htmlFor={item} className="text-sm font-normal cursor-pointer">
                {item}
              </label>
            </div>
          ))}
        </div>
      ) : null}
    </div>
  );
});

// ✅ Memoized Price Slider Component
const PriceSlider = memo(function PriceSlider({
  value,
  onChange,
  min,
  max,
  sx,
  width = 250,
}: {
  value: [number, number];
  onChange: (event: Event, newValue: number | number[]) => void;
  min: number;
  max: number;
  sx: any;
  width?: number | string;
}) {
  const valuetext = useCallback((value: number) => formatLargeNumber(value), []);

  // Calculate appropriate step size based on the range
  const stepSize = useMemo(() => {
    const range = max - min;
    if (range <= 1000000) return 10000; // 10K steps for ranges up to 1M
    if (range <= 5000000) return 50000; // 50K steps for ranges up to 5M
    if (range <= 20000000) return 100000; // 100K steps for ranges up to 20M
    if (range <= 100000000) return 500000; // 500K steps for ranges up to 100M
    return 1000000; // 1M steps for larger ranges
  }, [min, max]);

  return (
    <Box sx={{ width }}>
      <Slider
        aria-label="Price range"
        value={value}
        onChange={onChange}
        valueLabelDisplay="auto"
        getAriaValueText={valuetext}
        valueLabelFormat={valuetext}
        min={min}
        max={max}
        sx={sx}
        disableSwap
        step={stepSize}
      />
    </Box>
  );
});

// ✅ Loading Skeleton Component
const FilterLoadingSkeleton = memo(function FilterLoadingSkeleton({ isMobile = false }: { isMobile?: boolean }) {
  if (isMobile) {
    return (
      <div className="w-full">
        <div className="flex justify-start mb-3">
          <Skeleton className="h-10 w-24" />
        </div>
      </div>
    );
  }

  return (
    <div className="w-full bg-mj-teal-light border-mj-gold/20 border-1 rounded-lg py-6 px-4 flex flex-col gap-2">
      {/* Header Skeleton */}
      <div className="flex flex-row justify-between items-center mb-6">
        <div className="flex flex-row items-center gap-2">
          <Skeleton className="h-4 w-4" />
          <Skeleton className="h-6 w-16" />
        </div>
        <div className="flex flex-row items-center gap-2 px-2 py-1">
          <Skeleton className="h-4 w-4" />
          <Skeleton className="h-4 w-20" />
        </div>
      </div>

      {/* Search Bar Skeleton */}
      <div className="flex flex-col gap-2 px-4 mb-4">
        <div className="flex flex-row items-center gap-2">
          <Skeleton className="h-4 w-4" />
          <Skeleton className="h-4 w-32" />
        </div>
        <Skeleton className="h-10 w-full" />
      </div>

      {/* Price Range Skeleton */}
      <div className="flex flex-col gap-2 px-4">
        <Skeleton className="h-4 w-32" />
        <Skeleton className="h-6 w-full" />
        <div className="flex flex-row justify-between">
          <Skeleton className="h-4 w-8" />
          <Skeleton className="h-4 w-8" />
        </div>
      </div>

      {/* Checkbox Sections Skeleton */}
      <div className="flex flex-col gap-2 max-h-[500px] overflow-y-auto px-4">
        {Array.from({ length: 2 }).map((_, i) => (
          <div key={i} className="flex flex-col gap-2">
            <div className="flex items-center justify-between w-full px-2 py-1">
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-4 w-4" />
            </div>
            <div className="pl-2 space-y-2">
              {Array.from({ length: 3 }).map((_, j) => (
                <div key={j} className="flex flex-row items-center gap-2">
                  <Skeleton className="h-4 w-4" />
                  <Skeleton className="h-4 w-16" />
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Button Skeleton */}
      <Skeleton className="h-10 w-full mt-auto" />
    </div>
  );
});

interface PropertyFilterV2Props {
  searchParams?: { [key: string]: string | string[] | undefined }
}

export function PropertyFilterV2({ searchParams }: PropertyFilterV2Props) {
  const { priceRange: priceRangeData, loading: priceLoading } = usePriceRange();
  const { filters, updateFilters } = useFilters();
  
  // Local state for filters (not applied until "Apply Filters" is clicked)
  const [localPriceRange, setLocalPriceRange] = useState<[number, number]>([0, 2000]);
  const [localSearchQuery, setLocalSearchQuery] = useState<string>("");
  const [localBedrooms, setLocalBedrooms] = useState<string[]>([]);
  const [localBathrooms, setLocalBathrooms] = useState<string[]>([]);
  const [localLocations, setLocalLocations] = useState<string[]>([]);
  const [localPropertyTypes, setLocalPropertyTypes] = useState<string[]>([]);
  const [localFeatures, setLocalFeatures] = useState<string[]>([]);
  const [localAmenities, setLocalAmenities] = useState<string[]>([]);
  
  const isMobile = useIsMobile()
  const [open, setOpen] = useState(false)
  const [isSmallScreen, setIsSmallScreen] = useState(false)
  const [isInitialized, setIsInitialized] = useState(false)

  // Memoized values to prevent unnecessary re-renders
  const memoizedPriceRange = useMemo((): [number, number] => {
    return priceRangeData ? [priceRangeData.roundedMinPrice, priceRangeData.roundedMaxPrice] : [0, 2000];
  }, [priceRangeData]);

  // Calculate dynamic slider bounds that accommodate both the API range and filter values
  const sliderBounds = useMemo(() => {
    const apiMin = priceRangeData?.roundedMinPrice || 0;
    const apiMax = priceRangeData?.roundedMaxPrice || 2000;

    // Expand bounds if filter values are outside the API range
    const min = Math.min(apiMin, filters.priceRange[0]);
    const max = Math.max(apiMax, filters.priceRange[1]);

    return { min, max };
  }, [priceRangeData?.roundedMinPrice, priceRangeData?.roundedMaxPrice, filters.priceRange]);

  const memoizedSliderProps = useMemo(() => ({
    min: sliderBounds.min,
    max: sliderBounds.max,
    sx: {
      color: 'var(--color-mj-gold)',
      '& .MuiSlider-thumb': {
        color: 'var(--color-mj-gold)',
        width: 20,
        height: 20,
        '&:hover': {
          boxShadow: '0px 0px 0px 8px rgba(212, 175, 55, 0.16)',
        },
        '&.Mui-focusVisible': {
          boxShadow: '0px 0px 0px 8px rgba(212, 175, 55, 0.16)',
        },
      },
      '& .MuiSlider-track': {
        color: 'var(--color-mj-gold)',
        height: 6,
      },
      '& .MuiSlider-rail': {
        color: 'rgba(212, 175, 55, 0.3)',
        height: 6,
      },
      '& .MuiSlider-valueLabel': {
        backgroundColor: 'var(--color-mj-gold)',
        color: 'var(--color-mj-teal)',
      },
    }
  }), [sliderBounds]);

  const memoizedSearchQuery = useMemo(() => {
    return searchParams?.search ? (Array.isArray(searchParams.search) ? searchParams.search[0] : searchParams.search) : "";
  }, [searchParams?.search]);

  const memoizedFilterData = useMemo(() => ({
    search: localSearchQuery,
    priceRange: localPriceRange,
    bedrooms: localBedrooms,
    bathrooms: localBathrooms,
    locations: localLocations,
    propertyTypes: localPropertyTypes,
    features: localFeatures,
    amenities: localAmenities
  }), [localSearchQuery, localPriceRange, localBedrooms, localBathrooms, localLocations, localPropertyTypes, localFeatures, localAmenities]);

  // Calculate loading state - show loading until price data is loaded and component is initialized
  const isLoading = priceLoading || !isInitialized;


  // Initialize local state from filter context (which gets initialized from URL parameters)
  useEffect(() => {
    // Only update price range if it's different to prevent flickering
    setLocalPriceRange(prev => {
      const newRange = filters.priceRange;
      if (prev[0] !== newRange[0] || prev[1] !== newRange[1]) {
        return newRange;
      }
      return prev;
    });
    setLocalBedrooms(filters.bedrooms);
    setLocalBathrooms(filters.bathrooms);
    setLocalLocations(filters.selectedLocations);
    setLocalPropertyTypes(filters.selectedTypes);
    setLocalFeatures(filters.selectedFeatures);
    setLocalAmenities(filters.selectedAmenities);
    
    // Mark as initialized after setting all the filter data
    // Only initialize if we have price range data or if it's not loading
    if (!priceLoading) {
      setIsInitialized(true);
    }
  }, [filters, priceLoading]);

  // Initialize search query from URL parameters using memoized value
  useEffect(() => {
    if (memoizedSearchQuery) {
      setLocalSearchQuery(memoizedSearchQuery);
    }
  }, [memoizedSearchQuery]);

  useEffect(() => {
    const mq = window.matchMedia('(max-width: 1024px)')
    const onChange = () => setIsSmallScreen(mq.matches)
    onChange()
    mq.addEventListener('change', onChange)
    return () => mq.removeEventListener('change', onChange)
  }, [])

  const handlePriceChange = useCallback(
    (event: Event, newValue: number | number[]) => {
      const newRange = newValue as [number, number];
      // Only update if the values are actually different to prevent flickering
      setLocalPriceRange(prev => {
        if (prev[0] !== newRange[0] || prev[1] !== newRange[1]) {
          return newRange;
        }
        return prev;
      });
    },
    []
  );


  const handleCheckboxChange = useCallback((setter: React.Dispatch<React.SetStateAction<string[]>>) => (item: string) => {
    setter(prev => prev.includes(item) ? prev.filter(i => i !== item) : [...prev, item]);
  }, []);

  // Memoized checkbox handlers to prevent unnecessary re-renders
  const handleBedroomChange = useMemo(() => handleCheckboxChange(setLocalBedrooms), [handleCheckboxChange]);
  const handleBathroomChange = useMemo(() => handleCheckboxChange(setLocalBathrooms), [handleCheckboxChange]);
  const handleLocationChange = useMemo(() => handleCheckboxChange(setLocalLocations), [handleCheckboxChange]);
  const handlePropertyTypeChange = useMemo(() => handleCheckboxChange(setLocalPropertyTypes), [handleCheckboxChange]);
  const handleFeatureChange = useMemo(() => handleCheckboxChange(setLocalFeatures), [handleCheckboxChange]);
  const handleAmenityChange = useMemo(() => handleCheckboxChange(setLocalAmenities), [handleCheckboxChange]);

  const handleClearFilters = useCallback(() => {
    // Clear local state using memoized price range
    setLocalPriceRange(memoizedPriceRange);
    setLocalSearchQuery("");
    setLocalBedrooms([]);
    setLocalBathrooms([]);
    setLocalLocations([]);
    setLocalPropertyTypes([]);
    setLocalFeatures([]);
    setLocalAmenities([]);
    
    // Navigate to properties page without any parameters
    window.location.href = '/properties';
  }, [memoizedPriceRange]);

  const handleApplyFilters = useCallback(() => {
    // Apply local state to filter context
    updateFilters({
      priceRange: localPriceRange,
      bedrooms: localBedrooms,
      bathrooms: localBathrooms,
      selectedLocations: localLocations,
      selectedTypes: localPropertyTypes,
      selectedFeatures: localFeatures,
      selectedAmenities: localAmenities
    });
    
    
    // Build URL parameters
    const params = new URLSearchParams();
    
    if (localSearchQuery.trim()) {
      params.set('search', localSearchQuery.trim());
    }
    
    // Add price range parameters - use the API data if available, otherwise use slider bounds
    const defaultMin = priceRangeData?.roundedMinPrice || sliderBounds.min;
    const defaultMax = priceRangeData?.roundedMaxPrice || sliderBounds.max;

    // Only add price params if they differ from the defaults
    if (localPriceRange[0] !== defaultMin || localPriceRange[1] !== defaultMax) {
      params.set('min_price', localPriceRange[0].toString());
      params.set('max_price', localPriceRange[1].toString());
    }
    
    if (localLocations.length > 0) {
      params.set('location', localLocations.join(','));
    }
    
    if (localPropertyTypes.length > 0) {
      params.set('property_type', localPropertyTypes.join(','));
    }
    
    if (localBedrooms.length > 0) {
      params.set('bedrooms', localBedrooms.join(','));
    }
    
    if (localBathrooms.length > 0) {
      params.set('bathrooms', localBathrooms.join(','));
    }
    
    if (localFeatures.length > 0) {
      params.set('features', localFeatures.join(','));
    }
    
    if (localAmenities.length > 0) {
      params.set('amenities', localAmenities.join(','));
    }
    
    // Navigate to properties page with filters
    const queryString = params.toString();
    const url = queryString ? `/properties?${queryString}` : '/properties';
    window.location.href = url;
  }, [localPriceRange, localBedrooms, localBathrooms, localLocations, localPropertyTypes, localFeatures, localAmenities, localSearchQuery, memoizedFilterData, priceRangeData, sliderBounds, updateFilters]);

  const FiltersBody = (
    <div className="w-full bg-mj-teal-light border-mj-gold/20 border-1 rounded-lg py-6 px-4 flex flex-col gap-2">
      {/* Header */}
      <div className="flex flex-row justify-between items-center mb-6">
        <div className="flex flex-row items-center gap-2">
          <Filter className="h-4 w-4 text-mj-gold" />
          <h1 className="text-mj-gold text-lg font-bold">Filters</h1>
        </div>
        <div
          className="flex flex-row items-center gap-2 cursor-pointer px-2 py-1 rounded-md hover:bg-mj-teal"
          onClick={handleClearFilters}
        >
          <X className="h-4 w-4 text-muted-foreground" />
          <p className="text-muted-foreground text-sm font-semibold">
            Clear Filters
          </p>
        </div>
      </div>

      {/* Search Bar */}
      <div className="flex flex-col gap-2 px-4 mb-4">
        <div className="flex flex-row items-center gap-2">
          <Search className="h-4 w-4 text-mj-gold" />
          <h2 className="text-mj-gold text-sm font-semibold">Search Properties</h2>
        </div>
        <Input
          placeholder="Search by title, location, or description..."
          value={localSearchQuery}
          onChange={(e) => setLocalSearchQuery(e.target.value)}
          className="border-mj-gold/20 focus:border-mj-gold"
        />
      </div>

      {/* Price Range */}
      <div className="flex flex-col gap-2 px-4">
        <h2 className="text-mj-gold text-sm font-semibold">Price Range (AED)</h2>
        <PriceSlider
          value={localPriceRange}
          onChange={handlePriceChange}
          min={memoizedSliderProps.min}
          max={memoizedSliderProps.max}
          sx={memoizedSliderProps.sx}
          width={250}
        />
        <div className="flex flex-row justify-between">
          <div className="text-sm text-muted-foreground">{formatLargeNumber(localPriceRange[0])}</div>
          <div className="text-sm text-muted-foreground">{formatLargeNumber(localPriceRange[1])}</div>
        </div>
      </div>


      {/* Scrollable Checkbox Sections */}
      <div className="flex flex-col gap-2 max-h:[500px] overflow-y-auto px-4">
        <CheckboxSection 
          title="Bedrooms" 
          items={bedroomOptions} 
          selectedItems={localBedrooms}
          onItemChange={handleBedroomChange}
        />
        <CheckboxSection 
          title="Bathrooms" 
          items={bathroomOptions} 
          selectedItems={localBathrooms}
          onItemChange={handleBathroomChange}
        />
        <CheckboxSection 
          title="Location" 
          items={locations} 
          selectedItems={localLocations}
          onItemChange={handleLocationChange}
        />
        <CheckboxSection 
          title="Property Type" 
          items={PROPERTY_TYPES as unknown as string[]}
          selectedItems={localPropertyTypes}
          onItemChange={handlePropertyTypeChange}
        />
        <CheckboxSection 
          title="Features" 
          items={COMMON_FEATURES as unknown as string[]}
          selectedItems={localFeatures}
          onItemChange={handleFeatureChange}
        />
        <CheckboxSection 
          title="Amenities" 
          items={COMMON_AMENITIES as unknown as string[]}
          selectedItems={localAmenities}
          onItemChange={handleAmenityChange}
        />
      </div>
      <Button 
        className="w-full bg-mj-gold text-mj-teal hover:bg-mj-gold/90 mt-auto"
        onClick={handleApplyFilters}
      >
        Apply Filters
      </Button>
    </div>
  )

  const MobileFiltersBody = (
    <div className="w-full flex flex-col gap-3">
      {/* Header - Compact */}
      <div className="flex flex-row justify-start items-center mb-3 border-b border-mj-gold/20 pb-2">
        <div className="flex flex-row items-center justify-center gap-2">
          <Filter className="h-4 w-4 text-mj-gold" />
          <h1 className="text-mj-gold text-lg font-bold">Filters</h1>
        </div>
      </div>

      {/* Search Bar - Mobile */}
      <div className="flex flex-col gap-2">
        <div className="flex flex-row items-center gap-2">
          <Search className="h-4 w-4 text-mj-gold" />
          <h2 className="text-mj-gold text-xs font-semibold">Search Properties</h2>
        </div>
        <Input
          placeholder="Search by title, location, or description..."
          value={localSearchQuery}
          onChange={(e) => setLocalSearchQuery(e.target.value)}
          className="border-mj-gold/20 focus:border-mj-gold text-sm"
        />
      </div>
      {/* Price Range - Compact */}
      <div className="flex flex-col gap-1">
        <h2 className="text-mj-gold text-xs font-semibold">Price Range (AED)</h2>
        <PriceSlider
          value={localPriceRange}
          onChange={handlePriceChange}
          min={memoizedSliderProps.min}
          max={memoizedSliderProps.max}
          sx={memoizedSliderProps.sx}
          width="100%"
        />
        <div className="flex flex-row justify-between">
          <div className="text-xs text-muted-foreground">{formatLargeNumber(localPriceRange[0])}</div>
          <div className="text-xs text-muted-foreground">{formatLargeNumber(localPriceRange[1])}</div>
        </div>
      </div>


      {/* Scrollable Checkbox Sections - Compact */}
      <div className="flex flex-col gap-3 max-h-[55vh] overflow-y-auto">
        <CheckboxSection 
          title="Bedrooms" 
          items={bedroomOptions} 
          selectedItems={localBedrooms}
          onItemChange={handleBedroomChange}
        />
        <CheckboxSection 
          title="Bathrooms" 
          items={bathroomOptions} 
          selectedItems={localBathrooms}
          onItemChange={handleBathroomChange}
        />
        <CheckboxSection 
          title="Location" 
          items={locations} 
          selectedItems={localLocations}
          onItemChange={handleLocationChange}
        />
        <CheckboxSection 
          title="Property Type" 
          items={PROPERTY_TYPES as unknown as string[]}
          selectedItems={localPropertyTypes}
          onItemChange={handlePropertyTypeChange}
        />
        <CheckboxSection 
          title="Features" 
          items={COMMON_FEATURES as unknown as string[]}
          selectedItems={localFeatures}
          onItemChange={handleFeatureChange}
        />
        <CheckboxSection 
          title="Amenities" 
          items={COMMON_AMENITIES as unknown as string[]}
          selectedItems={localAmenities}
          onItemChange={handleAmenityChange}
        />
      </div>
      <div className="flex flex-row justify-between">
        <Button 
          className=" bg-mj-gold text-mj-teal hover:bg-mj-gold/90 mt-2"
          onClick={() => {
            handleApplyFilters()
            setOpen(false)
          }}
        >
          Apply Filters
        </Button>
        <Button 
          variant="outline"
          className=" text-mj-gold mt-2"
          onClick={handleClearFilters}
        >
          Clear Filters
        </Button>
      </div>
    </div>
  )

  // Show loading skeleton while data is loading
  if (isLoading) {
    return <FilterLoadingSkeleton isMobile={isSmallScreen} />;
  }

  if (isSmallScreen) {
    return (
      <div className="w-full">
        <Sheet open={open} onOpenChange={setOpen}>
          <div className="flex justify-start mb-3">
            <SheetTrigger asChild>
              <Button variant="outline" className="bg-mj-gold/10 border-mj-gold/30 text-mj-gold hover:bg-mj-gold/20">
                <Filter className="h-4 w-4 mr-2" />
                Filters
              </Button>
            </SheetTrigger>
          </div>
          <SheetContent side="right" className="bg-mj-teal-light px-4">
            <SheetHeader>
              {/* <SheetTitle className="text-mj-gold px-0">Filters</SheetTitle> */}
            </SheetHeader>
            {MobileFiltersBody}
          </SheetContent>
        </Sheet>
      </div>
    )
  }

  return FiltersBody
}

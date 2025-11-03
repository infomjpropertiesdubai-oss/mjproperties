import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatLargeNumber(num: number): string {
  if (num >= 1000000000) {
    // Format billions
    const billions = num / 1000000000
    return billions % 1 === 0 ? `${billions.toFixed(0)}B` : `${billions.toFixed(1)}B`
  } else if (num >= 1000000) {
    // Format millions
    const millions = num / 1000000
    return millions % 1 === 0 ? `${millions.toFixed(0)}M` : `${millions.toFixed(1)}M`
  } else if (num >= 1000) {
    // Format thousands
    const thousands = num / 1000
    return thousands % 1 === 0 ? `${thousands.toFixed(0)}K` : `${thousands.toFixed(1)}K`
  }
  return num.toLocaleString()
}

export function formatPrice(price: number): string {
  return `AED ${formatLargeNumber(price)}`
}
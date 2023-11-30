import { type ClassValue, clsx } from "clsx";
import { useCallback, useEffect, useState } from "react";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getLatLongDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number,
): number {
  const R = 6371; // Radius of the earth in km
  const dLat = deg2rad(lat2 - lat1); // deg2rad below
  const dLon = deg2rad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(deg2rad(lat1)) *
      Math.cos(deg2rad(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distanceKm = R * c; // Distance in km
  const distanceMiles = distanceKm * 0.621371; // Convert km to miles
  return distanceMiles;
}

// Converts degrees to radians
function deg2rad(deg: number): number {
  return deg * (Math.PI / 180);
}

export function toTitleCase(input: string): string {
  return input
    .toLowerCase()
    .replace(/(^|\s)\S/g, (letter) => letter.toUpperCase());
}

export function cleanString(input: string): string {
  return input.replace(/[.,]/g, "");
}

// useMediaQuery is from here:
//https://github.com/vercel/next.js/discussions/14810#discussioncomment-61177
// export const useMediaQuery = (width: number) => {
export const useMediaQuery = (width: number) => {
  const [targetReached, setTargetReached] = useState(false);

  const updateTarget = useCallback((e: MediaQueryListEvent) => {
    setTargetReached(e.matches);
  }, []);

  useEffect(() => {
    const media = window.matchMedia(`(max-width: ${width}px)`);
    media.addEventListener("change", updateTarget);

    // Check on mount (callback is not called until a change occurs)
    if (media.matches) {
      setTargetReached(true);
    }

    return () => {
      media.removeEventListener("change", updateTarget);
    };
  }, [width, updateTarget]);

  return targetReached;
};

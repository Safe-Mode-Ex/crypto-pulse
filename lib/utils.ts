import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatPrice(
  price: number,
  options?: { currency?: string; maxDecimals?: number },
) {
  const { currency = "USD", maxDecimals } = options ?? {};
  const minDecimals = price >= 100 ? 2 : price >= 1 ? 4 : 6;
  const decimals = maxDecimals ?? minDecimals;

  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(price);
}

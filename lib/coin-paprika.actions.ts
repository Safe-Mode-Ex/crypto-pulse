"use server";

import qs from "query-string";

const BASE_PAPRIKA_URL = process.env.COIN_PAPRIKA_BASE_URL;
const BASE_KUCOIN_URL = process.env.KUCOIN_BASE_URL;

if (!BASE_PAPRIKA_URL || !BASE_KUCOIN_URL) {
  throw new Error("Could not get base url");
}

export async function fetcher<T>(
  endpoint: string,
  params?: QueryParams,
  raw = false,
  revalidate = 60,
): Promise<T> {
  const url = qs.stringifyUrl(
    {
      url: `${raw ? BASE_KUCOIN_URL : BASE_PAPRIKA_URL}/${endpoint}`,
      query: params,
    },
    {
      skipEmptyString: true,
      skipNull: true,
    },
  );

  const response = await fetch(url, {
    headers: {
      "Content-Type": "application/json",
    } as Record<string, string>,
    next: { revalidate },
  });

  if (!response.ok) {
    const errorBody: CoinGeckoErrorBody = await response.json().catch(() => ({}));

    throw new Error(`API Error: ${response.status}: ${errorBody.error || response.statusText}`);
  }

  return response.json();
}

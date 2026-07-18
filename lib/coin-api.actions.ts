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
    const errorBody: ErrorBody = await response.json().catch(() => ({}));

    throw new Error(`API Error: ${response.status}: ${errorBody.error || response.statusText}`);
  }

  return response.json();
}

export async function getPools(id: string): Promise<PoolData> {
  const fallback: PoolData = {
    id: "",
    address: "",
    name: "",
    network: "",
  };

  if (!id) return fallback;

  try {
    const markets = await fetcher<CoinMarket[]>(`coins/${id}/markets`);

    const dexPools = markets.filter(
      (market: CoinMarket) =>
        market.category?.toUpperCase() === "DEX" || market.category?.toUpperCase() === "DEFI",
    );

    if (dexPools.length > 0) {
      const topPool = dexPools[0];

      return {
        id: topPool.exchange_id || "",
        address: topPool.market_url || "",
        name: `${topPool.exchange_name} (${topPool.pair})`,
        network: id.split("-")[0].toUpperCase(),
        price: topPool.quotes?.USD?.price || 0,
        volume24h: topPool.quotes?.USD?.volume_24h || 0,
      };
    }

    if (markets.length > 0) {
      const topMarket = markets[0];
      return {
        id: topMarket.exchange_id || "",
        address: topMarket.market_url || "",
        name: `${topMarket.exchange_name} (${topMarket.pair})`,
        network: "CEX",
        price: topMarket.quotes?.USD?.price || 0,
        volume24h: topMarket.quotes?.USD?.volume_24h || 0,
      };
    }

    return fallback;
  } catch (error) {
    console.error("Ошибка метода getPools:", error);
    return fallback;
  }
}

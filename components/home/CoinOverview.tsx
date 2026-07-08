import Image from "next/image";
import { fetcher } from "@/lib/coin-paprika.actions";
import { formatPrice } from "@/lib/utils";
import { CoinOverviewFallback } from "./fallback";

const CoinOverview = async () => {
  let coin: CoinDetailsData | null = null;
  let ticker: TickerDetailsData | null = null;

  try {
    const results = await Promise.all([
      fetcher<CoinDetailsData>("/coins/btc-bitcoin"),
      fetcher<TickerDetailsData>("/tickers/btc-bitcoin"),
    ]);
    coin = results[0];
    ticker = results[1];
  } catch (error) {
    console.error("CoinOverview fetch failed:", error);
    return <CoinOverviewFallback />;
  }

  if (!coin || !ticker) {
    return (
      <div id="coin-overview">
        <div className="header pt-2">
          <div className="info">
            <p>Bitcoin / BTC</p>
            <h1>--</h1>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div id="coin-overview">
      <div className="header pt-2">
        <Image src={coin.logo} width="56" height="56" alt={coin.name} />

        <div className="info">
          <p>
            {coin.name} / {coin.symbol}
          </p>
          <h1>{formatPrice(ticker.quotes.USD.price)}</h1>
        </div>
      </div>
    </div>
  );
};

export default CoinOverview;

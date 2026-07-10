import Image from "next/image";
import { fetcher } from "@/lib/coin-paprika.actions";
import { formatCurrency } from "@/lib/utils";
import { CoinOverviewFallback } from "./fallback";
import CandlestickChart from "../CandlestickChart";

const CoinOverview = async () => {
  let coin: CoinDetailsData | null = null;
  let ticker: TickerDetailsData | null = null;
  let coinOHLCData: OHLCData[];

  try {
    const results = await Promise.all([
      fetcher<CoinDetailsData>("/coins/btc-bitcoin"),
      fetcher<TickerDetailsData>("/tickers/btc-bitcoin"),
    ]);

    coin = results[0];
    ticker = results[1];

    const coinOHLCRawData = await fetcher<OHLCResponse>(
      "/market/kline",
      {
        tradeType: "SPOT",
        symbol: "BTC-USDT",
        interval: "1hour",
      },
      true,
    );

    coinOHLCData = coinOHLCRawData.data.list
      .reverse()
      .map((times) => times.map((time) => parseFloat(time.toString())) as OHLCData);

    console.log(coinOHLCData);
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
      <CandlestickChart data={coinOHLCData} coinSymbol="BTC-USDT">
        <div className="header pt-2">
          <Image src={coin.logo} width="56" height="56" alt={coin.name} />

          <div className="info">
            <p>
              {coin.name} / {coin.symbol}
            </p>
            <h1>{formatCurrency(ticker.quotes.USD.price)}</h1>
          </div>
        </div>
      </CandlestickChart>
    </div>
  );
};

export default CoinOverview;

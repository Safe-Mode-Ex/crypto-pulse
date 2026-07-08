import Image from "next/image";
import { fetcher } from "@/lib/coin-paprika.actions";
import { formatPrice } from "@/lib/utils";

const CoinOverview = async () => {
  const [coin, ticker] = await Promise.all([
    fetcher<CoinDetailsData>("/coins/btc-bitcoin"),
    fetcher<TickerDetailsData>("/tickers/btc-bitcoin"),
  ]);

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

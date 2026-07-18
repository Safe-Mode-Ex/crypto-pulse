import { ArrowUpRight } from "lucide-react";
import Link from "next/link";
import { formatCurrency, getOHLCDataFromResponse } from "@/lib/utils";
import { fetcher, getPools } from "@/lib/coin-api.actions";
import { PERIOD_CONFIG } from "@/constants";
import LiveDataWrapper from "@/components/LiveDataWrapper";

const Page = async ({ params }: NextPageProps) => {
  const { id } = await params;

  const [coinData, tickerData] = await Promise.all([
    fetcher<CoinDetailsData>(`/coins/${id}`, {
      dex_pair_format: "contract_address",
    }),
    fetcher<TickerDetailsData>(`/tickers/${id}`),
  ]);

  const { interval, endAt, startAt } = PERIOD_CONFIG["1day"];

  const coinOHLCResponce = await fetcher<OHLCResponse>(
    "/market/kline",
    {
      tradeType: "SPOT",
      symbol: `${coinData.symbol}-USDT`,
      interval,
      endAt,
      startAt,
    },
    true,
  );

  const coinOHLCData = getOHLCDataFromResponse(coinOHLCResponce);

  const platform = coinData.platform
    ? {
        network: coinData.platform,
        contractAddress: coinData.contract,
      }
    : null;

  const network = coinData.platform || null;
  const contractAddress = coinData.contract || null;

  const pool = await getPools(id);

  const coinDetails = [
    {
      label: "Market Cap",
      value: formatCurrency(tickerData.quotes.USD.market_cap),
    },
    {
      label: "Market Cap Rank",
      value: `# ${tickerData.rank}`,
    },
    {
      label: "Total Volume",
      value: formatCurrency(tickerData.quotes.USD.volume_24h),
    },
    {
      label: "Website",
      value: "-",
      link: coinData.links.website?.[0],
      linkText: "Homepage",
    },
    {
      label: "Explorer",
      value: "-",
      link: coinData.links.explorer?.[0],
      linkText: "Explorer",
    },
    {
      label: "Community",
      value: "-",
      link: coinData.links_extended.find(({ type }) => type === "telegram")?.url,
      linkText: "Community",
    },
  ];

  return (
    <main id="coin-details-page">
      <section className="primary">
        <LiveDataWrapper
          coinId={`${coinData.symbol}-USDT`}
          poolId={pool.id}
          coin={coinData}
          coinOHLCData={coinOHLCData}
        >
          <h4>Exchange Listings</h4>
        </LiveDataWrapper>
      </section>

      <section className="secondary">
        <p>Converter</p>

        <div className="details">
          <h4>Coin Details</h4>

          <ul className="details-grid">
            {coinDetails.map(({ label, value, link, linkText }, index) => (
              <li key={index}>
                <p className={label}>{label}</p>

                {link ? (
                  <div className="link">
                    <Link href={link} target="_blank">
                      {linkText || label}
                    </Link>
                    <ArrowUpRight size="16"></ArrowUpRight>
                  </div>
                ) : (
                  <p className="text-base font-medium">{value}</p>
                )}
              </li>
            ))}
          </ul>
        </div>

        <p>Top Gainers and Loosers</p>
      </section>
    </main>
  );
};

export default Page;

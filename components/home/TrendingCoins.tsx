import Link from "next/link";
import Image from "next/image";
import { TrendingUp, TrendingDown } from "lucide-react";
import { cn, formatCurrency } from "@/lib/utils";
import { fetcher } from "@/lib/coin-paprika.actions";
import DataTable from "../DataTable";
import { TrendingCoinsFallback } from "./fallback";

const TrendingCoins = async () => {
  let trendingCoins: TickerDetailsData[] = [];

  try {
    trendingCoins = await fetcher<TickerDetailsData[]>("/tickers");
  } catch (error) {
    console.error("TrendingCoins fetch failed:", error);
    return <TrendingCoinsFallback />;
  }

  const sortedTrendingCoins = [...trendingCoins].sort(
    (a: TickerDetailsData, b: TickerDetailsData) => {
      const changeA = Math.abs(a.quotes?.USD?.percent_change_24h || 0);
      const changeB = Math.abs(b.quotes?.USD?.percent_change_24h || 0);
      return changeB - changeA;
    },
  );

  const columns: DataTableColumn<TickerDetailsData>[] = [
    {
      header: "Name",
      cellClassName: "name-cell",
      cell: (coin) => {
        return (
          <Link href={`/coins/${coin.id}`}>
            <Image
              src={`https://static.coinpaprika.com/coin/${coin.id}/logo.png`}
              alt={coin.name}
              width={36}
              height={36}
            />
            <p>{coin.name}</p>
          </Link>
        );
      },
    },
    {
      header: "24h Change",
      cellClassName: "change-cell",
      cell: (coin) => {
        const pct = coin.quotes.USD.percent_change_24h;
        const isTrendingUp = pct > 0;

        return (
          <div
            className={cn("price-change flex flex-col items-center", {
              "text-green-500": isTrendingUp,
              "text-red-500": !isTrendingUp,
            })}
          >
            {isTrendingUp ? (
              <TrendingUp width="16" height="16" />
            ) : (
              <TrendingDown width="16" height="16" />
            )}
            <span>{pct.toFixed(2)}%</span>
          </div>
        );
      },
    },
    {
      header: "Price",
      cellClassName: "price-cell",
      cell: ({ quotes }) => formatCurrency(quotes.USD.price),
    },
  ];

  return (
    <div id="trending-coins">
      <h4>Trending Coins</h4>
      <DataTable
        data={sortedTrendingCoins.slice(0, 6)}
        columns={columns}
        rowKey={(coin) => coin.symbol}
        tableClassName="trending-coins-table"
        headerCellClassName="py-3!"
        bodyCellClassName="py-2!"
      />
    </div>
  );
};

export default TrendingCoins;

import Link from "next/link";
import Image from "next/image";
import { fetcher } from "@/lib/coin-paprika.actions";
import { cn, formatCurrency, formatPercentage } from "@/lib/utils";
import DataTable from "@/components/DataTable";

const Page = async () => {
  const coinsData = await fetcher<CoinMarketData[]>("/tickers");

  const columns: DataTableColumn<CoinMarketData>[] = [
    {
      header: "Rank",
      cellClassName: "rank-cell",
      cell: (coin) => (
        <>
          #{coin.market_cap_rank}
          <Link href={`/coins/${coin.id}`} aria-label="View coin" />
        </>
      ),
    },
    {
      header: "Token",
      cellClassName: "token-cell",
      cell: (coin) => (
        <div className="token-info">
          <Image src={coin.image} alt={coin.name} width={36} height={36} />
          <p>
            {coin.name} ({coin.symbol.toUpperCase()})
          </p>
        </div>
      ),
    },
    {
      header: "Price",
      cellClassName: "price-cell",
      cell: (coin) => formatCurrency(coin.current_price),
    },
    {
      header: "24h Change",
      cellClassName: "change-cell",
      cell: (coin) => {
        const pct = coin.market_cap_change_24h;
        const isTrendingUp = pct > 0;

        return (
          <span
            className={cn("change-value", {
              "text-green-600": isTrendingUp,
              "text-red-500": !isTrendingUp,
            })}
          >
            <p className="flex items-center">
              {isTrendingUp && "+"}
              {formatPercentage(pct)}
            </p>
          </span>
        );
      },
    },
    {
      header: "Market Cap",
      cellClassName: "market-cap-cell",
      cell: (coin) => formatCurrency(coin.market_cap),
    },
  ];

  return (
    <main id="coins-page">
      <div className="content">
        <h4>All coins</h4>

        <DataTable
          tableClassName="coins-table"
          columns={columns}
          data={coinsData}
          rowKey={(coin) => coin.id}
        />
      </div>
    </main>
  );
};

export default Page;

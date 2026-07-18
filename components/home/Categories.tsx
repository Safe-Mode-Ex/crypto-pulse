import Image from "next/image";
import { TrendingUp, TrendingDown } from "lucide-react";
import { fetcher } from "@/lib/coin-api.actions";
import DataTable from "../DataTable";
import { cn, formatCurrency, formatPercentage } from "@/lib/utils";

const Categories = async () => {
  const [tickers, tags] = await Promise.all([
    fetcher<TickerDetailsData[]>("/tickers"),
    fetcher<TagDetailsData[]>("/tags", { additional_fields: "coins" }),
  ]);

  const tickersMap = new Map();

  tickers.forEach(({ id, quotes }) => {
    tickersMap.set(id, {
      volume: quotes.USD.volume_24h || 0,
      marketCap: quotes.USD.market_cap || 0,
      marketCapChange24h: quotes.USD.market_cap_change_24h || 0,
    });
  });

  const categories = tags
    .filter((tag) => tag.coins && tag.coins.length > 0)
    .map((tag) => {
      let totalVolume = 0;
      let totalMarketCap = 0;
      let totalMarketCapChange = 0;
      let activeCoinsCount = 0;
      const topCoinsLogos: string[] = [];

      tag.coins.forEach((coinId: string) => {
        const coinStats = tickersMap.get(coinId);
        if (coinStats) {
          totalVolume += coinStats.volume;
          totalMarketCap += coinStats.marketCap;
          totalMarketCapChange += coinStats.marketCapChange24h;
          ++activeCoinsCount;
        }

        if (topCoinsLogos.length < 3) {
          topCoinsLogos.push(`https://static.coinpaprika.com/coin/${coinId}/logo.png`);
        }
      });

      const avgMarketCapChange = activeCoinsCount > 0 ? totalMarketCapChange / activeCoinsCount : 0;

      return {
        id: tag.id,
        name: tag.name,
        volume24h: totalVolume,
        marketCap: totalMarketCap,
        topCoins: topCoinsLogos,
        marketCapChange24h: avgMarketCapChange,
      };
    })
    .sort((a, b) => b.volume24h - a.volume24h)
    .slice(0, 10);

  const columns: DataTableColumn<Category>[] = [
    {
      header: "Category",
      cellClassName: "category-cell",
      cell: ({ name }: Category) => name,
    },
    {
      header: "Top Gainers",
      cellClassName: "top-gainers-cell",
      cell: ({ topCoins }: Category) =>
        topCoins.map((coin) => <Image key={coin} src={coin} alt={coin} width="28" height="28" />),
    },
    {
      header: "24h Change",
      cellClassName: "change-header-cell",
      cell: (category: Category) => {
        const pct = category.marketCapChange24h;
        const isTrendingUp = pct > 0;
        const isTrendingDown = pct < 0;

        return (
          <div
            className={cn("change-cell000 flex flex-col items-center", {
              "text-green-500": isTrendingUp,
              "text-red-500": isTrendingDown,
            })}
          >
            <p className="flex items-center">
              {formatPercentage(pct)}
              {isTrendingUp ? (
                <TrendingUp width="16" height="16" />
              ) : (
                <TrendingDown width="16" height="16" />
              )}
            </p>
          </div>
        );
      },
    },
    {
      header: "Market Cap",
      cellClassName: "market-cap-cell",
      cell: ({ marketCap }: Category) => formatCurrency(marketCap),
    },
    {
      header: "24h Volume",
      cellClassName: "volume-cell",
      cell: ({ volume24h }: Category) => formatCurrency(volume24h),
    },
  ];

  return (
    <div id="categories" className="custom-scrollbar">
      <h4>Top Categories</h4>

      <DataTable
        columns={columns}
        data={categories}
        rowKey={(_, index) => index}
        tableClassName="mt-3"
      ></DataTable>
    </div>
  );
};

export default Categories;

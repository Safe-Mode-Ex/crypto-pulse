"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import CoinsPagination from "./CoinsPagination";
import DataTable from "./DataTable";
import { formatCurrency, cn, formatPercentage } from "@/lib/utils";

const CoinsTable = ({ coinsData, initialPage }: CoinsTableProps) => {
  const columns: DataTableColumn<CoinMarketData>[] = [
    {
      header: "Rank",
      cellClassName: "rank-cell",
      cell: (coin) => (
        <>
          #{coin.rank}
          <Link href={`/coins/${coin.id}`} aria-label="View coin" />
        </>
      ),
    },
    {
      header: "Token",
      cellClassName: "token-cell",
      cell: (coin) => (
        <div className="token-info">
          <Image
            src={`https://static.coinpaprika.com/coin/${coin.id}/logo.png`}
            alt={coin.name}
            width={36}
            height={36}
          />
          <p>
            {coin.name} ({coin.symbol.toUpperCase()})
          </p>
        </div>
      ),
    },
    {
      header: "Price",
      cellClassName: "price-cell",
      cell: (coin) => formatCurrency(coin.quotes.USD.price),
    },
    {
      header: "24h Change",
      cellClassName: "change-cell",
      cell: (coin) => {
        const pct = coin.quotes.USD.market_cap_change_24h;
        const isTrendingUp = pct > 0;
        const isTrendingDown = pct < 0;

        return (
          <span
            className={cn("change-value", {
              "text-green-600": isTrendingUp,
              "text-red-500": isTrendingDown,
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
      cell: (coin) => formatCurrency(coin.quotes.USD.market_cap),
    },
  ];

  const [currentPage, setCurrentPage] = useState(initialPage);
  const perPage = 10;
  const totalPages = Math.ceil(coinsData.length / perPage);
  const pageData = coinsData.slice((currentPage - 1) * perPage, perPage * currentPage);
  const hasMorePages = currentPage < totalPages;

  const handlePageChange = (page: number) => {
    // router.push(`/coins?page=${page}`);
    setCurrentPage(page);
  };

  useEffect(() => {
    window.history.pushState(null, "", `/coins?page=${currentPage}`);
  }, [currentPage]);

  return (
    <>
      <DataTable
        tableClassName="coins-table"
        columns={columns}
        data={pageData}
        rowKey={(coin: CoinMarketData) => coin.id}
      />

      <CoinsPagination
        currentPage={currentPage}
        totalPages={totalPages}
        hasMorePages={hasMorePages}
        handlePageChange={handlePageChange}
      />
    </>
  );
};

export default CoinsTable;

"use client";

import { Separator } from "@base-ui/react/separator";
import CandlestickChart from "./CandlestickChart";
import { useWebSocket } from "@/hooks/use-web-socket";
import DataTable from "./DataTable";
import { formatCurrency, timeAgo } from "@/lib/utils";

const LiveDataWrapper = ({ coinId, poolId, coin, coinOHLCData }: LiveDataProps) => {
  const { trades } = useWebSocket({ coinId, poolId });

  const tradeColumns: DataTableColumn<Trade>[] = [
    {
      header: "Price",
      cellClassName: "price-cell",
      cell: (trade) => (trade.price ? formatCurrency(trade.price) : "-"),
    },
    {
      header: "Amount",
      cellClassName: "amount-cell",
      cell: (trade) => trade.amount?.toFixed(4) ?? "-",
    },
    {
      header: "Value",
      cellClassName: "value-cell",
      cell: (trade) => (trade.value ? formatCurrency(trade.value) : "-"),
    },
    {
      header: "Buy/Sell",
      cellClassName: "type-cell",
      cell: (trade) => (
        <span className={trade.type === "b" ? "text-green-500" : "text-red-500"}>
          {trade.type === "b" ? "Buy" : "Sell"}
        </span>
      ),
    },
    {
      header: "Time",
      cellClassName: "time-cell",
      cell: (trade) => (trade.timestamp ? timeAgo(trade.timestamp) : "-"),
    },
  ];

  return (
    <section id="live-data-wrapper">
      <p>Coin Header</p>

      <Separator className="divider" />

      <div className="trend">
        <CandlestickChart coinSymbol={coin.symbol} data={coinOHLCData}>
          <h4>Trend Overview</h4>
        </CandlestickChart>
      </div>

      <Separator className="divider" />

      <div className="trades">
        <h4>Recent Trades</h4>

        {trades.length > 0 ? (
          <DataTable
            columns={tradeColumns}
            data={trades}
            rowKey={(trade) => trade.id ?? Math.random()}
            tableClassName="trades-table"
          />
        ) : (
          <p className="text-sm text-purple-100/50">Waiting for live trades…</p>
        )}
      </div>
    </section>
  );
};

export default LiveDataWrapper;

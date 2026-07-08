import DataTable from "../DataTable";

const SKELETON_ROWS = [1, 2, 3, 4, 5, 6] as const;

const CoinOverviewFallback = () => {
  return (
    <div id="coin-overview-fallback">
      <div className="header pt-2">
        <div className="header-image skeleton" />
        <div className="info">
          <div className="header-line-sm skeleton" />
          <div className="header-line-lg skeleton" />
        </div>
      </div>

      <div className="header">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="period-button-skeleton skeleton" />
        ))}
      </div>

      <div className="chart">
        <div className="chart-skeleton skeleton" />
      </div>
    </div>
  );
};

const columns: DataTableColumn<number>[] = [
  {
    header: "Name",
    cellClassName: "name-cell",
    cell: () => (
      <div className="name-link">
        <div className="name-image skeleton" />
        <div className="name-line skeleton" />
      </div>
    ),
  },
  {
    header: "24h Change",
    cellClassName: "change-cell",
    cell: () => (
      <div className="price-change">
        <div className="change-icon skeleton" />
        <div className="change-line skeleton" />
      </div>
    ),
  },
  {
    header: "Price",
    cellClassName: "price-cell",
    cell: () => <div className="price-line skeleton" />,
  },
];

const TrendingCoinsFallback = () => {
  return (
    <div id="trending-coins-fallback">
      <h4>Trending Coins</h4>
      <DataTable
        data={SKELETON_ROWS as unknown as number[]}
        columns={columns}
        rowKey={(i) => i}
        tableClassName="trending-coins-table"
        headerCellClassName="py-3!"
        bodyCellClassName="py-2!"
      />
    </div>
  );
};

export { CoinOverviewFallback, TrendingCoinsFallback };

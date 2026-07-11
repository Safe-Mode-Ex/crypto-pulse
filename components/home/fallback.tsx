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

const SKELETON_CATEGORY_ROWS = [1, 2, 3, 4, 5, 6] as const;

const categoriesColumns: DataTableColumn<number>[] = [
  {
    header: "Category",
    cellClassName: "category-cell",
    cell: () => <div className="category-skeleton skeleton" />,
  },
  {
    header: "Top Gainers",
    cellClassName: "top-gainers-cell",
    cell: () => (
      <div className="flex gap-1">
        {[1, 2, 3].map((i) => (
          <div key={i} className="coin-skeleton skeleton" />
        ))}
      </div>
    ),
  },
  {
    header: "24h Change",
    headClassName: "change-header-cell",
    cellClassName: "change-cell",
    cell: () => (
      <div className="flex gap-1 items-center">
        <div className="change-icon skeleton" />
        <div className="value-skeleton-sm skeleton" />
      </div>
    ),
  },
  {
    header: "Market Cap",
    cellClassName: "market-cap-cell",
    cell: () => <div className="value-skeleton-md skeleton" />,
  },
  {
    header: "24h Volume",
    cellClassName: "volume-cell",
    cell: () => <div className="value-skeleton-lg skeleton" />,
  },
];

const CategoriesFallback = () => {
  return (
    <div id="categories-fallback">
      <h4>Top Categories</h4>
      <DataTable
        data={SKELETON_CATEGORY_ROWS as unknown as number[]}
        columns={categoriesColumns}
        rowKey={(i) => i}
        tableClassName="mt-3"
      />
    </div>
  );
};

export { CoinOverviewFallback, TrendingCoinsFallback, CategoriesFallback };

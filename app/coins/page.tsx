import { fetcher } from "@/lib/coin-api.actions";
import CoinsTable from "@/components/CoinsTable";

const CoinsPage = async ({ searchParams }: NextPageProps) => {
  const { page } = await searchParams;
  const initialPage = Number(page) || 1;

  const coinsData = await fetcher<CoinMarketData[]>("/tickers");

  return (
    <main id="coins-page">
      <div className="content">
        <h4>All coins</h4>

        <CoinsTable initialPage={initialPage} coinsData={coinsData} />
      </div>
    </main>
  );
};

export default CoinsPage;

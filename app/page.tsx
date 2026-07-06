import Image from 'next/image';
import Link from 'next/link';
import { TrendingDown, TrendingUp } from 'lucide-react';
import { cn } from '@/lib/utils';
import DataTable from '@/components/DataTable';

const columns: DataTableColumn<TrendingCoin>[] = [{
  header: 'Name',
  cellClassName: 'name-cell',
  cell: (coin) => {
    const item = coin.item;

    return (
      <Link href={`/coins/${item.id}`}>
        <Image src={item.large} alt={item.name} width={36} height={36} />
        <p>{item.name}</p>
      </Link>
    );
  }
}, {
  header: '24h Change',
  cellClassName: 'change-cell',
  cell: (coin) => {
    const item = coin.item;
    const pct = item.data.price_change_percentage_24h.usd;
    const isTrendingUp = pct > 0;

    return (
      <div className={cn(
        'price-change flex flex-col items-center',
        {
          'text-green-500': isTrendingUp,
          'text-red-500': !isTrendingUp,
        }
      )}>
        {isTrendingUp ? (
          <TrendingUp width="16" height="16" />
        ) : (
          <TrendingDown width="16" height="16" />
        )}
        <span>{pct.toFixed(2)}%</span>
      </div>
    );
  }
  }, {
  header: 'Price',
  cellClassName: 'price-cell',
  cell: ({item}) => `$${item.data.price}`,
}];

const dummyTrendingCoins: TrendingCoin[] = [
  {
    item: {
      id: 'bitcoin',
      name: 'Bitcoin',
      symbol: 'BTC',
      market_cap_rank: 1,
      thumb: '/logo.svg',
      large: '/logo.svg',
      data: { price: 89133.00, price_change_percentage_24h: { usd: 2.34 } },
    },
  },
  {
    item: {
      id: 'ethereum',
      name: 'Ethereum',
      symbol: 'ETH',
      market_cap_rank: 2,
      thumb: '/logo.svg',
      large: '/logo.svg',
      data: { price: 3456.78, price_change_percentage_24h: { usd: -1.23 } },
    },
  },
  {
    item: {
      id: 'solana',
      name: 'Solana',
      symbol: 'SOL',
      market_cap_rank: 5,
      thumb: '/logo.svg',
      large: '/logo.svg',
      data: { price: 142.50, price_change_percentage_24h: { usd: 5.67 } },
    },
  },
  {
    item: {
      id: 'cardano',
      name: 'Cardano',
      symbol: 'ADA',
      market_cap_rank: 8,
      thumb: '/logo.svg',
      large: '/logo.svg',
      data: { price: 0.72, price_change_percentage_24h: { usd: -0.89 } },
    },
  },
  {
    item: {
      id: 'polkadot',
      name: 'Polkadot',
      symbol: 'DOT',
      market_cap_rank: 12,
      thumb: '/logo.svg',
      large: '/logo.svg',
      data: { price: 7.89, price_change_percentage_24h: { usd: 1.45 } },
    },
  },
];

const Page = () => {
  return (
    <main className="main-container">
      <section className="home-grid">
        <div id="coin-overview">
          <div className="header pt-2">
            <Image
              src="https://assets.coingecko.com/coins/images/1/large/bitcoin.png"
              width="56"
              height="56"
              alt="Bitcoin"
            />

            <div className="info">
              <p>Bitcoin / BTC</p>
              <h1>$89,133.00</h1>
            </div>
          </div>
        </div>

        <p>Trending Coins</p>
        <DataTable
          data={dummyTrendingCoins}
          columns={columns}
          rowKey={(coin) => coin.item.id}
          tableClassName="trending-coins-table"
        />
      </section>

      <section className="w-full mt-7 space-y-4">
        <p>Categories</p>
      </section>
    </main>
  );
};

export default Page;

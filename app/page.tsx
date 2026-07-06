import type { FC } from 'react'

interface ComponentNameProps {
  propName: unknown;
}

const Page: FC<ComponentNameProps> = () => {
  return (
    <main className="main-container">
      <section className="home-grid">
        <p>Coin Overview</p>

        <p>Trending Coins</p>
      </section>

      <section className="w-full mt-7 space-y-4">
        <p>Categories</p>
      </section>
    </main>
  );
};

export default Page;

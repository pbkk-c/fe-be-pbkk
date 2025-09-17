import NewsCard from "./components/NewsCard";

export default function HomePage() {
  return (
    <main className="max-w-7xl mx-auto px-4 py-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Hero Section */}
      <section className="lg:col-span-2 grid grid-cols-2 gap-4">
        <NewsCard
          variant="big"
          title="Lorem Ipsum Dolor Sit Amet"
          description="Shaking up political traditions..."
          image="/img/home/news-1.png"
          category="Politics"
          href="/news/sample-article"
        />
        <NewsCard
          variant="small"
          title="Lorem Ipsum Dolor Sit Amet"
          image="/img/home/news-1.png"
          category="Science"
        />
        <NewsCard
          variant="small"
          title="Lorem Ipsum Dolor Sit Amet"
          image="/img/home/news-1.png"
          category="World"
        />
      </section>

      {/* Trending Headlines */}
      <aside className="lg:col-span-1 space-y-4">
        <h2 className="font-bold text-xl">Trending Headlines</h2>
        <div className="space-y-3">
          <NewsCard
            variant="trending"
            title="Lorem Ipsum Dolor Sit Amet"
          image="/img/home/news-1.png"
          />
          <NewsCard
            variant="trending"
            title="Lorem Ipsum Dolor Sit Amet"
          image="/img/home/news-1.png"

          />
        </div>
      </aside>

      {/* Latest News */}
      <section className="lg:col-span-3">
        <h2 className="font-bold text-2xl mb-4">Latest News ----</h2>
        <div className="grid md:grid-cols-2 gap-6">
          <NewsCard
            variant="medium"
            title="Lorem Ipsum Dolor Sit Amet"
            description="Lorem Ipsum dolor sit amet, consectetur..."
          image="/img/home/news-1.png"
            category="World"
          />
          <NewsCard
            variant="medium"
            title="Lorem Ipsum Dolor Sit Amet"
            description="Lorem Ipsum dolor sit amet, consectetur..."
          image="/img/home/news-1.png"
            category="Health"
          />
          <NewsCard
            variant="medium"
            title="Lorem Ipsum Dolor Sit Amet"
            description="Lorem Ipsum dolor sit amet, consectetur..."
          image="/img/home/news-1.png"
            category="World"
          />
          <NewsCard
            variant="medium"
            title="Lorem Ipsum Dolor Sit Amet"
            description="Lorem Ipsum dolor sit amet, consectetur..."
          image="/img/home/news-1.png"
            category="Health"
          />
        </div>
      </section>
    </main>
  );
}

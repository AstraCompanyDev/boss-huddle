import { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowRight, Clock, Play, Mail, Flame, Linkedin, Twitter, Instagram, Youtube } from "lucide-react";
import MarketTicker from "@/components/MarketTicker";
import { FadeIn } from "@/hooks/useScrollFadeIn";

import upfounderLogo from "@/assets/upfounder-logo.jpg";
import newsLead from "@/assets/news-lead.jpg";
import newsMarkets from "@/assets/news-markets.jpg";
import newsFounder from "@/assets/news-founder.jpg";
import newsTeam from "@/assets/news-team.jpg";
import newsCommodities from "@/assets/news-commodities.jpg";
import newsVc from "@/assets/news-vc.jpg";
import shortThumb1 from "@/assets/short-thumb-1.jpg";
import shortThumb2 from "@/assets/short-thumb-2.jpg";
import shortThumb3 from "@/assets/short-thumb-3.jpg";
import shortThumb4 from "@/assets/short-thumb-4.jpg";

const CATEGORIES = ["All", "Funding", "Markets", "Founders", "Product", "Opinion"] as const;

const lead = {
  category: "Funding",
  title: "Seed rounds are getting smaller — and founders say that's a good thing",
  excerpt:
    "Average first cheques have shrunk 18% year on year, pushing founders toward leaner teams, faster revenue and far less dilution.",
  image: newsLead,
  author: "Maya Ellis",
  read: "6 min read",
  time: "2h ago",
};

const secondary = [
  {
    category: "Markets",
    title: "Crypto's quiet comeback is reshaping startup treasuries",
    excerpt: "More early-stage teams are holding part of their runway in digital assets. Here's how the smart ones manage the risk.",
    image: newsMarkets,
    author: "Daniel Okafor",
    read: "4 min read",
    time: "5h ago",
  },
  {
    category: "Founders",
    title: "From side project to $4M ARR in 19 months",
    excerpt: "Sofia Marques built in public, shipped weekly, and never hired a salesperson. She breaks down the playbook.",
    image: newsFounder,
    author: "Priya Raman",
    read: "8 min read",
    time: "Yesterday",
  },
];

const feed = [
  {
    category: "Product",
    title: "The weekly sprint ritual that keeps small teams shipping",
    excerpt: "Four founders share the exact cadence they use to stay accountable without drowning in process.",
    image: newsTeam,
    author: "Tom Bright",
    read: "5 min read",
    time: "1d ago",
  },
  {
    category: "Markets",
    title: "Gold and oil are telling two very different stories this quarter",
    excerpt: "Commodities are flashing mixed signals — and startups with hardware supply chains should be paying attention.",
    image: newsCommodities,
    author: "Elena Fischer",
    read: "7 min read",
    time: "1d ago",
  },
  {
    category: "Funding",
    title: "What VCs actually look for in a first meeting",
    excerpt: "We asked eleven investors the same question. Their answers were far more consistent than founders expect.",
    image: newsVc,
    author: "Maya Ellis",
    read: "6 min read",
    time: "2d ago",
  },
  {
    category: "Opinion",
    title: "Building alone is the most expensive mistake you can make",
    excerpt: "Isolation kills more startups than competition does. A case for accountability as a growth strategy.",
    image: newsFounder,
    author: "Sean Walsh",
    read: "3 min read",
    time: "3d ago",
  },
];

const interviews = [
  {
    category: "Founder Interview",
    title: "The founder who rebuilt her company around one customer conversation",
    excerpt:
      "Amara Cole shares how listening more closely turned a stalled product into a fast-growing platform — and changed how her team builds.",
    image: newsFounder,
    author: "Nia Harper",
    read: "9 min read",
    time: "Today",
  },
  {
    category: "The Founder Files",
    title: "Why Luca Chen chose profitability over another funding round",
    image: newsTeam,
    author: "Daniel Okafor",
    time: "3h ago",
  },
  {
    category: "First Principles",
    title: "Mina Patel on finding product-market fit in an overlooked industry",
    image: newsLead,
    author: "Maya Ellis",
    time: "Yesterday",
  },
  {
    category: "Founder Interview",
    title: "The honest story behind a two-year overnight success",
    image: newsVc,
    author: "Priya Raman",
    time: "2d ago",
  },
];

const videos = [
  { title: "How to run a 90-day growth sprint", duration: "8:12", image: shortThumb1 },
  { title: "Inside a real investor pitch", duration: "12:40", image: shortThumb2 },
  { title: "Pricing your product from zero", duration: "6:55", image: shortThumb3 },
  { title: "Founder therapy: burnout & recovery", duration: "15:02", image: shortThumb4 },
];

const mostRead = [
  "The 10 slides every seed deck still needs",
  "Why your churn number is lying to you",
  "A founder's guide to reading a term sheet",
  "Hiring your first five people without a recruiter",
  "The unglamorous work behind overnight success",
];

const socials = [
  { name: "LinkedIn", description: "Founder news & hiring insights", icon: Linkedin, href: "https://www.linkedin.com/company/upfounder" },
  { name: "X (Twitter)", description: "Daily market moves & hot takes", icon: Twitter, href: "https://x.com/upfounder" },
  { name: "Instagram", description: "Behind the scenes with founders", icon: Instagram, href: "https://www.instagram.com/upfounder" },
  { name: "YouTube", description: "Interviews, teardowns & documentaries", icon: Youtube, href: "https://www.youtube.com/@upfounder" },
];

export default function News() {
  const navigate = useNavigate();
  const [active, setActive] = useState<string>("All");
  const [query, setQuery] = useState("");

  const articles = useMemo(() => {
    const all = [lead, ...secondary, ...feed];
    return all.filter(
      (a) =>
        (active === "All" || a.category === active) &&
        (query === "" || a.title.toLowerCase().includes(query.toLowerCase()))
    );
  }, [active, query]);

  const filtering = active !== "All" || query !== "";

  return (
    <div className="min-h-screen bg-background text-foreground font-['Inter',sans-serif]">
      {/* Masthead */}
      <header className="sticky top-0 z-50 bg-background/90 backdrop-blur-xl border-b">
        <div className="max-w-[1400px] mx-auto px-5 h-16 flex items-center justify-between gap-4">
          <Link to="/" className="flex items-center gap-3 shrink-0">
            <img src={upfounderLogo} alt="Upfounder" className="h-8 rounded-lg" />
            <span className="hidden sm:inline text-sm font-semibold tracking-widest uppercase text-muted-foreground border-l pl-3">
              Newsroom
            </span>
          </Link>
          <div className="flex items-center gap-3">
            <Button variant="ghost" className="font-medium" onClick={() => navigate("/")}>
              Back to site
            </Button>
            <Button
              className="rounded-full px-5 font-semibold bg-accent text-accent-foreground hover:bg-accent/90"
              onClick={() => navigate("/auth")}
            >
              Subscribe
            </Button>
          </div>
        </div>
        <MarketTicker />
        {/* Category bar */}
        <div className="border-b bg-background">
          <div className="max-w-[1400px] mx-auto px-5 py-2.5 flex items-center gap-2 overflow-x-auto scrollbar-hide">
            {CATEGORIES.map((c) => (
              <button
                key={c}
                onClick={() => setActive(c)}
                className={`px-3.5 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                  active === c
                    ? "bg-foreground text-background"
                    : "text-muted-foreground hover:bg-secondary"
                }`}
              >
                {c}
              </button>
            ))}
            <div className="ml-auto hidden md:block w-56">
              <Input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search stories..."
                className="h-9 rounded-full"
              />
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-[1400px] mx-auto px-5 py-8 space-y-14">
        {filtering ? (
          <FadeIn>
            <h2 className="text-2xl font-bold mb-6">
              {articles.length} {articles.length === 1 ? "story" : "stories"}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {articles.map((a, i) => (
                <ArticleCard key={i} article={a} />
              ))}
            </div>
            {articles.length === 0 && (
              <p className="text-muted-foreground">No stories match that search yet.</p>
            )}
          </FadeIn>
        ) : (
          <>
            {/* Top story + secondary */}
            <FadeIn>
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <article className="lg:col-span-2 group cursor-pointer">
                  <div className="rounded-2xl overflow-hidden aspect-[16/9]">
                    <img
                      src={lead.image}
                      alt={lead.title}
                      width={1280}
                      height={800}
                      className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-500"
                    />
                  </div>
                  <div className="mt-5">
                    <Badge className="rounded-full bg-accent text-accent-foreground hover:bg-accent mb-3">
                      {lead.category}
                    </Badge>
                    <h1 className="text-3xl md:text-4xl font-bold leading-tight tracking-tight group-hover:text-primary transition-colors">
                      {lead.title}
                    </h1>
                    <p className="text-muted-foreground mt-3 text-lg leading-relaxed max-w-3xl">
                      {lead.excerpt}
                    </p>
                    <Meta author={lead.author} read={lead.read} time={lead.time} />
                  </div>
                </article>

                <div className="space-y-6">
                  {secondary.map((a, i) => (
                    <article key={i} className="group cursor-pointer flex gap-4">
                      <div className="rounded-xl overflow-hidden w-32 h-24 shrink-0">
                        <img
                          src={a.image}
                          alt={a.title}
                          loading="lazy"
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      </div>
                      <div className="min-w-0">
                        <span className="text-xs font-semibold uppercase tracking-wider text-primary">
                          {a.category}
                        </span>
                        <h3 className="font-semibold leading-snug mt-1 group-hover:text-primary transition-colors">
                          {a.title}
                        </h3>
                        <p className="text-xs text-muted-foreground mt-2">
                          {a.author} · {a.time}
                        </p>
                      </div>
                    </article>
                  ))}

                  {/* Most read */}
                  <Card className="rounded-2xl border-0 bg-secondary">
                    <CardContent className="p-5">
                      <div className="flex items-center gap-2 mb-4">
                        <Flame className="h-4 w-4 text-accent" />
                        <h3 className="font-semibold text-sm uppercase tracking-wider">Most read</h3>
                      </div>
                      <ol className="space-y-3">
                        {mostRead.map((t, i) => (
                          <li key={i} className="flex gap-3 group cursor-pointer">
                            <span className="text-xl font-bold text-muted-foreground/50 leading-none w-6">
                              {i + 1}
                            </span>
                            <span className="text-sm font-medium leading-snug group-hover:text-primary transition-colors">
                              {t}
                            </span>
                          </li>
                        ))}
                      </ol>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </FadeIn>

            {/* Latest feed */}
            <FadeIn>
              <SectionHeading title="Latest" />
              <div className="latest-carousel overflow-hidden" aria-label="Latest stories">
                <div className="latest-carousel-track flex w-max gap-6">
                  {[...feed, ...feed].map((a, i) => (
                    <div
                      key={`${a.title}-${i}`}
                      className="w-[82vw] max-w-sm shrink-0 sm:w-[360px] lg:w-[390px]"
                      aria-hidden={i >= feed.length ? true : undefined}
                    >
                      <ArticleCard article={a} />
                    </div>
                  ))}
                </div>
              </div>
            </FadeIn>

            {/* Founder interviews */}
            <FadeIn>
              <SectionHeading title="Founder Interviews" />
              <section className="grid grid-cols-1 lg:grid-cols-[minmax(0,1.45fr)_minmax(340px,0.75fr)] gap-8 lg:gap-10">
                <article className="group cursor-pointer">
                  <div className="relative rounded-2xl overflow-hidden aspect-[16/9]">
                    <img
                      src={interviews[0].image}
                      alt={interviews[0].title}
                      loading="lazy"
                      className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-500"
                    />
                    <Badge className="absolute left-5 top-5 rounded-full bg-accent text-accent-foreground hover:bg-accent">
                      Featured interview
                    </Badge>
                  </div>
                  <span className="inline-block mt-5 text-xs font-semibold uppercase tracking-wider text-primary">
                    {interviews[0].category}
                  </span>
                  <h2 className="mt-2 text-2xl md:text-3xl font-bold leading-tight tracking-tight group-hover:text-primary transition-colors">
                    {interviews[0].title}
                  </h2>
                  <p className="mt-3 max-w-3xl text-base md:text-lg leading-relaxed text-muted-foreground">
                    {interviews[0].excerpt}
                  </p>
                  <Meta author={interviews[0].author} read={interviews[0].read} time={interviews[0].time} />
                </article>

                <div className="divide-y divide-border border-y border-border">
                  {interviews.slice(1).map((story) => (
                    <article key={story.title} className="group cursor-pointer grid grid-cols-[minmax(0,1fr)_120px] sm:grid-cols-[minmax(0,1fr)_160px] lg:grid-cols-[minmax(0,1fr)_140px] gap-4 py-5 first:pt-0 lg:first:pt-0 last:pb-0">
                      <div className="min-w-0 self-center">
                        <span className="text-xs font-semibold uppercase tracking-wider text-primary">
                          {story.category}
                        </span>
                        <h3 className="mt-2 text-base md:text-lg font-semibold leading-snug group-hover:text-primary transition-colors">
                          {story.title}
                        </h3>
                        <p className="mt-3 text-xs text-muted-foreground">
                          {story.author} · {story.time}
                        </p>
                      </div>
                      <div className="rounded-xl overflow-hidden aspect-[4/3] self-center">
                        <img
                          src={story.image}
                          alt={story.title}
                          loading="lazy"
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      </div>
                    </article>
                  ))}
                </div>
              </section>
            </FadeIn>

            {/* Video hub */}
            <FadeIn>
              <section className="rounded-3xl bg-foreground text-background p-8 md:p-10">
                <div className="flex items-end justify-between mb-6">
                  <div>
                    <h2 className="text-2xl md:text-3xl font-bold">Upfounder Video</h2>
                    <p className="text-background/60 mt-1 text-sm">
                      Interviews, teardowns and founder documentaries.
                    </p>
                  </div>
                  <Button
                    variant="ghost"
                    className="rounded-full text-background hover:bg-background/10 hidden sm:flex"
                  >
                    All episodes <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
                  {videos.map((v, i) => (
                    <div key={i} className="group cursor-pointer">
                      <div className="relative rounded-2xl overflow-hidden aspect-video">
                        <img
                          src={v.image}
                          alt={v.title}
                          loading="lazy"
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                        <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                          <div className="w-11 h-11 rounded-full bg-background/90 flex items-center justify-center">
                            <Play className="h-4 w-4 text-foreground fill-foreground ml-0.5" />
                          </div>
                        </div>
                        <span className="absolute bottom-2 right-2 text-[11px] font-medium px-1.5 py-0.5 rounded bg-black/70 text-white">
                          {v.duration}
                        </span>
                      </div>
                      <h3 className="mt-3 text-sm font-semibold leading-snug">{v.title}</h3>
                    </div>
                  ))}
                </div>
              </section>
            </FadeIn>

            {/* Newsletter */}
            <FadeIn>
              <section className="rounded-3xl bg-gradient-accent p-8 md:p-12 text-center text-accent-foreground">
                <Mail className="h-8 w-8 mx-auto mb-4 opacity-90" />
                <h2 className="text-2xl md:text-3xl font-bold">The Morning Huddle</h2>
                <p className="mt-2 opacity-90 max-w-xl mx-auto">
                  One short email each weekday: the startup stories, funding rounds and market moves
                  that actually matter.
                </p>
                <form
                  className="mt-6 flex flex-col sm:flex-row gap-3 max-w-md mx-auto"
                  onSubmit={(e) => e.preventDefault()}
                >
                  <Input
                    type="email"
                    required
                    placeholder="you@startup.com"
                    className="rounded-full h-11 bg-background text-foreground border-0"
                  />
                  <Button
                    type="submit"
                    className="rounded-full h-11 px-6 font-semibold bg-foreground text-background hover:bg-foreground/90"
                  >
                    Subscribe
                  </Button>
                </form>
              </section>
            </FadeIn>

            {/* Social media */}
            <FadeIn>
              <section className="rounded-3xl border bg-secondary/50 p-8 md:p-10">
                <div className="text-center max-w-xl mx-auto mb-8">
                  <h2 className="text-2xl md:text-3xl font-bold tracking-tight">Join the UpFounder community</h2>
                  <p className="mt-2 text-muted-foreground">
                    Follow along on social for daily founder stories, market updates and behind-the-scenes
                    from the newsroom.
                  </p>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {socials.map((s) => (
                    <a
                      key={s.name}
                      href={s.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group flex items-center gap-4 rounded-2xl bg-background border p-4 hover:border-primary/50 hover:shadow-sm transition-all"
                    >
                      <div className="w-11 h-11 rounded-full bg-foreground text-background flex items-center justify-center shrink-0 group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                        <s.icon className="h-5 w-5" />
                      </div>
                      <div className="min-w-0">
                        <h3 className="font-semibold text-sm leading-tight">{s.name}</h3>
                        <p className="text-xs text-muted-foreground mt-1 leading-snug">{s.description}</p>
                      </div>
                      <ArrowRight className="ml-auto h-4 w-4 text-muted-foreground opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                    </a>
                  ))}
                </div>
              </section>
            </FadeIn>
          </>
        )}
      </main>

      <footer className="border-t mt-8">
        <div className="max-w-[1400px] mx-auto px-5 pt-12 pb-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
            <div className="md:col-span-2">
              <div className="flex items-center gap-3">
                <img src={upfounderLogo} alt="Upfounder" className="h-8 rounded-lg" />
                <span className="text-sm font-semibold tracking-widest uppercase text-muted-foreground border-l pl-3">
                  Newsroom
                </span>
              </div>
              <p className="mt-4 text-sm text-muted-foreground max-w-sm leading-relaxed">
                News, interviews and market intelligence for the next generation of founders.
                Built by founders, for founders.
              </p>
              <div className="flex items-center gap-2 mt-5">
                {socials.map((s) => (
                  <a
                    key={s.name}
                    href={s.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={s.name}
                    className="w-9 h-9 rounded-full bg-secondary flex items-center justify-center text-muted-foreground hover:bg-foreground hover:text-background transition-colors"
                  >
                    <s.icon className="h-4 w-4" />
                  </a>
                ))}
              </div>
            </div>
            <div>
              <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-4">Sections</h3>
              <ul className="space-y-2.5">
                {CATEGORIES.filter((c) => c !== "All").map((c) => (
                  <li key={c}>
                    <button
                      onClick={() => {
                        setActive(c);
                        window.scrollTo({ top: 0, behavior: "smooth" });
                      }}
                      className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {c}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-4">Upfounder</h3>
              <ul className="space-y-2.5">
                <li>
                  <Link to="/" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                    Main site
                  </Link>
                </li>
                <li>
                  <button
                    onClick={() => navigate("/auth")}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    Join the platform
                  </button>
                </li>
                <li>
                  <Link to="/resources" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                    Resources
                  </Link>
                </li>
                <li>
                  <button
                    onClick={() => navigate("/contact")}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    Contact
                  </button>
                </li>
              </ul>
            </div>
          </div>
          <div className="mt-10 pt-6 border-t flex flex-col md:flex-row items-center justify-between gap-3">
            <p className="text-xs text-muted-foreground">
              © {new Date().getFullYear()} Upfounder Newsroom. All rights reserved.
            </p>
            <p className="text-xs text-muted-foreground">
              Market data is indicative and delayed.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

function SectionHeading({ title }: { title: string }) {
  return (
    <div className="flex items-center gap-4 mb-6">
      <h2 className="text-2xl md:text-3xl font-bold tracking-tight">{title}</h2>
      <div className="flex-1 h-px bg-border" />
    </div>
  );
}

function Meta({ author, read, time }: { author: string; read: string; time: string }) {
  return (
    <div className="flex items-center gap-3 mt-4 text-xs text-muted-foreground">
      <span className="font-medium text-foreground">{author}</span>
      <span className="flex items-center gap-1">
        <Clock className="h-3 w-3" />
        {read}
      </span>
      <span>·</span>
      <span>{time}</span>
    </div>
  );
}

function ArticleCard({
  article,
}: {
  article: { category: string; title: string; excerpt: string; image: string; author: string; read: string; time: string };
}) {
  return (
    <article className="group cursor-pointer">
      <div className="rounded-2xl overflow-hidden aspect-[4/3]">
        <img
          src={article.image}
          alt={article.title}
          loading="lazy"
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
      </div>
      <span className="inline-block mt-4 text-xs font-semibold uppercase tracking-wider text-primary">
        {article.category}
      </span>
      <h3 className="text-lg font-semibold leading-snug mt-1.5 group-hover:text-primary transition-colors">
        {article.title}
      </h3>
      <p className="text-sm text-muted-foreground mt-2 line-clamp-2">{article.excerpt}</p>
      <Meta author={article.author} read={article.read} time={article.time} />
    </article>
  );
}

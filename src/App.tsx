import { useMemo, useState } from "react";
import { Flame, Plus, Sparkles, Trophy, X } from "lucide-react";
import { CATEGORIES, CATEGORY_MAP, PEOPLE_MAP } from "./lib/categories";
import type { Category } from "./lib/categories";
import { useCurrentUser, useEntries } from "./lib/store";
import {
  balanceScore,
  countByCategory,
  currentStreak,
  entriesFor,
  thisWeek,
} from "./lib/stats";
import type { CategoryId } from "./lib/types";
import { Login } from "./components/Login";
import { TopBar } from "./components/TopBar";
import { Comparison } from "./components/Comparison";
import { Feed } from "./components/Feed";
import { LogModal } from "./components/LogModal";

export default function App() {
  const user = useCurrentUser();
  const entries = useEntries();
  const [active, setActive] = useState<CategoryId | null>(null);
  const [picking, setPicking] = useState(false);

  if (!user) return <Login />;

  const person = PEOPLE_MAP[user];
  const openCategory = (id: CategoryId) => {
    setPicking(false);
    setActive(id);
  };

  return (
    <div className="app-shell">
      <TopBar user={user} />
      <Hero user={user} entries={entries} onPick={openCategory} />

      <section className="section">
        <div className="section-head">
          <h3>Log a hobby</h3>
          <span className="meta">counts shown are this week</span>
        </div>
        <div className="cat-grid">
          {CATEGORIES.map((c, i) => (
            <CategoryCard
              key={c.id}
              category={c}
              entries={entries}
              user={user}
              index={i}
              onClick={() => openCategory(c.id)}
            />
          ))}
        </div>
      </section>

      <section className="section">
        <div className="section-head">
          <h3>Head to head</h3>
          <span className="meta">Till × Nicola</span>
        </div>
        <Comparison entries={entries} />
      </section>

      <section className="section">
        <div className="section-head">
          <h3>Recent activity</h3>
          <span className="meta">{entries.length} logged in total</span>
        </div>
        <Feed entries={entries.slice(0, 18)} />
      </section>

      <button
        className="fab"
        onClick={() => setPicking(true)}
        aria-label="Log a hobby"
      >
        <Plus size={20} strokeWidth={2.6} />
        Log
      </button>

      {picking && (
        <CategoryPicker
          onClose={() => setPicking(false)}
          onPick={openCategory}
        />
      )}

      {active && (
        <LogModal
          category={CATEGORY_MAP[active]}
          user={user}
          onClose={() => setActive(null)}
        />
      )}

      <footer
        style={{
          textAlign: "center",
          color: "var(--text-faint)",
          fontSize: 12.5,
          marginTop: 48,
        }}
      >
        Built for {person.name} & their favourite person · Balance beats
        burnout.
      </footer>
    </div>
  );
}

/* ------------------------------------------------------------------ */

function Hero({
  user,
  entries,
  onPick,
}: {
  user: string;
  entries: ReturnType<typeof useEntries>;
  onPick: (id: CategoryId) => void;
}) {
  const person = PEOPLE_MAP[user];
  const mine = entriesFor(entries, user as never);
  const week = thisWeek(mine);
  const counts = countByCategory(week);
  const balance = balanceScore(week);
  const streak = currentStreak(mine);

  const missing = CATEGORIES.filter((c) => counts[c.id] === 0);
  const greeting = useMemo(() => {
    const h = new Date().getHours();
    if (h < 5) return "Still up";
    if (h < 12) return "Good morning";
    if (h < 18) return "Good afternoon";
    return "Good evening";
  }, []);

  return (
    <div
      className="hero fade-in"
      style={{ ["--grad" as string]: person.gradient }}
    >
      <p className="eyebrow" style={{ marginBottom: 8 }}>
        {greeting}, {person.name}
      </p>
      <h2>
        You've balanced{" "}
        <span className="accent">
          {balance} of 5
        </span>{" "}
        {balance === 1 ? "dimension" : "dimensions"} this week.
      </h2>
      <p>
        {balance === 5
          ? "A full pentathlon this week — every side of you got some love. 🏆"
          : missing.length > 0
            ? `Still untouched: ${missing.map((m) => m.label).join(", ")}. Small steps count.`
            : "Keep the momentum going."}
      </p>

      <div className="hero-stats">
        <span className="chip">
          <Trophy size={15} color="var(--text-dim)" />
          <b>{balance}</b>/5 balanced
        </span>
        <span className="chip">
          <Flame size={15} color="#ff9558" />
          <b>{streak}</b> day{streak === 1 ? "" : "s"} streak
        </span>
        <span className="chip">
          <Sparkles size={15} color="#c084fc" />
          <b>{week.length}</b> logged this week
        </span>
        {missing.length > 0 && (
          <button
            className="chip"
            style={{ cursor: "pointer" }}
            onClick={() => onPick(missing[0].id)}
          >
            <Plus size={15} color={missing[0].color} />
            Log {missing[0].label}
          </button>
        )}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */

function CategoryCard({
  category,
  entries,
  user,
  index,
  onClick,
}: {
  category: Category;
  entries: ReturnType<typeof useEntries>;
  user: string;
  index: number;
  onClick: () => void;
}) {
  const week = thisWeek(entriesFor(entries, user as never));
  const count = week.filter((e) => e.category === category.id).length;
  const Icon = category.icon;

  return (
    <button
      className="cat-card fade-in"
      style={{
        ["--cat" as string]: category.color,
        ["--glow" as string]: category.glow,
        animationDelay: `${index * 0.05}s`,
      }}
      onClick={onClick}
    >
      <div className="cat-top">
        <div className="cat-icon">
          <Icon size={24} strokeWidth={2.2} />
        </div>
        <div className="cat-count">
          {count}
          <small>this week</small>
        </div>
      </div>
      <div className="cat-body">
        <div className="label">{category.label}</div>
        <div className="purpose">{category.purpose}</div>
      </div>
      <div className="cat-foot">
        <Plus size={14} strokeWidth={2.6} />
        {count > 0 ? "Log again" : "Log this"}
      </div>
    </button>
  );
}

/* ------------------------------------------------------------------ */

function CategoryPicker({
  onClose,
  onPick,
}: {
  onClose: () => void;
  onPick: (id: CategoryId) => void;
}) {
  return (
    <div className="overlay" onMouseDown={onClose}>
      <div
        className="modal"
        style={{ ["--glow" as string]: "124, 92, 255" }}
        onMouseDown={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-label="Choose a hobby to log"
      >
        <div className="modal-head">
          <div>
            <p className="eyebrow" style={{ color: "#a78bfa" }}>
              Which side of you?
            </p>
            <h3>Log a hobby</h3>
          </div>
          <button className="modal-close" onClick={onClose} aria-label="Close">
            <X size={20} />
          </button>
        </div>
        <div className="cat-grid" style={{ marginTop: 20 }}>
          {CATEGORIES.map((c) => {
            const Icon = c.icon;
            return (
              <button
                key={c.id}
                className="cat-card"
                style={{
                  ["--cat" as string]: c.color,
                  ["--glow" as string]: c.glow,
                  minHeight: 130,
                }}
                onClick={() => onPick(c.id)}
              >
                <div className="cat-icon">
                  <Icon size={22} strokeWidth={2.2} />
                </div>
                <div className="cat-body">
                  <div className="label">{c.label}</div>
                  <div className="purpose">{c.purpose}</div>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

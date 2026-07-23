import { ChevronDown } from "lucide-react";
import { PEOPLE_MAP } from "../lib/categories";
import { setCurrentUser } from "../lib/store";
import type { UserId } from "../lib/types";
import { Avatar } from "./Avatar";

export function TopBar({ user }: { user: UserId }) {
  const person = PEOPLE_MAP[user];

  return (
    <header className="topbar">
      <div className="topbar-brand">
        <img src="/favicon.svg" alt="" />
        <div>
          <div className="name">Pentathlon</div>
          <div className="tag">5-hobby tracker</div>
        </div>
      </div>

      <button
        className="user-switch"
        onClick={() => setCurrentUser(null)}
        title="Switch person"
      >
        <span className="who">
          <span className="hi">Signed in as</span>
          <br />
          <span className="nm">{person.name}</span>
        </span>
        <Avatar person={person} size={36} />
        <ChevronDown size={16} color="var(--text-faint)" />
      </button>
    </header>
  );
}

import { PEOPLE } from "../lib/categories";
import { setCurrentUser } from "../lib/store";
import type { UserId } from "../lib/types";
import { Avatar } from "./Avatar";

export function Login() {
  const pick = (id: UserId) => setCurrentUser(id);

  return (
    <div className="login">
      <div className="login-brand fade-in">
        <img src="/favicon.svg" alt="" className="login-logo" />
        <div>
          <p className="eyebrow" style={{ marginBottom: 12 }}>
            The 5-Hobby Framework
          </p>
          <h1>Pentathlon</h1>
          <p className="login-sub">
            Five hobbies. Five sides of a life well lived. Log what you do,
            keep each other balanced.
          </p>
        </div>
      </div>

      <div className="picker fade-in" style={{ animationDelay: "0.08s" }}>
        {PEOPLE.map((p) => (
          <button
            key={p.id}
            className="picker-card"
            style={{ ["--grad" as string]: p.gradient }}
            onClick={() => pick(p.id)}
          >
            <Avatar person={p} size={72} />
            <div>
              <div className="picker-name">{p.name}</div>
              <div className="picker-hint">Tap to continue</div>
            </div>
          </button>
        ))}
      </div>

      <p className="login-footnote fade-in" style={{ animationDelay: "0.16s" }}>
        Pick your name any time to switch. Entries sync to a shared space, so
        you'll both see each other's progress — from any device.
      </p>
    </div>
  );
}

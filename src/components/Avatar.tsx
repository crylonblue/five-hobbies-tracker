import type { Person } from "../lib/types";

export function Avatar({
  person,
  size = 44,
}: {
  person: Person;
  size?: number;
}) {
  return (
    <span
      className="avatar"
      style={{
        width: size,
        height: size,
        fontSize: size * 0.42,
        background: person.gradient,
      }}
      aria-hidden
    >
      {person.initial}
    </span>
  );
}

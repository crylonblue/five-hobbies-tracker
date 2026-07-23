import { useEffect, useRef, useState } from "react";
import { X, Check } from "lucide-react";
import type { Category } from "../lib/categories";
import { PEOPLE_MAP } from "../lib/categories";
import { addEntry } from "../lib/store";
import { celebrate } from "../lib/celebrate";
import type { UserId } from "../lib/types";

export function LogModal({
  category,
  user,
  onClose,
}: {
  category: Category;
  user: UserId;
  onClose: () => void;
}) {
  const [note, setNote] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const Icon = category.icon;
  const person = PEOPLE_MAP[user];

  useEffect(() => {
    const t = setTimeout(() => textareaRef.current?.focus(), 350);
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) submit();
    };
    window.addEventListener("keydown", onKey);
    return () => {
      clearTimeout(t);
      window.removeEventListener("keydown", onKey);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [note]);

  const submit = () => {
    if (!note.trim()) return;
    addEntry(user, category.id, note);
    celebrate([category.color, "#ffffff", person.color]);
    onClose();
  };

  return (
    <div className="overlay" onMouseDown={onClose}>
      <div
        className="modal"
        style={{
          ["--cat" as string]: category.color,
          ["--glow" as string]: category.glow,
        }}
        onMouseDown={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-label={`Log ${category.label}`}
      >
        <div className="modal-head">
          <div className="modal-icon">
            <Icon size={26} strokeWidth={2.2} />
          </div>
          <div>
            <p className="eyebrow" style={{ color: category.color }}>
              {category.purpose}
            </p>
            <h3>{category.label}</h3>
            <p className="purpose">{category.prompt}</p>
          </div>
          <button className="modal-close" onClick={onClose} aria-label="Close">
            <X size={20} />
          </button>
        </div>

        <label htmlFor="note">What did you do?</label>
        <textarea
          id="note"
          ref={textareaRef}
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder={`e.g. ${category.examples
            .slice(0, 2)
            .join(", ")}…`}
          maxLength={280}
        />

        <div className="examples">
          {category.examples.map((ex) => (
            <button
              key={ex}
              className="example-chip"
              onClick={() =>
                setNote((n) => (n.trim() ? n : ex))
              }
              type="button"
            >
              {ex}
            </button>
          ))}
        </div>

        <button className="btn" onClick={submit} disabled={!note.trim()}>
          <Check size={19} strokeWidth={2.6} />
          Log it as {person.name}
        </button>
      </div>
    </div>
  );
}

import {
  Sprout,
  Dumbbell,
  Palette,
  HeartHandshake,
  Cloud,
  type LucideIcon,
} from "lucide-react";
import type { CategoryId, Person } from "./types";

export interface Category {
  id: CategoryId;
  /** The headline noun. */
  label: string;
  emoji: string;
  /** The framework's one-liner. */
  purpose: string;
  /** Longer nudge shown on the log screen. */
  prompt: string;
  icon: LucideIcon;
  color: string;
  glow: string;
  examples: string[];
}

export const CATEGORIES: Category[] = [
  {
    id: "grow",
    label: "Grow",
    emoji: "🌱",
    purpose: "Learn, challenge yourself, and build new skills",
    prompt: "What did you learn or challenge yourself with?",
    icon: Sprout,
    color: "#6fd88a",
    glow: "111, 216, 138",
    examples: [
      "Learn a language",
      "Coding",
      "Reading non-fiction",
      "Chess",
      "An online course",
    ],
  },
  {
    id: "health",
    label: "Health",
    emoji: "💪",
    purpose: "Move your body and support your physical wellbeing",
    prompt: "How did you move your body today?",
    icon: Dumbbell,
    color: "#ff6b6b",
    glow: "255, 107, 107",
    examples: ["Weightlifting", "Running", "Yoga", "Swimming", "Hiking"],
  },
  {
    id: "creative",
    label: "Creative",
    emoji: "🎨",
    purpose: "Make or express something",
    prompt: "What did you make or express?",
    icon: Palette,
    color: "#c084fc",
    glow: "192, 132, 252",
    examples: [
      "Drawing",
      "Photography",
      "Writing",
      "Cooking",
      "Playing an instrument",
    ],
  },
  {
    id: "connect",
    label: "Connect",
    emoji: "🤝",
    purpose: "Spend meaningful time with others and build relationships",
    prompt: "Who did you share meaningful time with?",
    icon: HeartHandshake,
    color: "#ffa94d",
    glow: "255, 169, 77",
    examples: [
      "Team sports",
      "Board game night",
      "Volunteering",
      "Dinner with friends",
      "Community event",
    ],
  },
  {
    id: "peaceful",
    label: "Peaceful",
    emoji: "☁️",
    purpose: "Slow down, reflect, and recover",
    prompt: "How did you slow down and recover?",
    icon: Cloud,
    color: "#5eb8ff",
    glow: "94, 184, 255",
    examples: [
      "Meditation",
      "Journaling",
      "Reading fiction",
      "Walking in nature",
      "Gardening",
    ],
  },
];

export const CATEGORY_MAP: Record<CategoryId, Category> = Object.fromEntries(
  CATEGORIES.map((c) => [c.id, c]),
) as Record<CategoryId, Category>;

export const PEOPLE: Person[] = [
  {
    id: "till",
    name: "Till",
    initial: "T",
    gradient: "linear-gradient(135deg, #6366f1 0%, #22d3ee 100%)",
    color: "#7c8bff",
  },
  {
    id: "nicola",
    name: "Nicola",
    initial: "N",
    gradient: "linear-gradient(135deg, #f472b6 0%, #fb923c 100%)",
    color: "#f77fb8",
  },
];

export const PEOPLE_MAP: Record<string, Person> = Object.fromEntries(
  PEOPLE.map((p) => [p.id, p]),
);

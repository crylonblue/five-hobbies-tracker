import {
  Coins,
  Dumbbell,
  Palette,
  BookOpen,
  Sprout,
  type LucideIcon,
} from "lucide-react";
import type { CategoryId, Person } from "./types";

export interface Category {
  id: CategoryId;
  /** The headline noun. */
  label: string;
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
    id: "money",
    label: "Wealth",
    purpose: "Makes you money",
    prompt: "What did you do to grow a skill that pays?",
    icon: Coins,
    color: "#f5b955",
    glow: "245, 185, 85",
    examples: ["Freelance gig", "Coding side project", "Investing", "Photography"],
  },
  {
    id: "fitness",
    label: "Body",
    purpose: "Keeps you in shape",
    prompt: "How did you move your body today?",
    icon: Dumbbell,
    color: "#ff6b6b",
    glow: "255, 107, 107",
    examples: ["Gym", "Running", "Climbing", "Swimming", "Martial arts"],
  },
  {
    id: "creative",
    label: "Craft",
    purpose: "Lets you be creative",
    prompt: "What did you create or express?",
    icon: Palette,
    color: "#c084fc",
    glow: "192, 132, 252",
    examples: ["Drawing", "Writing", "Music", "Cooking", "Design"],
  },
  {
    id: "knowledge",
    label: "Mind",
    purpose: "Builds knowledge",
    prompt: "What did you learn or study?",
    icon: BookOpen,
    color: "#4dd4c8",
    glow: "77, 212, 200",
    examples: ["Reading", "A language", "AI", "History", "A course"],
  },
  {
    id: "mindset",
    label: "Soul",
    purpose: "Grows your mindset",
    prompt: "What grounded or stretched your mindset?",
    icon: Sprout,
    color: "#7dd77d",
    glow: "125, 215, 125",
    examples: ["Meditation", "Journaling", "Volunteering", "Travel", "Chess"],
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

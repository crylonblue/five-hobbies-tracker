export type UserId = "till" | "nicola";

export type CategoryId =
  | "grow"
  | "health"
  | "creative"
  | "connect"
  | "peaceful";

export interface LogEntry {
  id: string;
  user: UserId;
  category: CategoryId;
  note: string;
  createdAt: number;
}

export interface Person {
  id: UserId;
  name: string;
  initial: string;
  /** CSS gradient used for this person's avatar & accents. */
  gradient: string;
  color: string;
}

export type RoomStatus = "voting" | "locked" | "exited";
export type Gender = "m" | "f";
export type Reason = "fired" | "quit" | "fed_up";
export type GameId = "runaway" | "trivia" | "catch" | "picture";

export type Room = {
  id: string;
  slug: string;
  host_name: string;
  host_gender: Gender;
  group_name: string;
  reason: Reason | null;
  timezone: string;
  window_start: string; // YYYY-MM-DD in the room timezone
  window_end: string;
  day_start_hour: number;
  day_end_hour: number; // exclusive
  voting_closes_at: string;
  status: RoomStatus;
  locked_slot: string | null;
  exited_at: string | null;
  created_at: string;
};

export type Player = {
  room_id: string;
  user_id: string;
  display_name: string;
};

export type Vote = {
  id: number;
  room_id: string;
  user_id: string;
  slot_start: string;
};

export type WallMessage = {
  id: number;
  room_id: string;
  user_id: string;
  display_name: string;
  body: string;
  created_at: string;
};

export type LeaderboardRow = {
  room_id: string;
  game: GameId;
  user_id: string;
  score: number;
  display_name: string;
};

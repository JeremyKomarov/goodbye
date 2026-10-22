import { useMutation } from "@tanstack/react-query";
import { createRoom } from "@/features/landing/api/rooms.api";
import type { CreateRoomInput } from "@/features/landing/api/rooms.dto";
import { mapCreatedRoomDto } from "@/features/landing/api/rooms.mapper";

/** Opens a room. Invalidates nothing: no query holds rooms until the room screen (phase 05). */
export function useCreateRoom() {
  return useMutation({
    mutationFn: async (input: CreateRoomInput) => mapCreatedRoomDto(await createRoom(input)),
  });
}

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@shared/routes";
import { type InsertGameResult, type GameResult } from "@shared/schema";

// Helper to safely parse API responses
const parseResponse = <T>(schema: any, data: any): T => {
  return schema.parse(data);
};

export function useGameHistory() {
  return useQuery({
    queryKey: [api.game.list.path],
    queryFn: async () => {
      const res = await fetch(api.game.list.path);
      if (!res.ok) throw new Error("Failed to fetch game history");
      return api.game.list.responses[200].parse(await res.json());
    },
    refetchInterval: 2000, // Live feed effect
  });
}

export function useAddResult() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: InsertGameResult) => {
      const res = await fetch(api.game.add.path, {
        method: api.game.add.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      
      if (!res.ok) {
        if (res.status === 400) {
          const error = await res.json();
          throw new Error(error.message);
        }
        throw new Error("Failed to add result");
      }
      
      return api.game.add.responses[201].parse(await res.json());
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [api.game.list.path] });
      queryClient.invalidateQueries({ queryKey: [api.signals.latest.path] });
      queryClient.invalidateQueries({ queryKey: [api.signals.list.path] });
    },
  });
}

export function useResetGame() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async () => {
      const res = await fetch(api.game.reset.path, {
        method: api.game.reset.method,
      });
      if (!res.ok) throw new Error("Failed to reset game");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [api.game.list.path] });
      queryClient.invalidateQueries({ queryKey: [api.signals.latest.path] });
      queryClient.invalidateQueries({ queryKey: [api.signals.list.path] });
    },
  });
}

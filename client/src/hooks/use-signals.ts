import { useQuery } from "@tanstack/react-query";
import { api } from "@shared/routes";

export function useLatestSignal() {
  return useQuery({
    queryKey: [api.signals.latest.path],
    queryFn: async () => {
      const res = await fetch(api.signals.latest.path);
      if (!res.ok) throw new Error("Failed to fetch latest signal");
      const data = await res.json();
      return api.signals.latest.responses[200].parse(data);
    },
    refetchInterval: 1000, // Aggressive polling for signals
  });
}

export function useSignalHistory() {
  return useQuery({
    queryKey: [api.signals.list.path],
    queryFn: async () => {
      const res = await fetch(api.signals.list.path);
      if (!res.ok) throw new Error("Failed to fetch signal history");
      return api.signals.list.responses[200].parse(await res.json());
    },
    refetchInterval: 5000,
  });
}

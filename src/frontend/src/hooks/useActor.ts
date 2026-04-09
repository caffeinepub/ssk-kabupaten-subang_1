import { useActor as useActorBase } from "@caffeineai/core-infrastructure";
import { createActor } from "../backend";
import type { BackendActor } from "../types/backend";

// Wrapper that pre-binds our createActor factory, providing a typed actor
export function useActor() {
  // The package's useActor takes a createActor factory; we bind ours.
  // The returned actor is cast to BackendActor for full type safety.
  const result = useActorBase(
    createActor as Parameters<typeof useActorBase>[0],
  );
  return {
    actor: result.actor as unknown as BackendActor | null,
    isFetching: result.isFetching,
  };
}

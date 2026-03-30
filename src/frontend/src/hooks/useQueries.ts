import { useQuery } from "@tanstack/react-query";
import type { Article, TeamMember } from "../backend.d";
import { useActor } from "./useActor";

export function useAllArticles() {
  const { actor, isFetching } = useActor();
  return useQuery<Article[]>({
    queryKey: ["articles"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllArticles();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useArticle(id: bigint) {
  const { actor, isFetching } = useActor();
  return useQuery<Article>({
    queryKey: ["article", id.toString()],
    queryFn: async () => {
      if (!actor) throw new Error("No actor");
      return actor.getArticle(id);
    },
    enabled: !!actor && !isFetching,
  });
}

export function useTeamMembers() {
  const { actor, isFetching } = useActor();
  return useQuery<TeamMember[]>({
    queryKey: ["teamMembers"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getTeamMembers();
    },
    enabled: !!actor && !isFetching,
  });
}

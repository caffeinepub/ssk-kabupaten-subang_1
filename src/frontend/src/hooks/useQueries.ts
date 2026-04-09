import { useQuery } from "@tanstack/react-query";
import type {
  Activity,
  Article,
  ContactInfo,
  GaleriItem,
  PendaftaranAnggota,
  Profile,
  ProgramUnggulan,
  SatuanSSK,
  SiteSettings,
  SliderBanner,
  TeamMember,
  VideoYoutube,
} from "../types/backend";
import { useActor } from "./useActor";

export function useIsCallerAdmin() {
  const { actor, isFetching } = useActor();
  return useQuery<boolean>({
    queryKey: ["isCallerAdmin"],
    queryFn: async () => {
      if (!actor) return false;
      return actor.isCallerAdmin();
    },
    enabled: !!actor && !isFetching,
    staleTime: 0,
  });
}

export function useAdminPrincipal() {
  const { actor, isFetching } = useActor();
  return useQuery<string>({
    queryKey: ["adminPrincipal"],
    queryFn: async () => {
      if (!actor) return "";
      try {
        const result = await actor.getAdminPrincipal();
        // result is [Principal] | [] — Candid option
        if (Array.isArray(result) && result.length > 0 && result[0] != null) {
          return result[0].toString();
        }
        return "";
      } catch {
        return "";
      }
    },
    enabled: !!actor && !isFetching,
    staleTime: 0,
  });
}

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
      return actor.getAllTeamMembers();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useAllActivities() {
  const { actor, isFetching } = useActor();
  return useQuery<Activity[]>({
    queryKey: ["activities"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllActivities();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useContactInfo() {
  const { actor, isFetching } = useActor();
  return useQuery<ContactInfo>({
    queryKey: ["contactInfo"],
    queryFn: async () => {
      if (!actor) throw new Error("No actor");
      return actor.getContactInfo();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useProgramUnggulan() {
  const { actor, isFetching } = useActor();
  return useQuery<ProgramUnggulan>({
    queryKey: ["programUnggulan"],
    queryFn: async () => {
      if (!actor) throw new Error("No actor");
      return actor.getProgramUnggulan();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useAllVideos() {
  const { actor, isFetching } = useActor();
  return useQuery<VideoYoutube[]>({
    queryKey: ["videos"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllVideos();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useProfile() {
  const { actor, isFetching } = useActor();
  return useQuery<Profile>({
    queryKey: ["profile"],
    queryFn: async () => {
      if (!actor) throw new Error("No actor");
      return actor.getProfile();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useAllGaleriItems() {
  const { actor, isFetching } = useActor();
  return useQuery<GaleriItem[]>({
    queryKey: ["galeriItems"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllGaleriItems();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useAllPendaftaran() {
  const { actor, isFetching } = useActor();
  return useQuery<PendaftaranAnggota[]>({
    queryKey: ["pendaftaran"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllPendaftaran();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useAllSatuanSSK() {
  const { actor, isFetching } = useActor();
  return useQuery<SatuanSSK[]>({
    queryKey: ["satuanSSK"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllSatuanSSK();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useSiteSettings() {
  const { actor, isFetching } = useActor();
  return useQuery<SiteSettings>({
    queryKey: ["siteSettings"],
    queryFn: async () => {
      if (!actor) throw new Error("No actor");
      return actor.getSiteSettings();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useAllSliderBanners() {
  const { actor, isFetching } = useActor();
  return useQuery<SliderBanner[]>({
    queryKey: ["sliderBanners"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllSliderBanners();
    },
    enabled: !!actor && !isFetching,
  });
}

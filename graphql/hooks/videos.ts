import { useQuery } from "@tanstack/react-query";
import graphqlClient from "../client";
import {
  GetVideoShortsDocument,
  GetVideoShortsQuery,
} from "../generated/graphql";
import { Video } from "@/types/video";

const fetchVideos = async () => {
  return await graphqlClient.request(GetVideoShortsDocument);
};

export const useVideos = () => {
  return useQuery({
    queryKey: ["GetVideoShorts"],
    queryFn: fetchVideos,
  });
};

export function parseVideos(data: GetVideoShortsQuery): Video[] {
  return data.videos.map((video) => ({
    id: video.id,
    url: `https://assets.joyutils.org/video/${video.id}/media`,
    title: video.title ?? "",
    description: video.description ?? "",
    channelName: video.channel.title ?? "",
  }));
}

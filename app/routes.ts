import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
  index("routes/home.tsx"),
  route("upload", "routes/upload.tsx"),
  route("videos/:id", "routes/video-detail.tsx"),
  route("videos/:id/play", "routes/player.tsx"),
] satisfies RouteConfig;

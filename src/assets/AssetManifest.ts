export type AssetManifestEntry = {
  id: string;
  path: string;
  type: "image" | "audio" | "font" | "data";
};

export type AssetManifest = {
  entries: AssetManifestEntry[];
};

/** Pure logic for browsing an AI art gallery: tags, search, favorites. */

export type Artwork = {
  id: string;
  title: string;
  prompt: string;
  model: string;
  tags: string[];
  /** Dominant colors used to render the placeholder swatch. */
  palette: [string, string];
  createdAt: string; // ISO date
};

export type GalleryFilter = {
  query?: string;
  tag?: string | null;
  favoritesOnly?: boolean;
  favorites?: ReadonlySet<string>;
};

export function allTags(artworks: Artwork[]): string[] {
  return [...new Set(artworks.flatMap((a) => a.tags.map((t) => t.toLowerCase())))].sort();
}

export function filterArtworks(artworks: Artwork[], filter: GalleryFilter): Artwork[] {
  const q = (filter.query ?? "").trim().toLowerCase();
  const tag = filter.tag?.toLowerCase() ?? null;
  const favs = filter.favorites ?? new Set<string>();
  return artworks
    .filter((a) => !q || [a.title, a.prompt, a.model].some((s) => s.toLowerCase().includes(q)))
    .filter((a) => !tag || a.tags.some((t) => t.toLowerCase() === tag))
    .filter((a) => !filter.favoritesOnly || favs.has(a.id))
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

/** Returns a new set with `id` added or removed. */
export function toggleFavorite(favorites: ReadonlySet<string>, id: string): Set<string> {
  const next = new Set(favorites);
  if (next.has(id)) next.delete(id);
  else next.add(id);
  return next;
}

export const SAMPLE_ARTWORKS: Artwork[] = [
  { id: "a1", title: "Neon Monsoon", prompt: "rainy Bangkok street at night, neon reflections, cinematic", model: "SDXL", tags: ["cityscape", "night"], palette: ["#1B1464", "#E84393"], createdAt: "2025-03-02" },
  { id: "a2", title: "Temple of Glass", prompt: "crystal temple in misty mountains, soft light", model: "Midjourney v6", tags: ["architecture", "fantasy"], palette: ["#A8E6CF", "#3D84A8"], createdAt: "2025-02-14" },
  { id: "a3", title: "Paper Koi", prompt: "origami koi fish swimming through clouds, pastel", model: "DALL-E 3", tags: ["animals", "fantasy"], palette: ["#FFD3B6", "#FF8B94"], createdAt: "2025-04-11" },
  { id: "a4", title: "Rust Orbit", prompt: "abandoned space station orbiting a red planet", model: "SDXL", tags: ["sci-fi"], palette: ["#6D214F", "#F97F51"], createdAt: "2025-01-20" },
  { id: "a5", title: "Midnight Market", prompt: "floating market lanterns at midnight, watercolor", model: "Midjourney v6", tags: ["cityscape", "watercolor", "night"], palette: ["#182C61", "#F8EFBA"], createdAt: "2025-05-05" },
  { id: "a6", title: "Moss Giant", prompt: "gentle moss-covered giant in an ancient forest", model: "DALL-E 3", tags: ["fantasy", "nature"], palette: ["#2C3A47", "#55E6C1"], createdAt: "2025-03-28" },
];

/** Drops stored favorite ids that no longer match an artwork (and duplicates). */
export function knownFavorites(ids: string[], artworks: Artwork[]): Set<string> {
  const known = new Set(artworks.map((a) => a.id));
  return new Set(ids.filter((id) => known.has(id)));
}

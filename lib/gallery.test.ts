import { describe, expect, it } from "vitest";
import { allTags, filterArtworks, SAMPLE_ARTWORKS, toggleFavorite } from "./gallery";

describe("allTags", () => {
  it("returns unique sorted lowercase tags", () => {
    expect(allTags(SAMPLE_ARTWORKS)).toEqual([
      "animals", "architecture", "cityscape", "fantasy", "nature", "night", "sci-fi", "watercolor",
    ]);
  });
});

describe("filterArtworks", () => {
  it("sorts newest first by default", () => {
    expect(filterArtworks(SAMPLE_ARTWORKS, {}).map((a) => a.id)).toEqual(["a5", "a3", "a6", "a1", "a2", "a4"]);
  });
  it("searches title, prompt and model", () => {
    expect(filterArtworks(SAMPLE_ARTWORKS, { query: "koi" }).map((a) => a.id)).toEqual(["a3"]);
    expect(filterArtworks(SAMPLE_ARTWORKS, { query: "sdxl" }).map((a) => a.id)).toEqual(["a1", "a4"]);
  });
  it("filters by tag (case-insensitive)", () => {
    expect(filterArtworks(SAMPLE_ARTWORKS, { tag: "NIGHT" }).map((a) => a.id)).toEqual(["a5", "a1"]);
  });
  it("shows only favorites when asked", () => {
    const favorites = new Set(["a2", "a4"]);
    expect(filterArtworks(SAMPLE_ARTWORKS, { favoritesOnly: true, favorites }).map((a) => a.id)).toEqual(["a2", "a4"]);
    expect(filterArtworks(SAMPLE_ARTWORKS, { favoritesOnly: true })).toEqual([]);
  });
});

describe("toggleFavorite", () => {
  it("adds and removes without mutating the input", () => {
    const empty = new Set<string>();
    const one = toggleFavorite(empty, "a1");
    expect(one.has("a1")).toBe(true);
    expect(empty.size).toBe(0);
    expect(toggleFavorite(one, "a1").has("a1")).toBe(false);
  });
});

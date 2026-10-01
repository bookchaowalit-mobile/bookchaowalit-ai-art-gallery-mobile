import { describe, expect, it } from "vitest";
import { allTags, filterArtworks, normalizeText, SAMPLE_ARTWORKS, toggleFavorite, type Artwork } from "./gallery";

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

describe("pass 3 edge cases", () => {
  const base = SAMPLE_ARTWORKS[0];
  it("dedupes tags that differ only by zero-width characters, BOM, case or spacing", () => {
    const arts: Artwork[] = [
      { ...base, id: "x", tags: ["night", " Night ", "night\u200B", "\uFEFFnight"] },
    ];
    expect(allTags(arts)).toEqual(["night"]);
    expect(filterArtworks(arts, { tag: "NIGHT\u200B" })).toHaveLength(1);
  });
  it("sorts by actual instant, not by string, when timestamps carry offsets", () => {
    const early: Artwork = { ...base, id: "early", createdAt: "2025-03-02T01:00:00+07:00" }; // 2025-03-01T18:00Z
    const late: Artwork = { ...base, id: "late", createdAt: "2025-03-01T20:00:00Z" };
    expect(filterArtworks([early, late], {}).map((a) => a.id)).toEqual(["late", "early"]);
  });
  it("puts unparseable dates last instead of first", () => {
    const bad: Artwork = { ...base, id: "bad", createdAt: "not a date" };
    const ok: Artwork = { ...base, id: "ok", createdAt: "2025-01-01" };
    expect(filterArtworks([bad, ok], {}).map((a) => a.id)).toEqual(["ok", "bad"]);
  });
  it("matches decomposed accents in search", () => {
    expect(normalizeText("Cafe\u0301")).toBe(normalizeText("Café"));
  });
});

import { describe, expect, it } from "vitest";
import { encodeEnvelope, isStringArray, valueCodec } from "./persist";
import { knownFavorites, SAMPLE_ARTWORKS } from "./gallery";

describe("favorites persistence", () => {
  const codec = valueCodec(isStringArray);

  it("round-trips favorite ids", () => {
    const ids = [SAMPLE_ARTWORKS[0].id];
    expect(codec.decode(codec.encode(ids))).toEqual(ids);
  });

  it("rejects malformed stored data", () => {
    expect(codec.decode(encodeEnvelope([1, 2]))).toBeUndefined();
    expect(codec.decode("{")).toBeUndefined();
  });

  it("knownFavorites drops stale and duplicate ids", () => {
    const id = SAMPLE_ARTWORKS[0].id;
    expect([...knownFavorites([id, "gone", id], SAMPLE_ARTWORKS)]).toEqual([id]);
  });
});

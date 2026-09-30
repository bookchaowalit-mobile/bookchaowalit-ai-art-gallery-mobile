import { useMemo, useState } from "react";
import { FlatList, Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { allTags, filterArtworks, SAMPLE_ARTWORKS, toggleFavorite, type Artwork } from "../../lib/gallery";

const TAGS = allTags(SAMPLE_ARTWORKS);

export default function GalleryScreen() {
  const [query, setQuery] = useState("");
  const [tag, setTag] = useState<string | null>(null);
  const [favorites, setFavorites] = useState<Set<string>>(new Set());
  const [favoritesOnly, setFavoritesOnly] = useState(false);

  const artworks = useMemo(
    () => filterArtworks(SAMPLE_ARTWORKS, { query, tag, favorites, favoritesOnly }),
    [query, tag, favorites, favoritesOnly],
  );

  return (
    <FlatList
      style={styles.container}
      data={artworks}
      keyExtractor={(a) => a.id}
      keyboardShouldPersistTaps="handled"
      ListHeaderComponent={
        <View style={styles.filters}>
          <TextInput
            style={styles.input}
            placeholder="Search title, prompt or model"
            value={query}
            onChangeText={setQuery}
            accessibilityLabel="Search artworks"
          />
          <View style={styles.chips}>
            <Chip label="All" active={tag === null} onPress={() => setTag(null)} />
            {TAGS.map((t) => (
              <Chip key={t} label={t} active={tag === t} onPress={() => setTag(tag === t ? null : t)} />
            ))}
          </View>
          <Chip
            label={`Favorites only (${favorites.size})`}
            active={favoritesOnly}
            onPress={() => setFavoritesOnly(!favoritesOnly)}
          />
        </View>
      }
      ListEmptyComponent={<Text style={styles.empty}>No artworks match.</Text>}
      renderItem={({ item }) => (
        <ArtworkCard
          artwork={item}
          favorite={favorites.has(item.id)}
          onToggleFavorite={() => setFavorites(toggleFavorite(favorites, item.id))}
        />
      )}
    />
  );
}

function ArtworkCard({
  artwork,
  favorite,
  onToggleFavorite,
}: {
  artwork: Artwork;
  favorite: boolean;
  onToggleFavorite: () => void;
}) {
  return (
    <View style={styles.card}>
      <View
        style={[styles.swatch, { backgroundColor: artwork.palette[0] }]}
        accessibilityRole="image"
        accessibilityLabel={`Color preview for ${artwork.title}`}
      >
        <View style={[styles.swatchAccent, { backgroundColor: artwork.palette[1] }]} />
      </View>
      <View style={styles.cardBody}>
        <View style={styles.titleRow}>
          <Text style={styles.cardTitle}>{artwork.title}</Text>
          <Pressable
            onPress={onToggleFavorite}
            hitSlop={12}
            accessibilityRole="button"
            accessibilityLabel={favorite ? `Remove ${artwork.title} from favorites` : `Add ${artwork.title} to favorites`}
          >
            <Ionicons name={favorite ? "heart" : "heart-outline"} size={24} color="#E84393" />
          </Pressable>
        </View>
        <Text style={styles.prompt}>“{artwork.prompt}”</Text>
        <Text style={styles.meta}>
          {artwork.model} · {artwork.createdAt} · {artwork.tags.join(", ")}
        </Text>
      </View>
    </View>
  );
}

function Chip({ label, active, onPress }: { label: string; active: boolean; onPress: () => void }) {
  return (
    <Pressable
      onPress={onPress}
      style={[styles.chip, active && styles.chipActive]}
      accessibilityRole="button"
      accessibilityState={{ selected: active }}
    >
      <Text style={[styles.chipText, active && styles.chipTextActive]}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F5F5F5" },
  filters: { padding: 16, gap: 10 },
  input: {
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
  },
  chips: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  chip: { alignSelf: "flex-start", paddingHorizontal: 14, paddingVertical: 8, borderRadius: 16, backgroundColor: "#E3ECF7" },
  chipActive: { backgroundColor: "#4A90D9" },
  chipText: { color: "#2A5A8C", fontWeight: "500" },
  chipTextActive: { color: "#fff" },
  empty: { textAlign: "center", color: "#777", marginTop: 32 },
  card: { backgroundColor: "#fff", borderRadius: 12, marginHorizontal: 16, marginBottom: 12, overflow: "hidden", elevation: 2 },
  swatch: { height: 120, justifyContent: "flex-end", alignItems: "flex-end" },
  swatchAccent: { width: 90, height: 90, borderTopLeftRadius: 90 },
  cardBody: { padding: 14, gap: 4 },
  titleRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  cardTitle: { fontSize: 17, fontWeight: "600", color: "#333" },
  prompt: { fontSize: 14, color: "#555", fontStyle: "italic" },
  meta: { fontSize: 12, color: "#888" },
});

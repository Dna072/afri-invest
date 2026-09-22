import { ASSET_SEED, MARKET_SEED } from "@/mock/catalog";

export function marketSlug(id: string) {
  return id.replace(/_/g, "-");
}

export function marketFromSlug(slug: string) {
  const id = slug.replace(/-/g, "_");
  return MARKET_SEED.find((m) => m.id === id || marketSlug(m.id) === slug);
}

export function publicAssets(marketId?: string) {
  return ASSET_SEED.filter((a) => (marketId ? a.marketId === marketId : true));
}

export function publicAsset(symbol: string) {
  const needle = symbol.toUpperCase();
  return ASSET_SEED.find((a) => a.symbol.toUpperCase() === needle);
}

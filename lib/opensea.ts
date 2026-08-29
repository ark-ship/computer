import {
  OPENSEA_API_KEY,
  OPENSEA_CHAIN,
  OPENSEA_SLUG,
} from "./config";

const BASE = "https://api.opensea.io/api/v2";

function headers() {
  if (!OPENSEA_API_KEY) {
    throw new Error("OPENSEA_API_KEY is missing.");
  }

  return {
    "x-api-key": OPENSEA_API_KEY,
    accept: "application/json",
  };
}

async function get(path: string) {
  const response = await fetch(`${BASE}${path}`, {
    headers: headers(),
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error(`OpenSea API ${response.status}`);
  }

  return response.json();
}

export async function getCollectionStats(slug = OPENSEA_SLUG) {
  if (!slug) throw new Error("OPENSEA_SLUG is missing.");
  return get(`/collections/${encodeURIComponent(slug)}/stats`);
}

export async function getCollectionEvents(
  slug = OPENSEA_SLUG,
  eventType: "mint" | "sale" | "transfer" | "listing" = "mint"
) {
  if (!slug) throw new Error("OPENSEA_SLUG is missing.");

  return get(
    `/events/collection/${encodeURIComponent(slug)}?event_type=${eventType}&limit=20`
  );
}

export async function getAccountNFTs(address: string) {
  if (!OPENSEA_API_KEY || !OPENSEA_SLUG) {
    return null;
  }

  return get(
    `/chain/${encodeURIComponent(OPENSEA_CHAIN)}/account/${encodeURIComponent(
      address
    )}/nfts?collection=${encodeURIComponent(OPENSEA_SLUG)}&limit=200`
  );
}
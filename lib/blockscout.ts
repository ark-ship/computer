import { BLOCKSCOUT_API_KEY } from "./config";

const BASE = "https://api.blockscout.com/4663/api/v2";

export async function getAddressTransactions(address: string) {
  const url = new URL(
    `${BASE}/addresses/${encodeURIComponent(address)}/transactions`
  );

  url.searchParams.set("limit", "10");

  const headers: Record<string, string> = {
    accept: "application/json",
  };

  if (BLOCKSCOUT_API_KEY) {
    headers.authorization = `Bearer ${BLOCKSCOUT_API_KEY}`;
  }

  const response = await fetch(url, {
    headers,
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error(`Blockscout API ${response.status}`);
  }

  return response.json();
}
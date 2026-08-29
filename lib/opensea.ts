import {
  OPENSEA_API_KEY,
  OPENSEA_CHAIN,
  OPENSEA_SLUG,
} from "./config";

const BASE =
  "https://api.opensea.io/api/v2";

function headers() {
  if (!OPENSEA_API_KEY) {
    throw new Error(
      "OPENSEA_API_KEY is missing."
    );
  }

  return {
    "x-api-key": OPENSEA_API_KEY,
    accept: "application/json",
  };
}

async function get(
  path: string
) {
  const response = await fetch(
    `${BASE}${path}`,
    {
      headers: headers(),
      cache: "no-store",
    }
  );

  if (!response.ok) {
    const body =
      await response.text().catch(
        () => ""
      );

    throw new Error(
      `OpenSea API ${response.status}${
        body ? `: ${body}` : ""
      }`
    );
  }

  return response.json();
}

/* ==========================================================
   COLLECTION STATS
========================================================== */

export async function getCollectionStats(
  slug = OPENSEA_SLUG
) {
  if (!slug) {
    throw new Error(
      "OPENSEA_SLUG is missing."
    );
  }

  return get(
    `/collections/${encodeURIComponent(
      slug
    )}/stats`
  );
}

/* ==========================================================
   COLLECTION EVENTS
========================================================== */

export async function getCollectionEvents(
  slug = OPENSEA_SLUG,
  eventType:
    | "mint"
    | "sale"
    | "transfer"
    | "listing" = "mint"
) {
  if (!slug) {
    throw new Error(
      "OPENSEA_SLUG is missing."
    );
  }

  return get(
    `/events/collection/${encodeURIComponent(
      slug
    )}?event_type=${eventType}&limit=20`
  );
}

/* ==========================================================
   COLLECTION DETAILS
========================================================== */

export async function getCollection(
  slug: string
) {
  if (!slug) {
    throw new Error(
      "Collection slug is missing."
    );
  }

  return get(
    `/collections/${encodeURIComponent(
      slug
    )}`
  );
}

/* ==========================================================
   RESOLVE CONTRACT ADDRESS
========================================================== */

export async function getCollectionContract(
  slug: string
): Promise<string | null> {
  const data =
    await getCollection(slug);

  /*
   * OpenSea can return different shapes depending
   * on collection configuration / API response.
   *
   * Try the common locations.
   */

  const possibleValues = [
    data?.primary_asset_contracts?.[0]
      ?.address,

    data?.contracts?.[0]?.address,

    data?.contract_address,

    data?.primary_asset_contract?.address,
  ];

  for (const value of possibleValues) {
    if (
      typeof value === "string" &&
      /^0x[a-fA-F0-9]{40}$/.test(
        value
      )
    ) {
      return value;
    }
  }

  return null;
}

/* ==========================================================
   ACCOUNT NFTS
========================================================== */

export async function getAccountNFTs(
  address: string
) {
  if (
    !OPENSEA_API_KEY ||
    !OPENSEA_SLUG
  ) {
    return null;
  }

  return get(
    `/chain/${encodeURIComponent(
      OPENSEA_CHAIN
    )}/account/${encodeURIComponent(
      address
    )}/nfts?collection=${encodeURIComponent(
      OPENSEA_SLUG
    )}&limit=200`
  );
}
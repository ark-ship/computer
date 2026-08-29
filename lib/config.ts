export const CHAIN_ID = Number(
  process.env.NEXT_PUBLIC_CHAIN_ID ?? "4663"
);

export const CHAIN_HEX =
  process.env.NEXT_PUBLIC_CHAIN_HEX ??
  "0x1237";

export const RPC_URL =
  process.env.NEXT_PUBLIC_RPC_URL ??
  "https://rpc.mainnet.chain.robinhood.com";

export const NFT_CONTRACT =
  process.env.NEXT_PUBLIC_NFT_CONTRACT ?? "";

export const OPENSEA_SLUG =
  process.env.NEXT_PUBLIC_OPENSEA_SLUG ??
  "super-computers";

export const OPENSEA_CHAIN =
  process.env.OPENSEA_CHAIN ??
  "robinhood";

export const OPENSEA_API_KEY =
  process.env.OPENSEA_API_KEY ??
  "82a15a484e089dfbb314a41218ecc5f0";

export const BLOCKSCOUT_API_KEY =
  process.env.BLOCKSCOUT_API_KEY ?? "";

export const ALCHEMY_API_KEY =
  process.env.ALCHEMY_API_KEY ?? "alch_2sRTZkQGkXRUR_AOI7pft";

export const ALCHEMY_WEBHOOK_SECRET =
  process.env.ALCHEMY_WEBHOOK_SECRET ?? "whsec_UjFZIVomatnnWu4LBdYJCnb9";

export const ALCHEMY_NOTIFY_TOKEN =
  process.env.ALCHEMY_NOTIFY_TOKEN ?? "aeUwwqO3x2_UOOjB15wap-xayDXV9XNm";

  export const ALCHEMY_CONTRACT_VARIABLE =
  process.env.ALCHEMY_CONTRACT_VARIABLE ??
  "contractAddresses";

export function assertServerConfig() {
  if (!process.env.AUTH_SECRET) {
    throw new Error("AUTH_SECRET is missing");
  }

  if (!process.env.DATABASE_URL) {
    throw new Error("DATABASE_URL is missing");
  }

  if (!NFT_CONTRACT) {
    throw new Error(
      "NEXT_PUBLIC_NFT_CONTRACT is missing"
    );
  }

  if (!OPENSEA_API_KEY) {
    throw new Error(
      "OPENSEA_API_KEY is missing"
    );
  }
}
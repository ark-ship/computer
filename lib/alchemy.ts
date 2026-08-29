import {
  ALCHEMY_NOTIFY_TOKEN,
  ALCHEMY_CONTRACT_VARIABLE,
} from "./config";

const ALCHEMY_API =
  "https://dashboard.alchemy.com/api";

export async function addAlchemyContract(
  contractAddress: string
) {
  if (!ALCHEMY_NOTIFY_TOKEN) {
    throw new Error(
      "ALCHEMY_NOTIFY_TOKEN is missing."
    );
  }

  if (!/^0x[a-fA-F0-9]{40}$/.test(contractAddress)) {
    throw new Error(
      "Invalid contract address."
    );
  }

  const response = await fetch(
    `${ALCHEMY_API}/graphql/variables/${encodeURIComponent(
      ALCHEMY_CONTRACT_VARIABLE
    )}`,
    {
      method: "PATCH",

      headers: {
        "Content-Type":
          "application/json",
        "X-Alchemy-Token":
          ALCHEMY_NOTIFY_TOKEN,
      },

      body: JSON.stringify({
        add: [contractAddress],
      }),

      cache: "no-store",
    }
  );

  if (!response.ok) {
    const body =
      await response
        .text()
        .catch(() => "");

    throw new Error(
      `Alchemy variable update failed: ${response.status}${
        body ? ` ${body}` : ""
      }`
    );
  }

  return response.json().catch(
    () => ({})
  );
}
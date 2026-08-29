# Super Computers — REAL Next.js / TSX MVP

Dark, premium, pixel-art site for Super Computers on Robinhood Chain.

This version intentionally removes demo/localStorage-only behavior.

## What is real

### Wallet
Uses an injected EVM wallet and:
1. switches/adds Robinhood Chain,
2. requests the real wallet account,
3. asks the wallet to sign a real authentication message,
4. verifies the signature on the server,
5. sets an HTTP-only signed session cookie.

No private key is ever requested.

### Holder verification
The server reads the ERC-721 `balanceOf(address)` directly from Robinhood Chain.

The user cannot create worker tasks unless the wallet currently owns at least one NFT.

### Worker tasks
Tasks are stored in PostgreSQL, not localStorage.

Each task belongs to the authenticated wallet.

### Worker engine
`/api/worker` checks live data:

- Wallet Watcher -> Robinhood Chain Blockscout transactions
- Floor Watcher -> OpenSea collection stats
- Mint Watcher -> OpenSea mint events

Triggered events are persisted and can be sent to Telegram and/or Discord.

### Scheduled worker
`vercel.json` runs `/api/worker` every 5 minutes on Vercel.

You can also call it manually:

```bash
curl -H "x-cron-secret: YOUR_CRON_SECRET" \
  https://YOUR_DOMAIN/api/worker
```

## Setup

Create `.env.local` from `.env.example`.

Minimum production configuration:

```env
NEXT_PUBLIC_CHAIN_ID=4663
NEXT_PUBLIC_CHAIN_HEX=0x1237
NEXT_PUBLIC_RPC_URL=https://YOUR_ALCHEMY_ROBINHOOD_RPC
NEXT_PUBLIC_NFT_CONTRACT=0xYOUR_ERC721_CONTRACT

DATABASE_URL=postgresql://...
AUTH_SECRET=your_long_random_secret

OPENSEA_API_KEY=...
NEXT_PUBLIC_OPENSEA_SLUG=your-open-sea-slug
OPENSEA_CHAIN=robinhood

BLOCKSCOUT_API_KEY=...

CRON_SECRET=...
```

For production, use a provider RPC rather than relying on Robinhood's public RPC because the public endpoint is rate-limited. Robinhood's developer documentation recommends Alchemy for production infrastructure.

Optional alerts:

```env
TELEGRAM_BOT_TOKEN=...
TELEGRAM_CHAT_ID=...
DISCORD_WEBHOOK_URL=...
```

## Run

```bash
npm install
npm run dev
```

Open:

http://localhost:3000

## Important

The site can be deployed without adding a custom utility smart contract.
Your NFT only needs to exist as the ERC-721 collection.

The worker system is intentionally off-chain:
NFT ownership controls access, while tasks/data/alerts live in the application backend.

This is the simplest way to launch utility while keeping the mint contract on OpenSea standard.

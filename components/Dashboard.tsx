"use client";

import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import { ethers } from "ethers";

declare global {
  interface Window {
    ethereum?: ethers.Eip1193Provider;
  }
}

type TaskType = "wallet" | "floor" | "mint";

type Task = {
  id: string;
  type: TaskType;
  target: string;
  condition: string;
  active: boolean;
  last_checked_at?: string | null;
  last_triggered_at?: string | null;
  created_at?: string;
};

type EventItem = {
  id: string;
  task_id: string;
  message: string;
  created_at: string;
};

type NFTItem = {
  identifier: string;
  name?: string | null;
  image_url?: string | null;
  collection?: string | null;
};

const CHAIN_ID = 4663;
const CHAIN_HEX = "0x1237";

const NETWORK = {
  chainId: CHAIN_HEX,
  chainName: "Robinhood Chain",
  nativeCurrency: {
    name: "Ether",
    symbol: "ETH",
    decimals: 18,
  },
  rpcUrls: [
    process.env.NEXT_PUBLIC_RPC_URL ||
      "https://rpc.mainnet.chain.robinhood.com",
  ],
  blockExplorerUrls: [
    "https://robinhoodchain.blockscout.com",
  ],
};

function shortAddress(value: string) {
  return `${value.slice(0, 6)}...${value.slice(-4)}`;
}

function formatTime(value?: string | null) {
  if (!value) return "--:--";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "--:--";
  }

  return date.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });
}

function taskLabel(type: TaskType) {
  switch (type) {
    case "wallet":
      return "WALLET";

    case "floor":
      return "FLOOR";

    case "mint":
      return "MINT";
  }
}

function taskIcon(type: TaskType) {
  switch (type) {
    case "wallet":
      return "W";

    case "floor":
      return "F";

    case "mint":
      return "M";
  }
}

function normalizeImageUrl(
  value?: string | null
) {
  if (!value) {
    return null;
  }

  const image = String(value).trim();

  if (!image) {
    return null;
  }

  if (image.startsWith("ipfs://")) {
    return image.replace(
      "ipfs://",
      "https://ipfs.io/ipfs/"
    );
  }

  if (image.startsWith("ar://")) {
    return image.replace(
      "ar://",
      "https://arweave.net/"
    );
  }

  return image;
}

function normalizeNFTs(data: any): NFTItem[] {
  const source =
    data?.nfts?.nfts ??
    data?.nfts?.items ??
    data?.nfts ??
    [];

  if (!Array.isArray(source)) {
    return [];
  }

  return source
    .map((item: any): NFTItem | null => {
      const identifier = String(
        item?.identifier ??
          item?.token_id ??
          item?.tokenId ??
          item?.id ??
          ""
      );

      if (!identifier) {
        return null;
      }

      const image =
        item?.image_url ??
        item?.imageUrl ??
        item?.image ??
        item?.metadata?.image ??
        item?.metadata?.image_url ??
        null;

      const name =
        item?.name ??
        item?.metadata?.name ??
        `Computer #${identifier}`;

      const collection =
        item?.collection?.name ??
        item?.collection ??
        item?.token?.name ??
        null;

      return {
        identifier,
        name,
        image_url: normalizeImageUrl(
          image
        ),
        collection,
      };
    })
    .filter(
      (item): item is NFTItem =>
        item !== null
    );
}

export default function Dashboard() {
  const [wallet, setWallet] = useState("");
  const [balance, setBalance] = useState("0");

  const [tasks, setTasks] = useState<Task[]>([]);
  const [events, setEvents] =
    useState<EventItem[]>([]);

  const [nfts, setNfts] =
    useState<NFTItem[]>([]);

  const [selectedNFT, setSelectedNFT] =
    useState<NFTItem | null>(null);

  const [taskType, setTaskType] =
    useState<TaskType>("wallet");

  const [target, setTarget] = useState("");
  const [condition, setCondition] =
    useState("");

  const [loading, setLoading] = useState(false);
  const [taskLoading, setTaskLoading] =
    useState(false);

  const [error, setError] = useState("");

  const [networkReady, setNetworkReady] =
    useState(false);

  const [booted, setBooted] = useState(false);

  const [tab, setTab] = useState<
    "computer" | "signals" | "ai"
  >("computer");

  const activeCount = useMemo(
    () =>
      tasks.filter(
        (task) => task.active
      ).length,
    [tasks]
  );

  const workerState =
    !wallet
      ? "OFFLINE"
      : activeCount > 0
      ? "WORKING"
      : "IDLE";

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setBooted(true);
    }, 650);

    return () => {
      window.clearTimeout(timer);
    };
  }, []);

  async function ensureRobinhoodNetwork(
    provider: ethers.BrowserProvider
  ) {
    const current =
      await provider.send(
        "eth_chainId",
        []
      );

    if (
      String(current).toLowerCase() ===
      CHAIN_HEX
    ) {
      setNetworkReady(true);
      return;
    }

    try {
      await provider.send(
        "wallet_switchEthereumChain",
        [
          {
            chainId: CHAIN_HEX,
          },
        ]
      );
    } catch (switchError) {
      const code = Number(
        (switchError as any)?.code ?? 0
      );

      if (
        code !== 4902 &&
        code !== -32603
      ) {
        throw switchError;
      }

      await provider.send(
        "wallet_addEthereumChain",
        [NETWORK]
      );
    }

    const after =
      await provider.send(
        "eth_chainId",
        []
      );

    if (
      String(after).toLowerCase() !==
      CHAIN_HEX
    ) {
      throw new Error(
        `Switch wallet to Robinhood Chain (${CHAIN_ID}).`
      );
    }

    setNetworkReady(true);
  }

  async function connectWallet() {
    setError("");

    if (!window.ethereum) {
      setError(
        "NO EVM WALLET FOUND"
      );
      return;
    }

    try {
      setLoading(true);

      const provider =
        new ethers.BrowserProvider(
          window.ethereum
        );

      await ensureRobinhoodNetwork(
        provider
      );

      const accounts =
        await provider.send(
          "eth_requestAccounts",
          []
        );

      const address = accounts?.[0];

      if (!address) {
        throw new Error(
          "NO WALLET SELECTED"
        );
      }

      const challengeResponse =
        await fetch(
          "/api/auth/challenge",
          {
            method: "POST",
            headers: {
              "content-type":
                "application/json",
            },
            body: JSON.stringify({
              address,
            }),
          }
        );

      const challenge =
        await challengeResponse.json();

      if (
        !challengeResponse.ok
      ) {
        throw new Error(
          challenge.error ||
            "AUTH CHALLENGE FAILED"
        );
      }

      const signer =
        await provider.getSigner();

      const signature =
        await signer.signMessage(
          challenge.message
        );

      const verifyResponse =
        await fetch(
          "/api/auth/verify",
          {
            method: "POST",
            headers: {
              "content-type":
                "application/json",
            },
            body: JSON.stringify({
              address,
              message:
                challenge.message,
              signature,
            }),
          }
        );

      const verify =
        await verifyResponse.json();

      if (!verifyResponse.ok) {
        throw new Error(
          verify.error ||
            "SIGNATURE VERIFICATION FAILED"
        );
      }

      await loadAccount();
      await loadNFTs(address);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "CONNECT FAILED"
      );
    } finally {
      setLoading(false);
    }
  }

  async function loadAccount() {
    const response =
      await fetch("/api/me", {
        cache: "no-store",
      });

    const data =
      await response.json();

    if (!response.ok) {
      throw new Error(
        data.error ===
          "WALLET_DOES_NOT_OWN_COMPUTER"
          ? "WALLET HAS NO SUPER COMPUTER"
          : data.error ||
              "ACCOUNT LOAD FAILED"
      );
    }

    setWallet(data.wallet ?? "");
    setBalance(data.balance ?? "0");
    setTasks(data.tasks ?? []);
    setEvents(data.events ?? []);

    const ownedNFTs =
      normalizeNFTs(data);

    setNfts(ownedNFTs);

    setSelectedNFT((current) => {
      if (
        current &&
        ownedNFTs.some(
          (nft) =>
            nft.identifier ===
            current.identifier
        )
      ) {
        return current;
      }

      return ownedNFTs[0] ?? null;
    });
  }

  async function loadNFTs(
    address: string
  ) {
    try {
      const response =
        await fetch(
          `/api/nfts?address=${encodeURIComponent(
            address
          )}`,
          {
            cache: "no-store",
          }
        );

      const data =
        await response.json();

      if (!response.ok) {
        throw new Error(
          data.error ||
            "UNABLE TO LOAD COMPUTERS"
        );
      }

      const ownedNFTs =
        normalizeNFTs(data);

      setNfts(ownedNFTs);

      setSelectedNFT((current) => {
        if (
          current &&
          ownedNFTs.some(
            (nft) =>
              nft.identifier ===
              current.identifier
          )
        ) {
          return current;
        }

        return ownedNFTs[0] ?? null;
      });
    } catch (err) {
      console.error(
        "NFT loading failed:",
        err
      );
    }
  }

  async function disconnect() {
    try {
      await fetch(
        "/api/auth/logout",
        {
          method: "POST",
        }
      );
    } finally {
      setWallet("");
      setBalance("0");

      setTasks([]);
      setEvents([]);

      setNfts([]);
      setSelectedNFT(null);

      setNetworkReady(false);
      setError("");
    }
  }

  async function startWorker() {
    setError("");

    if (!wallet) {
      setError(
        "CONNECT YOUR COMPUTER FIRST"
      );
      return;
    }

    if (!selectedNFT) {
      setError(
        "SELECT A COMPUTER FIRST"
      );
      return;
    }

    if (
      !target.trim() ||
      !condition.trim()
    ) {
      setError(
        "TARGET AND CONDITION REQUIRED"
      );
      return;
    }

    try {
      setTaskLoading(true);

      const response =
        await fetch(
          "/api/tasks",
          {
            method: "POST",
            headers: {
              "content-type":
                "application/json",
            },
            body: JSON.stringify({
              type: taskType,
              target:
                target.trim(),
              condition:
                condition.trim(),
            }),
          }
        );

      const data =
        await response.json();

      if (!response.ok) {
        throw new Error(
          data.error ||
            "WORKER CREATION FAILED"
        );
      }

      setTarget("");
      setCondition("");

      await loadAccount();
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "WORKER CREATION FAILED"
      );
    } finally {
      setTaskLoading(false);
    }
  }

  async function toggleTask(
    task: Task
  ) {
    setError("");

    try {
      const response =
        await fetch(
          "/api/tasks",
          {
            method: "PATCH",
            headers: {
              "content-type":
                "application/json",
            },
            body: JSON.stringify({
              id: task.id,
              active:
                !task.active,
            }),
          }
        );

      const data =
        await response.json();

      if (!response.ok) {
        throw new Error(
          data.error ||
            "TASK UPDATE FAILED"
        );
      }

      await loadAccount();
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "TASK UPDATE FAILED"
      );
    }
  }

  async function deleteTask(
    id: string
  ) {
    setError("");

    try {
      const response =
        await fetch(
          `/api/tasks?id=${encodeURIComponent(
            id
          )}`,
          {
            method: "DELETE",
          }
        );

      const data =
        await response.json();

      if (!response.ok) {
        throw new Error(
          data.error ||
            "DELETE FAILED"
        );
      }

      await loadAccount();
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "DELETE FAILED"
      );
    }
  }

  useEffect(() => {
    fetch("/api/me", {
      cache: "no-store",
    })
      .then(async (response) => {
        if (!response.ok) {
          return null;
        }

        return response.json();
      })
      .then((data) => {
        if (!data) return;

        setWallet(data.wallet ?? "");
        setBalance(data.balance ?? "0");
        setTasks(data.tasks ?? []);
        setEvents(data.events ?? []);

        const ownedNFTs =
          normalizeNFTs(data);

        setNfts(ownedNFTs);

        setSelectedNFT(
          ownedNFTs[0] ?? null
        );

        if (data.wallet) {
          loadNFTs(
            data.wallet
          ).catch((error) => {
            console.error(
              "NFT session loading failed:",
              error
            );
          });
        }
      })
      .catch(() => {});
  }, []);

  if (!booted) {
    return (
      <div className="boot-screen">
        <div className="boot-box">

          <div className="boot-logo">
            <span />
            SUPER COMPUTERS
          </div>

          <div className="boot-lines">

            <div>
              &gt; INITIALIZING CORE...
            </div>

            <div>
              &gt; LOADING PIXEL OS...
            </div>

            <div>
              &gt; CONNECTING NETWORK...
            </div>

            <div className="boot-ready">
              &gt; READY_
            </div>

          </div>

        </div>
      </div>
    );
  }

  return (
    <div className="pixel-os">

      {/* ==================================================
          TOP BAR
      ================================================== */}

      <header className="os-topbar">

        <div className="os-brand">

          <Image
            src="/logo.png"
            alt="Super Computers"
            width={70}
            height={70}
            priority
            className="os-logo-image"
          />

          <span className="os-brand-name">
            SUPER COMPUTERS
          </span>

        </div>


        <div className="os-center">

          <span className="top-label">
            NETWORK
          </span>

          <span
            className={
              networkReady
                ? "top-value online"
                : "top-value"
            }
          >
            {networkReady
              ? "ONLINE"
              : "OFFLINE"}
          </span>

          <span className="top-separator">
            ::
          </span>

          <span className="top-label">
            CHAIN
          </span>

          <span className="top-value">
            RH / 4663
          </span>

        </div>


        <div className="os-account">

          {wallet ? (
            <>
              <span className="account-dot" />

              <span>
                {shortAddress(wallet)}
              </span>

              <button
                onClick={disconnect}
                className="tiny-button"
              >
                EXIT
              </button>
            </>
          ) : (
            <button
              className="wallet-button"
              onClick={connectWallet}
              disabled={loading}
            >
              {loading
                ? "CONNECTING..."
                : "CONNECT WALLET"}
            </button>
          )}

        </div>

      </header>


      {/* ==================================================
          DESKTOP
      ================================================== */}

      <main className="desktop">


        {/* ==================================================
            SIDEBAR
        ================================================== */}

        <aside className="sidebar">

          <div className="sidebar-title">
            MY COMPUTER
          </div>


          {/* ================================================
              SELECTED NFT
          ================================================= */}

          <div className="computer-mini">

            {selectedNFT?.image_url ? (

              <img
                src={selectedNFT.image_url}
                alt={
                  selectedNFT.name ??
                  "Super Computer"
                }
                className="owned-nft-image"
              />

            ) : (

              <div className="nft-placeholder">

                {wallet
                  ? "NO COMPUTER"
                  : "CONNECT"}

              </div>

            )}

          </div>


          {/* ================================================
              SELECTED NFT NAME
          ================================================= */}

          {selectedNFT && (

            <div className="selected-nft-info">

              <div className="selected-nft-label">
                SELECTED COMPUTER
              </div>

              <strong>
                {selectedNFT.name ??
                  `COMPUTER #${selectedNFT.identifier}`}
              </strong>

            </div>

          )}


          {/* ================================================
              NFT SELECTOR
          ================================================= */}

          {nfts.length > 0 && (

            <div className="nft-selector">

              <div className="nft-selector-title">
                MY COMPUTERS ({nfts.length})
              </div>

              <div className="nft-selector-grid">

                {nfts.map((nft) => {

                  const selected =
                    selectedNFT?.identifier ===
                    nft.identifier;

                  return (
                    <button
                      key={nft.identifier}
                      className={
                        selected
                          ? "nft-thumb selected"
                          : "nft-thumb"
                      }
                      onClick={() =>
                        setSelectedNFT(
                          nft
                        )
                      }
                      title={
                        nft.name ??
                        `Computer #${nft.identifier}`
                      }
                    >

                      {nft.image_url ? (

                        <img
                          src={nft.image_url}
                          alt={
                            nft.name ??
                            "Computer"
                          }
                        />

                      ) : (
                        <span>?</span>
                      )}

                    </button>
                  );
                })}

              </div>

            </div>

          )}


          {/* ================================================
              UNIT
          ================================================= */}

          <div className="sidebar-unit">

            <div>
              UNIT
            </div>

            <strong>
              {selectedNFT
                ? `SC-${String(
                    selectedNFT.identifier
                  ).padStart(4, "0")}`
                : "SC----"}
            </strong>

          </div>


          {/* ================================================
              MENU
          ================================================= */}

          <nav className="os-menu">

            <button
              className={
                tab === "computer"
                  ? "menu-active"
                  : ""
              }
              onClick={() =>
                setTab("computer")
              }
            >
              <span>▣</span>
              COMPUTER
            </button>


            <button
              className={
                tab === "signals"
                  ? "menu-active"
                  : ""
              }
              onClick={() =>
                setTab("signals")
              }
            >
              <span>◈</span>
              SIGNAL LOG
            </button>


            <button
              className={
                tab === "ai"
                  ? "menu-active menu-ai-soon"
                  : "menu-ai-soon"
              }
              onClick={() =>
                setTab("ai")
              }
            >
              <span>✦</span>

              AI

              <small>
                
              </small>
            </button>

          </nav>


          {/* ================================================
              STATS
          ================================================= */}

          <div className="sidebar-bottom">

            <div className="sidebar-stat">

              <span>
                SUPPLY
              </span>

              <strong>
                5,555
              </strong>

            </div>


            <div className="sidebar-stat">

              <span>
                OWNED
              </span>

              <strong>
                {wallet
                  ? balance
                  : "0"}
              </strong>

            </div>


            <div className="sidebar-stat">

              <span>
                WORKING
              </span>

              <strong className="lime">
                {wallet
                  ? activeCount
                  : "0"}
              </strong>

            </div>

          </div>

        </aside>


        {/* ==================================================
            MAIN WINDOW
        ================================================== */}

        <section className="os-window">

          <div className="window-titlebar">

            <div className="window-title">

              <span className="window-icon">
                ▣
              </span>

              {tab === "computer"
                ? "COMPUTER CONTROL"
                : tab === "signals"
                ? "SIGNAL LOG"
                : "AI SYSTEM"}

            </div>


            <div className="window-tools">

              <span>_</span>
              <span>□</span>
              <span>×</span>

            </div>

          </div>


          {/* ==================================================
              COMPUTER TAB
          ================================================== */}

          {tab === "computer" ? (

            <div className="window-body">


              <section className="worker-display">

                <div className="display-header">

                  <div>

                    <span>
                      PROCESS
                    </span>

                    <strong>
                      {workerState}
                    </strong>

                  </div>

                  <div className="display-time">
                    {new Date().toLocaleTimeString()}
                  </div>

                </div>


                <div className="display-screen">

                  <div className="pixel-grid" />


                  <div className="real-nft-display">

                    {selectedNFT?.image_url ? (

                      <img
                        src={
                          selectedNFT.image_url
                        }
                        alt={
                          selectedNFT.name ??
                          "Super Computer"
                        }
                        className="main-nft-image"
                      />

                    ) : (

                      <div className="main-nft-placeholder">

                        {wallet
                          ? "NO COMPUTER"
                          : "CONNECT WALLET"}

                      </div>

                    )}

                  </div>


                  <div className="display-footer">

                    <span>
                      CORE
                    </span>

                    <strong>
                      {wallet
                        ? "ACTIVE"
                        : "LOCKED"}
                    </strong>

                    <span>
                      COMPUTER
                    </span>

                    <strong>
                      {selectedNFT
                        ? `#${selectedNFT.identifier}`
                        : "--"}
                    </strong>

                    <span>
                      JOBS
                    </span>

                    <strong>
                      {wallet
                        ? tasks.length
                        : "0"}
                    </strong>

                  </div>

                </div>

              </section>


              {/* ==================================================
                  ASSIGNMENT
              ================================================== */}

              <section className="assignment">

                <div className="block-title">

                  <span>
                    NEW ASSIGNMENT
                  </span>

                  <small>
                    {wallet
                      ? "WORKER ONLINE"
                      : "LOCKED"}
                  </small>

                </div>


                <div className="assignment-grid">

                  <div className="job-picker">

                    <div className="field-label">
                      JOB TYPE
                    </div>


                    <div className="job-list">

                      {(
                        [
                          "wallet",
                          "floor",
                          "mint",
                        ] as TaskType[]
                      ).map(
                        (type) => (

                          <button
                            key={type}
                            className={
                              taskType ===
                              type
                                ? "job-selected"
                                : ""
                            }
                            onClick={() =>
                              setTaskType(
                                type
                              )
                            }
                          >

                            <span>
                              {taskIcon(
                                type
                              )}
                            </span>


                            <div>

                              <strong>
                                {taskLabel(
                                  type
                                )}
                              </strong>

                              <small>
                                {type ===
                                "wallet"
                                  ? "WATCH ADDRESS"
                                  : type ===
                                    "floor"
                                  ? "WATCH FLOOR"
                                  : "WATCH MINT"}
                              </small>

                            </div>

                          </button>

                        )
                      )}

                    </div>

                  </div>


                  <div className="assignment-form">

                    <div className="field-label">
                      TARGET
                    </div>


                    <input
                      value={target}
                      onChange={(event) =>
                        setTarget(
                          event.target.value
                        )
                      }
                      placeholder={
                        taskType ===
                        "wallet"
                          ? "0x..."
                          : "collection-slug"
                      }
                    />


                    <div className="field-label">
                      TRIGGER
                    </div>


                    <input
                      value={condition}
                      onChange={(event) =>
                        setCondition(
                          event.target.value
                        )
                      }
                      placeholder={
                        taskType ===
                        "wallet"
                          ? "ANY ACTIVITY"
                          : taskType ===
                            "floor"
                          ? "< 0.10"
                          : "NEW MINT"
                      }
                    />


                    <button
                      className="start-button"
                      onClick={
                        startWorker
                      }
                      disabled={
                        taskLoading
                      }
                    >
                      {taskLoading
                        ? "BOOTING WORKER..."
                        : "▶ START WORKER"}
                    </button>


                    {error && (

                      <div className="system-error">

                        ERROR:
                        <br />

                        {error}

                      </div>

                    )}

                  </div>

                </div>

              </section>


              {/* ==================================================
                  ACTIVE WORKERS
              ================================================== */}

              <section className="worker-list">

                <div className="block-title">

                  <span>
                    ACTIVE WORKERS
                  </span>

                  <small>
                    {activeCount} RUNNING
                  </small>

                </div>


                {tasks.length === 0 ? (

                  <div className="empty-worker">

                    <div className="empty-art">
                      [ _ _ ]
                    </div>

                    <strong>
                      YOUR COMPUTER
                      IS IDLE
                    </strong>

                    <p>
                      Assign a job and
                      let it work.
                    </p>

                  </div>

                ) : (

                  <div className="worker-rows">

                    {tasks.map(
                      (
                        task,
                        index
                      ) => (

                        <div
                          className="worker-row"
                          key={
                            task.id
                          }
                        >

                          <div className="row-number">

                            {String(
                              index + 1
                            ).padStart(
                              2,
                              "0"
                            )}

                          </div>


                          <div className="row-icon">

                            {taskIcon(
                              task.type
                            )}

                          </div>


                          <div className="row-main">

                            <div className="row-name">

                              {taskLabel(
                                task.type
                              )}{" "}
                              WATCHER

                              <span
                                className={
                                  task.active
                                    ? "status-live"
                                    : "status-paused"
                                }
                              >
                                {task.active
                                  ? "● WORKING"
                                  : "○ PAUSED"}
                              </span>

                            </div>


                            <div className="row-target">
                              {task.target}
                            </div>


                            <div className="row-condition">

                              WHEN:
                              {" "}
                              {task.condition}

                            </div>

                          </div>


                          <div className="row-check">

                            <small>
                              LAST CHECK
                            </small>

                            <span>
                              {formatTime(
                                task.last_checked_at
                              )}
                            </span>

                          </div>


                          <div className="row-actions">

                            <button
                              onClick={() =>
                                toggleTask(
                                  task
                                )
                              }
                            >
                              {task.active
                                ? "II"
                                : "▶"}
                            </button>


                            <button
                              onClick={() =>
                                deleteTask(
                                  task.id
                                )
                              }
                            >
                              X
                            </button>

                          </div>

                        </div>

                      )
                    )}

                  </div>

                )}

              </section>

            </div>

          ) : tab === "signals" ? (

            /* ==================================================
               SIGNAL LOG
            ================================================== */

            <div className="signal-window">

              <div className="block-title">

                <span>
                  SIGNAL HISTORY
                </span>

                <small>
                  {events.length}
                  {" "}
                  EVENTS
                </small>

              </div>


              {events.length === 0 ? (

                <div className="empty-worker">

                  <div className="empty-art">
                    NO SIGNAL
                  </div>

                  <strong>
                    NOTHING DETECTED
                  </strong>

                  <p>
                    Worker events will
                    appear here.
                  </p>

                </div>

              ) : (

                <div className="signal-history">

                  {events.map(
                    (event) => (

                      <div
                        className="signal-item"
                        key={
                          event.id
                        }
                      >

                        <div className="signal-bullet">
                          ●
                        </div>

                        <div>

                          <small>
                            {formatTime(
                              event.created_at
                            )}
                          </small>

                          <pre>
                            {event.message}
                          </pre>

                        </div>

                      </div>

                    )
                  )}

                </div>

              )}

            </div>

          ) : (

            /* ==================================================
               AI SOON
            ================================================== */

            <div className="ai-soon-window">

              <div className="block-title">

                <span>
                  AI SYSTEM
                </span>

                <small>
                  SOON
                </small>

              </div>


              <div className="ai-soon-content">

  <div className="ai-symbol">
    ✦
  </div>

  <div className="ai-title">
    AI WORKER
  </div>

  <div className="ai-status">
    SYSTEM UNDER DEVELOPMENT
  </div>

  <p>
    Your Computer will soon be able
    to use AI assisted workers.
  </p>

  <div className="ai-progress">
    <span />
    <span />
    <span />
    <span />
    <span />
    <span />
    <span />
    <span />
  </div>

  <div className="ai-soon-label">
    COMING SOON
  </div>

</div>

            </div>

          )}

        </section>

      </main>


      {/* ==================================================
          FOOTER
      ================================================== */}

      <footer className="os-footer">

        <span>
          SUPER COMPUTERS OS v1.0
        </span>

        <span>
          5,555 UNITS
        </span>

      </footer>

    </div>
  );
}
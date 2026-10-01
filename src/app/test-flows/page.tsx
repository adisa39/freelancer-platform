"use client";

import { useState } from "react";
import { ethers } from "ethers";

const INTERLINK_RPC =
  "https://evm-rpc.test-net.interlinklabs.ai/v1";

const CHAIN_ID = 19042026;

type Step =
  | "idle"
  | "connecting"
  | "challenge"
  | "signing"
  | "verifying"
  | "authenticated"
  | "rpc"
  | "error";

type JsonObject = Record<string, unknown>;

declare global {
  interface Window {
    ethereum?: {
      request(args: { method: string; params?: unknown[] }): Promise<unknown>;
    };
  }
}

function getErrorMessage(error: unknown, fallback: string): string {
  return error instanceof Error ? error.message : fallback;
}

function asObject(value: unknown): JsonObject | null {
  return typeof value === "object" && value !== null
    ? (value as JsonObject)
    : null;
}

export default function HomePage() {
  const [step, setStep] = useState<Step>("idle");

  const [walletAddress, setWalletAddress] = useState("");
  const [challenge, setChallenge] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [balance, setBalance] = useState("");
  const [error, setError] = useState("");

  /*
   * ---------------------------------------------------------
   * 1. CONNECT WALLET
   * ---------------------------------------------------------
   *
   * IMPORTANT:
   * This assumes an EIP-1193-compatible injected wallet
   * such as window.ethereum.
   *
   * The Interlink PDF does NOT confirm that Interlink uses
   * window.ethereum, so this is the piece we may need to
   * change once Interlink wallet documentation is available.
   */
  async function connectWallet() {
    try {
      setError("");
      setStep("connecting");

      const ethereum = window.ethereum;

      if (!ethereum) {
        throw new Error(
          "No browser wallet detected. Install/connect the Interlink-compatible wallet."
        );
      }

      // Ask wallet for the user's public address
      const accounts = await ethereum.request({
        method: "eth_requestAccounts",
      });

      if (!Array.isArray(accounts) || typeof accounts[0] !== "string") {
        throw new Error("No wallet account returned.");
      }

      const address = ethers.getAddress(accounts[0]);

      setWalletAddress(address);

      /*
       * Make sure the wallet is connected to ITL Testnet.
       *
       * The network details come from the supplied document:
       * Chain ID: 19042026
       */
      const currentChainId = await ethereum.request({
        method: "eth_chainId",
      });

      if (typeof currentChainId !== "string" || Number.parseInt(currentChainId, 16) !== CHAIN_ID) {
        throw new Error(
          `Wrong network. Please switch the wallet to ITL Testnet (Chain ID ${CHAIN_ID}).`
        );
      }

      await getChallenge(address);
    } catch (err: unknown) {
      setStep("error");
      setError(getErrorMessage(err, "Wallet connection failed."));
    }
  }

  /*
   * ---------------------------------------------------------
   * 2. REQUEST SIWE CHALLENGE
   * ---------------------------------------------------------
   *
   * According to the PDF:
   *
   * POST /v1/auth/challenge
   *
   * The EXACT request/response schema is not included in the PDF.
   *
   * Therefore this is the part you may need to adjust to
   * Interlink's actual API response format.
   */
  async function getChallenge(address: string) {
  try {
    setStep("challenge");
    setError("");

    const url = `${INTERLINK_RPC}/auth/challenge`;

    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        walletAddress: address,
        chainId: String(CHAIN_ID),
      }),
    });

    const rawBody = await response.text();
    const data = asObject(JSON.parse(rawBody));
    if (!data) throw new Error("Interlink returned an invalid challenge response.");

    if (!response.ok) {
      let message: string;

      if (typeof data === "string") {
        message = data;
      } else {
        message = JSON.stringify(
          data,
          null,
          2
        );
      }

      throw new Error(
        `Interlink challenge failed (${response.status}):\n${message}`
      );
    }

    const result = asObject(data.result);
    const challengeId = result?.challengeId;
    const messageToSign = result?.messageToSign;

    if (typeof challengeId !== "string" || typeof messageToSign !== "string") {
      throw new Error(
        "Interlink returned a successful response, but challengeId or messageToSign is missing:\n" +
          JSON.stringify(data, null, 2)
      );
    }

    setChallenge(messageToSign);

    await signChallenge(
      address,
      messageToSign,
      challengeId
    );

  } catch (err: unknown) {
    setStep("error");
    setError(getErrorMessage(err, "Could not obtain Interlink challenge."));
  }
}

  /*
   * ---------------------------------------------------------
   * 3. SIGN CHALLENGE
   * ---------------------------------------------------------
   *
   * The PRIVATE KEY stays inside the wallet.
   *
   * The application asks the wallet to sign the message.
   */
  async function signChallenge(
    address: string,
    message: string,
    challengeId: string
  ) {
    try {
      setStep("signing");
      setError("");

      const ethereum = window.ethereum;

      if (!ethereum) {
        throw new Error("Wallet is not available.");
      }

      const messageBytes = ethers.toUtf8Bytes(message);
      const signature = await ethereum.request({
        method: "personal_sign",
        params: [
          ethers.hexlify(messageBytes),
          address,
        ],
      });

      if (typeof signature !== "string") throw new Error("Wallet returned an invalid signature.");

      await verifySignature(
        address, 
        message, 
        signature,
        challengeId
      );
    } catch (err: unknown) {
      setStep("error");
      setError(getErrorMessage(err, "Wallet signing failed."));
    }
  }

  /*
   * ---------------------------------------------------------
   * 4. VERIFY SIGNATURE
   * ---------------------------------------------------------
   *
   * POST /v1/auth/verify
   */
  async function verifySignature(
    address: string,
    message: string,
    signedMessage: string,
    challengeId: string
  ) {
    try {
      setStep("verifying");

      const response = await fetch(`${INTERLINK_RPC}/auth/verify`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          walletAddress: address,
          challengeId,
          message,
          signature: signedMessage,
          chainId: String(CHAIN_ID),
        }),
      });

      const rawBody = await response.text();

      let data: unknown;

      try {
        data = JSON.parse(rawBody);
      } catch {
        data = rawBody;
      }

      const info =
        typeof data === "string"
          ? data
          : JSON.stringify(data, null, 2)

      if (!response.ok) {
        throw new Error(
          `Signature verification failed: HTTP ${response.status}:\n${info}`
        );
      }

      const result = asObject(asObject(data)?.result);
      const token = result?.accessToken;

      if (typeof token !== "string" || !token) {
        throw new Error(
          `Verification succeeded but no access token was found in the response ${response.status}.`
        );
      }

      setIsAuthenticated(true);
      setStep("authenticated");

      // Immediately test the authenticated RPC.
      await getBalance(address, token);
    } catch (err: unknown) {
      setStep("error");
      setError(getErrorMessage(err, "Signature verification failed."));
    }
  }

  /*
   * ---------------------------------------------------------
   * 5. AUTHENTICATED RPC
   * ---------------------------------------------------------
   *
   * The PDF says:
   *
   * Authorization: Bearer <accessToken>
   *
   * and RPC calls go to:
   *
   * /v1/rpc
   */
  async function getBalance(
    address: string,
    token: string
  ) {
    try {
      setStep("rpc");

      const response = await fetch(
        `${INTERLINK_RPC}/rpc`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            jsonrpc: "2.0",
            id: 1,
            method: "eth_getBalance",
            params: [address, "latest"],
          }),
        }
      );

      if (!response.ok) {
        throw new Error(
          `RPC request failed: HTTP ${response.status}`
        );
      }

      const data = asObject(await response.json());
      if (!data) throw new Error("RPC returned an invalid response.");

      const rpcError = asObject(data.error);
      if (rpcError) {
        throw new Error(
          typeof rpcError.message === "string" ? rpcError.message : "RPC error"
        );
      }

      if (typeof data.result !== "string" || !/^0x[\da-f]+$/i.test(data.result)) {
        throw new Error("RPC returned an invalid balance value.");
      }

      setBalance(ethers.formatEther(BigInt(data.result)));

      setStep("authenticated");
    } catch (err: unknown) {
      setStep("error");
      setError(getErrorMessage(err, "Authenticated RPC call failed."));
    }
  }

  /*
   * ---------------------------------------------------------
   * UI
   * ---------------------------------------------------------
   */

  const steps = [
    ["connecting", "Connect wallet"],
    ["challenge", "Get Interlink challenge"],
    ["signing", "Sign challenge"],
    ["verifying", "Verify signature"],
    ["authenticated", "Receive access token"],
    ["rpc", "Call authenticated RPC"],
  ];

  return (
    <main
      style={{
        maxWidth: 800,
        margin: "40px auto",
        padding: 24,
        fontFamily: "Arial, sans-serif",
      }}
    >
      <h1>FreelancerApp × Interlink Testnet</h1>

      <p>
        Simple proof-of-concept for the complete wallet
        authentication flow.
      </p>

      <hr />

      <section style={{ marginTop: 30 }}>
        <h2>1. Wallet</h2>

        <button
          onClick={connectWallet}
          disabled={
            step !== "idle" &&
            step !== "error"
          }
          className="rounded-md"
          style={{
            padding: "12px 20px",
            backgroundColor:"blue",
            color: "white",
            cursor: "pointer",
          }}
        >
          Connect Wallet
        </button>

        {walletAddress && (
          <p>
            <strong>Wallet:</strong>{" "}
            {walletAddress}
          </p>
        )}
      </section>

      <section style={{ marginTop: 30 }}>
        <h2>2. Flow</h2>

        <ol>
          {steps.map(([key, label]) => (
            <li key={key} style={{ marginBottom: 10 }}>
              {label}{" "}
              {step === key ? "← CURRENT" : ""}
            </li>
          ))}
        </ol>
      </section>

      <section style={{ marginTop: 30 }}>
        <h2>3. Challenge</h2>

        {challenge ? (
          <pre
            style={{
              background: "#f4f4f4",
              color: "black",
              padding: 15,
              overflow: "auto",
            }}
          >
            {challenge}
          </pre>
        ) : (
          <p>Waiting for challenge...</p>
        )}
      </section>

      <section style={{ marginTop: 30 }}>
        <h2>4. Signature</h2>

        <p>
          The wallet signature is sent directly for verification and is not displayed.
        </p>
      </section>

      <section style={{ marginTop: 30 }}>
        <h2>5. Authentication</h2>

        {isAuthenticated ? (
          <p>
            ✅ Interlink authentication successful.
          </p>
        ) : (
          <p>
            Waiting for signature verification...
          </p>
        )}
      </section>

      <section style={{ marginTop: 30 }}>
        <h2>6. Authenticated RPC</h2>

        {balance ? (
          <p>
            <strong>tITL Balance:</strong>{" "}
            {balance} tITL
          </p>
        ) : (
          <p>
            Waiting for authenticated RPC call...
          </p>
        )}
      </section>

      {error && (
        <section
          style={{
            marginTop: 30,
            padding: 20,
            color: "black",
            background: "#ffecec",
            border: "1px solid #ffaaaa",
            borderRadius: 8,
          }}
        >
            <h3>Interlink Error</h3>

            <pre
            style={{
                whiteSpace: "pre-wrap",
                wordBreak: "break-word",
            }}
            >
            {error}
            </pre>

            <button
            onClick={() => {
                setError("");
                setStep("idle");
            }}
            style={{
                marginTop: 10,
                background: "red",
                color: "white",
                padding: "8px 14px",
            }}
            >
            Reset
            </button>
        </section>
      )}
    </main>
  );
}

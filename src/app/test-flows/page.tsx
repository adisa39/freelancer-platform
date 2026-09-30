"use client";

import { useState } from "react";

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

export default function HomePage() {
  const [step, setStep] = useState<Step>("idle");

  const [walletAddress, setWalletAddress] = useState("");
  const [challenge, setChallenge] = useState("");
  const [signature, setSignature] = useState("");
  const [accessToken, setAccessToken] = useState("");
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

      const ethereum = (window as any).ethereum;

      if (!ethereum) {
        throw new Error(
          "No browser wallet detected. Install/connect the Interlink-compatible wallet."
        );
      }

      // Ask wallet for the user's public address
      const accounts = await ethereum.request({
        method: "eth_requestAccounts",
      });

      if (!accounts?.length) {
        throw new Error("No wallet account returned.");
      }

      const address = accounts[0];

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

      console.log("Wallet chain:", currentChainId);

      if (parseInt(currentChainId, 16) !== CHAIN_ID) {
        throw new Error(
          `Wrong network. Please switch the wallet to ITL Testnet (Chain ID ${CHAIN_ID}).`
        );
      }

      await getChallenge(address);
    } catch (err: any) {
      setStep("error");
      setError(err?.message || "Wallet connection failed.");
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

        const requestBody = {
        address,
        };

        console.log("=== INTERLINK CHALLENGE REQUEST ===");
        console.log("URL:", url);
        console.log("Method:", "POST");
        console.log("Body:", requestBody);

        const response = await fetch(url, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
        },
        body: JSON.stringify(requestBody),
        });

        /*
        * Read the body regardless of whether the request succeeded.
        * This is important because HTTP 400 responses often contain
        * the actual validation/error message.
        */
        const rawBody = await response.text();

        console.log("=== INTERLINK CHALLENGE RESPONSE ===");
        console.log("HTTP Status:", response.status);
        console.log("Status Text:", response.statusText);
        console.log(
        "Headers:",
        Object.fromEntries(response.headers.entries())
        );
        console.log("Raw Body:", rawBody);

        let data: any = null;

        try {
        data = rawBody ? JSON.parse(rawBody) : null;
        } catch {
        console.log(
            "Response body is not JSON."
        );
        }

        console.log("Parsed Body:", data);

        if (!response.ok) {
        /*
        * Try to extract as much useful information as possible.
        */
        const serverMessage =
            data?.message ||
            data?.error ||
            data?.error?.message ||
            data?.detail ||
            data?.details ||
            data?.data?.message ||
            rawBody ||
            response.statusText;

        throw new Error(
            `Interlink challenge failed (${response.status}): ${serverMessage}`
        );
        }

        /*
        * Log successful response too.
        */
        console.log(
        "=== CHALLENGE SUCCESS ===",
        data
        );

        /*
        * We still don't know the exact Interlink response schema
        * from the PDF, so inspect the actual response.
        */
        const message =
        data?.challenge ||
        data?.message ||
        data?.data?.challenge ||
        data?.data?.message;

        if (!message) {
        throw new Error(
            `Challenge request succeeded, but no challenge/message was found. Raw response: ${rawBody}`
        );
        }

        setChallenge(message);

        await signChallenge(address, message);
    } catch (err: any) {
        console.error(
        "=== CHALLENGE ERROR ===",
        err
        );

        setStep("error");

        setError(
        err?.message ||
            "Could not obtain Interlink challenge."
        );
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
    message: string
  ) {
    try {
      setStep("signing");

      const ethereum = (window as any).ethereum;

      if (!ethereum) {
        throw new Error("Wallet is not available.");
      }

      /*
       * Personal-sign is used here as an illustrative
       * EIP-1193 wallet signing call.
       *
       * IMPORTANT:
       * Interlink's PDF says "sign the SIWE challenge",
       * but does not specify the exact wallet signing method.
       * Their documentation may require eth_signTypedData_v4
       * or another SIWE-specific implementation.
       */
      const signedMessage = await ethereum.request({
        method: "personal_sign",
        params: [message, address],
      });

      console.log("Signature:", signedMessage);

      setSignature(signedMessage);

      await verifySignature(
        address,
        message,
        signedMessage
      );
    } catch (err: any) {
      setStep("error");
      setError(
        err?.message ||
          "Signing failed or the user rejected the wallet request."
      );
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
    signedMessage: string
  ) {
    try {
      setStep("verifying");

      const response = await fetch(
        `${INTERLINK_RPC}/auth/verify`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            address,
            message,
            signature: signedMessage,
          }),
        }
      );

      if (!response.ok) {
        throw new Error(
          `Signature verification failed: HTTP ${response.status}`
        );
      }

      const data = await response.json();

      console.log("Verify response:", data);

      /*
       * Again, the PDF does not provide the exact JSON
       * response schema.
       */
      const token =
        data.accessToken ||
        data.access_token ||
        data.data?.accessToken ||
        data.data?.access_token;

      if (!token) {
        throw new Error(
          "Verification succeeded but no access token was found in the response."
        );
      }

      setAccessToken(token);
      setStep("authenticated");

      /*
       * Immediately test the authenticated RPC.
       */
      await getBalance(address, token);
    } catch (err: any) {
      setStep("error");
      setError(
        err?.message || "Signature verification failed."
      );
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

      const data = await response.json();

      console.log("RPC response:", data);

      if (data.error) {
        throw new Error(
          data.error.message || "RPC error"
        );
      }

      const balanceWei = BigInt(data.result);

      /*
       * tITL uses 18 decimals according to the PDF.
       */
      const balanceITL =
        Number(balanceWei) / 1e18;

      setBalance(balanceITL.toString());

      setStep("authenticated");
    } catch (err: any) {
      setStep("error");
      setError(
        err?.message || "Authenticated RPC call failed."
      );
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
          style={{
            padding: "12px 20px",
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

        {signature ? (
          <pre
            style={{
              background: "#f4f4f4",
              padding: 15,
              overflow: "auto",
              wordBreak: "break-all",
            }}
          >
            {signature}
          </pre>
        ) : (
          <p>
            The wallet signature will appear here after
            the user approves the signing request.
          </p>
        )}
      </section>

      <section style={{ marginTop: 30 }}>
        <h2>5. Authentication</h2>

        {accessToken ? (
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
import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import axios from "axios";
import fs from "fs";
import crypto from "crypto";

const app = express();
app.use(cors());
app.use(express.json());

/* =====================================================
   SOURCE CREDIBILITY DATABASE
===================================================== */

let sourceDB = {};
try {
  sourceDB = JSON.parse(fs.readFileSync("./Credibility_Scores.json", "utf-8"));
  console.log("✅ Source DB loaded");
} catch {
  console.warn("⚠️ Source DB missing, defaulting to neutral");
}

/* =====================================================
   IN-MEMORY STORES
===================================================== */

const lifecycleStore = new Map(); // articleHash → lifecycle
const mintedNFTs = new Map();     // articleHash → nft data

/* =====================================================
   HELPERS
===================================================== */

const getDomain = (url) => {
  try {
    return new URL(url).hostname.replace("www.", "");
  } catch {
    return null;
  }
};

const computeLengthScore = (text) => {
  const wc = text.split(/\s+/).length;
  if (wc < 20) return 0.3;
  if (wc < 100) return 0.7;
  return 1.0;
};

const credibilityLabel = (score) => {
  if (score >= 0.7) return "HIGH_CREDIBILITY";
  if (score <= 0.45) return "LOW_CREDIBILITY";
  return "UNCERTAIN";
};

/* =====================================================
   VERIFY NEWS (CORE ENGINE)
===================================================== */

app.post("/api/verify-news", async (req, res) => {
  try {
    const { content, sourceUrl = "" } = req.body;
    if (!content) {
      return res.status(400).json({ error: "Content required" });
    }

    const articleHash = crypto
      .createHash("sha256")
      .update(content)
      .digest("hex");

    /* ---------- ML SERVICE ---------- */
    const ml = await axios.post("http://127.0.0.1:8000/verify", {
      text: content,
    });

    const probability = ml.data?.probability ?? 0.5;
    const emi = ml.data?.emotional_manipulation?.emi_score ?? 0;
    const certaintyRaw = ml.data?.linguistic_certainty?.certainty_ratio ?? 0;
    const certainty = certaintyRaw > 0.7 ? certaintyRaw : 0;

    /* ---------- SOURCE + CONTEXT ---------- */
    const domain = getDomain(sourceUrl);
    const sourceScore = domain
      ? sourceDB[domain]?.credibility_score ?? 0.45
      : 0.5;

    const lengthScore = computeLengthScore(content);

    /* ---------- LIFECYCLE TRACKING ---------- */
    const now = new Date().toISOString();

    if (!lifecycleStore.has(articleHash)) {
      lifecycleStore.set(articleHash, {
        firstVerifiedAt: now,
        lastVerifiedAt: now,
        verificationCount: 1,
      });
    } else {
      const entry = lifecycleStore.get(articleHash);
      entry.lastVerifiedAt = now;
      entry.verificationCount += 1;
    }

    const lifecycle = lifecycleStore.get(articleHash);
    const stability = lifecycle.verificationCount >= 2 ? 1 : 0.5;

    /* =====================================================
       TRUST SCORE FORMULA (UNCHANGED)
    ===================================================== */

    let trustScore =
      0.45 * probability +
      0.15 * sourceScore +
      0.15 * lengthScore +
      0.15 * stability -
      0.07 * emi -
      0.03 * certainty;

    trustScore = Math.max(0, Math.min(trustScore, 1));

    /* =====================================================
       🔥 CONFIDENCE COMPONENT BREAKDOWN (FIX)
    ===================================================== */

    const confidenceComponents = {
      mlProbability: Number((probability * 0.45 * 100).toFixed(2)),
      sourceCredibility: Number((sourceScore * 0.15 * 100).toFixed(2)),
      contextLength: Number((lengthScore * 0.15 * 100).toFixed(2)),
      stability: Number((stability * 0.15 * 100).toFixed(2)),
      emotionalPenalty: Number((-emi * 0.07 * 100).toFixed(2)),
      certaintyPenalty: Number((-certainty * 0.03 * 100).toFixed(2)),
    };

    /* =====================================================
       RESPONSE
    ===================================================== */

    res.json({
      articleHash,
      trustScore: Number(trustScore.toFixed(3)),
      credibility: credibilityLabel(trustScore),
      eligibleForNFT: trustScore >= 0.5,

      lifecycle: {
        ...lifecycle,
        isStable: lifecycle.verificationCount >= 2,
      },

      confidenceComponents,
    });
  } catch (err) {
    console.error("❌ Verification error:", err.message);
    res.status(500).json({ error: "Verification failed" });
  }
});

/* =====================================================
   NFT MINT (OPTIONAL / PAID FEATURE)
===================================================== */

app.post("/api/mint-nft", async (req, res) => {
  try {
    const { articleHash } = req.body;

    if (!lifecycleStore.has(articleHash)) {
      return res.status(404).json({ error: "Article not verified" });
    }

    if (mintedNFTs.has(articleHash)) {
      return res.json(mintedNFTs.get(articleHash));
    }

    // 🔒 Since Verbwire minting is paid,
    // we return a simulated on-chain proof for demo
    const lifecycle = lifecycleStore.get(articleHash);

    const nft = {
      ipfsCid: "SIMULATED_IPFS_" + articleHash.slice(0, 8),
      tokenId: Math.floor(Math.random() * 100000),
      transactionHash: "0xSIMULATED_" + articleHash.slice(0, 12),
      firstVerifiedAt: lifecycle.firstVerifiedAt,
      lastVerifiedAt: lifecycle.lastVerifiedAt,
      verificationCount: lifecycle.verificationCount,
    };

    mintedNFTs.set(articleHash, nft);
    res.json(nft);
  } catch (err) {
    console.error("❌ NFT mint error:", err.message);
    res.status(500).json({ error: "NFT mint failed" });
  }
});

/* =====================================================
   SERVER
===================================================== */

app.listen(5000, () =>
  console.log("🚀 TrustMint backend running (analysis + lifecycle + NFT-ready)")
);

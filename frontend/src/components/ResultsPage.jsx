import { Header } from "./Header";
import { Button } from "./ui/button";
import { Progress } from "./ui/progress";
import {
  Dialog,
  DialogContent,
  DialogTrigger
} from "./ui/dialog";
import { useLocation, useNavigate } from "react-router-dom";

export function ResultsPage() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const newspaperTexture = "https://images.unsplash.com/photo-1649433540410-eb607ff25bd5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxvbGQlMjBuZXdzcGFwZXIlMjBiYWNrZ3JvdW5kfGVufDF8fHx8MTc2NzA3OTMyNHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral";

  if (!state) {
    navigate("/");
    return null;
  }

  const {
    probabilityReal,
    ipfsCid,
    transactionHash,
    tokenId
  } = state;

  // 🟢 TRUST BUCKET LOGIC
  let trustLevel = "";
  let labelText = "";
  let badgeColor = "";
  let progressValue = 0;

  if (probabilityReal < 0.3) {
    trustLevel = "LOW";
    labelText = "LIKELY FAKE";
    badgeColor = "bg-red-600";
    progressValue = 25;
  } else if (probabilityReal < 0.6) {
    trustLevel = "MEDIUM";
    labelText = "UNCERTAIN";
    badgeColor = "bg-yellow-500";
    progressValue = 50;
  } else {
    trustLevel = "HIGH";
    labelText = "LIKELY REAL";
    badgeColor = "bg-green-600";
    progressValue = 85;
  }

  const nftEligible = trustLevel === "HIGH";

  return (
    <div className="min-h-screen bg-white relative">
      {/* Newspaper Background */}
      <div
        className="fixed inset-0 bg-cover bg-center opacity-50 z-0"
        style={{ backgroundImage: `url(${newspaperTexture})` }}
      />

      {/* Content */}
      <div className="relative z-10">
        <Header />

        <main className="pt-24 px-6 max-w-4xl mx-auto space-y-8">

          {/* RESULT BADGE */}
          <div className={`h-20 flex items-center justify-center text-white text-3xl ${badgeColor}`}>
            {labelText}
          </div>

          {/* TRUST LEVEL */}
          <div className="border p-6">
            <h3 className="text-xl mb-2">Trust Level</h3>
            <Progress value={progressValue} />
            <p className="mt-2">
              <b>{trustLevel}</b> confidence
            </p>
            <p className="text-sm text-gray-500">
              (AI probability: {(probabilityReal * 100).toFixed(1)}%)
            </p>
          </div>

          {/* NFT SECTION */}
          {nftEligible ? (
            <Dialog>
              <DialogTrigger asChild>
                <Button className="w-full">Mint Trusted NFT</Button>
              </DialogTrigger>

              <DialogContent>
                <h3 className="text-xl font-bold mb-4">Trusted Content NFT</h3>

                <p><b>IPFS CID:</b> {ipfsCid}</p>
                <p><b>Transaction Hash:</b> {transactionHash}</p>
                <p><b>Token ID:</b> {tokenId}</p>

                <div className="flex gap-4 mt-4">
                  <Button
                    onClick={() =>
                      window.open(`https://ipfs.io/ipfs/${ipfsCid}`, "_blank")
                    }
                  >
                    View Metadata
                  </Button>

                  <Button
                    variant="outline"
                    onClick={() =>
                      window.open(
                        `https://polygonscan.com/tx/${transactionHash}`,
                        "_blank"
                      )
                    }
                  >
                    View on Blockchain
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          ) : (
            <Button disabled className="w-full">
              Not Eligible for NFT Certification
            </Button>
          )}

          <Button variant="outline" onClick={() => navigate("/verify")}>
            Verify Another
          </Button>

        </main>
      </div>
    </div>
  );
}
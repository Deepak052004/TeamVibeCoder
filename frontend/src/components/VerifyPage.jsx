import { Header } from "./Header";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export function VerifyPage() {
  const navigate = useNavigate();
  const newspaperTexture = "https://images.unsplash.com/photo-1649433540410-eb607ff25bd5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxvbGQlMjBuZXdzcGFwZXIlMjBiYWNrZ3JvdW5kfGVufDF8fHx8MTc2NzA3OTMyNHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral";

  const [url, setUrl] = useState("");
  const [headline, setHeadline] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const content = headline || url;

    if (!content || content.length < 15) {
      alert("Please enter a valid URL or headline");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("http://localhost:5000/api/verify-news", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content })
      });

      const data = await res.json();
      navigate("/results", { state: data });
    } catch {
      alert("Verification failed");
    } finally {
      setLoading(false);
    }
  };

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

        <main className="pt-24 px-6 flex justify-center">
          <form onSubmit={handleSubmit} className="w-full max-w-2xl space-y-6">
            <h2 className="text-4xl text-center">Verify News</h2>

            <Input
              placeholder="Enter News URL (optional)"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
            />

            <Input
              placeholder="Enter Headline"
              value={headline}
              onChange={(e) => setHeadline(e.target.value)}
            />

            <Button className="w-full" disabled={loading} type="submit">
              {loading ? "Verifying..." : "Verify"}
            </Button>
          </form>
        </main>
      </div>
    </div>
  );
}
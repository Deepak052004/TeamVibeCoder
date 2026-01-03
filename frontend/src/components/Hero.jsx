import { Button } from "./ui/button";
import { Link } from "react-router-dom";

export function Hero({ backgroundImage }) {
  return (
    <section className="relative h-screen flex items-center justify-center overflow-hidden">
      {/* Newspaper Background */}
      <div
        className="absolute inset-0 bg-cover bg-center opacity-15"
        style={{ backgroundImage: `url(${backgroundImage})` }}
      />

      {/* Overlay gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-white/80 via-white/60 to-white/80" />

      {/* Content */}
      <div className="relative z-10 text-center px-6">
        <h2 className="text-6xl mb-8 tracking-tight max-w-4xl mx-auto">
          Verify The Truth Behind Every Headline
        </h2>
        <p className="text-xl mb-12 text-gray-700 max-w-2xl mx-auto">
          Cutting through misinformation with AI-powered fact-checking
        </p>
        <Link to="/verify">
          <Button
            size="lg"
            className="bg-black text-white hover:bg-gray-800 px-8 py-6 text-lg"
          >
            Get Started
          </Button>
        </Link>
      </div>
    </section>
  );
}

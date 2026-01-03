import { Link } from "react-router-dom";

export function Header({ variant = "light" }) {
  const isDark = variant === "dark";

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 border-b-2 transition-colors
        ${isDark ? "bg-transparent border-white text-white" : "bg-transparent border-black text-black"}
      `}
    >
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        <Link to="/">
          <h1 className="text-3xl md:text-4xl tracking-tight cursor-pointer hover:opacity-80 transition-opacity">
            TrustMint
          </h1>
        </Link>

        <nav className="flex gap-8">
          <Link to="/" className="hover:underline transition-all">
            Home
          </Link>
          <Link to="/#about" className="hover:underline transition-all">
            About
          </Link>
          <Link to ="/#contact" className="hover:underline transition-all">
            Contact
          </Link>
        </nav>
      </div>
    </header>
  );
}

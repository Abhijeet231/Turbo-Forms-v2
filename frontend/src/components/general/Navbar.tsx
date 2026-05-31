import { Link } from "react-router-dom";

const Navbar = () => {
  return (
    <header className="sticky top-0 z-50 border-b border-white/5 bg-[#2c2824]/80 backdrop-blur-xl">
      <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">

        {/* Left */}
        <Link
          to="/"
          className="text-xl font-semibold tracking-tight text-[#f5f1ea]"
        >
          Turbo
          <span className="text-[#a89474]">Form</span>
        </Link>

        {/* Middle */}
        <div className="hidden items-center gap-8 md:flex">
          <Link
            to="/about"
            className="text-sm text-[#cbb89a] transition hover:text-[#f5f1ea]"
          >
            About
          </Link>

          <Link
            to="/contact"
            className="text-sm text-[#cbb89a] transition hover:text-[#f5f1ea]"
          >
            Contact
          </Link>
        </div>

        {/* Right */}
        <div className="flex items-center gap-3">

          <Link
            to="/login"
            className="rounded-xl border border-white/10 px-4 py-2 text-sm font-medium text-[#f5f1ea] transition hover:border-[#a89474]/40 hover:bg-white/5"
          >
            Login
          </Link>

          <Link
            to="/register"
            className="rounded-xl bg-[#a89474] px-4 py-2 text-sm font-medium text-black transition hover:bg-[#bca98a]"
          >
            Register
          </Link>

        </div>
      </nav>
    </header>
  );
};

export default Navbar;
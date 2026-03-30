import { Link, useRouterState } from "@tanstack/react-router";
import { Menu, Search, Settings, Shield, X } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { useSiteSettings } from "../hooks/useQueries";

const navLinks = [
  { label: "Beranda", href: "/" as const },
  { label: "Tentang SSK", href: "/tentang" as const },
  { label: "Berita & Artikel", href: "/berita" as const },
  { label: "Galeri", href: "/galeri" as const },
  { label: "Satuan", href: "/satuan" as const },
  { label: "Daftar Anggota", href: "/daftar" as const },
  { label: "Kontak", href: "/kontak" as const },
];

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const routerState = useRouterState();
  const currentPath = routerState.location.pathname;
  const { data: siteSettings } = useSiteSettings();

  const logoContent = siteSettings?.logoUrl ? (
    <img
      src={siteSettings.logoUrl}
      alt="Logo SSK"
      className="w-12 h-12 object-contain rounded-full"
    />
  ) : (
    <div className="w-12 h-12 bg-navy rounded-full flex items-center justify-center flex-shrink-0">
      <Shield className="w-7 h-7 text-gold" />
    </div>
  );

  return (
    <header>
      {/* Top bar */}
      <div className="bg-white border-b border-gray-200 py-3">
        <div className="max-w-6xl mx-auto px-4 flex items-center gap-4">
          <div className="flex items-center gap-3">
            {logoContent}
            <div>
              <h1 className="text-navy font-bold text-xl leading-tight">
                SSK KABUPATEN SUBANG
              </h1>
              <p className="text-gray-500 text-xs">
                Sekolah Siaga Kependudukan
              </p>
              <p className="text-gray-400 text-xs">Jawa Barat, Indonesia</p>
            </div>
          </div>
        </div>
      </div>

      {/* Nav bar */}
      <nav className="bg-navy sticky top-0 z-50 shadow-lg">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex items-center justify-between h-12">
            {/* Desktop nav */}
            <div className="hidden md:flex items-center gap-1 flex-wrap">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  to={link.href}
                  data-ocid={`nav.${link.label.toLowerCase().replace(/[^a-z0-9]/g, "_")}.link`}
                  className={`px-3 py-2 text-xs font-semibold uppercase tracking-wide transition-colors ${
                    currentPath === link.href
                      ? "text-gold"
                      : "text-white hover:text-gold"
                  }`}
                >
                  {link.label}
                </Link>
              ))}
            </div>

            {/* Right side: Search + Admin */}
            <div className="hidden md:flex items-center gap-4 text-white">
              <div className="flex items-center gap-2">
                <Search className="w-4 h-4 text-gold" />
                <span className="text-xs text-gray-300 uppercase tracking-wide">
                  Cari
                </span>
              </div>
              <Link
                to="/admin"
                data-ocid="nav.admin.link"
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-semibold uppercase tracking-wide border transition-colors ${
                  currentPath === "/admin"
                    ? "bg-gold text-navy border-gold"
                    : "border-gold text-gold hover:bg-gold hover:text-navy"
                }`}
              >
                <Settings className="w-3.5 h-3.5" />
                Admin
              </Link>
            </div>

            {/* Mobile hamburger */}
            <button
              type="button"
              className="md:hidden text-white p-2"
              onClick={() => setMobileOpen(!mobileOpen)}
              data-ocid="nav.mobile.toggle"
            >
              {mobileOpen ? (
                <X className="w-5 h-5" />
              ) : (
                <Menu className="w-5 h-5" />
              )}
            </button>
          </div>
        </div>

        <AnimatePresence>
          {mobileOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden md:hidden bg-navy-dark"
            >
              <div className="px-4 py-2 border-t border-navy-light">
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    to={link.href}
                    onClick={() => setMobileOpen(false)}
                    className={`block py-3 text-sm font-semibold uppercase tracking-wide border-b border-navy-light ${
                      currentPath === link.href
                        ? "text-gold"
                        : "text-white hover:text-gold"
                    }`}
                  >
                    {link.label}
                  </Link>
                ))}
                <Link
                  to="/admin"
                  onClick={() => setMobileOpen(false)}
                  className={`flex items-center gap-2 py-3 text-sm font-semibold uppercase tracking-wide ${
                    currentPath === "/admin"
                      ? "text-gold"
                      : "text-gold hover:text-yellow-300"
                  }`}
                >
                  <Settings className="w-4 h-4" />
                  Panel Admin
                </Link>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>
    </header>
  );
}

import { Link } from "@tanstack/react-router";
import { Facebook, Instagram, Mail, MapPin, Phone, Shield } from "lucide-react";

export default function Footer() {
  const year = new Date().getFullYear();
  const hostname =
    typeof window !== "undefined" ? window.location.hostname : "";

  return (
    <footer className="bg-navy text-white">
      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-gold rounded-full flex items-center justify-center flex-shrink-0">
                <Shield className="w-6 h-6 text-navy" />
              </div>
              <div>
                <p className="font-bold text-sm leading-tight">
                  SSK KABUPATEN SUBANG
                </p>
                <p className="text-gray-400 text-xs">Jawa Barat</p>
              </div>
            </div>
            <p className="text-gray-300 text-sm leading-relaxed">
              Sekolah Siaga Kependudukan Kabupaten Subang — membangun generasi
              sadar kependudukan untuk masa depan Indonesia.
            </p>
          </div>

          <div>
            <h3 className="text-gold font-bold uppercase text-sm tracking-wide mb-4">
              Tautan Cepat
            </h3>
            <ul className="space-y-2">
              {(
                [
                  { label: "Beranda", href: "/" },
                  { label: "Tentang SSK", href: "/tentang" },
                  { label: "Berita & Artikel", href: "/berita" },
                  { label: "Kontak", href: "/kontak" },
                ] as const
              ).map((link) => (
                <li key={link.href}>
                  <Link
                    to={link.href}
                    className="text-gray-300 text-sm hover:text-gold transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-gold font-bold uppercase text-sm tracking-wide mb-4">
              Media Sosial
            </h3>
            <div className="space-y-3">
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 text-gray-300 hover:text-gold transition-colors text-sm"
              >
                <Facebook className="w-5 h-5" />
                SSK Kabupaten Subang
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 text-gray-300 hover:text-gold transition-colors text-sm"
              >
                <Instagram className="w-5 h-5" />
                @ssk.subang
              </a>
            </div>
          </div>

          <div>
            <h3 className="text-gold font-bold uppercase text-sm tracking-wide mb-4">
              Kontak
            </h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-3 text-gray-300 text-sm">
                <MapPin className="w-4 h-4 mt-0.5 text-gold flex-shrink-0" />
                Jl. Brigjen Katamso No. 1, Subang, Jawa Barat
              </li>
              <li className="flex items-center gap-3 text-gray-300 text-sm">
                <Phone className="w-4 h-4 text-gold flex-shrink-0" />
                (0260) 411-1234
              </li>
              <li className="flex items-center gap-3 text-gray-300 text-sm">
                <Mail className="w-4 h-4 text-gold flex-shrink-0" />
                info@ssk-subang.go.id
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div className="border-t border-navy-light">
        <div className="max-w-6xl mx-auto px-4 py-4 flex flex-col md:flex-row items-center justify-between gap-2">
          <p className="text-xs text-gold/70">
            © {year} SSK Kabupaten Subang. Hak Cipta Dilindungi.
          </p>
          <div className="flex items-center gap-4">
            <p className="text-xs text-gray-500">
              Built with ❤️ using{" "}
              <a
                href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(hostname)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-gold/70 hover:text-gold transition-colors"
              >
                caffeine.ai
              </a>
            </p>
            <Link
              to="/admin"
              className="text-xs text-gray-600 hover:text-gray-400 transition-colors"
              data-ocid="footer.admin.link"
            >
              Admin
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

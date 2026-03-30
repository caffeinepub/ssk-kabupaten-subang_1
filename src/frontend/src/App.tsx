import {
  Link,
  Outlet,
  RouterProvider,
  createRootRoute,
  createRoute,
  createRouter,
  useRouterState,
} from "@tanstack/react-router";
import Footer from "./components/Footer";
import Header from "./components/Header";
import Admin from "./pages/Admin";
import Berita from "./pages/Berita";
import BeritaDetail from "./pages/BeritaDetail";
import Daftar from "./pages/Daftar";
import Galeri from "./pages/Galeri";
import Home from "./pages/Home";
import Kegiatan from "./pages/Kegiatan";
import Konseling from "./pages/Konseling";
import Kontak from "./pages/Kontak";
import Satuan from "./pages/Satuan";
import Tentang from "./pages/Tentang";

export { Link, useRouterState };

const rootRoute = createRootRoute({
  component: () => (
    <div className="flex flex-col min-h-screen">
      <Header />
      <div className="flex-1">
        <Outlet />
      </div>
      <Footer />
    </div>
  ),
});

const homeRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/",
  component: Home,
});
const tentangRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/tentang",
  component: Tentang,
});
const beritaRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/berita",
  component: Berita,
});
const beritaDetailRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/berita/$id",
  component: BeritaDetail,
});
const kegiatanRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/kegiatan",
  component: Kegiatan,
});
const konselingRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/konseling",
  component: Konseling,
});
const kontakRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/kontak",
  component: Kontak,
});
const adminRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/admin",
  component: Admin,
});
const galeriRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/galeri",
  component: Galeri,
});
const daftarRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/daftar",
  component: Daftar,
});
const satuanRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/satuan",
  component: Satuan,
});

const routeTree = rootRoute.addChildren([
  homeRoute,
  tentangRoute,
  beritaRoute,
  beritaDetailRoute,
  kegiatanRoute,
  konselingRoute,
  kontakRoute,
  adminRoute,
  galeriRoute,
  daftarRoute,
  satuanRoute,
]);

const router = createRouter({ routeTree });

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

export default function App() {
  return <RouterProvider router={router} />;
}

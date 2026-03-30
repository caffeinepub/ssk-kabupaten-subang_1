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
import Home from "./pages/Home";
import Kontak from "./pages/Kontak";
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

const routeTree = rootRoute.addChildren([
  homeRoute,
  tentangRoute,
  beritaRoute,
  beritaDetailRoute,
  kontakRoute,
  adminRoute,
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

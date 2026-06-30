import { Outlet } from "react-router-dom";
import PublicNav from "../components/layouts/PublicNav";

export default function PublicLayout() {
  return (
    <div className="min-h-screen w-full bg-white">
      <PublicNav />
      <main>
        <Outlet />
      </main>
    </div>
  );
}

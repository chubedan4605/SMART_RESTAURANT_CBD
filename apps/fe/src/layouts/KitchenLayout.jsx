import { Outlet } from "react-router-dom";
import Navbar from "../Components/NavBar";

const KitchenLayout = () => {
  return (
    <div className="flex flex-col min-h-screen bg-gray-50 dark:bg-neutral-950 text-gray-900 dark:text-white transition-colors">
      <Navbar></Navbar>
      <main className="flex-1 pt-14 bg-gray-50 dark:bg-neutral-950 text-gray-900 dark:text-white font-sans transition-colors">
        <Outlet />
      </main>
    </div>
  );
};

export default KitchenLayout;

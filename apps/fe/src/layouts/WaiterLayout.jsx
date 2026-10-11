import React from "react";
import { Outlet } from "react-router-dom";
import Header from "../Components/Header";
import BottomNav from "../Components/BottomNav";
import Navbar from "../Components/NavBar";
import BillRequestNotification from "../Components/BillRequestNotification";
import WaiterNavbar from "../Components/WaiterNavbar";

const WaiterLayout = () => {
  return (
    <div className="flex flex-col min-h-screen bg-gray-50 dark:bg-neutral-950 text-gray-900 dark:text-white transition-colors">
      <Navbar></Navbar>
      <main className="flex-1 pt-14 bg-gray-50 dark:bg-neutral-950 text-gray-900 dark:text-white font-sans transition-colors">
        <BillRequestNotification />
        <Outlet />
      </main>
    </div>
  );
};

export default WaiterLayout;

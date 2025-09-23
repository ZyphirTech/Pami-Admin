"use client";
import React from "react";
import Sidebar from "../components/sidebar";

function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex">
      <Sidebar />
      <main className="flex-1 p-6">{children}</main>
    </div>
  );
}

export default DashboardLayout;

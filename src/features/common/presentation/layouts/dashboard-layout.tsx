"use client";
import React from "react";
import Sidebar, { SidebarProvider } from "../components/sidebar";

function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <div className="flex">
        <Sidebar />
        <main className="flex-1 overflow-auto transition-all duration-300">
          {children}
        </main>
      </div>
    </SidebarProvider>
  );
}

export default DashboardLayout;

"use client";

import { QueryClientProvider } from "@tanstack/react-query";
import React from "react";
import DashboardLayout from "../layouts/dashboard-layout";
import { queryClient } from "../../infrastructure/query-client/config";

function QueryProvider({ children }: { children: React.ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>
      <DashboardLayout>{children}</DashboardLayout>
    </QueryClientProvider>
  );
}

export default QueryProvider;

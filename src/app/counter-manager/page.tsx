"use client";
import React from "react";
import DashboardLayout from "@/components/organisms/DashboardLayout";
import CounterDashboard from "@/components/organisms/CounterDashboard";

export default function CounterManagerPage() {
  return (
    <DashboardLayout>
      <CounterDashboard />
    </DashboardLayout>
  );
}

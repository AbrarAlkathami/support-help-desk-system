"use client";

import { useState } from "react";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import { TicketQueue } from "@/features/tickets/components/ticket-queue";
import { UsersManagement } from "@/features/users/components/users-management";
import { CategoryManagement } from "@/features/categories/components/category-management";
import { AdminMetrics } from "@/features/metrics/components/admin-metrics";

import { CreateUserDialog } from "@/features/users/components/create-user-dialog";
import { CreateCategoryDialog } from "@/features/categories/components/create-category-dialog";

export function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("overview");

  return (
    <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <TabsList variant="line">
          <TabsTrigger value="overview">Overview</TabsTrigger>

          <TabsTrigger value="tickets">Tickets</TabsTrigger>

          <TabsTrigger value="accounts">Accounts</TabsTrigger>

          <TabsTrigger value="categories">Categories</TabsTrigger>
        </TabsList>

        <div className="shrink-0">
          {activeTab === "accounts" && <CreateUserDialog />}

          {activeTab === "categories" && <CreateCategoryDialog />}
        </div>
      </div>

      <TabsContent value="overview">
        <AdminMetrics />
      </TabsContent>

      <TabsContent value="tickets">
        <TicketQueue />
      </TabsContent>

      <TabsContent value="accounts">
        <UsersManagement />
      </TabsContent>

      <TabsContent value="categories">
        <CategoryManagement />
      </TabsContent>
    </Tabs>
  );
}

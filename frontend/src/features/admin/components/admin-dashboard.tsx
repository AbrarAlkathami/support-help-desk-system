"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import { TicketQueue } from "@/features/tickets/components/ticket-queue";
import { UsersManagement } from "@/features/users/components/users-management";
import { CategoryManagement } from "@/features/categories/components/category-management";
import { AdminMetrics } from "@/features/metrics/components/admin-metrics";

export function AdminDashboard() {
  return (
    <Tabs defaultValue="overview" className="space-y-6">
      <TabsList variant="line">
        <TabsTrigger value="overview">Overview</TabsTrigger>

        <TabsTrigger value="tickets">Tickets</TabsTrigger>

        <TabsTrigger value="accounts">Accounts</TabsTrigger>

        <TabsTrigger value="categories">Categories</TabsTrigger>
      </TabsList>

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

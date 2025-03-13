
import React from "react";
import CustomerList from "./CustomerList";
import { Card, CardContent } from "@/components/ui/card";

const CustomerDashboard = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 to-white">
      <div className="container mx-auto py-10 px-4">
        <header className="mb-10">
          <h1 className="text-3xl font-bold tracking-tight text-purple-900 md:text-4xl">
            Customer Management
          </h1>
          <p className="mt-2 text-lg text-muted-foreground">
            Manage your customer database with ease
          </p>
        </header>
        
        <Card className="border-none shadow-lg">
          <CardContent className="p-0">
            <CustomerList />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CustomerDashboard;

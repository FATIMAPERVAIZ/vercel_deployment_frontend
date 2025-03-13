
import React, { useEffect, useState } from "react";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PlusCircle, User, Mail, Phone, MapPin, Search, Loader2, UserPlus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import AddCustomerForm from "./AddCustomerForm";
import CustomerTable from "./CustomerTable";

interface Customer {
  _id: string;
  customerId: string;
  name: string;
  contact: string;
  email: string;
  address: string;
}

const CustomerList = () => {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const { toast } = useToast();

  // Fetch Customers from MongoDB
  const fetchCustomers = async () => {
    setLoading(true);
    try {
      // This is a mock implementation since we can't connect to a real API in this demo
      // In a real app, you would use this:
      const response = await axios.get("https://server-taupe-theta-31.vercel.app/users/getAllCustomers");
      setCustomers(response.data.customer);
      
      //Mock data for demonstration purposes
      // setTimeout(() => {
      //   const mockCustomers = [
      //     { _id: "1", customerId: "CUST001", name: "John Doe", contact: "1234567890", email: "john@example.com", address: "123 Main St, City" },
      //     { _id: "2", customerId: "CUST002", name: "Jane Smith", contact: "9876543210", email: "jane@example.com", address: "456 Oak Ave, Town" },
      //     { _id: "3", customerId: "CUST003", name: "Bob Johnson", contact: "5551234567", email: "bob@example.com", address: "789 Pine Rd, Village" },
      //   ];
      //   setCustomers(mockCustomers);
      //   setLoading(false);
      // }, 600);
    } catch (error) {
      console.error("Error fetching customers:", error);
      toast({
        title: "Error",
        description: "Could not fetch customers. Please try again.",
        variant: "destructive",
      });
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  // Handle adding a new customer (will be implemented in AddCustomerForm component)
  const handleCustomerAdded = () => {
    toast({
      title: "Success",
      description: "Customer added successfully!",
      variant: "default",
    });
    fetchCustomers();
  };

  const filteredCustomers = customers.filter(
    (customer) =>
      customer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      customer.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      customer.customerId.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <Tabs defaultValue="list" className="w-full">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center px-6 py-4 border-b">
        <TabsList className="mb-4 md:mb-0">
          <TabsTrigger value="list" className="flex items-center gap-2">
            <User size={16} />
            Customer List
          </TabsTrigger>
          <TabsTrigger value="add" className="flex items-center gap-2">
            <PlusCircle size={16} />
            Add Customer
          </TabsTrigger>
        </TabsList>

        <div className="relative w-full md:w-auto">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search customers..."
            className="pl-10 w-full md:w-[250px]"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      <TabsContent value="list" className="p-0 m-0">
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <span className="ml-2">Loading customers...</span>
          </div>
        ) : filteredCustomers.length > 0 ? (
          <CustomerTable customers={filteredCustomers} onRefresh={fetchCustomers} />
        ) : (
          <div className="flex flex-col items-center justify-center h-64 text-center p-6">
            <UserPlus className="h-12 w-12 text-muted-foreground mb-4" />
            {searchQuery ? (
              <>
                <h3 className="text-lg font-medium">No customers found</h3>
                <p className="text-muted-foreground mt-1">
                  Try adjusting your search query
                </p>
              </>
            ) : (
              <>
                <h3 className="text-lg font-medium">No customers yet</h3>
                <p className="text-muted-foreground mt-1">
                  Add your first customer to get started
                </p>
                <Button
                  variant="default"
                  className="mt-4"
                  onClick={() => {
                    (document.querySelector('[data-value="add"]') as HTMLElement)?.click();
                  }}
                  
                >
                  Add Customer
                </Button>
              </>
            )}
          </div>
        )}
      </TabsContent>

      <TabsContent value="add" className="p-0 m-0">
        <div className="p-6">
          <h2 className="text-xl font-semibold mb-6">Add New Customer</h2>
          <AddCustomerForm onCustomerAdded={handleCustomerAdded} />
        </div>
      </TabsContent>
    </Tabs>
  );
};

export default CustomerList;

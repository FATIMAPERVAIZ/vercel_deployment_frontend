
import React, { useState } from "react";
import axios from "axios";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { User, Mail, Phone, MapPin, Hash, Loader2 } from "lucide-react";

interface AddCustomerFormProps {
  onCustomerAdded: () => void;
}

const AddCustomerForm: React.FC<AddCustomerFormProps> = ({ onCustomerAdded }) => {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const [newCustomer, setNewCustomer] = useState({
    customerId: "",
    name: "",
    contact: "",
    email: "",
    address: "",
  });

  // Field change handler
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setNewCustomer((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // In a real app, you'd actually send this to your API:
      // await axios.post("http://localhost:8080/users/createCustomer", newCustomer);
      
      // This is just for the demo:
      console.log("Customer data would be sent to API:", newCustomer);
      
      // Wait to simulate API call
      await new Promise(resolve => setTimeout(resolve, 800));
      
      setNewCustomer({
        customerId: "",
        name: "",
        contact: "",
        email: "",
        address: "",
      });
      
      onCustomerAdded();
    } catch (error) {
      console.error("Error adding customer:", error);
      toast({
        title: "Error",
        description: "Could not add customer. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl mx-auto">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="customerId" className="flex items-center gap-2">
            <Hash size={16} />
            Customer ID
          </Label>
          <Input
            id="customerId"
            name="customerId"
            placeholder="e.g., CUST001"
            value={newCustomer.customerId}
            onChange={handleChange}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="name" className="flex items-center gap-2">
            <User size={16} />
            Full Name
          </Label>
          <Input
            id="name"
            name="name"
            placeholder="John Doe"
            value={newCustomer.name}
            onChange={handleChange}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="contact" className="flex items-center gap-2">
            <Phone size={16} />
            Contact Number
          </Label>
          <Input
            id="contact"
            name="contact"
            type="tel"
            placeholder="1234567890"
            value={newCustomer.contact}
            onChange={handleChange}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="email" className="flex items-center gap-2">
            <Mail size={16} />
            Email Address
          </Label>
          <Input
            id="email"
            name="email"
            type="email"
            placeholder="customer@example.com"
            value={newCustomer.email}
            onChange={handleChange}
            required
          />
        </div>

        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="address" className="flex items-center gap-2">
            <MapPin size={16} />
            Address
          </Label>
          <Textarea
            id="address"
            name="address"
            placeholder="123 Main St, City, Country"
            value={newCustomer.address}
            onChange={handleChange}
            rows={3}
            className="resize-none"
            required
          />
        </div>
      </div>

      <div className="flex justify-end pt-4">
        <Button
          type="button"
          variant="outline"
          className="mr-2"
          onClick={() => {
            (document.querySelector('[data-value="add"]') as HTMLElement)?.click();
          }}
          
        >
          Cancel
        </Button>
        <Button type="submit" disabled={loading}>
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Adding...
            </>
          ) : (
            "Add Customer"
          )}
        </Button>
      </div>
    </form>
  );
};

export default AddCustomerForm;

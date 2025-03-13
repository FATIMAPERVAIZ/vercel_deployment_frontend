import React, { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button} from "@/components/ui/button";
import { Input} from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { Mail, Phone, Trash2, Edit, Check, X } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

const CustomerTable = ({ customers, onRefresh }) => {
  const { toast } = useToast();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [customerToDelete, setCustomerToDelete] = useState(null);
  const [editingCustomer, setEditingCustomer] = useState(null);
  const [editedData, setEditedData] = useState({});

  // DELETE CUSTOMER
  const handleDeleteClick = (customer) => {
    setCustomerToDelete(customer);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (!customerToDelete) return;
    try {
      await fetch(`https://server-taupe-theta-31.vercel.app/users/deleteCustomer/${customerToDelete.customerId}`, {
        method: "DELETE",
      });
      toast({
        title: "Success",
        description: `${customerToDelete.name} has been removed.`,
      });
      onRefresh();
    } catch (error) {
      console.error("Error deleting customer:", error);
      toast({
        title: "Error",
        description: "Could not delete customer. Please try again.",
        variant: "destructive",
      });
    } finally {
      setDeleteDialogOpen(false);
      setCustomerToDelete(null);
    }
  };

  // START EDITING
  const handleEditClick = (customer) => {
    setEditingCustomer(customer.customerId);
    setEditedData({
      name: customer.name || "",
      email: customer.email || "",
      contact: customer.contact || "",
      address: customer.address || "",
    });
  };

  // HANDLE INPUT CHANGE
  const handleInputChange = (e, field) => {
    setEditedData({ ...editedData, [field]: e.target.value });
  };

  // SAVE CUSTOMER
  const handleSave = async () => {
    if (!editingCustomer) return;

    try {
      const response = await fetch(`https://server-taupe-theta-31.vercel.app/users/updateCustomerById/${editingCustomer}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editedData),
      });
      
      if (!response.ok) {
        throw new Error("Failed to update customer");
      }

      toast({ title: "Success", description: "Customer updated successfully." });
      onRefresh();
    } catch (error) {
      console.error("Error updating customer:", error);
      toast({ title: "Error", description: "Could not update customer.", variant: "destructive" });
    } finally {
      setEditingCustomer(null);
      setEditedData({});
    }
  };

  // CANCEL EDITING
  const handleCancelEdit = () => {
    setEditingCustomer(null);
    setEditedData({});
  };

  return (
    <>
      <div className="overflow-x-auto">
        <Table>
          <TableHeader className="bg-muted/50">
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Customer</TableHead>
              <TableHead>Contact Info</TableHead>
              <TableHead>Address</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {customers.map((customer) => (
              <TableRow key={customer._id} className="hover:bg-muted/30">
                <TableCell className="font-medium">
                  {customer.customerId}
                </TableCell>
                <TableCell>
                  {editingCustomer === customer.customerId ? (
                    <Input value={editedData.name} onChange={(e) => handleInputChange(e, "name")} />
                  ) : (
                    <div className="font-medium">{customer.name}</div>
                  )}
                </TableCell>
                <TableCell>
                  {editingCustomer === customer.customerId ? (
                    <Input value={editedData.email} onChange={(e) => handleInputChange(e, "email")} />
                  ) : (
                    <div className="flex flex-col gap-1">
                      <div className="flex items-center gap-1 text-sm">
                        <Mail className="h-3 w-3 text-muted-foreground" />
                        <a href={`mailto:${customer.email}`} className="hover:underline">
                          {customer.email}
                        </a>
                      </div>
                      <div className="flex items-center gap-1 text-sm">
                        <Phone className="h-3 w-3 text-muted-foreground" />
                        <a href={`tel:${customer.contact}`} className="hover:underline">
                          {customer.contact}
                        </a>
                      </div>
                    </div>
                  )}
                </TableCell>
                <TableCell>
                  {editingCustomer === customer.customerId ? (
                    <Input value={editedData.address} onChange={(e) => handleInputChange(e, "address")} />
                  ) : (
                    customer.address
                  )}
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    {editingCustomer === customer.customerId ? (
                      <>
                        <Button variant="ghost" size="icon" onClick={handleSave}>
                          <Check className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={handleCancelEdit}>
                          <X className="h-4 w-4" />
                        </Button>
                      </>
                    ) : (
                      <Button variant="ghost" size="icon" onClick={() => handleEditClick(customer)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                    )}
                    <Button variant="ghost" size="icon" onClick={() => handleDeleteClick(customer)} className="text-destructive hover:text-destructive hover:bg-destructive/10">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* DELETE CONFIRMATION DIALOG */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete {customerToDelete?.name}'s record and all associated data. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className="bg-destructive text-destructive-foreground">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default CustomerTable;

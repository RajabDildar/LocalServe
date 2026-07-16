import { Button } from "@/components/ui/button";

export const ServicesPage = () => {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Manage Services</h1>
      <div className="border p-4 rounded">
        <p>No services added yet.</p>
        <Button className="mt-4">Add Service</Button>
      </div>
    </div>
  );
};

"use client";

import { useState } from "react";
import api from "@/lib/api";
import { toast } from "sonner";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function AddUserDialog({
  onSuccess,
}: {
  onSuccess: () => void;
}) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    password: "",
    phone: "",
    dob: "",
    gender: "m",
    address: "",
    role: "artist",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post("/users", formData);
      toast.success("User created successfully");
      setOpen(false);
      onSuccess();
    } catch (err: any) {
      toast.error(err.response?.data?.error || "Failed to create user");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="mr-2 h-4 w-4" /> Add User
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Add New User</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4 mt-4">
          <div className="space-y-2">
            <Label>First Name</Label>
            <Input name="first_name" required onChange={handleChange} />
          </div>
          <div className="space-y-2">
            <Label>Last Name</Label>
            <Input name="last_name" required onChange={handleChange} />
          </div>
          <div className="space-y-2">
            <Label>Email</Label>
            <Input name="email" type="email" required onChange={handleChange} />
          </div>
          <div className="space-y-2">
            <Label>Password</Label>
            <Input
              name="password"
              type="password"
              required
              onChange={handleChange}
            />
          </div>
          <div className="space-y-2">
            <Label>Phone</Label>
            <Input name="phone" required onChange={handleChange} />
          </div>
          <div className="space-y-2">
            <Label>Date of Birth</Label>
            <Input name="dob" type="date" required onChange={handleChange} />
          </div>

          <div className="space-y-2">
            <Label>Gender</Label>
            <Select
              onValueChange={(v) => handleSelectChange("gender", v)}
              defaultValue="m"
            >
              <SelectTrigger>
                <SelectValue placeholder="Gender" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="m">Male</SelectItem>
                <SelectItem value="f">Female</SelectItem>
                <SelectItem value="o">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Role</Label>
            <Select
              onValueChange={(v) => handleSelectChange("role", v)}
              defaultValue="artist"
            >
              <SelectTrigger>
                <SelectValue placeholder="Role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="super_admin">Super Admin</SelectItem>
                <SelectItem value="artist_manager">Artist Manager</SelectItem>
                <SelectItem value="artist">Artist</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2 col-span-2">
            <Label>Address</Label>
            <Input name="address" required onChange={handleChange} />
          </div>

          <div className="col-span-2 flex justify-end mt-4">
            <Button type="submit" disabled={loading}>
              {loading ? "Saving..." : "Save User"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

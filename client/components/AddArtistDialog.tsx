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

interface AddArtistDialogProps {
  onSuccess: () => void;
}

export default function AddArtistDialog({ onSuccess }: AddArtistDialogProps) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    dob: "",
    gender: "m",
    address: "",
    first_release_year: "",
    no_of_albums_released: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleGenderChange = (value: string) => {
    setFormData({ ...formData, gender: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await api.post("/artists", {
        ...formData,
        first_release_year: parseInt(formData.first_release_year),
        no_of_albums_released: parseInt(formData.no_of_albums_released),
      });

      toast.success("Artist and User account created successfully");
      setOpen(false);

      setFormData({
        name: "",
        email: "",
        password: "",
        dob: "",
        gender: "m",
        address: "",
        first_release_year: "",
        no_of_albums_released: "",
      });

      onSuccess();
    } catch (err: any) {
      toast.error(err.response?.data?.error || "Failed to create artist");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="mr-2 h-4 w-4" /> Add Artist
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Add New Artist</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <div className="grid gap-2">
            <Label htmlFor="name">Full Name</Label>
            <Input
              id="name"
              name="name"
              required
              value={formData.name}
              onChange={handleChange}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="email">Login Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                required
                value={formData.email}
                onChange={handleChange}
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="password">Login Password</Label>
              <Input
                id="password"
                name="password"
                type="password"
                required
                value={formData.password}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="dob">Date of Birth</Label>
              <Input
                id="dob"
                name="dob"
                type="date"
                required
                value={formData.dob}
                onChange={handleChange}
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="gender">Gender</Label>
              <Select
                value={formData.gender}
                onValueChange={handleGenderChange}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select gender" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="m">Male</SelectItem>
                  <SelectItem value="f">Female</SelectItem>
                  <SelectItem value="o">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="address">Address</Label>
            <Input
              id="address"
              name="address"
              required
              value={formData.address}
              onChange={handleChange}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="first_release_year">First Release Year</Label>
              <Input
                id="first_release_year"
                name="first_release_year"
                type="number"
                min="1900"
                max={new Date().getFullYear()}
                required
                value={formData.first_release_year}
                onChange={handleChange}
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="no_of_albums_released">Albums Released</Label>
              <Input
                id="no_of_albums_released"
                name="no_of_albums_released"
                type="number"
                min="0"
                required
                value={formData.no_of_albums_released}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="flex justify-end pt-4">
            <Button type="submit" disabled={loading}>
              {loading ? "Saving..." : "Save Artist"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

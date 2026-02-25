"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import api from "@/lib/api";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function RegisterPage() {
  const router = useRouter();
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
    role: "super_admin",
  });

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      router.push("/dashboard");
    }
  }, [router]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post("/auth/register", formData);
      toast.success("Registration successful! Please log in.");

      router.push("/login");
    } catch (err: any) {
      toast.error(err.response?.data?.error || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 py-10">
      <Card className="w-[500px]">
        <CardHeader>
          <CardTitle>Admin Registration</CardTitle>
          <CardDescription>Create a new super admin account.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleRegister} className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>First Name</Label>
              <Input name="first_name" required onChange={handleChange} />
            </div>
            <div className="space-y-2">
              <Label>Last Name</Label>
              <Input name="last_name" required onChange={handleChange} />
            </div>
            <div className="space-y-2 col-span-2">
              <Label>Email</Label>
              <Input
                name="email"
                type="email"
                required
                onChange={handleChange}
              />
            </div>
            <div className="space-y-2 col-span-2">
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
                onValueChange={(v) => setFormData({ ...formData, gender: v })}
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
              <Input value="Super Admin" disabled className="bg-slate-100" />
            </div>

            <div className="space-y-2 col-span-2">
              <Label>Address</Label>
              <Input name="address" required onChange={handleChange} />
            </div>

            <div className="col-span-2 mt-4">
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? "Registering..." : "Create Account"}
              </Button>
            </div>
          </form>
        </CardContent>
        <CardFooter className="flex justify-center border-t p-4 mt-4">
          <p className="text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link
              href="/login"
              className="text-blue-600 hover:underline font-medium"
            >
              Log in here
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}

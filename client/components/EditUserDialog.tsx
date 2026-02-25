"use client";

import { useState } from "react";
import api from "@/lib/api";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

interface User {
    id: number;
    first_name: string;
    last_name: string;
    email: string;
    phone: string;
    dob: string;
    gender: string;
    address: string;
    role: string;
}

interface EditUserDialogProps {
    user: User;
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onSuccess: () => void;
}

export default function EditUserDialog({
    user,
    open,
    onOpenChange,
    onSuccess,
}: EditUserDialogProps) {
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        first_name: user.first_name,
        last_name: user.last_name,
        phone: user.phone,
        dob: user.dob ? user.dob.split("T")[0] : "",
        gender: user.gender || "m",
        address: user.address || "",
        role: user.role,
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            await api.put(`/users/${user.id}`, formData);
            toast.success("User updated successfully");
            onOpenChange(false);
            onSuccess();
        } catch (err: any) {
            toast.error(err.response?.data?.error || "Failed to update user");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle>Edit User</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4 mt-4">
                    <div className="space-y-2">
                        <Label>First Name</Label>
                        <Input
                            name="first_name"
                            required
                            value={formData.first_name}
                            onChange={handleChange}
                        />
                    </div>
                    <div className="space-y-2">
                        <Label>Last Name</Label>
                        <Input
                            name="last_name"
                            required
                            value={formData.last_name}
                            onChange={handleChange}
                        />
                    </div>
                    <div className="space-y-2">
                        <Label>Phone</Label>
                        <Input
                            name="phone"
                            required
                            value={formData.phone}
                            onChange={handleChange}
                        />
                    </div>
                    <div className="space-y-2">
                        <Label>Date of Birth</Label>
                        <Input
                            name="dob"
                            type="date"
                            required
                            value={formData.dob}
                            onChange={handleChange}
                        />
                    </div>

                    <div className="space-y-2">
                        <Label>Gender</Label>
                        <Select
                            value={formData.gender}
                            onValueChange={(v) =>
                                setFormData({ ...formData, gender: v })
                            }
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
                            value={formData.role}
                            onValueChange={(v) =>
                                setFormData({ ...formData, role: v })
                            }
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
                        <Input
                            name="address"
                            required
                            value={formData.address}
                            onChange={handleChange}
                        />
                    </div>

                    <div className="col-span-2 flex justify-end mt-4">
                        <Button type="submit" disabled={loading}>
                            {loading ? "Saving..." : "Update User"}
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
}

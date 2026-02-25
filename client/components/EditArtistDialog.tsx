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

interface Artist {
    id: number;
    name: string;
    dob: string;
    gender?: string;
    address?: string;
    first_release_year: number;
    no_of_albums_released: number;
}

interface EditArtistDialogProps {
    artist: Artist;
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onSuccess: () => void;
}

export default function EditArtistDialog({
    artist,
    open,
    onOpenChange,
    onSuccess,
}: EditArtistDialogProps) {
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: artist.name,
        dob: artist.dob ? artist.dob.split("T")[0] : "",
        gender: artist.gender || "m",
        address: artist.address || "",
        first_release_year: artist.first_release_year?.toString() || "",
        no_of_albums_released: artist.no_of_albums_released?.toString() || "",
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            await api.put(`/artists/${artist.id}`, {
                ...formData,
                first_release_year: parseInt(formData.first_release_year),
                no_of_albums_released: parseInt(formData.no_of_albums_released),
            });
            toast.success("Artist updated successfully");
            onOpenChange(false);
            onSuccess();
        } catch (err: any) {
            toast.error(err.response?.data?.error || "Failed to update artist");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle>Edit Artist</DialogTitle>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-4 mt-4">
                    <div className="grid gap-2">
                        <Label htmlFor="edit-name">Full Name</Label>
                        <Input
                            id="edit-name"
                            name="name"
                            required
                            value={formData.name}
                            onChange={handleChange}
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="grid gap-2">
                            <Label htmlFor="edit-dob">Date of Birth</Label>
                            <Input
                                id="edit-dob"
                                name="dob"
                                type="date"
                                required
                                value={formData.dob}
                                onChange={handleChange}
                            />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="edit-gender">Gender</Label>
                            <Select
                                value={formData.gender}
                                onValueChange={(v) =>
                                    setFormData({ ...formData, gender: v })
                                }
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
                        <Label htmlFor="edit-address">Address</Label>
                        <Input
                            id="edit-address"
                            name="address"
                            required
                            value={formData.address}
                            onChange={handleChange}
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="grid gap-2">
                            <Label htmlFor="edit-first_release_year">First Release Year</Label>
                            <Input
                                id="edit-first_release_year"
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
                            <Label htmlFor="edit-no_of_albums_released">Albums Released</Label>
                            <Input
                                id="edit-no_of_albums_released"
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
                            {loading ? "Saving..." : "Update Artist"}
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
}

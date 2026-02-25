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

interface Song {
    id: number;
    title: string;
    album_name: string;
    genre: string;
}

interface EditMusicDialogProps {
    song: Song;
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onSuccess: () => void;
}

export default function EditMusicDialog({
    song,
    open,
    onOpenChange,
    onSuccess,
}: EditMusicDialogProps) {
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        title: song.title,
        album_name: song.album_name,
        genre: song.genre,
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            await api.put(`/music/${song.id}`, formData);
            toast.success("Song updated successfully");
            onOpenChange(false);
            onSuccess();
        } catch (err: any) {
            toast.error(err.response?.data?.error || "Failed to update song");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Edit Song</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4 mt-4">
                    <div className="space-y-2">
                        <Label>Title</Label>
                        <Input
                            required
                            value={formData.title}
                            onChange={(e) =>
                                setFormData({ ...formData, title: e.target.value })
                            }
                        />
                    </div>
                    <div className="space-y-2">
                        <Label>Album Name</Label>
                        <Input
                            required
                            value={formData.album_name}
                            onChange={(e) =>
                                setFormData({ ...formData, album_name: e.target.value })
                            }
                        />
                    </div>
                    <div className="space-y-2">
                        <Label>Genre</Label>
                        <Select
                            value={formData.genre}
                            onValueChange={(v) => setFormData({ ...formData, genre: v })}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Genre" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="rnb">R&B</SelectItem>
                                <SelectItem value="country">Country</SelectItem>
                                <SelectItem value="classic">Classic</SelectItem>
                                <SelectItem value="rock">Rock</SelectItem>
                                <SelectItem value="jazz">Jazz</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="flex justify-end pt-4">
                        <Button type="submit" disabled={loading}>
                            {loading ? "Saving..." : "Update Song"}
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
}

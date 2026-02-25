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

export default function AddMusicDialog({
  artistId,
  onSuccess,
}: {
  artistId: string;
  onSuccess: () => void;
}) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    album_name: "",
    genre: "rock",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post("/music", { ...formData, artist_id: parseInt(artistId) });
      toast.success("Song added successfully");
      setOpen(false);
      onSuccess();
    } catch (err: any) {
      toast.error(err.response?.data?.error || "Failed to add song");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="mr-2 h-4 w-4" /> Add Song
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add New Song</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <div className="space-y-2">
            <Label>Title</Label>
            <Input
              required
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
            />
          </div>
          <div className="space-y-2">
            <Label>Album Name</Label>
            <Input
              required
              onChange={(e) =>
                setFormData({ ...formData, album_name: e.target.value })
              }
            />
          </div>
          <div className="space-y-2">
            <Label>Genre</Label>
            <Select
              onValueChange={(v) => setFormData({ ...formData, genre: v })}
              defaultValue="rock"
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
              {loading ? "Saving..." : "Save Song"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

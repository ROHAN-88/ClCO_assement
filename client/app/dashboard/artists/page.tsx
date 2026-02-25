"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import api from "@/lib/api";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { toast } from "sonner";
import { Upload, Download, Trash2, Edit, Music } from "lucide-react";
import AddArtistDialog from "@/components/AddArtistDialog";
import EditArtistDialog from "@/components/EditArtistDialog";
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

interface Artist {
  id: number;
  name: string;
  dob: string;
  gender?: string;
  address?: string;
  first_release_year: number;
  no_of_albums_released: number;
}

export default function ArtistsPage() {
  const [artists, setArtists] = useState<Artist[]>([]);
  const [role, setRole] = useState<string | null>(null);
  const [editingArtist, setEditingArtist] = useState<Artist | null>(null);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  const fetchArtists = async () => {
    try {
      const { data } = await api.get("/artists");
      setArtists(data.data || []);
    } catch (err) {
      toast.error("Failed to fetch artists");
    }
  };

  useEffect(() => {
    setRole(localStorage.getItem("role"));
    fetchArtists();
  }, []);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    try {
      await api.post("/artists/import", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      toast.success("CSV Imported successfully");
      fetchArtists();
    } catch (err: any) {
      toast.error(err.response?.data?.error || "Import failed");
    } finally {
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const handleExportCSV = async () => {
    try {
      const response = await api.get("/artists/export", {
        responseType: "blob",
      });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "artists_export.csv");
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
      toast.success("CSV exported successfully");
    } catch (err: any) {
      toast.error("Failed to export CSV");
    }
  };

  const handleDelete = async () => {
    if (!deletingId) return;
    try {
      await api.delete(`/artists/${deletingId}`);
      toast.success("Artist removed successfully");
      fetchArtists();
    } catch (err) {
      toast.error("Error deleting artist");
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold tracking-tight">Artists</h1>

        {role === "artist_manager" && (
          <div className="flex gap-3">
            <input
              type="file"
              accept=".csv"
              className="hidden"
              ref={fileInputRef}
              onChange={handleFileUpload}
            />
            <Button
              variant="outline"
              onClick={() => fileInputRef.current?.click()}
            >
              <Upload className="mr-2 h-4 w-4" /> Import CSV
            </Button>

            <Button variant="outline" onClick={handleExportCSV}>
              <Download className="mr-2 h-4 w-4" /> Export CSV
            </Button>

            <AddArtistDialog onSuccess={fetchArtists} />
          </div>
        )}
      </div>

      <div className="border rounded-md bg-white">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>DOB</TableHead>
              <TableHead>First Release</TableHead>
              <TableHead>Albums</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {artists.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={5}
                  className="text-center py-8 text-muted-foreground"
                >
                  No artists found.
                </TableCell>
              </TableRow>
            ) : (
              artists.map((artist) => (
                <TableRow key={artist.id}>
                  <TableCell className="font-medium">{artist.name}</TableCell>
                  <TableCell>
                    {new Date(artist.dob).toLocaleDateString()}
                  </TableCell>
                  <TableCell>{artist.first_release_year}</TableCell>
                  <TableCell>{artist.no_of_albums_released}</TableCell>

                  <TableCell className="text-right flex justify-end gap-2">
                    {(role === "super_admin" || role === "artist_manager") && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() =>
                          router.push(`/dashboard/artists/${artist.id}/music`)
                        }
                      >
                        <Music className="h-4 w-4 mr-2" /> Songs
                      </Button>
                    )}

                    {role === "artist_manager" && (
                      <>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-blue-600"
                          onClick={() => setEditingArtist(artist)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-red-600"
                          onClick={() => setDeletingId(artist.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </>
                    )}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {editingArtist && (
        <EditArtistDialog
          artist={editingArtist}
          open={!!editingArtist}
          onOpenChange={(open) => {
            if (!open) setEditingArtist(null);
          }}
          onSuccess={fetchArtists}
        />
      )}

      <AlertDialog
        open={!!deletingId}
        onOpenChange={(open) => {
          if (!open) setDeletingId(null);
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Artist</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this artist? All their songs will
              also be removed. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              variant="destructive"
              onClick={handleDelete}
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

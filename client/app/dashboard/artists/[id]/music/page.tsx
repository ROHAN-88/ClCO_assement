"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import api from "@/lib/api";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Trash2, Edit, ArrowLeft } from "lucide-react";
import AddMusicDialog from "@/components/AddMusicDialog";
import EditMusicDialog from "@/components/EditMusicDialog";
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

interface Song {
  id: number;
  title: string;
  album_name: string;
  genre: string;
}

export default function ArtistMusicPage() {
  const params = useParams();
  const router = useRouter();
  const artistId = params.id as string;
  const [songs, setSongs] = useState<Song[]>([]);
  const [role, setRole] = useState<string | null>(null);
  const [editingSong, setEditingSong] = useState<Song | null>(null);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  const fetchSongs = async () => {
    try {
      const { data } = await api.get(`/music/artist/${artistId}`);
      setSongs(data);
    } catch (err) {
      toast.error("Failed to fetch songs");
    }
  };

  useEffect(() => {
    setRole(localStorage.getItem("role"));
    fetchSongs();
  }, [artistId]);

  const handleDelete = async () => {
    if (!deletingId) return;
    try {
      await api.delete(`/music/${deletingId}`);
      toast.success("Song deleted");
      fetchSongs();
    } catch (err) {
      toast.error("Error deleting song");
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4 mb-6">
        <Button variant="outline" size="icon" onClick={() => router.back()}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <h1 className="text-3xl font-bold">Artist's Songs</h1>
      </div>

      <div className="flex justify-between items-center">
        <p className="text-muted-foreground">
          Manage the discography for this artist.
        </p>

        {role === "artist" && (
          <AddMusicDialog artistId={artistId} onSuccess={fetchSongs} />
        )}
      </div>

      <div className="border rounded-md bg-white">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Title</TableHead>
              <TableHead>Album</TableHead>
              <TableHead>Genre</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {songs.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={4}
                  className="text-center py-8 text-muted-foreground"
                >
                  No songs found for this artist.
                </TableCell>
              </TableRow>
            ) : (
              songs.map((song) => (
                <TableRow key={song.id}>
                  <TableCell className="font-medium">{song.title}</TableCell>
                  <TableCell>{song.album_name}</TableCell>
                  <TableCell className="capitalize">{song.genre}</TableCell>

                  <TableCell className="text-right">
                    {role === "artist" ? (
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-blue-600"
                          onClick={() => setEditingSong(song)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-red-600"
                          onClick={() => setDeletingId(song.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    ) : (
                      <span className="text-xs text-slate-400">View Only</span>
                    )}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {editingSong && (
        <EditMusicDialog
          song={editingSong}
          open={!!editingSong}
          onOpenChange={(open) => {
            if (!open) setEditingSong(null);
          }}
          onSuccess={fetchSongs}
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
            <AlertDialogTitle>Delete Song</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this song? This action cannot be
              undone.
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

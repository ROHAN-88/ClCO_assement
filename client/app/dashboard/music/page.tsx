"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Mic2, Music } from "lucide-react";
import { useEffect, useState } from "react";

export default function GlobalMusicPage() {
  const router = useRouter();
  const [role, setRole] = useState<string | null>(null);

  useEffect(() => {
    const currentRole = localStorage.getItem("role");
    setRole(currentRole);

    if (currentRole === "artist") {
      const artistId = localStorage.getItem("artist_id");
      if (artistId) {
        router.push(`/dashboard/artists/${artistId}/music`);
      }
    }
  }, [router]);

  return (
    <div className="h-[80vh] flex items-center justify-center">
      <Card className="max-w-md text-center shadow-sm border-slate-200">
        <CardHeader>
          <div className="mx-auto bg-slate-100 p-4 rounded-full mb-4 w-fit">
            <Music className="h-8 w-8 text-slate-600" />
          </div>
          <CardTitle className="text-2xl">Music Management</CardTitle>
          <CardDescription className="text-base mt-2">
            Songs are organized by artist. To view, add, or manage songs, you
            must select an artist first.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {role === "super_admin" || role === "artist_manager" ? (
            <Button
              size="lg"
              className="w-full mt-2"
              onClick={() => router.push("/dashboard/artists")}
            >
              <Mic2 className="mr-2 h-5 w-5" /> Go to Artists List
            </Button>
          ) : (
            <p className="text-sm text-amber-600 bg-amber-50 p-3 rounded-md border border-amber-200">
              Your artist profile is currently being set up. Please try logging
              in again later.
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

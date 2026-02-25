"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { Users, Mic2, Music, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [role, setRole] = useState<string | null>(null);
  const [artistId, setArtistId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const storedRole = localStorage.getItem("role");
    const token = localStorage.getItem("token");
    const storedArtistId = localStorage.getItem("artist_id");

    if (!token || !storedRole) {
      router.push("/login");
    } else {
      setRole(storedRole);
      setArtistId(storedArtistId);
      setLoading(false);
    }
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("artist_id");
    router.push("/login");
  };

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading...
      </div>
    );

  const musicHref =
    role === "artist" && artistId
      ? `/dashboard/artists/${artistId}/music`
      : "/dashboard/music";

  return (
    <div className="flex min-h-screen bg-slate-50">
      <aside className="w-64 bg-white border-r flex flex-col">
        <div className="p-6 border-b">
          <h2 className="text-xl font-bold tracking-tight">AMS Panel</h2>
          <p className="text-sm text-muted-foreground capitalize mt-1">
            Role: {role?.replace("_", " ")}
          </p>
        </div>

        <nav className="flex-1 p-4 space-y-2">
          {role === "super_admin" && (
            <Link
              href="/dashboard/users"
              className={`flex items-center gap-3 px-3 py-2 rounded-md transition-colors ${pathname.includes("/users") ? "bg-slate-100 text-slate-900" : "text-slate-600 hover:bg-slate-50"}`}
            >
              <Users size={20} /> Users
            </Link>
          )}

          {(role === "super_admin" || role === "artist_manager") && (
            <Link
              href="/dashboard/artists"
              className={`flex items-center gap-3 px-3 py-2 rounded-md transition-colors ${pathname.includes("/artists") ? "bg-slate-100 text-slate-900" : "text-slate-600 hover:bg-slate-50"}`}
            >
              <Mic2 size={20} /> Artists
            </Link>
          )}

          <Link
            href={musicHref}
            className={`flex items-center gap-3 px-3 py-2 rounded-md transition-colors ${pathname.includes("/music") ? "bg-slate-100 text-slate-900" : "text-slate-600 hover:bg-slate-50"}`}
          >
            <Music size={20} /> {role === "artist" ? "My Music" : "Music"}
          </Link>
        </nav>

        <div className="p-4 border-t">
          <Button
            variant="ghost"
            className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50"
            onClick={handleLogout}
          >
            <LogOut size={20} className="mr-3" /> Logout
          </Button>
        </div>
      </aside>

      <main className="flex-1 p-8">{children}</main>
    </div>
  );
}

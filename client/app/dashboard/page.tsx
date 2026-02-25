"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function DashboardPage() {
    const router = useRouter();

    useEffect(() => {
        const role = localStorage.getItem("role");
        const artistId = localStorage.getItem("artist_id");

        if (role === "super_admin") {
            router.replace("/dashboard/users");
        } else if (role === "artist_manager") {
            router.replace("/dashboard/artists");
        } else if (role === "artist" && artistId) {
            router.replace(`/dashboard/artists/${artistId}/music`);
        } else {
            router.replace("/dashboard/music");
        }
    }, [router]);

    return (
        <div className="flex items-center justify-center h-[80vh]">
            <p className="text-muted-foreground animate-pulse">Loading dashboard...</p>
        </div>
    );
}

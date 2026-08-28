import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { logout } from "./actions";

export default async function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("display_name, role")
    .eq("id", user.id)
    .single();

  if (!profile || !["admin", "moderator"].includes(profile.role)) {
    redirect("/");
  }

  return (
    <div className="min-h-screen bg-[#070A0F] text-slate-100">
      <header className="border-b border-slate-800 bg-[#0F172A]">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">
          <div>
            <Link
              href="/admin"
              className="font-mono text-sm font-bold uppercase tracking-[0.2em] text-cyan-400"
            >
              G-Archive Control
            </Link>

            <p className="mt-1 font-mono text-[10px] uppercase tracking-wider text-slate-500">
              {profile.display_name ?? user.email}
              {" // "}
              {profile.role}{" "}
            </p>
          </div>

          <div className="flex items-center gap-4">
            <Link
              href="/"
              className="font-mono text-xs uppercase tracking-wider text-slate-400 hover:text-cyan-400"
            >
              View website
            </Link>

            <form action={logout}>
              <button
                type="submit"
                className="border border-slate-700 px-4 py-2 font-mono text-xs uppercase tracking-wider text-slate-400 hover:border-red-400 hover:text-red-400"
              >
                Logout
              </button>
            </form>
          </div>
        </div>
      </header>

      {children}
    </div>
  );
}

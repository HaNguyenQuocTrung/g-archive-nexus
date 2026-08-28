import type { Metadata } from "next";
import { login } from "./actions";

export const metadata: Metadata = {
  title: "Archive Login",
  description: "Access your G-Archive Nexus account.",
};

interface LoginPageProps {
  searchParams: Promise<{
    error?: string;
  }>;
}

export default async function LoginPage({
  searchParams,
}: LoginPageProps) {
  const { error } = await searchParams;

  return (
    <main className="min-h-screen bg-[#070A0F] px-6 py-20 text-slate-100">
      <section className="mx-auto max-w-md border border-slate-800 bg-[#0F172A] p-8">
        <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-cyan-400">
          Secure archive access
        </p>

        <h1 className="mt-4 text-3xl font-bold uppercase">
          Operator Login
        </h1>

        <p className="mt-3 text-sm leading-6 text-slate-400">
          Authenticate to access your G-Archive Nexus account.
        </p>

        {error ? (
          <div className="mt-6 border border-red-500/40 bg-red-500/10 px-4 py-3 font-mono text-xs text-red-300">
            {error}
          </div>
        ) : null}

        <form action={login} className="mt-8 space-y-5">
          <div>
            <label
              htmlFor="email"
              className="font-mono text-[10px] uppercase tracking-[0.2em] text-slate-400"
            >
              Email
            </label>

            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              className="mt-2 w-full border border-slate-700 bg-[#070A0F] px-4 py-3 text-sm outline-none transition focus:border-cyan-400"
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="font-mono text-[10px] uppercase tracking-[0.2em] text-slate-400"
            >
              Password
            </label>

            <input
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              required
              className="mt-2 w-full border border-slate-700 bg-[#070A0F] px-4 py-3 text-sm outline-none transition focus:border-cyan-400"
            />
          </div>

          <button
            type="submit"
            className="w-full border border-cyan-400 bg-cyan-400 px-5 py-3 font-mono text-xs font-bold uppercase tracking-[0.2em] text-slate-950 transition hover:bg-cyan-300"
          >
            Authenticate
          </button>
        </form>
      </section>
    </main>
  );
}
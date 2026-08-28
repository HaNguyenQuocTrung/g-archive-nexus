"use client";

import { useEffect } from "react";

interface ErrorPageProps {
  error: Error & {
    digest?: string;
  };
  reset: () => void;
}

export default function ErrorPage({
  error,
  reset,
}: ErrorPageProps) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main className="flex min-h-screen items-center justify-center 
bg-[#070A0F] px-6 text-white">
      <section className="w-full max-w-xl border border-red-500/30 
bg-[#0F172A] p-8">
        <p className="font-mono text-sm uppercase tracking-[0.3em] 
text-red-400">
          System Error // GAN-ERR
        </p>

        <h1 className="mt-4 text-3xl font-bold uppercase">
          Archive connection interrupted
        </h1>

        <p className="mt-4 text-slate-400">
          G-Archive Nexus encountered an unexpected system error.
        </p>

        {error.digest && (
          <p className="mt-3 font-mono text-xs text-slate-500">
            Error reference: {error.digest}
          </p>
        )}

        <button
          type="button"
          onClick={reset}
          className="mt-8 border border-cyan-400 px-5 py-3 font-mono 
text-sm uppercase tracking-wider text-cyan-300 transition-colors 
hover:bg-cyan-400 hover:text-slate-950"
        >
          Retry connection
        </button>
      </section>
    </main>
  );
}


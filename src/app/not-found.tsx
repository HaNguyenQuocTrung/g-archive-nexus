import Link from "next/link";

export default function NotFound() {
  return (
    <main className="flex min-h-screen items-center justify-center 
bg-[#070A0F] px-6 text-white">
      <section className="max-w-xl text-center">
        <p className="font-mono text-sm uppercase tracking-[0.3em] 
text-red-400">
          Error 404 // Archive record missing
        </p>

        <h1 className="mt-4 text-4xl font-bold uppercase">
          Data not found
        </h1>

        <p className="mt-4 text-slate-400">
          The requested archive record does not exist or has been 
restricted.
        </p>

        <Link
          href="/"
          className="mt-8 inline-block border border-cyan-400 px-5 py-3 
font-mono text-sm uppercase tracking-wider text-cyan-300 transition-colors 
hover:bg-cyan-400 hover:text-slate-950"
        >
          Return to terminal
        </Link>
      </section>
    </main>
  );
}

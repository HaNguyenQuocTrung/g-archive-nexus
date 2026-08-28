export default function Loading() {
  return (
    <main className="flex min-h-screen items-center justify-center 
bg-[#070A0F] text-white">
      <section className="text-center">
        <div className="mx-auto h-12 w-12 animate-spin border-2 
border-slate-700 border-t-cyan-400" />

        <p className="mt-6 font-mono text-sm uppercase tracking-[0.3em] 
text-cyan-400">
          Accessing archive
        </p>

        <p className="mt-2 font-mono text-xs text-slate-500">
          SYSTEM STATUS // LOADING DATA
        </p>
      </section>
    </main>
  );
}

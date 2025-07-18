export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <section>
      <div className="flex min-h-screen w-full">
        <main className="flex-1 w-full overflow-auto">{children}</main>
      </div>
    </section>
  );
}

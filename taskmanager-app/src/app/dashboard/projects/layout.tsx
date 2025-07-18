export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen w-screen">
      <main className="flex-1 overflow-hidden">{children}</main>
    </div>
  );
}

import { Toaster } from "react-hot-toast";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex w-full h-full p-10 max-w-screen-xl mx-auto">
      {children}
      <Toaster />
    </div>
  );
}

import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "./Provider";
import { ToastProvider } from "@/components/ui/toast";
import { useUserStore } from "@/hooks/useUserStore";
import { getCookie } from "cookies-next";
import { useEffect } from "react";

export const metadata: Metadata = {
  title: "Таймер тренувань",
  description: "Створюй тренування та відстежуй свої прогреси",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const user = useUserStore((state) => state.user);
  const setUser = useUserStore((state) => state.setUser);
  useEffect(() => {
    async function fetchProfile() {
      const jwt = getCookie("jwt");
      if (jwt && !user) {
        const res = await fetch("/api/profile", {
          headers: { Authorization: `Bearer ${jwt}` },
        });
        if (res.ok) {
          const profile = await res.json();
          setUser(profile);
        }
      }
    }
    fetchProfile();
  }, [user, setUser]);
  return (
    <html lang="en">
      <body>
        <Providers>{children}</Providers>
        <ToastProvider />
      </body>
    </html>
  );
}

"use client";

import { useRouter } from "next/navigation";

export function LogoutButton() {
  const router = useRouter();

  return (
    <button
      onClick={async () => {
        await fetch("/api/auth/logout", { method: "POST" });
        router.push("/");
        router.refresh();
      }}
      className="text-on-surface-variant hover:text-primary transition-colors duration-500 font-label-sm text-label-sm uppercase tracking-widest"
    >
      Log Out
    </button>
  );
}

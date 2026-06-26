"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export function GuestButton({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  return (
    <button
      type="button"
      disabled={loading}
      onClick={async () => {
        setLoading(true);
        await fetch("/api/auth/guest", { method: "POST" });
        router.push("/");
        router.refresh();
      }}
      className={className}
    >
      {loading ? "Entering…" : children}
    </button>
  );
}

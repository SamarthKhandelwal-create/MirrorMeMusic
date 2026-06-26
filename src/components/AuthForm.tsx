"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { GuestButton } from "@/components/GuestButton";

const GOOGLE_ERROR_MESSAGES: Record<string, string> = {
  google_not_configured: "Google sign-in isn't configured yet.",
  google_state_mismatch: "That sign-in attempt expired. Please try again.",
  google_token_exchange_failed: "Google sign-in failed. Please try again.",
  google_userinfo_failed: "Google sign-in failed. Please try again.",
  google_unknown_error: "Something went wrong with Google sign-in. Please try again.",
};

export function AuthForm({ mode }: { mode: "login" | "signup" }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const googleError = searchParams.get("error");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const endpoint = mode === "login" ? "/api/auth/login" : "/api/auth/signup";
    const payload =
      mode === "login" ? { email, password } : { email, password, displayName };

    try {
      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Something went wrong.");
        setLoading(false);
        return;
      }
      router.push("/");
      router.refresh();
    } catch {
      setError("Could not reach the server. Please try again.");
      setLoading(false);
    }
  }

  return (
    <div className="flex flex-col gap-6 w-full max-w-md">
      {googleError && (
        <p className="text-error font-body-md text-sm border border-error/30 bg-error-container/10 rounded px-4 py-3">
          {GOOGLE_ERROR_MESSAGES[googleError] ?? "Google sign-in failed. Please try again."}
        </p>
      )}
      <a
        href="/api/auth/google"
        className="flex items-center justify-center gap-3 px-8 py-4 border border-outline-variant bg-surface-container-low hover:bg-surface-container transition-all duration-300 rounded press-scale"
      >
        <svg viewBox="0 0 48 48" className="w-5 h-5" aria-hidden="true">
          <path
            fill="#FFC107"
            d="M43.611 20.083H42V20H24v8h11.303c-1.649 4.657-6.08 8-11.303 8-6.627 0-12-5.373-12-12s5.373-12 12-12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4 12.955 4 4 12.955 4 24s8.955 20 20 20 20-8.955 20-20c0-1.341-.138-2.65-.389-3.917z"
          />
          <path
            fill="#FF3D00"
            d="M6.306 14.691l6.571 4.819C14.655 15.108 18.961 12 24 12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4 16.318 4 9.656 8.337 6.306 14.691z"
          />
          <path
            fill="#4CAF50"
            d="M24 44c5.166 0 9.86-1.977 13.409-5.192l-6.19-5.238C29.211 35.091 26.715 36 24 36c-5.202 0-9.619-3.317-11.283-7.946l-6.522 5.025C9.505 39.556 16.227 44 24 44z"
          />
          <path
            fill="#1976D2"
            d="M43.611 20.083H42V20H24v8h11.303a12.04 12.04 0 0 1-4.087 5.571l6.19 5.238C40.205 35.836 44 30.318 44 24c0-1.341-.138-2.65-.389-3.917z"
          />
        </svg>
        <span className="font-label-sm text-label-sm text-on-surface uppercase tracking-widest">
          Continue with Google
        </span>
      </a>
      <GuestButton className="flex items-center justify-center gap-2 px-8 py-4 border border-outline-variant/50 bg-transparent hover:bg-surface-container-low transition-all duration-300 rounded text-on-surface-variant hover:text-primary disabled:opacity-50 press-scale">
        <span className="material-symbols-outlined text-[18px]" style={{ fontVariationSettings: "'FILL' 0" }}>
          visibility
        </span>
        <span className="font-label-sm text-label-sm uppercase tracking-widest">
          Continue as Guest
        </span>
      </GuestButton>
      <div className="flex items-center gap-4">
        <div className="flex-1 h-px bg-outline-variant" />
        <span className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-widest">
          Or
        </span>
        <div className="flex-1 h-px bg-outline-variant" />
      </div>
      <form onSubmit={handleSubmit} className="flex flex-col gap-6">
        {mode === "signup" && (
        <div className="flex flex-col gap-2">
          <label className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-widest">
            Display Name
          </label>
          <input
            type="text"
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
            placeholder="Your artist name"
            className="bg-surface-container-low border border-outline-variant rounded px-4 py-3 text-on-surface font-body-md focus:outline-none focus:border-primary transition-colors"
          />
        </div>
      )}
      <div className="flex flex-col gap-2">
        <label className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-widest">
          Email
        </label>
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@example.com"
          className="bg-surface-container-low border border-outline-variant rounded px-4 py-3 text-on-surface font-body-md focus:outline-none focus:border-primary transition-colors"
        />
      </div>
      <div className="flex flex-col gap-2">
        <label className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-widest">
          Password
        </label>
        <input
          type="password"
          required
          minLength={8}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="At least 8 characters"
          className="bg-surface-container-low border border-outline-variant rounded px-4 py-3 text-on-surface font-body-md focus:outline-none focus:border-primary transition-colors"
        />
      </div>
      {error && (
        <p className="text-error font-body-md text-sm border border-error/30 bg-error-container/10 rounded px-4 py-3">
          {error}
        </p>
      )}
      <button
        type="submit"
        disabled={loading}
        className="relative overflow-hidden px-8 py-4 border border-primary/30 bg-transparent hover:bg-primary/10 transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-50 press-scale"
      >
        <span className="font-label-sm text-label-sm text-primary tracking-widest uppercase">
          {loading ? "Please wait…" : mode === "login" ? "Enter the Mirror" : "Begin the Ritual"}
        </span>
      </button>
      </form>
    </div>
  );
}

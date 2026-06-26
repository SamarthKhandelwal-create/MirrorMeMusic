"use client";

import { useState } from "react";

type Project = {
  id: string;
  title: string;
  type: string;
  description: string;
  coverImageUrl: string;
  createdAt: string;
};

export function ArchiveManager({ initialProjects }: { initialProjects: Project[] }) {
  const [projects, setProjects] = useState(initialProjects);
  const [title, setTitle] = useState("");
  const [type, setType] = useState("EP");
  const [description, setDescription] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim()) return;
    setSubmitting(true);
    const res = await fetch("/api/archive", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, type, description }),
    });
    if (res.ok) {
      const data = await res.json();
      setProjects((prev) => [data.project, ...prev]);
      setTitle("");
      setDescription("");
    }
    setSubmitting(false);
  }

  async function handleDelete(id: string) {
    await fetch(`/api/archive/${id}`, { method: "DELETE" });
    setProjects((prev) => prev.filter((p) => p.id !== id));
  }

  return (
    <div className="space-y-12">
      <form
        onSubmit={handleAdd}
        className="bronze-filigree-border space-y-4"
      >
        <div className="inline-flex items-center px-4 py-2 border border-primary/50 text-primary font-label-sm text-label-sm uppercase mb-2 tracking-[0.2em] bg-surface-container-high/50">
          Add to Library
        </div>
        <div className="grid grid-cols-1 md:grid-cols-[2fr_1fr] gap-4">
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Project title"
            className="bg-surface-container-lowest border border-primary/20 rounded px-4 py-3 text-on-surface font-body-md focus:outline-none focus:border-primary transition-colors"
          />
          <select
            value={type}
            onChange={(e) => setType(e.target.value)}
            className="bg-surface-container-lowest border border-primary/20 rounded px-4 py-3 text-on-surface font-body-md focus:outline-none focus:border-primary transition-colors"
          >
            {["EP", "Single", "Album", "Mixtape", "Demo"].map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
        </div>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Description"
          rows={2}
          className="w-full bg-surface-container-lowest border border-primary/20 rounded px-4 py-3 text-on-surface font-body-md focus:outline-none focus:border-primary transition-colors resize-none"
        />
        <button
          type="submit"
          disabled={submitting || !title.trim()}
          className="px-6 py-3 border border-primary/50 rounded-full font-label-sm text-label-sm text-primary hover:bg-primary/10 transition-all duration-300 disabled:opacity-50 press-scale"
        >
          {submitting ? "Adding…" : "Add Artifact"}
        </button>
      </form>

      {projects.length === 0 ? (
        <p className="text-on-surface-variant italic text-center font-body-md">
          Your library is empty. Add your first project above.
        </p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {projects.map((p) => (
            <div
              key={p.id}
              className="glass-morphic p-6 rounded-sm space-y-3 relative group animate-fade-up transition-shadow duration-300 hover:shadow-[0_8px_30px_rgba(0,0,0,0.4)]"
            >
              <button
                onClick={() => handleDelete(p.id)}
                className="absolute top-4 right-4 material-symbols-outlined text-on-surface-variant text-sm opacity-0 group-hover:opacity-100 hover:text-error transition-all"
                aria-label="Delete"
              >
                delete
              </button>
              <p className="font-label-sm text-label-sm text-primary uppercase tracking-widest">{p.type}</p>
              <h3 className="font-headline-md text-headline-md text-on-surface italic">{p.title}</h3>
              {p.description && (
                <p className="font-body-md text-body-md text-on-surface-variant">{p.description}</p>
              )}
              <p className="font-label-sm text-[10px] text-outline uppercase tracking-widest">
                {new Date(p.createdAt).toLocaleDateString()}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

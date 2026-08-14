# Claude Cowork Prompt — Connect MirrorMeMusic.com (Namecheap → Vercel)

Copy everything below the line into Claude Cowork.

---

I want to connect my Namecheap domain **MirrorMeMusic.com** to my Next.js site, which is already deployed on Vercel. Walk me through it and verify each step actually worked before moving on.

## Where things stand

- **Repo:** `SamarthKhandelwal-create/MirrorMeMusic`, deploying from `main`
- **Host:** Vercel, already live on its `.vercel.app` URL
- **Registrar:** Namecheap — I own `mirrormemusic.com`
- **Database:** Neon Postgres, already connected and migrated
- **Stack:** Next.js 16 (App Router), Prisma 7, custom JWT auth, Google OAuth, Gemini

I have access to both the Vercel and Namecheap dashboards. I have not started the domain setup.

## Decide this first

**Which hostname is canonical — `www.mirrormemusic.com` or the bare `mirrormemusic.com`?**

Ask me before configuring anything, because it determines the DNS records, the redirect direction, and a code change.

Relevant fact: `src/app/layout.tsx` currently sets

```ts
metadataBase: new URL("https://www.mirrormemusic.com")
```

So the code currently assumes **www**. If I choose the apex instead, that line must change to match, or canonical URLs and social preview links will point at the wrong host. Don't leave it inconsistent.

My default preference is **www** unless you give me a concrete reason otherwise. Whichever we pick, the other must 301-redirect to it — both resolving independently splits SEO and can break sessions, since a cookie set on one host isn't sent to the other.

## Steps

### 1. Add the domain in Vercel

Vercel project → **Settings → Domains** → add both `mirrormemusic.com` and `www.mirrormemusic.com`. Set the non-canonical one to redirect to the canonical one.

Vercel will then display the exact DNS records it wants. **Use the values Vercel shows, not values from memory or a blog post** — Vercel has changed its recommended IPs before, and a stale A record fails in a way that looks like a propagation delay for hours.

### 2. Configure DNS at Namecheap

Namecheap → **Domain List** → Manage → **Advanced DNS**.

Important: the "Host Records" section only applies when **Nameservers** is set to *Namecheap BasicDNS*. If it's on *Custom DNS* or *Namecheap Web Hosting DNS*, records added there will be ignored. Check this first — it's the most common reason a correct-looking setup does nothing.

Then:
- Delete Namecheap's default **parking page** records. A leftover `CNAME` on `www` pointing to `parkingpage.namecheap.com`, or an A record on `@`, will conflict and keep serving the parking page.
- Add the records Vercel gave you (typically an `A` record on `@` and a `CNAME` on `www` → `cname.vercel-dns.com`, but defer to the dashboard).
- Set TTL to **Automatic** or 1 min while we're testing, so mistakes don't cache for hours.

### 3. Verify DNS actually propagated

Don't rely on the browser — it caches aggressively and will mislead you. Check from the command line:

```bash
dig +short mirrormemusic.com
dig +short www.mirrormemusic.com
dig +short mirrormemusic.com @8.8.8.8   # an external resolver, not my ISP's cache
```

Confirm the answers match what Vercel asked for. Propagation is usually minutes but can take up to 48 hours; if the records look right, the correct move is to wait, not to keep changing them.

### 4. Wait for the SSL certificate

Vercel issues a Let's Encrypt cert automatically once DNS resolves. The domain will show **Invalid Configuration** until then — that's expected, not an error to fix.

Verify it landed:

```bash
curl -sI https://www.mirrormemusic.com | head -20
```

Expect `HTTP/2 200`. A TLS error means the cert hasn't issued yet.

### 5. Update Google OAuth — sign-in breaks without this

The OAuth routes build their redirect from `req.nextUrl.origin` (see `src/app/api/auth/google/route.ts` and `callback/route.ts`), so **no code change is needed** — they adapt to whatever host serves them. But Google rejects any redirect URI it hasn't been told about.

Google Cloud Console → **APIs & Services → Credentials** → my OAuth 2.0 client → **Authorized redirect URIs**. Add, keeping the existing entries:

```
https://www.mirrormemusic.com/api/auth/google/callback
https://mirrormemusic.com/api/auth/google/callback
```

Add both, even though one redirects — a user can hit either host before the redirect fires.

Under **Authorized JavaScript origins**, add `https://www.mirrormemusic.com` and `https://mirrormemusic.com`.

Keep `http://localhost:3000/api/auth/google/callback` so local dev keeps working.

Symptom if skipped: `Error 400: redirect_uri_mismatch` at sign-in.

### 6. Verify end to end on the live domain

Report what actually happened, including anything broken:

- [ ] `https://www.mirrormemusic.com` loads
- [ ] The non-canonical host 301-redirects to the canonical one (`curl -sI` and check the `location` header)
- [ ] `http://` upgrades to `https://`
- [ ] Homepage renders: animated gold mirror, curved title, shattered-glass crack
- [ ] Clicking the crack plays the shatter sound and jolts the frame
- [ ] The lobby music toggle (bottom-right) plays — it's a Web Audio synth, needs a click, browsers block autoplay
- [ ] Email/password signup works, then log out and back in — session persists
- [ ] **Google sign-in completes** — most likely thing to fail
- [ ] Both About-page tracks play and seek: "Head Over Heels" (mp3) and "No One Knows Me" (m4a/AAC)
- [ ] AI Strategist returns a Gemini response
- [ ] Create a library entry, hard-refresh, confirm it persisted — proves Postgres is wired correctly
- [ ] Favicon shows the purple diamond (hard-refresh; favicons cache hard)

### 7. Only if I chose the apex domain

Update `metadataBase` in `src/app/layout.tsx` to `https://mirrormemusic.com`, then commit and push so Vercel redeploys. Skip entirely if we're using www.

## How I want you to work

- Show me each command before running it, and show real output.
- If something fails, show the actual error rather than summarizing it.
- Don't mark anything verified you haven't observed working. DNS especially — "should be propagated by now" is not verification.
- Tell me plainly when the correct action is to wait.
- Never ask me to paste API keys or secrets into the chat. Nothing in this task needs them.

## Things that commonly go wrong

- **Nameservers not on Namecheap BasicDNS** → Advanced DNS records silently ignored
- **Parking page records left in place** → conflicts with Vercel's records
- **Both hosts resolving with no redirect** → split SEO, and sessions break when a cookie set on `www` isn't sent to the apex
- **Google OAuth URIs not updated** → `redirect_uri_mismatch`
- **Judging propagation from a browser** → cached results; use `dig` against an external resolver
- **`metadataBase` disagreeing with the canonical host** → wrong canonical tags and broken social previews

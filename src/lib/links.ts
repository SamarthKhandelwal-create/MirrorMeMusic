/**
 * External links for the artist.
 *
 * Leave a value as an empty string until the real URL exists — the site hides
 * the corresponding link rather than shipping a dead one. To go live, paste
 * the URL in and redeploy; no other change is needed.
 */
export const SPOTIFY_ARTIST_URL = "";

/**
 * The next single. Set `released` to true and fill in `spotifyUrl` on release
 * day; until then the About page shows it as coming soon.
 */
export const UPCOMING_SINGLE = {
  title: "No One Knows Me",
  released: false,
  spotifyUrl: "",
} as const;

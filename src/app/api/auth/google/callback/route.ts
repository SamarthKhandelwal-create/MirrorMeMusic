import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";
import { createSession } from "@/lib/auth";

const STATE_COOKIE = "google_oauth_state";

type GoogleUserInfo = {
  sub: string;
  email: string;
  email_verified: boolean;
  name?: string;
  picture?: string;
};

export async function GET(req: NextRequest) {
  const clientId = process.env.GOOGLE_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
  const loginUrl = new URL("/login", req.nextUrl.origin);

  if (!clientId || !clientSecret) {
    loginUrl.searchParams.set("error", "google_not_configured");
    return NextResponse.redirect(loginUrl);
  }

  const code = req.nextUrl.searchParams.get("code");
  const state = req.nextUrl.searchParams.get("state");

  const cookieStore = await cookies();
  const expectedState = cookieStore.get(STATE_COOKIE)?.value;
  cookieStore.delete(STATE_COOKIE);

  if (!code || !state || !expectedState || state !== expectedState) {
    loginUrl.searchParams.set("error", "google_state_mismatch");
    return NextResponse.redirect(loginUrl);
  }

  const redirectUri = `${req.nextUrl.origin}/api/auth/google/callback`;

  try {
    const tokenRes = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        client_id: clientId,
        client_secret: clientSecret,
        code,
        grant_type: "authorization_code",
        redirect_uri: redirectUri,
      }),
    });

    if (!tokenRes.ok) {
      console.error("Google token exchange failed", await tokenRes.text());
      loginUrl.searchParams.set("error", "google_token_exchange_failed");
      return NextResponse.redirect(loginUrl);
    }

    const tokenData = await tokenRes.json();
    const accessToken = tokenData.access_token as string;

    const userInfoRes = await fetch("https://www.googleapis.com/oauth2/v3/userinfo", {
      headers: { Authorization: `Bearer ${accessToken}` },
    });

    if (!userInfoRes.ok) {
      console.error("Google userinfo fetch failed", await userInfoRes.text());
      loginUrl.searchParams.set("error", "google_userinfo_failed");
      return NextResponse.redirect(loginUrl);
    }

    const googleUser = (await userInfoRes.json()) as GoogleUserInfo;
    const email = googleUser.email.toLowerCase();

    let user = await prisma.user.findUnique({ where: { googleId: googleUser.sub } });

    if (!user) {
      const existingByEmail = await prisma.user.findUnique({ where: { email } });
      if (existingByEmail) {
        user = await prisma.user.update({
          where: { id: existingByEmail.id },
          data: {
            googleId: googleUser.sub,
            avatarUrl: googleUser.picture ?? existingByEmail.avatarUrl,
            displayName: existingByEmail.displayName ?? googleUser.name ?? null,
          },
        });
      } else {
        user = await prisma.user.create({
          data: {
            email,
            googleId: googleUser.sub,
            displayName: googleUser.name ?? null,
            avatarUrl: googleUser.picture ?? null,
          },
        });
      }
    }

    await createSession(user.id);

    return NextResponse.redirect(new URL("/", req.nextUrl.origin));
  } catch (err) {
    console.error("Google OAuth callback failed", err);
    loginUrl.searchParams.set("error", "google_unknown_error");
    return NextResponse.redirect(loginUrl);
  }
}

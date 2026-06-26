import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { StrategistChat } from "@/components/StrategistChat";

export default async function StrategistPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  const sessions = await prisma.chatSession.findMany({
    where: { userId: user.id },
    orderBy: { updatedAt: "desc" },
    include: { messages: { orderBy: { createdAt: "desc" }, take: 1 } },
  });

  const initialSessions = sessions.map((s: typeof sessions[number]) => ({
    id: s.id,
    title: s.title,
    tags: s.tags,
    updatedAt: s.updatedAt.toISOString(),
    lastMessage: s.messages[0]?.content ?? "",
  }));

  return (
    <StrategistChat
      initialSessions={initialSessions}
      userLabel={user.displayName || user.email}
      isGuest={user.isGuest}
    />
  );
}

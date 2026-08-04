/**
 * MIRROR: SHATTERED (Deluxe Edition) — full track guide.
 * `accent` drives the per-track color highlight in the tracklist UI.
 * Tracks tied to an artifact carry `artifact` + `artifactMeaning`.
 */

export type MirrorTrack = {
  num: number;
  title: string;
  kind: "skit" | "song" | "interlude" | "single" | "remix";
  /** Label shown beside the title, e.g. "Lead Single". */
  badge?: string;
  accent: string;
  summary: string;
  artifact?: string;
  artifactMeaning?: string;
};

export const DISC_ONE: MirrorTrack[] = [
  {
    num: 1,
    title: "Mirror, Pt. 1: Self-Realization",
    kind: "skit",
    badge: "Skit #1",
    accent: "#8b8b9e",
    summary:
      "Seven years after disappearing into the Mirrorverse, a 20-year-old Joey begins his first therapy session. Rather than treating his experience as a tragedy, his therapist challenges him to understand why it happened and what it taught him. Together they begin unpacking the journey, framing the Mirrorverse not as a place of punishment, but as the internal world every teenager unknowingly enters while growing into adulthood.",
  },
  {
    num: 2,
    title: "Want It All Back",
    kind: "song",
    badge: "Prelude",
    accent: "#9aa5c4",
    summary:
      "Before telling his story, Joey expresses the emotional weight he still carries from those seven years. The song captures the universal desire to reclaim innocence, familiarity, and the simpler version of ourselves that existed before adolescence complicated everything. It serves as both an emotional introduction to the therapist and a reminder that growing up always means leaving part of yourself behind.",
  },
  {
    num: 3,
    title: "Relentless",
    kind: "song",
    badge: "Monologue",
    accent: "#a4708a",
    summary:
      "Joey begins recounting the night everything changed. Alone in his bedroom, overwhelmed by a toxic relationship and the emotional confusion of being thirteen, he unknowingly stands at the threshold of the Mirrorverse. The song establishes that the fantasy world is born from very real teenage struggles, showing how unhealthy relationships and emotional instability often become the first defining crossroads of adolescence.",
  },
  {
    num: 4,
    title: "Welcome To The Mirrorverse",
    kind: "interlude",
    badge: "Interlude",
    accent: "#6f7fae",
    summary:
      "A spilled bottle of medication, a fallen glass of water, and a surge of electricity awaken the mirror in Joey's bathroom. As the lights flicker and his reflection smiles back for the first time, he's violently pulled into the Mirrorverse. From this point forward, every world contains its own mirror, and each time Joey learns the lesson that world exists to teach, he steps through that mirror into the next challenge. The Mirrorverse itself becomes a symbol for the emotional maze of adolescence — constantly changing, unpredictable, frightening, and ultimately transformative.",
  },
  {
    num: 5,
    title: "Striped (XO, XO)",
    kind: "single",
    badge: "Lead Single",
    accent: "#c9c9d4",
    artifact: "The Striped Suit",
    artifactMeaning:
      "Accepting that people are beautifully inconsistent — and stepping into the responsibility of adulthood.",
    summary:
      "Joey awakens inside the first world: the Striped Room, an endless black chamber filled with flashing mirrors and distorted reflections. Here he confronts what appears to be a hostile version of himself, only to later discover it is his future self desperately trying to warn him about the consequences of remaining in a toxic relationship. By choosing to walk away, Joey earns the striped suit — his first artifact — which symbolizes accepting that people are beautifully inconsistent, carrying both strengths and flaws. The suit also marks the beginning of his transition from childhood into adulthood, representing the responsibility that comes with making difficult but necessary choices.",
  },
  {
    num: 6,
    title: "Mess Me Up",
    kind: "single",
    accent: "#a855f7",
    artifact: "The Purple Power Plug",
    artifactMeaning:
      "Remove the source of fear, insecurity, or temptation before it controls your life.",
    summary:
      "The next mirror transports Joey into a purple pixelated world resembling a giant video game, where towering monsters relentlessly attack him. At first he fights them head-on and fails every time, but eventually realizes the monsters draw their strength from a hidden purple power source. By pulling the purple power plug, he defeats them instantly, learning that life's greatest battles are won by addressing problems at their root rather than endlessly fighting their symptoms.",
  },
  {
    num: 7,
    title: "Mirror, Pt. 2: Self-Elevation",
    kind: "skit",
    badge: "Skit #2",
    accent: "#8b8b9e",
    summary:
      "The therapist pauses Joey's story to reflect on what this victory truly meant. Together they realize that learning how to solve problems — not simply survive them — marked the first genuine step toward maturity. This moment becomes the foundation upon which the rest of Joey's growth is built.",
  },
  {
    num: 8,
    title: "Friends",
    kind: "single",
    accent: "#f5c542",
    artifact: "The Yellow Microphone",
    artifactMeaning:
      "True success comes not from fitting in, but from sharing the gifts you were given.",
    summary:
      "Emerging into a black-and-white 1960s game show, Joey enters a world that symbolizes the game of life itself. Surrounded by spectators and expectations, he discovers that the only way to transform the colorless world around him is by confidently using his own voice. As he sings into the yellow microphone, the entire world gradually fills with warm golden light, teaching him that every person possesses unique gifts capable of bringing joy and hope to others.",
  },
  {
    num: 9,
    title: "No One Knows Me",
    kind: "song",
    accent: "#4a6fa5",
    summary:
      "The next world strips away all distractions. Alone in a dark blue room as rain pours endlessly around him, Joey confronts his deepest insecurities and fears about the future. This emotional low point reflects how adolescence often brings feelings of loneliness and uncertainty, reminding listeners that even when no one else understands what you're experiencing, growth is still taking place beneath the surface.",
  },
  {
    num: 10,
    title: "Lost In The Mirrorverse",
    kind: "interlude",
    badge: "Interlude",
    accent: "#3f5680",
    summary:
      "Standing at his lowest point, Joey begins questioning whether he'll ever escape. Yet even in the darkness, another mirror appears, reminding him that every difficult season eventually leads somewhere new. The interlude represents the turning point where hopelessness slowly gives way to hope.",
  },
  {
    num: 11,
    title: "If Only",
    kind: "single",
    badge: "Second Single",
    accent: "#5b8def",
    artifact: "Colby, The Blue Butterfly",
    artifactMeaning: "Hope, courage, and chasing your dreams before life moves on without you.",
    summary:
      "The mirror opens into a bright outdoor wedding venue where Joey meets Colby, the blue butterfly — the next artifact and a symbol of hope, courage, and chasing your dreams. Watching the woman he loves prepare to marry someone else, Joey imagines the life they could have shared if he had been brave enough to pursue what truly mattered. As they dance through rain, music, pottery studios, and peaceful courtyards, he realizes that regret is often born not from failure, but from never taking the chance at all.",
  },
  {
    num: 12,
    title: "Firecracker",
    kind: "single",
    badge: "Third Single",
    accent: "#ff5a3c",
    artifact: "The Aztecan Wildflower",
    artifactMeaning:
      "Genuine love and passion make us stronger rather than weaker.",
    summary:
      "The next mirror leads Joey into an ancient Aztec civilization where he discovers the enchanted wildflower, granting him the power of fire. As armies attack in an attempt to steal its power, he learns that genuine love and passion make us stronger rather than weaker. The orange flames symbolize the intensity of adulthood — romance, sexuality, ambition, and purpose — all of which can either consume us or empower us depending on how we choose to use them.",
  },
  {
    num: 13,
    title: "Mirror, Pt. 3: Self-Transformation",
    kind: "skit",
    badge: "Skit #3",
    accent: "#8b8b9e",
    summary:
      "Still within the same therapy session, Joey and his therapist reflect on how each world has steadily transformed him into someone stronger, wiser, and more disciplined. The therapist explains that adulthood isn't reached through age alone, but through the choices we repeatedly make when life tests our character.",
  },
  {
    num: 14,
    title: "Live Like This (Na Na, Hey Hey… Goodbye)",
    kind: "song",
    accent: "#7d8471",
    summary:
      "The next mirror leads Joey into a small, run-down apartment scattered with empty alcohol bottles, clutter, and reminders of a life that has lost its direction. Rather than waiting for his circumstances to improve, he begins working out and relentlessly pursuing his goals despite the environment around him. The lesson is that discipline, not circumstance, is what ultimately transforms a boy into a man.",
  },
  {
    num: 15,
    title: "Write A Song",
    kind: "song",
    accent: "#5fa87c",
    summary:
      "Surrounded by lush green landscapes, Joey discovers that music has always been more than entertainment — it is the language through which he understands life itself. His love inspires creativity, while creativity gives purpose to his experiences. The world celebrates art as one of humanity's greatest gifts: the ability to transform emotion into something that can heal both ourselves and others.",
  },
  {
    num: 16,
    title: "Don't Wanna Ask",
    kind: "single",
    badge: "Sixth Single",
    accent: "#b08968",
    artifact: "The Brown Acoustic Guitar",
    artifactMeaning:
      "Music remains a constant source of comfort, identity, and emotional honesty.",
    summary:
      "The next mirror leads Joey into an enormous California mansion, where despite having every material comfort imaginable, he finds himself completely alone. His only companion is a brown acoustic guitar, symbolizing that while possessions may come and go, music remains a constant source of comfort, identity, and emotional honesty. The lesson becomes one of vulnerability: opening your heart to new love without allowing past pain to prevent future happiness.",
  },
  {
    num: 17,
    title: "I Wish I Just Wanted You",
    kind: "song",
    accent: "#8a6f9e",
    summary:
      "In one of the album's most introspective moments, Joey stops blaming others and finally accepts responsibility for his own mistakes. The song acknowledges that maturity isn't just recognizing how others have hurt us — it's recognizing how we've hurt them too. Taking accountability becomes the final lesson required before he is ready to leave the Mirrorverse.",
  },
  {
    num: 18,
    title: "Escape From The Mirrorverse",
    kind: "interlude",
    badge: "Outrolude",
    accent: "#c0b7d4",
    summary:
      "After stepping through one final mirror, Joey is finally released back into the real world. He returns not as the frightened thirteen-year-old who first entered the Mirrorverse, but as a twenty-year-old man carrying every lesson, artifact, and memory from the journey. The Mirrorverse closes behind him, revealing that it was never a prison, but a symbolic representation of adolescence itself.",
  },
];

export const DISC_TWO: MirrorTrack[] = [
  {
    num: 19,
    title: "Mirror, Pt. 4: Self-Revisitation",
    kind: "skit",
    badge: "Skit #4",
    accent: "#8b8b9e",
    summary:
      "Several months later, following the events of the original album, Joey returns for a follow-up therapy appointment. Now fully immersed in adulthood, he revisits the lessons of the Mirrorverse to reflect on how they continue to influence his everyday life. Unlike the first three skits — which together form one continuous therapy session — this final conversation serves as an epilogue, showing that growth doesn't end when adolescence does.",
  },
  {
    num: 20,
    title: "Why?",
    kind: "single",
    badge: "Deluxe Single",
    accent: "#9ca3af",
    artifact: "The Grey Sunglasses",
    artifactMeaning:
      "Wisdom, discernment, and protecting yourself as you step into adulthood.",
    summary:
      "Driving through the real world wearing gray sunglasses, Joey reflects on love, loss, and the people who helped shape him. The gray sunglasses — the final artifact — symbolize wisdom, discernment, and protecting yourself as you step into adulthood. Rather than dwelling on what cannot be changed, Joey chooses to carry the past with gratitude, proving that true maturity comes from learning without becoming bitter.",
  },
  {
    num: 21,
    title: "Mess Me Up (Remix)",
    kind: "remix",
    badge: "Remix",
    accent: "#a855f7",
    summary: "",
  },
  {
    num: 22,
    title: "Friends (Remix)",
    kind: "remix",
    badge: "Remix",
    accent: "#f5c542",
    summary: "",
  },
  {
    num: 23,
    title: "Firecracker (Remix)",
    kind: "remix",
    badge: "Remix",
    accent: "#ff5a3c",
    summary: "",
  },
  {
    num: 24,
    title: "Don't Wanna Ask (Remix)",
    kind: "remix",
    badge: "Remix",
    accent: "#b08968",
    summary: "",
  },
];

export const REMIX_NOTE =
  "The remixes celebrate the journey from a new perspective, extending the life of the Mirrorverse while reminding listeners that every lesson can be experienced differently depending on where they are in their own lives.";

export const PROJECT_SUMMARY: string[] = [
  "MIRROR is a cinematic coming-of-age concept mixtape that reimagines adolescence as a psychological fantasy. Framed through therapy sessions, a 20-year-old Joey recounts the mysterious seven years he spent trapped inside the Mirrorverse after being pulled through his bathroom mirror at thirteen years old. Throughout one continuous therapy session, he and his therapist revisit every challenge, gradually discovering that the Mirrorverse was never simply a supernatural place — it was a symbolic representation of the internal emotional world every teenager experiences while growing up. Each world reflects a different stage of adolescence, from toxic relationships and insecurity to friendship, ambition, love, discipline, creativity, accountability, and ultimately self-acceptance. Hidden inside every world is another mirror, and only after Joey learns the lesson that world was designed to teach can he step through it into the next chapter of his journey.",
  "As Joey progresses through the Mirrorverse, he collects symbolic artifacts that embody each lesson: the striped suit, the purple power plug, the yellow microphone, Colby the blue butterfly, the enchanted Aztecan wildflower, the brown acoustic guitar, and finally the gray sunglasses. Together, these artifacts chart his transformation from the innocent Brown-Haired Boy into the confident young man who returns home seven years later. The project embraces the emotional highs and lows that define adolescence, recognizing that the teenage years are rarely linear — they are a roller coaster of hope, fear, heartbreak, confidence, failure, love, and growth. Yet beneath that unpredictability lies a clear trajectory toward maturity.",
  "Every world asks the same question in a different way: Will you make the right choice? By the time Joey escapes the Mirrorverse, he understands that becoming an adult isn't about reaching a certain age — it's about choosing who you become, one decision at a time. The final revisitation with his therapist in the deluxe edition reminds us that even after adolescence ends, the lessons we learned there continue to shape the rest of our lives.",
];

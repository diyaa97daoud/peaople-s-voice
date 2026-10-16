/* Vox Populi live: settings, message channel and codebook, shared by index.html (phones) and screen.html (presenter).
   Edit the sections marked EDIT. Everything else can stay as it is. */
window.VOX = (() => {
  /* ---------- EDIT: question, channel, threshold ---------- */
  const QUESTION = "What do you think about vinho verde?";
  // The channel name is the only "password": anyone who knows it can read and send. Change it for each event.
  const TOPIC = "t4eu";
  // A critique reaches the Duke when it is mentioned MORE than this many times. Lower it for a small room.
  const THRESHOLD = 5;

  /* ---------- Message channel (ntfy.sh, free, no account) ----------
     To use another backend (Supabase, Firebase, your own API), replace send() and listen() and keep their shapes. */
  const BASE = "https://ntfy.sh/";
  const VALID = /^[01]{5}( [01]{5}){4}$/;
  // bells: the five codes the messenger hears (never the strings the person pulled)
  async function send(bells) {
    const r = await fetch(BASE + TOPIC, {
      method: "POST",
      body: bells.join(" "),
    });
    if (!r.ok) throw new Error("http " + r.status);
  }
  // onMessage({id, time, bells:[5 codes]}); onStatus(true|false) tells whether the stream is connected
  function listen(onMessage, onStatus) {
    const es = new EventSource(BASE + TOPIC + "/sse?since=all");
    es.onopen = () => onStatus && onStatus(true);
    es.onerror = () => onStatus && onStatus(false);
    es.onmessage = (e) => {
      try {
        const d = JSON.parse(e.data),
          text = (d.message || "").trim();
        if (d.event === "message" && VALID.test(text))
          onMessage({ id: d.id, time: d.time, bells: text.split(" ") });
      } catch (_) {}
    };
    return () => es.close();
  }

  /* ---------- The five strings and the secret crossing ---------- */
  const STR = [
    { n: "Red", l: "R", c: "#d2463c", t: "#ffffff" },
    { n: "Blue", l: "B", c: "#3f78d6", t: "#ffffff" },
    { n: "Green", l: "G", c: "#3f9a5a", t: "#ffffff" },
    { n: "Yellow", l: "Y", c: "#e2b93b", t: "#1f1d1a" },
    { n: "Black", l: "K", c: "#1b1b1f", t: "#ffffff" },
  ];
  const ROMAN = ["I", "II", "III", "IV", "V"];
  const ALL = "11111";
  const P = [3, 0, 4, 1, 2]; // Red to IV, Blue to I, Green to V, Yellow to II, Black to III
  const on = (c) =>
    [...c].map((b, i) => (b === "1" ? i : -1)).filter((i) => i >= 0);
  const enc = (c) => {
    const o = [..."00000"];
    on(c).forEach((i) => (o[P[i]] = "1"));
    return o.join("");
  };
  const dec = (c) => {
    let s = "";
    for (let i = 0; i < 5; i++) s += c[P[i]];
    return s;
  };
  const names = (c) =>
    c === ALL
      ? "all five"
      : on(c)
          .map((i) => STR[i].n)
          .join(" + ");
  const dots = (c) =>
    (c === ALL ? [0, 1, 2, 3, 4] : on(c))
      .map((i) => `<span class="dot" style="--c:${STR[i].c}"></span>`)
      .join("");
  const bellsOf = (c) =>
    on(enc(c))
      .map((j) => ROMAN[j])
      .join(" + ");

  /* ---------- EDIT: the codebook, written for this room and this question ----------
     Keep every list the same length (7 / 7 / 4 options each / 3 / 4) and keep the codes: they are what the strings mean. */
  const FIELDS = ["Who", "Opinion on", "Detail", "How much", "Feeling"];
  const STATUS = [
    { code: "01010", label: "Student", icon: "cap" },
    { code: "10001", label: "Teacher or researcher", icon: "book" },
    { code: "00011", label: "Software or engineering", icon: "code" },
    { code: "11000", label: "Philosophy or humanities", icon: "quill" },
    { code: "00101", label: "I live in the Minho", icon: "pin" },
    { code: "01100", label: "Visiting from abroad", icon: "plane" },
    { code: "10100", label: "Prefer not to say", icon: "shield" },
  ];
  const SUBCODES = ["10001", "01100", "11000", "00011"]; // codes of the four details under any subject
  const SUBJECTS = [
    {
      code: "00101",
      label: "Taste",
      icon: "drop",
      subs: [
        "Fresh and crisp",
        "A light natural fizz",
        "Too sour for me",
        "Too light, little character",
      ],
    },
    {
      code: "11000",
      label: "Price and value",
      icon: "coin",
      subs: [
        "Great value for money",
        "So cheap I doubt it",
        "Too expensive abroad",
        "Hard to pick a good bottle",
      ],
    },
    {
      code: "01010",
      label: "Origin and tradition",
      icon: "leaf",
      subs: [
        "Proud of the Minho",
        "Old vineyards, old ways",
        "Many brands taste alike",
        "Unknown outside Portugal",
      ],
    },
    {
      code: "00011",
      label: "Food pairing",
      icon: "fork",
      subs: [
        "Seafood and fish",
        "Grilled traditional dishes",
        "Light starters and salads",
        "Never sure what to pair",
      ],
    },
    {
      code: "10100",
      label: "Occasions",
      icon: "sun",
      subs: [
        "Summer on a terrace",
        "Family lunch",
        "With friends, at a party",
        "Nothing special",
      ],
    },
    {
      code: "10001",
      label: "Health and alcohol",
      icon: "heart",
      subs: [
        "Light and low in alcohol",
        "A headache next day",
        "Sweetness and sugar",
        "I would rather drink less",
      ],
    },
    {
      code: "01100",
      label: "Image and marketing",
      icon: "flag",
      subs: [
        "A symbol of Portugal",
        "A tourist drink only",
        "Needs better marketing",
        "Deserves more export",
      ],
    },
  ];
  const GRAVITY = [
    { code: "00101", label: "I · A small matter" },
    { code: "01010", label: "II · It matters to me" },
    { code: "10100", label: "III · It matters deeply" },
  ];
  const FEELING = [
    { code: "01100", label: "Delight" },
    { code: "00011", label: "Pride" },
    { code: "10001", label: "Nostalgia" },
    { code: "00101", label: "Disappointment" },
  ];

  // Five readable labels for five codes, or undefined where a code is not on the board
  function meaning(codes) {
    const su = SUBJECTS.find((s) => s.code === codes[1]),
      si = SUBCODES.indexOf(codes[2]);
    return [
      STATUS.find((o) => o.code === codes[0])?.label,
      su?.label,
      su && si >= 0 ? su.subs[si] : undefined,
      GRAVITY.find((o) => o.code === codes[3])?.label,
      FEELING.find((o) => o.code === codes[4])?.label,
    ];
  }

  const ICONS = {
    cap: '<path d="M2 9l10-5 10 5-10 5z"/><path d="M6 11v5c0 1 3 3 6 3s6-2 6-3v-5"/>',
    book: '<path d="M4 5a2 2 0 012-2h13v16H6a2 2 0 00-2 2z"/><path d="M4 19V5"/>',
    code: '<path d="M8 8l-5 4 5 4M16 8l5 4-5 4M14 5l-4 14"/>',
    quill:
      '<path d="M4 20C8 12 14 6 20 4c-1 6-6 12-14 14"/><path d="M4 20l6-6"/>',
    pin: '<path d="M12 21s-7-6-7-11a7 7 0 0114 0c0 5-7 11-7 11z"/><circle cx="12" cy="10" r="2.5"/>',
    plane: '<path d="M2 14l20-8-6 16-4-6z"/>',
    shield: '<path d="M12 3l8 3v6c0 5-4 8-8 9-4-1-8-4-8-9V6z"/>',
    drop: '<path d="M12 3s6 7 6 11a6 6 0 01-12 0c0-4 6-11 6-11z"/>',
    coin: '<circle cx="12" cy="12" r="8"/><circle cx="12" cy="12" r="4"/>',
    leaf: '<path d="M5 19C5 10 10 5 20 4c0 9-4 15-13 15"/><path d="M5 19l8-8"/>',
    fork: '<path d="M7 3v8M5 3v5a2 2 0 004 0V3M7 11v10M17 3c-2 2-3 5-3 8h3v10"/>',
    sun: '<circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M2 12h2M20 12h2M5 5l1.5 1.5M17.5 17.5L19 19M19 5l-1.5 1.5M6.5 17.5L5 19"/>',
    heart:
      '<path d="M12 20s-8-5-8-11a4.5 4.5 0 018-2.5A4.5 4.5 0 0120 9c0 6-8 11-8 11z"/>',
    flag: '<path d="M5 21V4M5 4h12l-2 4 2 4H5"/>',
  };
  const ic = (n) =>
    ICONS[n]
      ? `<svg class="ic" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${ICONS[n]}</svg>`
      : "";

  return {
    QUESTION,
    TOPIC,
    THRESHOLD,
    send,
    listen,
    STR,
    ROMAN,
    ALL,
    P,
    on,
    enc,
    dec,
    names,
    dots,
    bellsOf,
    FIELDS,
    STATUS,
    SUBCODES,
    SUBJECTS,
    GRAVITY,
    FEELING,
    meaning,
    ic,
  };
})();

// "מה בתמונה?" pictures. Each picture is stitched from two things that have
// nothing to do with each other: the top quarter is the top of one thing (a
// banana, Trump's hair), and the rest is the bottom of something else entirely
// (a train, a computer). Everyone guesses the top; the curtain drops on the rest.
// Icons are Noto Emoji SVGs in /public/picture-game, named by codepoint.
// Positions are % of the whole square stage, in physical (not RTL) coordinates.

/** % of the picture's height shown before the reveal. */
export const TOP_SHOWN = 25;

export type IconLayer = {
  icon: string;
  x: number;
  y: number;
  size: number;
  rotate?: number;
  flip?: boolean;
};
/** A plain shape for parts no icon covers. */
export type RectLayer = {
  rect: {
    x: number;
    y: number;
    w: number;
    h: number;
    fill: string;
    radius?: number;
    rotate?: number;
  };
};
export type Layer = IconLayer | RectLayer;

export type PicturePuzzle = {
  id: string;
  bg: string;
  decoy: { label: string; answers: string[] };
  truth: { label: string; answers: string[] };
  reveal: string;
  /** Clipped to the top strip: the thing everyone will guess. */
  top: Layer[];
  /** Clipped to everything below the strip: what the picture really is. */
  bottom: Layer[];
};

export const PICTURES: PicturePuzzle[] = [
  {
    id: "train",
    bg: "#cfe6f7",
    decoy: { label: "בננה", answers: ["בננה", "בננות", "banana"] },
    truth: {
      label: "רכבת",
      answers: ["רכבת", "קטר", "רכבת קיטור", "train", "locomotive"],
    },
    reveal: "למעלה בננה, ומתחת... רכבת 🍌🚂",
    top: [{ icon: "1f34c", x: 6, y: 2, size: 42 }],
    bottom: [
      { icon: "1f682", x: 12, y: 25, size: 75 },
      { icon: "1f34c", x: 6, y: 2, size: 42 },
    ],
  },
  {
    id: "trump",
    bg: "#e4ecf7",
    decoy: {
      label: "טראמפ",
      answers: [
        "טראמפ",
        "דונלד טראמפ",
        "שיער",
        "שיער צהוב",
        "בלונדיני",
        "בלונדינית",
        "פאה",
        "איש",
        "אישה",
        "אדם",
        "ראש",
        "trump",
        "hair",
        "blonde",
      ],
    },
    truth: {
      label: "מחשב",
      answers: [
        "מחשב",
        "מסך",
        "מחשב שולחני",
        "מוניטור",
        "computer",
        "pc",
        "monitor",
      ],
    },
    reveal: "השיער של טראמפ, ומתחתיו מחשב 💻",
    top: [{ icon: "1f471", x: 18, y: 0, size: 64 }],
    bottom: [{ icon: "1f5a5", x: 8, y: 20, size: 84 }],
  },
  {
    id: "penguin",
    bg: "#e6f4ea",
    decoy: { label: "אננס", answers: ["אננס", "pineapple", "עלים", "צמח"] },
    truth: { label: "פינגווין", answers: ["פינגווין", "פינגוין", "penguin"] },
    reveal: "העלים של אננס על פינגווין 🍍🐧",
    top: [{ icon: "1f34d", x: 15, y: 0, size: 70 }],
    bottom: [{ icon: "1f427", x: 10, y: 20, size: 80 }],
  },
  {
    id: "couch",
    bg: "#fff2d9",
    decoy: {
      label: "ג׳ירפה",
      answers: ["ג׳ירפה", "גירפה", "ג'ירפה", "giraffe"],
    },
    truth: { label: "ספה", answers: ["ספה", "סלון", "כורסה", "couch", "sofa"] },
    reveal: "ראש של ג׳ירפה וגוף של ספה 🦒🛋️",
    top: [{ icon: "1f992", x: -10, y: -4, size: 120 }],
    bottom: [{ icon: "1f6cb", x: 8, y: 22, size: 84 }],
  },
  {
    id: "tv",
    bg: "#f0e6ff",
    decoy: {
      label: "ארנב",
      answers: ["ארנב", "ארנבת", "ארנבון", "שפן", "bunny", "rabbit"],
    },
    truth: {
      label: "טלוויזיה",
      answers: ["טלוויזיה", "טלויזיה", "טלוויזיה ישנה", "tv", "television"],
    },
    reveal: "אוזני ארנב על טלוויזיה. האנטנה הכי חמודה 🐰📺",
    top: [{ icon: "1f430", x: 0, y: 0, size: 100 }],
    bottom: [{ icon: "1f4fa", x: 8, y: 20, size: 84 }],
  },
  {
    id: "toilet",
    bg: "#e3f1f3",
    decoy: {
      label: "סנטה",
      answers: ["סנטה", "סנטה קלאוס", "כובע", "כובע של סנטה", "santa"],
    },
    truth: {
      label: "אסלה",
      answers: ["אסלה", "שירותים", "בית שימוש", "toilet"],
    },
    reveal: "הכובע של סנטה על אסלה. חג שמח 🎅🚽",
    top: [{ icon: "1f385", x: 18, y: 0, size: 64 }],
    bottom: [{ icon: "1f6bd", x: 10, y: 20, size: 80 }],
  },
  {
    id: "turtle",
    bg: "#e2f0fb",
    decoy: {
      label: "פסל החירות",
      answers: [
        "פסל החירות",
        "פסל",
        "חירות",
        "ניו יורק",
        "statue of liberty",
        "liberty",
      ],
    },
    truth: { label: "צב", answers: ["צב", "צבה", "turtle", "tortoise"] },
    reveal: "פסל החירות? לא, צב עם לפיד 🗽🐢",
    top: [{ icon: "1f5fd", x: 2, y: -2, size: 90 }],
    bottom: [{ icon: "1f422", x: 8, y: 22, size: 84 }],
  },
  {
    id: "car",
    bg: "#ffe4ef",
    decoy: {
      label: "גלידה",
      answers: ["גלידה", "גלידה אמריקאית", "גביע גלידה", "ice cream"],
    },
    truth: { label: "מכונית", answers: ["מכונית", "אוטו", "רכב", "car"] },
    reveal: "גלידה למעלה, מכונית למטה 🍦🚗",
    top: [{ icon: "1f366", x: 18, y: 0, size: 64 }],
    bottom: [{ icon: "1f697", x: 4, y: 22, size: 92 }],
  },
  {
    id: "tractor",
    bg: "#fbefe0",
    decoy: {
      label: "חד קרן",
      answers: ["חד קרן", "חדקרן", "סוס", "unicorn", "horse"],
    },
    truth: { label: "טרקטור", answers: ["טרקטור", "tractor"] },
    reveal: "חד קרן? בכלל טרקטור 🦄🚜",
    top: [{ icon: "1f984", x: 20, y: 2, size: 60 }],
    bottom: [{ icon: "1f69c", x: 6, y: 22, size: 88 }],
  },
  {
    id: "sheep",
    bg: "#e8f3dc",
    decoy: {
      label: "בירה",
      answers: ["בירה", "קצף", "ענן", "beer", "foam", "cloud"],
    },
    truth: { label: "כבשה", answers: ["כבשה", "כבש", "כבשים", "sheep"] },
    reveal: "הקצף של הבירה הפך לצמר של כבשה 🍺🐑",
    top: [{ icon: "1f37a", x: 20, y: 0, size: 60 }],
    bottom: [{ icon: "1f411", x: 8, y: 20, size: 84 }],
  },
  {
    id: "pig",
    bg: "#eef7e4",
    decoy: { label: "תות", answers: ["תות", "תות שדה", "תותים", "strawberry"] },
    truth: { label: "חזיר", answers: ["חזיר", "חזרזיר", "pig"] },
    reveal: "תות למעלה, חזיר למטה 🍓🐷",
    top: [{ icon: "1f353", x: 20, y: 0, size: 60 }],
    bottom: [{ icon: "1f416", x: 8, y: 20, size: 84 }],
  },
  {
    id: "bicycle",
    bg: "#e6f1ff",
    decoy: {
      label: "פטרייה",
      answers: ["פטרייה", "פטריה", "פטריות", "mushroom"],
    },
    truth: {
      label: "אופניים",
      answers: ["אופניים", "אופנים", "אופני", "bicycle", "bike"],
    },
    reveal: "פטרייה שרוכבת על אופניים 🍄🚲",
    top: [{ icon: "1f344", x: 15, y: 0, size: 70 }],
    bottom: [{ icon: "1f6b2", x: 4, y: 22, size: 92 }],
  },
  {
    id: "printer",
    bg: "#efe9f7",
    decoy: {
      label: "קוסם",
      answers: ["קוסם", "מכשף", "מכשפה", "כובע", "גנדלף", "wizard"],
    },
    truth: { label: "מדפסת", answers: ["מדפסת", "printer"] },
    reveal: "הקוסם האמיתי של המשרד: המדפסת 🧙🖨️",
    top: [{ icon: "1f9d9", x: 20, y: 0, size: 60 }],
    bottom: [{ icon: "1f5a8", x: 8, y: 20, size: 84 }],
  },
  {
    id: "duck",
    bg: "#dff0f7",
    decoy: { label: "טירה", answers: ["טירה", "ארמון", "מבצר", "castle"] },
    truth: { label: "ברווז", answers: ["ברווז", "ברווזה", "duck"] },
    reveal: "טירה על ברווז. ממלכה צפה 🏰🦆",
    top: [{ icon: "1f3f0", x: 20, y: 0, size: 60 }],
    bottom: [{ icon: "1f986", x: 8, y: 20, size: 84 }],
  },
  {
    id: "cart",
    bg: "#fff4dc",
    decoy: { label: "כתר", answers: ["כתר", "crown", "מלך", "מלכה"] },
    truth: {
      label: "עגלת קניות",
      answers: [
        "עגלת קניות",
        "עגלה",
        "עגלת סופר",
        "סופר",
        "shopping cart",
        "cart",
      ],
    },
    reveal: "כתר על עגלת קניות. מלך הסופר 👑🛒",
    top: [{ icon: "1f451", x: 20, y: -6, size: 60 }],
    bottom: [{ icon: "1f6d2", x: 8, y: 20, size: 84 }],
  },
  {
    id: "sneaker",
    bg: "#fde8f0",
    decoy: {
      label: "קאפקייק",
      answers: ["קאפקייק", "קפקייק", "מאפין", "עוגה", "cupcake", "muffin"],
    },
    truth: {
      label: "נעל",
      answers: ["נעל", "נעליים", "נעל ספורט", "סניקרס", "shoe", "sneaker"],
    },
    reveal: "קאפקייק? לא, נעל ספורט 🧁👟",
    top: [{ icon: "1f9c1", x: 20, y: 0, size: 60 }],
    bottom: [{ icon: "1f45f", x: 4, y: 22, size: 92 }],
  },
  {
    id: "bathtub",
    bg: "#ffeedd",
    decoy: {
      label: "הר געש",
      answers: ["הר געש", "וולקן", "התפרצות", "volcano"],
    },
    truth: { label: "אמבטיה", answers: ["אמבטיה", "אמבט", "bathtub", "bath"] },
    reveal: "הר געש? לא, אמבטיה חמה מדי 🌋🛁",
    top: [{ icon: "1f30b", x: 26, y: 2, size: 48 }],
    bottom: [{ icon: "1f6c1", x: 6, y: 22, size: 88 }],
  },
  {
    id: "elephant",
    bg: "#e4efe6",
    decoy: {
      label: "עץ חג המולד",
      answers: [
        "עץ חג המולד",
        "עץ אשוח",
        "אשוח",
        "עץ",
        "כריסמס",
        "christmas tree",
      ],
    },
    truth: { label: "פיל", answers: ["פיל", "elephant"] },
    reveal: "עץ חג המולד שהתברר כפיל 🎄🐘",
    top: [{ icon: "1f384", x: 20, y: 0, size: 60 }],
    bottom: [{ icon: "1f418", x: 8, y: 20, size: 84 }],
  },
  {
    id: "guitar",
    bg: "#f6eadf",
    decoy: {
      label: "עוגת יום הולדת",
      answers: ["עוגה", "עוגת יום הולדת", "יום הולדת", "נרות", "cake"],
    },
    truth: { label: "גיטרה", answers: ["גיטרה", "גיטרה חשמלית", "guitar"] },
    reveal: "הנרות של העוגה על גיטרה. מזל טוב בסגנון רוק 🎂🎸",
    top: [{ icon: "1f382", x: 20, y: 0, size: 60 }],
    bottom: [{ icon: "1f3b8", x: 8, y: 20, size: 84 }],
  },
];

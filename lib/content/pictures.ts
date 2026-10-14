// "מה בתמונה?" scenes. Each one shows a single quarter first (the decoy), then the
// whole scene, which turns out to be something else (the truth).
// Icons are Noto Emoji SVGs in /public/picture-game, named by codepoint.
// Positions are % of a square stage, in physical (not RTL) coordinates.

export type Quarter = "tl" | "tr" | "bl" | "br";

export type Layer = {
  icon: string;
  x: number;
  y: number;
  size: number;
  rotate?: number;
  flip?: boolean;
};

export type PicturePuzzle = {
  id: string;
  bg: string;
  quarter: Quarter;
  decoy: { label: string; answers: string[] };
  truth: { label: string; answers: string[] };
  reveal: string;
  layers: Layer[];
};

export const PICTURES: PicturePuzzle[] = [
  {
    id: "train",
    bg: "#cfe6f7",
    quarter: "tr",
    decoy: { label: "בננה", answers: ["בננה", "בננות", "banana"] },
    truth: {
      label: "רכבת",
      answers: ["רכבת", "קטר", "רכבת משא", "קרון", "train", "locomotive"],
    },
    reveal: "הבננה בסך הכל תפסה טרמפ על רכבת 🍌🚂",
    layers: [
      { icon: "2601", x: 0, y: 10, size: 26 },
      { icon: "1f682", x: 2, y: 32, size: 52 },
      { icon: "1f683", x: 50, y: 35, size: 50 },
      { icon: "1f34c", x: 62, y: 12, size: 38 },
    ],
  },
  {
    id: "snowman",
    bg: "#dfeaf3",
    quarter: "tr",
    decoy: { label: "גזר", answers: ["גזר", "carrot"] },
    truth: {
      label: "איש שלג",
      answers: ["איש שלג", "בובת שלג", "אשת שלג", "שלג", "snowman"],
    },
    reveal: "הגזר היה האף של איש השלג ⛄",
    layers: [
      { icon: "26aa", x: 8, y: 50, size: 46 },
      { icon: "2601", x: 58, y: 70, size: 36 },
      { icon: "26aa", x: 13, y: 18, size: 34 },
      { icon: "1f9e3", x: 16, y: 40, size: 28 },
      { icon: "26ab", x: 21, y: 28, size: 6 },
      { icon: "26ab", x: 31, y: 28, size: 6 },
      { icon: "26ab", x: 28, y: 64, size: 6 },
      { icon: "26ab", x: 28, y: 76, size: 6 },
      { icon: "1f3a9", x: 15, y: 0, size: 30 },
      { icon: "1f955", x: 52, y: 12, size: 32 },
    ],
  },
  {
    id: "mouse",
    bg: "#f2e6d0",
    quarter: "bl",
    decoy: { label: "גבינה", answers: ["גבינה", "גבינה צהובה", "cheese"] },
    truth: { label: "עכבר", answers: ["עכבר", "עכברון", "עכברה", "mouse"] },
    reveal: "הגבינה כבר לא לבד. מישהו מתקרב 🐭",
    layers: [
      { icon: "1f401", x: 46, y: 10, size: 56 },
      { icon: "1f9c0", x: 4, y: 56, size: 40 },
    ],
  },
  {
    id: "dog",
    bg: "#dcefd2",
    quarter: "br",
    decoy: { label: "עצם", answers: ["עצם", "עצמות", "bone"] },
    truth: {
      label: "כלב",
      answers: ["כלב", "כלבלב", "כלבה", "גור", "dog", "puppy"],
    },
    reveal: "העצם שייכת למישהו שמחכה לה 🐶",
    layers: [
      { icon: "2601", x: 58, y: 8, size: 30 },
      { icon: "1f415", x: 0, y: 16, size: 50 },
      { icon: "1f9b4", x: 56, y: 58, size: 38 },
    ],
  },
  {
    id: "bear",
    bg: "#e3f1d8",
    quarter: "bl",
    decoy: { label: "דבש", answers: ["דבש", "צנצנת דבש", "honey"] },
    truth: {
      label: "דוב",
      answers: ["דוב", "דובי", "דובון", "פו הדוב", "bear"],
    },
    reveal: "זה הדבש של הדוב. כדאי להחזיר 🐻",
    layers: [
      { icon: "1f43b", x: 44, y: 4, size: 56 },
      { icon: "1f36f", x: 4, y: 54, size: 40 },
    ],
  },
  {
    id: "squirrel",
    bg: "#e9f3df",
    quarter: "br",
    decoy: {
      label: "בוטן",
      answers: ["בוטן", "בוטנים", "אגוז", "peanut", "nut"],
    },
    truth: {
      label: "סנאי",
      answers: ["סנאי", "סנאית", "squirrel", "chipmunk"],
    },
    reveal: "הבוטן הזה כבר שמור למישהו 🐿️",
    layers: [
      { icon: "1f43f", x: 0, y: 6, size: 52, flip: true },
      { icon: "1f95c", x: 58, y: 58, size: 36, rotate: -20 },
    ],
  },
  {
    id: "cat",
    bg: "#f5e3e8",
    quarter: "bl",
    decoy: { label: "דג", answers: ["דג", "דגים", "fish"] },
    truth: {
      label: "חתול",
      answers: ["חתול", "חתולה", "חתלתול", "cat", "kitten"],
    },
    reveal: "הדג הוא בעצם ארוחת הערב של מישהו 🐱",
    layers: [
      { icon: "1f408", x: 50, y: 12, size: 50 },
      { icon: "1f41f", x: 2, y: 58, size: 42 },
    ],
  },
  {
    id: "chicken",
    bg: "#f6ecd2",
    quarter: "br",
    decoy: { label: "ביצה", answers: ["ביצה", "ביצים", "egg"] },
    truth: {
      label: "תרנגולת",
      answers: ["תרנגולת", "תרנגול", "עוף", "chicken", "hen"],
    },
    reveal: "מי קדם למי? הפעם התרנגולת 🐔",
    layers: [
      { icon: "1f414", x: 4, y: 0, size: 50 },
      { icon: "1f95a", x: 60, y: 56, size: 34 },
    ],
  },
  {
    id: "birthday",
    bg: "#fbe2ea",
    quarter: "tr",
    decoy: { label: "נר", answers: ["נר", "נרות", "candle"] },
    truth: {
      label: "יום הולדת",
      answers: [
        "יום הולדת",
        "עוגת יום הולדת",
        "עוגה",
        "מסיבה",
        "מסיבת יום הולדת",
        "birthday",
        "cake",
        "party",
      ],
    },
    reveal: "נר אחד, עוגה אחת, מזל טוב 🎂",
    layers: [
      { icon: "1f389", x: 2, y: 4, size: 40 },
      { icon: "1f388", x: 62, y: 54, size: 34 },
      { icon: "1f382", x: 4, y: 52, size: 48 },
      { icon: "1f56f", x: 60, y: 6, size: 38 },
    ],
  },
  {
    id: "rocket",
    bg: "#16233f",
    quarter: "bl",
    decoy: {
      label: "אש",
      answers: ["אש", "להבה", "להבות", "מדורה", "שריפה", "fire", "flame"],
    },
    truth: {
      label: "טיל",
      answers: ["טיל", "רקטה", "חללית", "שיגור", "rocket", "spaceship"],
    },
    reveal: "זו לא מדורה, זה שיגור 🚀",
    layers: [
      { icon: "2b50", x: 8, y: 8, size: 16 },
      { icon: "2728", x: 62, y: 62, size: 28 },
      { icon: "1f680", x: 48, y: 0, size: 50 },
      { icon: "1f525", x: 14, y: 50, size: 36, rotate: 35 },
    ],
  },
  {
    id: "office",
    bg: "linear-gradient(#e8eef5 58%, #c99b6d 58%)",
    quarter: "br",
    decoy: {
      label: "קפה",
      answers: ["קפה", "כוס קפה", "ספל", "ספל קפה", "coffee", "cup"],
    },
    truth: {
      label: "משרד",
      answers: [
        "משרד",
        "שולחן עבודה",
        "עבודה",
        "שולחן",
        "מחשב",
        "office",
        "desk",
      ],
    },
    reveal: "ככה נראה השולחן שהשארתם מאחור ☕",
    layers: [
      { icon: "1f4bb", x: 0, y: 4, size: 48 },
      { icon: "1fab4", x: 58, y: 6, size: 38 },
      { icon: "1f4ce", x: 6, y: 62, size: 22 },
      { icon: "1f58a", x: 22, y: 60, size: 28 },
      { icon: "2615", x: 58, y: 56, size: 36 },
    ],
  },
  {
    id: "truck",
    bg: "#d6ebfa",
    quarter: "tr",
    decoy: {
      label: "קופסה",
      answers: ["קופסה", "קופסא", "ארגז", "חבילה", "קרטון", "box", "package"],
    },
    truth: {
      label: "משאית",
      answers: ["משאית", "משאית משלוחים", "משלוח", "טנדר", "truck"],
    },
    reveal: "החבילה שלכם בדרך 📦🚚",
    layers: [
      { icon: "2601", x: 4, y: 8, size: 32 },
      { icon: "1f69a", x: 2, y: 30, size: 72 },
      { icon: "1f4e6", x: 56, y: 12, size: 36 },
    ],
  },
  {
    id: "cocktail",
    bg: "#ffe9c7",
    quarter: "tl",
    decoy: { label: "לימון", answers: ["לימון", "lemon"] },
    truth: {
      label: "קוקטייל",
      answers: ["קוקטייל", "משקה", "שייק", "cocktail", "drink"],
    },
    reveal: "הלימון רק קישט את הקוקטייל 🍹",
    layers: [
      { icon: "1f30a", x: 0, y: 62, size: 38 },
      { icon: "1f379", x: 38, y: 14, size: 62 },
      { icon: "1f34b", x: 2, y: 4, size: 42 },
    ],
  },
  {
    id: "night",
    bg: "#14203a",
    quarter: "tr",
    decoy: { label: "ירח", answers: ["ירח", "סהר", "moon"] },
    truth: {
      label: "לילה",
      answers: ["לילה", "עיר", "עיר בלילה", "לילה בעיר", "night", "city"],
    },
    reveal: "הירח מעל עיר שלא ישנה 🌃",
    layers: [
      { icon: "2b50", x: 8, y: 10, size: 12 },
      { icon: "2b50", x: 30, y: 26, size: 9 },
      { icon: "2728", x: 18, y: 32, size: 12 },
      { icon: "1f3e2", x: 0, y: 52, size: 40 },
      { icon: "1f3e2", x: 32, y: 50, size: 48 },
      { icon: "1f3e2", x: 68, y: 58, size: 34 },
      { icon: "1f319", x: 58, y: 6, size: 38 },
    ],
  },
  {
    id: "surfer",
    bg: "#cdeefa",
    quarter: "bl",
    decoy: { label: "גל", answers: ["גל", "גלים", "ים", "wave", "sea"] },
    truth: {
      label: "גולש",
      answers: ["גולש", "גולשת", "גלישה", "גלשן", "surf", "surfer", "surfing"],
    },
    reveal: "הגל הזה כבר תפוס 🏄",
    layers: [
      { icon: "1f3c4", x: 48, y: 2, size: 50 },
      { icon: "1f30a", x: 0, y: 50, size: 50 },
    ],
  },
  {
    id: "king",
    bg: "#efe0ff",
    quarter: "tr",
    decoy: { label: "כתר", answers: ["כתר", "crown"] },
    truth: { label: "מלך", answers: ["מלך", "מלכה", "king", "queen"] },
    reveal: "הכתר לא הגיע לבד 👑",
    layers: [
      { icon: "1f3f0", x: 0, y: 2, size: 46 },
      { icon: "2728", x: 8, y: 60, size: 30 },
      { icon: "1f9d4", x: 52, y: 50, size: 46 },
      { icon: "1f451", x: 56, y: 17, size: 38 },
    ],
  },
  {
    id: "magician",
    bg: "#3b2a63",
    quarter: "tl",
    decoy: {
      label: "כובע",
      answers: ["כובע", "כובע צילינדר", "צילינדר", "hat"],
    },
    truth: {
      label: "קוסם",
      answers: [
        "קוסם",
        "קוסמת",
        "קסם",
        "קסמים",
        "מופע קסמים",
        "ארנב",
        "magic",
        "magician",
      ],
    },
    reveal: "מהכובע יצא ארנב. קלאסי 🪄🐇",
    layers: [
      { icon: "1f3a9", x: 4, y: 8, size: 42 },
      { icon: "1f407", x: 54, y: 6, size: 42 },
      { icon: "1fa84", x: 6, y: 56, size: 38 },
      { icon: "2728", x: 58, y: 58, size: 34 },
    ],
  },
  {
    id: "goal",
    bg: "#d7f0cf",
    quarter: "br",
    decoy: {
      label: "כדור",
      answers: ["כדור", "כדורגל", "ball", "football", "soccer"],
    },
    truth: { label: "שער", answers: ["שער", "גול", "כדורגל", "שוער", "goal"] },
    reveal: "גווווול! ⚽",
    layers: [
      { icon: "1f945", x: 0, y: 0, size: 52 },
      { icon: "1f9e4", x: 60, y: 6, size: 32 },
      { icon: "2728", x: 8, y: 62, size: 28 },
      { icon: "26bd", x: 60, y: 60, size: 32 },
    ],
  },
];

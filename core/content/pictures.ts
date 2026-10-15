// "מה בתמונה?" pictures. Each picture is stitched from two things that have
// nothing to do with each other: the top quarter is the top of one thing (a
// banana, Trump's hair), and the rest is the bottom of something else entirely
// (a train, a computer). Everyone guesses the top; the curtain drops on the rest.
// Some pictures in each round are honest instead: the same top strip, but the
// picture really is the top thing (see `honest` in PictureStage).
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
  /** Clipped to the top strip: the thing everyone will guess. */
  top: Layer[];
  /** Clipped to everything below the strip: what the picture really is. */
  bottom: Layer[];
};

/** Where each top icon is drawn inside its box: [left, top, right, bottom] fractions. */
export const ICON_BOUNDS: Record<string, [number, number, number, number]> = {
  "1f34c": [0.105, 0.025, 0.935, 0.9625],
  "1f471": [0.1, 0.0325, 0.9, 0.97],
  "1f34d": [0.195, 0.03, 0.78, 0.97],
  "1f992": [0.1475, 0.03, 0.86, 0.9675],
  "1f430": [0.1425, 0.0325, 0.845, 0.965],
  "1f385": [0.0925, 0.0325, 0.9075, 0.97],
  "1f981": [0.0775, 0.03, 0.9125, 0.965],
  "1f366": [0.255, 0.03, 0.77, 0.97],
  "1f984": [0.0625, 0.0425, 0.93, 0.9625],
  "1f37a": [0.1825, 0.03, 0.9125, 0.9725],
  "1f353": [0.0775, 0.0275, 0.915, 0.9725],
  "1f344": [0.05, 0.03, 0.9475, 0.965],
  "1f9d9": [0.05, 0.0275, 0.95, 0.9725],
  "1f3f0": [0.0375, 0.0475, 0.985, 0.9725],
  "1f43c": [0.035, 0.06, 0.9725, 0.9425],
  "1f9c1": [0.1325, 0.0275, 0.8625, 0.97],
  "1f30b": [0.075, 0.0275, 0.93, 0.97],
  "1f384": [0.115, 0.0275, 0.9025, 0.9725],
  "1f382": [0.13, 0.06, 0.865, 0.9925],
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
    top: [{ icon: "1f471", x: 18, y: 0, size: 64 }],
    bottom: [{ icon: "1f5a5", x: 8, y: 20, size: 84 }],
  },
  {
    id: "penguin",
    bg: "#e6f4ea",
    decoy: { label: "אננס", answers: ["אננס", "pineapple", "עלים", "צמח"] },
    truth: { label: "פינגווין", answers: ["פינגווין", "פינגוין", "penguin"] },
    top: [{ icon: "1f34d", x: 23.0, y: -0.5, size: 50.1 }],
    bottom: [{ icon: "1f427", x: 8.2, y: 17.9, size: 84.2 }],
  },
  {
    id: "couch",
    bg: "#fff2d9",
    decoy: {
      label: "ג׳ירפה",
      answers: ["ג׳ירפה", "גירפה", "ג'ירפה", "giraffe"],
    },
    truth: { label: "ספה", answers: ["ספה", "סלון", "כורסה", "couch", "sofa"] },
    top: [{ icon: "1f992", x: -4.2, y: -4.1, size: 170.7 }],
    bottom: [{ icon: "1f6cb", x: -1.1, y: -24.5, size: 102.1 }],
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
    top: [{ icon: "1f430", x: 25.6, y: 3.2, size: 48.2 }],
    bottom: [{ icon: "1f4fa", x: 3.8, y: 9.0, size: 92.4 }],
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
    top: [{ icon: "1f385", x: 58.6, y: 3.6, size: 42.8 }],
    bottom: [{ icon: "1f6bd", x: -20.3, y: -37.1, size: 140.6 }],
  },
  {
    id: "bus",
    bg: "#fff1d6",
    decoy: { label: "אריה", answers: ["אריה", "לביאה", "מלך החיות", "lion"] },
    truth: { label: "אוטובוס", answers: ["אוטובוס", "אוטובוס צהוב", "bus"] },
    top: [{ icon: "1f981", x: 15.0, y: -0.5, size: 56.7 }],
    bottom: [{ icon: "1f68c", x: -1.1, y: -12.3, size: 102.1 }],
  },
  {
    id: "car",
    bg: "#ffe4ef",
    decoy: {
      label: "גלידה",
      answers: ["גלידה", "גלידה אמריקאית", "גביע גלידה", "ice cream"],
    },
    truth: { label: "מכונית", answers: ["מכונית", "אוטו", "רכב", "car"] },
    top: [{ icon: "1f366", x: 42.8, y: 3.9, size: 32.9 }],
    bottom: [{ icon: "1f697", x: -0.0, y: -12.6, size: 100.5 }],
  },
  {
    id: "tractor",
    bg: "#fbefe0",
    decoy: {
      label: "חד קרן",
      answers: ["חד קרן", "חדקרן", "סוס", "unicorn", "horse"],
    },
    truth: { label: "טרקטור", answers: ["טרקטור", "tractor"] },
    top: [{ icon: "1f984", x: 18.5, y: -2.4, size: 79.1 }],
    bottom: [{ icon: "1f69c", x: 2.4, y: 4.5, size: 96.8 }],
  },
  {
    id: "sheep",
    bg: "#e8f3dc",
    decoy: {
      label: "בירה",
      answers: ["בירה", "קצף", "ענן", "beer", "foam", "cloud"],
    },
    truth: { label: "כבשה", answers: ["כבשה", "כבש", "כבשים", "sheep"] },
    top: [{ icon: "1f37a", x: 2.0, y: 1.5, size: 57.7 }],
    bottom: [{ icon: "1f411", x: 5.3, y: 11.8, size: 89.7 }],
  },
  {
    id: "pig",
    bg: "#eef7e4",
    decoy: { label: "תות", answers: ["תות", "תות שדה", "תותים", "strawberry"] },
    truth: { label: "חזיר", answers: ["חזיר", "חזרזיר", "pig"] },
    top: [{ icon: "1f353", x: 38.6, y: -0.4, size: 57.3 }],
    bottom: [{ icon: "1f416", x: 1.8, y: 8.7, size: 95.4 }],
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
    top: [{ icon: "1f344", x: 28.3, y: -0.0, size: 45.9 }],
    bottom: [{ icon: "1f6b2", x: -0.3, y: -19.3, size: 100.5 }],
  },
  {
    id: "printer",
    bg: "#efe9f7",
    decoy: {
      label: "קוסם",
      answers: ["קוסם", "מכשף", "מכשפה", "כובע", "גנדלף", "wizard"],
    },
    truth: { label: "מדפסת", answers: ["מדפסת", "printer"] },
    top: [{ icon: "1f9d9", x: 19.0, y: 2.8, size: 54.6 }],
    bottom: [{ icon: "1f5a8", x: 6.0, y: 13.5, size: 87.9 }],
  },
  {
    id: "duck",
    bg: "#dff0f7",
    decoy: { label: "טירה", answers: ["טירה", "ארמון", "מבצר", "castle"] },
    truth: { label: "ברווז", answers: ["ברווז", "ברווזה", "duck"] },
    top: [{ icon: "1f3f0", x: 11.0, y: 2.9, size: 44.9 }],
    bottom: [{ icon: "1f986", x: 6.5, y: 9.6, size: 90.6 }],
  },
  {
    id: "trash",
    bg: "#e9f2ea",
    decoy: { label: "פנדה", answers: ["פנדה", "דוב פנדה", "דוב", "panda"] },
    truth: { label: "פח", answers: ["פח", "פח זבל", "פח אשפה", "סל אשפה", "trash", "trash can", "bin"] },
    top: [{ icon: "1f43c", x: 21.5, y: -0.4, size: 55.5 }],
    bottom: [{ icon: "1f5d1", x: 9.0, y: 19.1, size: 82.0 }],
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
    top: [{ icon: "1f9c1", x: 0.9, y: 2.4, size: 50.0 }],
    bottom: [{ icon: "1f45f", x: -1.1, y: -14.2, size: 102.1 }],
  },
  {
    id: "bathtub",
    bg: "#ffeedd",
    decoy: {
      label: "הר געש",
      answers: ["הר געש", "וולקן", "התפרצות", "volcano"],
    },
    truth: { label: "אמבטיה", answers: ["אמבטיה", "אמבט", "bathtub", "bath"] },
    top: [{ icon: "1f30b", x: 46.3, y: 3.3, size: 47.1 }],
    bottom: [{ icon: "1f6c1", x: 7.2, y: 15.6, size: 85.6 }],
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
    top: [{ icon: "1f384", x: 4.0, y: 5.9, size: 38.9 }],
    bottom: [{ icon: "1f418", x: 6.5, y: 16.8, size: 87.3 }],
  },
  {
    id: "guitar",
    bg: "#f6eadf",
    decoy: {
      label: "עוגת יום הולדת",
      answers: ["עוגה", "עוגת יום הולדת", "יום הולדת", "נרות", "cake"],
    },
    truth: { label: "גיטרה", answers: ["גיטרה", "גיטרה חשמלית", "guitar"] },
    top: [{ icon: "1f382", x: 30.9, y: -2.0, size: 56.2 }],
    bottom: [{ icon: "1f3b8", x: -1.3, y: -1.6, size: 102.7 }],
  },
];

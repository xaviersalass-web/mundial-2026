/* ============================================================================
   WORLD CUP ATLAS — LICENSED PHOTO MAP
   Real, freely-licensed photos (Wikimedia Commons / Unsplash), downloaded and
   optimised to width-appropriate WebP in /public/photos. CC BY / CC BY-SA
   images require visible on-page credit — see <PhotoCredits>.
   `pos` (optional) sets object-position so faces/subjects stay framed when the
   slot crops (e.g. circular podium portraits).
   ========================================================================== */

export interface LicensedPhoto {
  src: string;
  label: string;
  license: string;
  attribution: string;
  /** CSS object-position for the crop (defaults to "center"). */
  pos?: string;
}

export const PHOTOS: Record<string, LicensedPhoto> = {
  /* ---- 2026 host-city venues ------------------------------------------- */
  "city-nynj": {
    src: "/photos/city-nynj.webp",
    label: "MetLife Stadium, New York / New Jersey",
    license: "CC BY 2.0",
    attribution: "Anthony Quintano, via Wikimedia Commons",
  },
  "city-mexico": {
    src: "/photos/city-mexico.webp",
    label: "Estadio Azteca, Mexico City",
    license: "CC BY-SA 4.0",
    attribution: "ProtoplasmaKid, via Wikimedia Commons",
  },
  "city-dallas": {
    src: "/photos/city-dallas.webp",
    label: "AT&T Stadium, Dallas",
    license: "CC BY-SA 2.0",
    attribution: "Rondo Estrello, via Wikimedia Commons",
  },
  "city-atlanta": {
    src: "/photos/city-atlanta.webp",
    label: "Mercedes-Benz Stadium, Atlanta",
    license: "CC BY-SA 4.0",
    attribution: "Droidman1231, via Wikimedia Commons",
  },
  "city-la": {
    src: "/photos/city-la.webp",
    label: "SoFi Stadium, Los Angeles",
    license: "CC0 1.0",
    attribution: "Nowoco, via Wikimedia Commons (Public Domain)",
  },
  "city-miami": {
    src: "/photos/city-miami.webp",
    label: "Hard Rock Stadium, Miami",
    license: "CC BY-SA 4.0",
    attribution: "Eisenthesky Productions, via Wikimedia Commons",
  },
  "city-seattle": {
    src: "/photos/city-seattle.webp",
    label: "Lumen Field, Seattle",
    license: "CC BY-SA 4.0",
    attribution: "SounderBruce, via Wikimedia Commons",
  },
  "city-sfbay": {
    src: "/photos/city-sfbay.webp",
    label: "Levi's Stadium, San Francisco Bay Area",
    license: "CC BY-SA 2.0",
    attribution: "Matthew Roth, via Wikimedia Commons",
  },
  "city-houston": {
    src: "/photos/city-houston.webp",
    label: "NRG Stadium, Houston",
    license: "CC BY-SA 2.0",
    attribution: "Ed Schipul, via Wikimedia Commons",
  },
  "city-kansascity": {
    src: "/photos/city-kansascity.webp",
    label: "Arrowhead Stadium, Kansas City",
    license: "CC BY-SA 4.0",
    attribution: "PCN02WPS, via Wikimedia Commons",
  },
  "city-boston": {
    src: "/photos/city-boston.webp",
    label: "Gillette Stadium, Boston / Foxborough",
    license: "CC BY-SA 4.0",
    attribution: "Kenneth C. Zirkel, via Wikimedia Commons",
  },
  "city-philadelphia": {
    src: "/photos/city-philadelphia.webp",
    label: "Lincoln Financial Field, Philadelphia",
    license: "CC BY 2.0",
    attribution: "Ron Reiring, via Wikimedia Commons",
  },
  "city-toronto": {
    src: "/photos/city-toronto.webp",
    label: "BMO Field, Toronto",
    license: "CC BY-SA 4.0",
    attribution: "H4stings, via Wikimedia Commons",
  },
  "city-vancouver": {
    src: "/photos/city-vancouver.webp",
    label: "BC Place, Vancouver",
    license: "CC BY 4.0",
    attribution: "Quintin Soloviev, via Wikimedia Commons",
  },
  "city-guadalajara": {
    src: "/photos/city-guadalajara.webp",
    label: "Estadio Akron, Guadalajara",
    license: "CC BY 4.0",
    attribution: "Erik Cleves Kristensen, via Wikimedia Commons",
  },
  "city-monterrey": {
    src: "/photos/city-monterrey.webp",
    label: "Estadio BBVA, Monterrey",
    license: "CC BY-SA 3.0 DE",
    attribution: "Arne Müseler / arne-mueseler.com, via Wikimedia Commons",
  },

  /* ---- scorer podium portraits ----------------------------------------- */
  "pod-klose": {
    src: "/photos/pod-klose.webp",
    label: "Miroslav Klose",
    license: "CC BY-SA 3.0",
    attribution: "Michael Kranewitter, via Wikimedia Commons",
    pos: "center 30%",
  },
  "pod-ronaldo": {
    src: "/photos/pod-ronaldo.webp",
    label: "Ronaldo Nazário",
    license: "CC BY 2.0",
    attribution: "Web Summit, via Wikimedia Commons",
    pos: "center 22%",
  },
  "pod-muller": {
    src: "/photos/pod-muller.webp",
    label: "Gerd Müller",
    license: "CC0 1.0",
    attribution: "Koen Suyk / Anefo — Dutch National Archive (Public Domain)",
    pos: "center 18%",
  },

  /* ---- moments gallery -------------------------------------------------- */
  trophy: {
    src: "/photos/trophy.webp",
    label: "The FIFA World Cup Trophy",
    license: "CC BY-SA 4.0",
    attribution: "Ank Kumar, via Wikimedia Commons",
  },
  "moment-celebration": {
    src: "/photos/moment-celebration.webp",
    label: "Pure euphoria — a celebration",
    license: "Unsplash License",
    attribution: "Igor Batista, on Unsplash",
  },
  "moment-scorer": {
    src: "/photos/moment-scorer.webp",
    label: "A striker wheels away in celebration",
    license: "CC BY-SA 2.0",
    attribution: "IIJ Events, via Wikimedia Commons",
  },
  "moment-atmosphere": {
    src: "/photos/moment-atmosphere.webp",
    label: "A stadium roar",
    license: "Unsplash License",
    attribution: "Bernd Dittrich, on Unsplash",
  },
  "moment-drama": {
    src: "/photos/moment-drama.webp",
    label: "The decisive penalty — 2022 World Cup final",
    license: "CC BY 3.0",
    attribution: "Sebas, via Wikimedia Commons",
  },
  "moment-opening": {
    src: "/photos/moment-opening.webp",
    label: "Opening-night atmosphere",
    license: "Unsplash License",
    attribution: "Ahmet Kurt, on Unsplash",
  },
};

export function photoSrc(key: string): string | undefined {
  return PHOTOS[key]?.src;
}

/** object-position for a photo's crop (used by circular / fixed-ratio slots). */
export function photoPos(key: string): string | undefined {
  return PHOTOS[key]?.pos;
}

/** Human label for a photo (used for alt text). */
export function photoLabel(key: string): string | undefined {
  return PHOTOS[key]?.label;
}

/** All photos that require visible attribution (CC0/PD are credited as courtesy). */
export const PHOTO_CREDITS = Object.values(PHOTOS);

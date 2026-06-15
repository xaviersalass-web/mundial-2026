/* ============================================================================
   WORLD CUP ATLAS — LICENSED PHOTO MAP
   Real, freely-licensed photos (Wikimedia Commons / Unsplash), downloaded into
   /public/photos at build time (avoids Wikimedia per-IP 429 throttling). CC BY /
   CC BY-SA images require visible on-page credit — see <PhotoCredits>.
   ========================================================================== */

export interface LicensedPhoto {
  src: string;
  label: string;
  license: string;
  attribution: string;
}

export const PHOTOS: Record<string, LicensedPhoto> = {
  "city-nynj": {
    src: "/photos/city-nynj.jpg",
    label: "MetLife Stadium",
    license: "CC BY 2.0",
    attribution: "Anthony Quintano, via Wikimedia Commons",
  },
  "city-la": {
    src: "/photos/city-la.jpg",
    label: "SoFi Stadium",
    license: "CC0 1.0",
    attribution: "Nowoco, via Wikimedia Commons (Public Domain)",
  },
  "city-dallas": {
    src: "/photos/city-dallas.jpg",
    label: "AT&T Stadium",
    license: "CC BY-SA 2.0",
    attribution: "Rondo Estrello, via Wikimedia Commons",
  },
  "city-miami": {
    src: "/photos/city-miami.jpg",
    label: "Hard Rock Stadium",
    license: "CC BY-SA 4.0",
    attribution: "Eisenthesky Productions, via Wikimedia Commons",
  },
  "city-mexico": {
    src: "/photos/city-mexico.jpg",
    label: "Estadio Azteca",
    license: "CC BY-SA 4.0",
    attribution: "ProtoplasmaKid, via Wikimedia Commons",
  },
  "city-toronto": {
    src: "/photos/city-toronto.jpg",
    label: "BMO Field",
    license: "CC BY-SA 4.0",
    attribution: "H4stings, via Wikimedia Commons",
  },
  "city-vancouver": {
    src: "/photos/city-vancouver.jpg",
    label: "BC Place",
    license: "CC BY 4.0",
    attribution: "Quintin Soloviev, via Wikimedia Commons",
  },
  "city-atlanta": {
    src: "/photos/city-atlanta.jpg",
    label: "Mercedes-Benz Stadium",
    license: "CC BY-SA 4.0",
    attribution: "Droidman1231, via Wikimedia Commons",
  },
  trophy: {
    src: "/photos/trophy.jpg",
    label: "FIFA World Cup Trophy",
    license: "CC BY-SA 4.0",
    attribution: "Ank Kumar, via Wikimedia Commons",
  },
  "moment-celebration": {
    src: "/photos/moment-celebration.jpg",
    label: "Celebration",
    license: "Unsplash License",
    attribution: "Igor Batista, on Unsplash",
  },
  "moment-atmosphere": {
    src: "/photos/moment-atmosphere.jpg",
    label: "Stadium atmosphere",
    license: "Unsplash License",
    attribution: "Bernd Dittrich, on Unsplash",
  },
  "moment-opening": {
    src: "/photos/moment-opening.jpg",
    label: "Opening atmosphere",
    license: "Unsplash License",
    attribution: "Ahmet Kurt, on Unsplash",
  },
};

export function photoSrc(key: string): string | undefined {
  return PHOTOS[key]?.src;
}

/** All photos that legally require visible attribution (everything but CC0/PD is courteous too). */
export const PHOTO_CREDITS = Object.values(PHOTOS);

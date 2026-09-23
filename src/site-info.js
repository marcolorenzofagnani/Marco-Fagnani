/** Single source of truth for NAP / local business facts (Marco site). */
export const SITE = {
  personName: "Marco Fagnani",
  jobTitle: "Osteopata e chinesiologo",
  businessName: "Marco Fagnani Osteopata",
  phoneDisplay: "345 156 8849",
  phoneTel: "+393451568849",
  phoneHref: "tel:+393451568849",
  email: "marcolorenzofagnani@gmail.com",
  streetAddress: "Viale Enrico Forlanini 23",
  postalCode: "20134",
  addressLocality: "Milano",
  addressRegion: "MI",
  addressCountry: "IT",
  zone: "Forlanini",
  /** Nearest transit — confirmed by coach. */
  transitNote: "Metro Repetti (M4), circa 5 minuti a piedi",
  vat: "11349850963",
  /** Already published in home LocalBusiness schema. */
  geo: { latitude: 45.4628, longitude: 9.2426 },
  mapsQuery: "Viale+Enrico+Forlanini+23,+20134+Milano",
  siteUrl: "https://www.marcofagnaniosteopata.it",
  waBase: "https://wa.me/393451568849",
};

export function formatAddressOneLine() {
  const s = SITE;
  return `${s.streetAddress}, ${s.postalCode} ${s.addressLocality}`;
}

export function formatAddressMultiLineHtml() {
  const s = SITE;
  return `${s.streetAddress}<br />${s.postalCode} ${s.addressLocality} ${s.addressRegion}`;
}

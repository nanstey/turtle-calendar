export type MoonReferenceRow = {
  moon: number;
  anishinaabeSample: string;
  haudenosauneeSample: string;
};

export const MOON_REFERENCE_ROWS: MoonReferenceRow[] = [
  {
    moon: 1,
    anishinaabeSample: 'Namebini-giizis (Sucker Fish Moon)',
    haudenosauneeSample: 'Mid-Winter Moon'
  },
  {
    moon: 2,
    anishinaabeSample: 'Mkwa-giizis (Bear Moon)',
    haudenosauneeSample: 'Maple Syrup / Split Days Moon'
  },
  {
    moon: 3,
    anishinaabeSample: 'Onaabani-giizis (Hard Crust on the Snow Moon)',
    haudenosauneeSample: 'Thunder Moon'
  },
  {
    moon: 4,
    anishinaabeSample: 'Iskigamizige-giizis (Boiling of Sap Moon)',
    haudenosauneeSample: 'Planting Moon'
  },
  {
    moon: 5,
    anishinaabeSample: 'Zaagibagaa-giizis (Budding Moon)',
    haudenosauneeSample: 'Strawberry Moon'
  },
  {
    moon: 6,
    anishinaabeSample: "Ode'imin-giizis (Strawberry Moon)",
    haudenosauneeSample: 'Green Bean Moon'
  },
  {
    moon: 7,
    anishinaabeSample: 'Miin-giizis (Berry Moon)',
    haudenosauneeSample: 'Green Corn Moon'
  },
  {
    moon: 8,
    anishinaabeSample: 'Apenim-goozii-giizis (Midway Through Summer Moon)',
    haudenosauneeSample: 'Harvest Moon'
  },
  {
    moon: 9,
    anishinaabeSample: 'Manoominike-giizis (Ricing Moon)',
    haudenosauneeSample: 'Food Storing Moon'
  },
  {
    moon: 10,
    anishinaabeSample: 'Waatebagaa-giizis (Leaves Changing Color Moon)',
    haudenosauneeSample: 'Hunting / Giving Thanks Moon'
  },
  {
    moon: 11,
    anishinaabeSample: 'Binaakwe-giizis (Leaves Falling Moon)',
    haudenosauneeSample: 'Long Night Moon'
  },
  {
    moon: 12,
    anishinaabeSample: 'Gashkadino-giizis (Freezing Over Moon)',
    haudenosauneeSample: 'Great Light / Resting Moon'
  },
  {
    moon: 13,
    anishinaabeSample: 'Manidoo-giizisoons (Little Spirit Moon)',
    haudenosauneeSample: 'Snow Moon'
  }
];

export type Citation = {
  id: number;
  title: string;
  url: string;
  note: string;
};

export const CITATIONS: Citation[] = [
  {
    id: 1,
    title: 'SCCDSB FNMI Knowledge Building: 13 Moons',
    url: 'https://fnmi.sccdsb.net/13-moons',
    note: 'Overview connecting 13 moons and turtle shell teachings across Nations.'
  },
  {
    id: 2,
    title: 'Anishinaabemdaa: Moons',
    url: 'https://anishinaabemdaa.com/pages/moons',
    note: 'Example 13-moon naming sequence from an Anishinaabe language program.'
  },
  {
    id: 3,
    title: 'Haudenosaunee Confederacy: Ceremonies',
    url: 'https://www.haudenosauneeconfederacy.com/ceremonies/',
    note: 'Haudenosaunee ceremonial cycle across 13 moons.'
  },
  {
    id: 4,
    title: 'Dawn Dark Mountain: Thirteen Moons',
    url: 'https://www.dawndarkmountain.com/product/thirteen-moons-2/',
    note: 'Publicly shared English moon-name list for an Iroquois/Haudenosaunee context.'
  },
  {
    id: 5,
    title: 'NASA Science: The Moon',
    url: 'https://science.nasa.gov/moon/',
    note: 'Moon-cycle background (about a 29.5-day synodic month) used for phase approximation.'
  },
  {
    id: 6,
    title: 'Library of Congress CRS: Lunar New Year Fact Sheet (R46674)',
    url: 'https://www.congress.gov/crs-product/R46674',
    note: 'Lunar New Year boundary rules and zodiac cycle context.'
  },
  {
    id: 7,
    title: 'Smithsonian: 2026 Year of the Horse',
    url: 'https://www.si.edu/spotlight/lunar-year-horse',
    note: 'Current cycle year context and animal-year sequence confirmation.'
  }
];

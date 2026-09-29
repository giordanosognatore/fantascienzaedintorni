export const categories = [
  'Libri',
  'Cinema',
  'Serie TV',
  'Videogames',
  'Community',
  'Approfondimenti',
] as const;

export type Category = (typeof categories)[number];

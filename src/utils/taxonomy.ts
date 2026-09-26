export const categories = [
  'Libri',
  'Cinema',
  'Serie TV',
  'Community',
  'Approfondimenti',
] as const;

export type Category = (typeof categories)[number];

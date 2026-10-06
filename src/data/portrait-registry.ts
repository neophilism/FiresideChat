export const portraitPaths: Record<string, string> = {
  "al-franken": "/portraits/al-franken.webp",
  "andy-biggs": "/portraits/andy-biggs.webp",
  "angus-king": "/portraits/angus-king.webp",
  "anna-paulina-luna": "/portraits/anna-paulina-luna.webp",
  "bernie-sanders": "/portraits/bernie-sanders.webp",
  "brian-fitzpatrick": "/portraits/brian-fitzpatrick.webp",
  "cory-booker": "/portraits/cory-booker.webp",
  "doug-collins": "/portraits/doug-collins.webp",
  "edward-markey": "/portraits/edward-markey.webp",
  "james-lankford": "/portraits/james-lankford.webp",
  "jason-chaffetz": "/portraits/jason-chaffetz.webp",
  "jeff-crank": "/portraits/jeff-crank.webp",
  "joe-walsh": "/portraits/joe-walsh.webp",
  "lisa-murkowski": "/portraits/lisa-murkowski.webp",
  "marc-veasey": "/portraits/marc-veasey.webp",
  "mark-alford": "/portraits/mark-alford.webp",
  "marsha-blackburn": "/portraits/marsha-blackburn.webp",
  "newt-gingrich": "/portraits/newt-gingrich.webp",
  "ron-johnson": "/portraits/ron-johnson.webp",
  "ruben-gallego": "/portraits/ruben-gallego.webp",
  "sheldon-whitehouse": "/portraits/sheldon-whitehouse.webp",
  "ted-cruz": "/portraits/ted-cruz.webp",
  "thomas-suozzi": "/portraits/thomas-suozzi.webp",
  "tim-burchett": "/portraits/tim-burchett.webp",
  "tim-scott": "/portraits/tim-scott.webp",
  "trey-gowdy": "/portraits/trey-gowdy.webp",
  "troy-carter": "/portraits/troy-carter.webp",
};

export function portraitPathFor(slug: string) {
  return portraitPaths[slug] ?? null;
}

export const IMAGE_STYLES = [
  { name: "Illustration",  file: "Illustration.png",  ratio: "16 / 9" },
  { name: "Anime",         file: "Anime.png",          ratio: "16 / 9" },
  { name: "3D Render",     file: "3D render.png",      ratio: "16 / 9" },
  { name: "Comic Book",    file: "Comic book.png",     ratio: "16 / 9" },
  { name: "Pixel Art",     file: "Pixel art.png",      ratio: "16 / 9" },
  { name: "Watercolor",    file: "Water color.png",    ratio: "1 / 1"  },
  { name: "Oil Painting",  file: "Oil painting.png",   ratio: "1 / 1"  },
  { name: "Cinematic",     file: "Cinematic.png",      ratio: "1 / 1"  },
  { name: "Pencil Sketch", file: "Pencil Sketch.png",  ratio: "1 / 1"  },
  { name: "Monochrome",    file: "Monochrome.png",     ratio: "1 / 1"  },
  { name: "Minecraft",     file: "Minecraft.png",      ratio: "9 / 16" },
  { name: "Neon Noir",     file: "Neon Noir.png",      ratio: "9 / 16" },
  { name: "Cyberpunk",     file: "Cyberpunk.png",      ratio: "9 / 16" },
  { name: "Vintage Film",  file: "Vintage.png",        ratio: "9 / 16" },
  { name: "Surreal",       file: "Surreal.png",        ratio: "9 / 16" },
  { name: "Studio Ghibli", file: "Studio Ghibli.png",  ratio: "9 / 16" },
  { name: "Impressionist", file: "Impressionist.png",  ratio: "9 / 16" },
  { name: "Photorealistic",file: "Photorealistic.png", ratio: "9 / 16" },
  { name: "Abstract",      file: "Abstract.png",       ratio: "9 / 16" },
];

export function getImageStyleUrl(style) {
  return `/image-styles/${encodeURIComponent(style.file)}`;
}

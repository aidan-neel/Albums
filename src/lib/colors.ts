export async function getContrastTailwindColor(imgSrc: string): Promise<`#${string}`> {
  function rgbToHsl(r: number, g: number, b: number) {
    r /= 255; g /= 255; b /= 255;
    const max = Math.max(r, g, b), min = Math.min(r, g, b);
    let h = 0, s = 0, l = (max + min) / 2;
    if (max !== min) {
      const d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
      switch (max) {
        case r: h = ((g - b) / d) + (g < b ? 6 : 0); break;
        case g: h = ((b - r) / d) + 2; break;
        case b: h = ((r - g) / d) + 4; break;
      }
      h /= 6;
    }
    return { h, s, l };
  }

  function hslToRgb(h: number, s: number, l: number) {
    let r: number, g: number, b: number;
    if (s === 0) {
      r = g = b = l;
    } else {
      const hue2rgb = (p: number, q: number, t: number) => {
        if (t < 0) t += 1;
        if (t > 1) t -= 1;
        if (t < 1 / 6) return p + (q - p) * 6 * t;
        if (t < 1 / 2) return q;
        if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
        return p;
      };
      const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
      const p = 2 * l - q;
      r = hue2rgb(p, q, h + 1 / 3);
      g = hue2rgb(p, q, h);
      b = hue2rgb(p, q, h - 1 / 3);
    }
    return {
      r: Math.round(r * 255),
      g: Math.round(g * 255),
      b: Math.round(b * 255)
    };
  }

  function getAverageColor(imgSrc: string): Promise<{ r: number, g: number, b: number }> {
    return new Promise((resolve) => {
      const img = new Image();
      img.crossOrigin = 'Anonymous';
      img.src = imgSrc;
      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = 1;
        canvas.height = 1;
        const ctx = canvas.getContext('2d')!;
        ctx.drawImage(img, 0, 0, 1, 1);
        const [r, g, b] = ctx.getImageData(0, 0, 1, 1).data;
        resolve({ r, g, b });
      };
    });
  }

  function rgbToHex(r: number, g: number, b: number): `#${string}` {
    return `#${[r, g, b].map(x => x.toString(16).padStart(2, '0')).join('')}`;
  }

  const { r, g, b } = await getAverageColor(imgSrc);
  const { h, s, l } = rgbToHsl(r, g, b);
  const contrastHue = (h + 0.5) % 1;
  const contrastS = s < 0.5 ? Math.min(s + 0.4, 1) : s;
  const contrastL = l < 0.5 ? Math.min(l + 0.3, 1) : Math.max(l - 0.3, 0);
  const { r: cr, g: cg, b: cb } = hslToRgb(contrastHue, contrastS, contrastL);

  return rgbToHex(cr, cg, cb);
}

/**
 * Mandelbrot and Julia Set Fractal Generator
 * Based on UCF (Universal Consciousness Framework) parameters
 */

interface UCFState {
  harmony: number;
  zoom: number;
  resilience: number;
  prana: number;
  drishti: number;
  klesha: number;
}

interface FractalConfig {
  width: number;
  height: number;
  maxIterations: number;
  centerX: number;
  centerY: number;
  zoom: number;
  colorScheme: 'cosmic' | 'ocean' | 'fire' | 'consciousness';
}

/**
 * Generate a Mandelbrot set fractal
 */
export function generateMandelbrot(
  ucfState: UCFState,
  config: Partial<FractalConfig> = {}
): string {
  const {
    width = 1024,
    height = 1024,
    maxIterations = 100,
    centerX = -0.5,
    centerY = 0,
    zoom = ucfState.zoom,
    colorScheme = 'cosmic'
  } = config;

  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');
  
  if (!ctx) return '';

  const imageData = ctx.createImageData(width, height);
  const data = imageData.data;

  // Calculate the complex plane bounds based on zoom
  const scale = 3.5 / zoom;
  const minReal = centerX - scale;
  const maxReal = centerX + scale;
  const minImag = centerY - scale;
  const maxImag = centerY + scale;

  // Adjust iterations based on harmony (higher harmony = more detail)
  const iterations = Math.floor(maxIterations * (0.5 + ucfState.harmony));

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      // Map pixel to complex plane
      const cReal = minReal + (x / width) * (maxReal - minReal);
      const cImag = minImag + (y / height) * (maxImag - minImag);

      // Mandelbrot iteration
      let zReal = 0;
      let zImag = 0;
      let iteration = 0;

      while (iteration < iterations && zReal * zReal + zImag * zImag < 4) {
        const zRealTemp = zReal * zReal - zImag * zImag + cReal;
        zImag = 2 * zReal * zImag + cImag;
        zReal = zRealTemp;
        iteration++;
      }

      // Calculate pixel index
      const pixelIndex = (y * width + x) * 4;

      // Color based on iteration count and UCF parameters
      if (iteration === iterations) {
        // Inside the set - use dark colors influenced by klesha
        const darkness = 1 - ucfState.klesha * 10;
        data[pixelIndex] = 0;
        data[pixelIndex + 1] = 0;
        data[pixelIndex + 2] = Math.floor(20 * darkness);
        data[pixelIndex + 3] = 255;
      } else {
        // Outside the set - colorize based on iteration and UCF state
        const color = getColor(
          iteration,
          iterations,
          ucfState,
          colorScheme
        );
        data[pixelIndex] = color.r;
        data[pixelIndex + 1] = color.g;
        data[pixelIndex + 2] = color.b;
        data[pixelIndex + 3] = 255;
      }
    }
  }

  ctx.putImageData(imageData, 0, 0);
  return canvas.toDataURL();
}

/**
 * Generate a Julia set fractal
 */
export function generateJuliaSet(
  ucfState: UCFState,
  config: Partial<FractalConfig> = {}
): string {
  const {
    width = 1024,
    height = 1024,
    maxIterations = 100,
    centerX = 0,
    centerY = 0,
    zoom = ucfState.zoom,
    colorScheme = 'cosmic'
  } = config;

  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');
  
  if (!ctx) return '';

  const imageData = ctx.createImageData(width, height);
  const data = imageData.data;

  // Julia set constant influenced by prana and drishti
  const cReal = -0.7 + ucfState.prana * 0.4;
  const cImag = 0.27015 + ucfState.drishti * 0.2;

  const scale = 3.5 / zoom;
  const minReal = centerX - scale;
  const maxReal = centerX + scale;
  const minImag = centerY - scale;
  const maxImag = centerY + scale;

  const iterations = Math.floor(maxIterations * (0.5 + ucfState.harmony));

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      // Map pixel to complex plane
      let zReal = minReal + (x / width) * (maxReal - minReal);
      let zImag = minImag + (y / height) * (maxImag - minImag);

      let iteration = 0;

      while (iteration < iterations && zReal * zReal + zImag * zImag < 4) {
        const zRealTemp = zReal * zReal - zImag * zImag + cReal;
        zImag = 2 * zReal * zImag + cImag;
        zReal = zRealTemp;
        iteration++;
      }

      const pixelIndex = (y * width + x) * 4;

      if (iteration === iterations) {
        const darkness = 1 - ucfState.klesha * 10;
        data[pixelIndex] = 0;
        data[pixelIndex + 1] = 0;
        data[pixelIndex + 2] = Math.floor(20 * darkness);
        data[pixelIndex + 3] = 255;
      } else {
        const color = getColor(
          iteration,
          iterations,
          ucfState,
          colorScheme
        );
        data[pixelIndex] = color.r;
        data[pixelIndex + 1] = color.g;
        data[pixelIndex + 2] = color.b;
        data[pixelIndex + 3] = 255;
      }
    }
  }

  ctx.putImageData(imageData, 0, 0);
  return canvas.toDataURL();
}

/**
 * Get color based on iteration count and UCF state
 */
function getColor(
  iteration: number,
  maxIterations: number,
  ucfState: UCFState,
  scheme: string
): { r: number; g: number; b: number } {
  const t = iteration / maxIterations;
  
  // Apply UCF influences
  const harmonyInfluence = ucfState.harmony;
  const pranaInfluence = ucfState.prana;
  const resilience = ucfState.resilience;

  switch (scheme) {
    case 'cosmic':
      // Purple, pink, cyan gradient influenced by UCF
      return {
        r: Math.floor(147 + 108 * t * harmonyInfluence),
        g: Math.floor(112 * (1 - t) + 200 * t * pranaInfluence),
        b: Math.floor(219 - 100 * t + 100 * resilience * t)
      };
    
    case 'ocean':
      return {
        r: Math.floor(50 * t),
        g: Math.floor(100 + 155 * t * pranaInfluence),
        b: Math.floor(200 + 55 * t * harmonyInfluence)
      };
    
    case 'fire':
      return {
        r: Math.floor(255 * resilience),
        g: Math.floor(100 * t * harmonyInfluence),
        b: Math.floor(50 * (1 - t))
      };
    
    case 'consciousness':
      // Smooth gradient representing consciousness states
      const hue = (t * 360 * harmonyInfluence) % 360;
      const saturation = 0.6 + 0.4 * pranaInfluence;
      const lightness = 0.3 + 0.4 * t;
      return hslToRgb(hue, saturation, lightness);
    
    default:
      return { r: 0, g: 0, b: 0 };
  }
}

/**
 * Convert HSL to RGB
 */
function hslToRgb(h: number, s: number, l: number): { r: number; g: number; b: number } {
  const c = (1 - Math.abs(2 * l - 1)) * s;
  const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
  const m = l - c / 2;
  
  let r = 0, g = 0, b = 0;
  
  if (h >= 0 && h < 60) {
    r = c; g = x; b = 0;
  } else if (h >= 60 && h < 120) {
    r = x; g = c; b = 0;
  } else if (h >= 120 && h < 180) {
    r = 0; g = c; b = x;
  } else if (h >= 180 && h < 240) {
    r = 0; g = x; b = c;
  } else if (h >= 240 && h < 300) {
    r = x; g = 0; b = c;
  } else if (h >= 300 && h < 360) {
    r = c; g = 0; b = x;
  }
  
  return {
    r: Math.floor((r + m) * 255),
    g: Math.floor((g + m) * 255),
    b: Math.floor((b + m) * 255)
  };
}

/**
 * Generate a hybrid fractal combining Mandelbrot and Julia characteristics
 * This creates unique "consciousness" fractals based on UCF state
 */
export function generateConsciousnessFractal(
  ucfState: UCFState,
  config: Partial<FractalConfig> = {}
): string {
  // Use resilience to blend between Mandelbrot and Julia
  if (ucfState.resilience > 1.0) {
    return generateJuliaSet(ucfState, config);
  } else {
    return generateMandelbrot(ucfState, config);
  }
}


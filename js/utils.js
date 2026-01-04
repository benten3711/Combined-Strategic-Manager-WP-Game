// Math utilities for hexagon geometry

/**
 * Convert axial coordinates (q, r) to pixel coordinates (x, y)
 * For pointy-topped hexagons
 * @param {number} q - Column coordinate
 * @param {number} r - Row coordinate
 * @param {number} size - Hex size (radius)
 * @returns {Object} {x, y} pixel coordinates
 */
function axialToPixel(q, r, size) {
    const x = size * (Math.sqrt(3) * q + Math.sqrt(3) / 2 * r);
    const y = size * (3 / 2 * r);
    return { x, y };
}

/**
 * Convert pixel coordinates to axial coordinates
 * For pointy-topped hexagons
 * @param {number} x - X pixel coordinate
 * @param {number} y - Y pixel coordinate
 * @param {number} size - Hex size (radius)
 * @returns {Object} {q, r} axial coordinates
 */
function pixelToAxial(x, y, size) {
    const q = (Math.sqrt(3) / 3 * x - 1 / 3 * y) / size;
    const r = (2 / 3 * y) / size;
    return axialRound(q, r);
}

/**
 * Round fractional axial coordinates to nearest hex
 * @param {number} q - Fractional q coordinate
 * @param {number} r - Fractional r coordinate
 * @returns {Object} {q, r} rounded axial coordinates
 */
function axialRound(q, r) {
    return cubeToAxial(cubeRound(axialToCube(q, r)));
}

/**
 * Convert axial to cube coordinates
 * @param {number} q - Q coordinate
 * @param {number} r - R coordinate
 * @returns {Object} {x, y, z} cube coordinates
 */
function axialToCube(q, r) {
    const x = q;
    const z = r;
    const y = -x - z;
    return { x, y, z };
}

/**
 * Convert cube to axial coordinates
 * @param {Object} cube - {x, y, z} cube coordinates
 * @returns {Object} {q, r} axial coordinates
 */
function cubeToAxial(cube) {
    const q = cube.x;
    const r = cube.z;
    return { q, r };
}

/**
 * Round fractional cube coordinates to nearest hex
 * @param {Object} cube - {x, y, z} fractional cube coordinates
 * @returns {Object} {x, y, z} rounded cube coordinates
 */
function cubeRound(cube) {
    let rx = Math.round(cube.x);
    let ry = Math.round(cube.y);
    let rz = Math.round(cube.z);

    const xDiff = Math.abs(rx - cube.x);
    const yDiff = Math.abs(ry - cube.y);
    const zDiff = Math.abs(rz - cube.z);

    if (xDiff > yDiff && xDiff > zDiff) {
        rx = -ry - rz;
    } else if (yDiff > zDiff) {
        ry = -rx - rz;
    } else {
        rz = -rx - ry;
    }

    return { x: rx, y: ry, z: rz };
}

/**
 * Calculate the 6 corner points of a hexagon
 * For pointy-topped hexagons
 * @param {number} centerX - Center X coordinate
 * @param {number} centerY - Center Y coordinate
 * @param {number} size - Hex size (radius)
 * @returns {Array} Array of {x, y} corner points
 */
function hexCorners(centerX, centerY, size) {
    const corners = [];
    for (let i = 0; i < 6; i++) {
        const angleDeg = 60 * i - 30; // Start at -30 for pointy-top
        const angleRad = Math.PI / 180 * angleDeg;
        corners.push({
            x: centerX + size * Math.cos(angleRad),
            y: centerY + size * Math.sin(angleRad)
        });
    }
    return corners;
}

/**
 * Calculate distance between two hexes (in hex units)
 * @param {number} q1 - Q coordinate of first hex
 * @param {number} r1 - R coordinate of first hex
 * @param {number} q2 - Q coordinate of second hex
 * @param {number} r2 - R coordinate of second hex
 * @returns {number} Distance in hex units
 */
function hexDistance(q1, r1, q2, r2) {
    const cube1 = axialToCube(q1, r1);
    const cube2 = axialToCube(q2, r2);
    return (Math.abs(cube1.x - cube2.x) + Math.abs(cube1.y - cube2.y) + Math.abs(cube1.z - cube2.z)) / 2;
}

/**
 * Convert D6 roll to probability percentage
 * @param {number} targetNumber - Target number on D6 (1-6)
 * @returns {number} Probability as percentage
 */
function d6ToProbability(targetNumber) {
    if (targetNumber < 1 || targetNumber > 6) {
        return 0;
    }
    return D6_PROBABILITIES[targetNumber];
}

/**
 * Interpolate between two colors based on a factor (0-1)
 * @param {string} color1 - Start color (hex format)
 * @param {string} color2 - End color (hex format)
 * @param {number} factor - Interpolation factor (0-1)
 * @returns {string} Interpolated color (hex format)
 */
function interpolateColor(color1, color2, factor) {
    // Parse hex colors
    const c1 = hexToRgb(color1);
    const c2 = hexToRgb(color2);
    
    // Interpolate each channel
    const r = Math.round(c1.r + (c2.r - c1.r) * factor);
    const g = Math.round(c1.g + (c2.g - c1.g) * factor);
    const b = Math.round(c1.b + (c2.b - c1.b) * factor);
    
    return rgbToHex(r, g, b);
}

/**
 * Convert hex color string to RGB object
 * @param {string} hex - Hex color string (e.g., "#FF0000")
 * @returns {Object} {r, g, b} values (0-255)
 */
function hexToRgb(hex) {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
    } : { r: 0, g: 0, b: 0 };
}

/**
 * Convert RGB values to hex color string
 * @param {number} r - Red value (0-255)
 * @param {number} g - Green value (0-255)
 * @param {number} b - Blue value (0-255)
 * @returns {string} Hex color string
 */
function rgbToHex(r, g, b) {
    return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1).toUpperCase();
}

/**
 * Create a gradient color interpolator (Green to Red)
 * @param {number} value - Value between 0 and 1
 * @returns {string} Color hex string
 */
function greenToRedGradient(value) {
    // Clamp value between 0 and 1
    value = Math.max(0, Math.min(1, value));
    
    // Green (#00FF00) to Yellow (#FFFF00) to Red (#FF0000)
    if (value < 0.5) {
        // Green to Yellow
        return interpolateColor('#00FF00', '#FFFF00', value * 2);
    } else {
        // Yellow to Red
        return interpolateColor('#FFFF00', '#FF0000', (value - 0.5) * 2);
    }
}

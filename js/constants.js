// Board Configuration
const BOARD_CONFIG = {
    // Hex dimensions
    HEX_SIZE: 30,
    
    // Board dimensions (number of hexes)
    BOARD_WIDTH: 11,  // Number of columns
    BOARD_HEIGHT: 7,  // Number of rows
    
    // Canvas dimensions (calculated based on hex size)
    CANVAS_WIDTH: 800,
    CANVAS_HEIGHT: 600,
    
    // Hex orientation (pointy-topped)
    POINTY_TOP: true
};

// Zone Types
const ZONE_TYPES = {
    FIELD: 'field',
    GOAL: 'goal',
    EJECTION: 'ejection'
};

// Color Palettes
const COLORS = {
    // Ejection Zone (Red corners)
    EJECTION: '#DC143C',
    EJECTION_BORDER: '#8B0000',
    
    // Goal Zone (Checkered pattern)
    GOAL_PRIMARY: '#FFD700',
    GOAL_SECONDARY: '#FFA500',
    GOAL_BORDER: '#FF8C00',
    
    // Field Zone (Gradient blue from light to dark)
    FIELD_LIGHT: '#87CEEB',
    FIELD_MEDIUM: '#4682B4',
    FIELD_DARK: '#1E3A8A',
    FIELD_BORDER: '#0F2557',
    
    // General
    HEX_BORDER: '#2C3E50',
    HEX_HOVER: 'rgba(255, 255, 255, 0.3)'
};

// Probability conversion (D6 to percentage)
// Used to convert traditional D6 dice rolls to percentage-based probabilities
const D6_PROBABILITIES = {
    1: 16.67,   // 1/6
    2: 33.33,   // 2/6
    3: 50.00,   // 3/6
    4: 66.67,   // 4/6
    5: 83.33,   // 5/6
    6: 100.00   // 6/6
};

// Board layout definition
// Defines special zones (goals and ejection areas)
const BOARD_LAYOUT = {
    // Goal hexes (at the ends of the board)
    GOAL_POSITIONS: [
        // Left goal
        { q: 0, r: 3 },
        // Right goal
        { q: 10, r: 3 }
    ],
    
    // Ejection hexes (red corners)
    EJECTION_POSITIONS: [
        // Top-left corner
        { q: 0, r: 0 },
        { q: 1, r: 0 },
        // Top-right corner
        { q: 9, r: 0 },
        { q: 10, r: 0 },
        // Bottom-left corner
        { q: 0, r: 6 },
        { q: 1, r: 6 },
        // Bottom-right corner
        { q: 9, r: 6 },
        { q: 10, r: 6 }
    ]
};

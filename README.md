# Water Polo Strategic Board Game

A web-based strategic board game featuring a hexagonal grid representing a water polo field. This Phase 1 implementation focuses on rendering the board with different zones and interactive hex selection.

## Features

### Hexagonal Board
- **Pointy-topped hexagons** arranged in an 11x7 grid
- **Three distinct zone types:**
  - 🔴 **Ejection Zones**: Red hexagons in the four corners representing penalty areas
  - 🟡 **Goal Zones**: Checkered yellow/orange hexagons on the left and right sides
  - 🔵 **Field Zones**: Blue gradient hexagons transitioning from light (center) to dark (edges)

### Interactive Features
- Click on any hexagon to select it
- View hexagon coordinates (q, r) in axial coordinate system
- Display zone type for each selected hexagon
- Visual feedback with white overlay on selected hex

### Technical Implementation
- Pure vanilla JavaScript (no frameworks)
- HTML5 Canvas for rendering
- Axial/Cube coordinate system for hex mathematics
- Modular code structure with separate concerns

## Project Structure

```
.
├── index.html              # Main HTML entry point
├── css/
│   └── style.css          # Styling for UI and layout
└── js/
    ├── constants.js       # Board configuration and color palettes
    ├── utils.js          # Hex geometry math helpers and utilities
    ├── hex-grid.js       # HexGrid class for rendering and interaction
    └── main.js           # Game initialization
```

## File Descriptions

### `index.html`
Main entry point with a Canvas element for rendering the board and an info overlay for displaying hex information.

### `css/style.css`
- Centers the game board on the page
- Applies styling to the canvas and UI overlays
- Creates an attractive gradient background

### `js/constants.js`
- Board dimensions (11x7 hexagons)
- Hex size configuration (30px radius)
- Color palettes for all three zones
- D6 probability conversion table (for future gameplay features)
- Board layout definitions (goal and ejection positions)

### `js/utils.js`
- **Hexagon geometry functions:**
  - `axialToPixel()` - Convert hex coordinates to screen coordinates
  - `pixelToAxial()` - Convert mouse clicks to hex coordinates
  - `hexCorners()` - Calculate the 6 corner points of a hexagon
  - `hexDistance()` - Calculate distance between hexagons
- **Coordinate system converters:**
  - `axialToCube()` / `cubeToAxial()` - Convert between coordinate systems
  - `axialRound()` / `cubeRound()` - Round fractional coordinates
- **Utility functions:**
  - `d6ToProbability()` - Convert dice rolls to percentages
  - `interpolateColor()` - Blend between two colors
  - `greenToRedGradient()` - Generate color gradients for UI feedback

### `js/hex-grid.js`
The `HexGrid` class manages the entire board:
- Initializes hex data with zone types
- Renders all hexagons to the canvas
- Handles mouse click events
- Converts pixel coordinates to hex coordinates
- Draws special patterns (checkered for goals)
- Applies gradient colors (light to dark blue for field)
- Updates info overlay with selection details

### `js/main.js`
Game initialization script that creates the HexGrid instance and performs the initial render.

## How to Run

1. **Clone the repository:**
   ```bash
   git clone https://github.com/benten3711/Combined-Strategic-Manager-WP-Game.git
   cd Combined-Strategic-Manager-WP-Game
   ```

2. **Open in a browser:**
   - Simply open `index.html` in a web browser, or
   - Use a local web server (recommended):
     ```bash
     python3 -m http.server 8080
     ```
     Then navigate to `http://localhost:8080`

3. **Interact with the board:**
   - Click on any hexagon to select it
   - View the coordinates and zone type in the info panel below the board

## Screenshots

### Initial Board View
![Water Polo Board](https://github.com/user-attachments/assets/402f25a7-aadb-4116-b122-fc498840b87d)

The board displays all three zone types with proper visual distinction:
- Red ejection zones in corners
- Yellow checkered goal zones on sides
- Blue gradient field zones

### Hex Selection - Goal Zone
![Goal Hex Selected](https://github.com/user-attachments/assets/82208453-b163-4f22-bd55-c67c4ffdc349)

Clicking on a goal hex highlights it and displays its coordinates and zone type.

## Future Enhancements (Phases 2-3)

This Phase 1 implementation sets the foundation for:
- **Manager Phase**: Player pieces, movement mechanics, and turn-based gameplay
- **Gameplay Phase**: Actions, probability calculations, and strategic decision-making

## Technologies Used

- HTML5 Canvas API
- Vanilla JavaScript (ES6+)
- CSS3 (Flexbox, Gradients)

## License

MIT License - Feel free to use this code for your own projects.

## Author

Created as part of the Combined Strategic Manager Water Polo Game project.
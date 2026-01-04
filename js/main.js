/**
 * Main entry point for the Water Polo Strategic Board Game
 */

// Global game state
let hexGrid;

/**
 * Initialize the game
 */
function initGame() {
    console.log('Initializing Water Polo Strategic Board Game...');
    
    // Get canvas element
    const canvas = document.getElementById('game-board');
    
    if (!canvas) {
        console.error('Canvas element not found!');
        return;
    }
    
    // Create hex grid
    hexGrid = new HexGrid(canvas, BOARD_CONFIG);
    
    // Initial draw
    hexGrid.draw();
    
    console.log('Game initialized successfully!');
}

// Initialize game when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initGame);
} else {
    initGame();
}

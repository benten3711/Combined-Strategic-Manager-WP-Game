/**
 * HexGrid Class
 * Manages the hexagonal grid data, coordinate systems, and Canvas rendering
 */
class HexGrid {
    constructor(canvas, config) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.config = config;
        this.hexSize = config.HEX_SIZE;
        this.width = config.BOARD_WIDTH;
        this.height = config.BOARD_HEIGHT;
        
        // Set canvas size
        this.canvas.width = config.CANVAS_WIDTH;
        this.canvas.height = config.CANVAS_HEIGHT;
        
        // Calculate center offset for the board
        this.offsetX = config.CANVAS_WIDTH / 2 - (this.width * this.hexSize * Math.sqrt(3)) / 2;
        this.offsetY = config.CANVAS_HEIGHT / 2 - (this.height * this.hexSize * 1.5) / 2;
        
        // Store hex data (zones, state, etc.)
        this.hexData = new Map();
        
        // Initialize board layout
        this.initializeBoard();
        
        // Selected hex
        this.selectedHex = null;
        
        // Add click event listener
        this.canvas.addEventListener('click', (e) => this.handleClick(e));
    }
    
    /**
     * Initialize the board with zones
     */
    initializeBoard() {
        // Initialize all hexes as field hexes
        for (let r = 0; r < this.height; r++) {
            for (let q = 0; q < this.width; q++) {
                const key = this.getHexKey(q, r);
                this.hexData.set(key, {
                    q, r,
                    zone: ZONE_TYPES.FIELD
                });
            }
        }
        
        // Set goal hexes
        BOARD_LAYOUT.GOAL_POSITIONS.forEach(pos => {
            const key = this.getHexKey(pos.q, pos.r);
            if (this.hexData.has(key)) {
                this.hexData.get(key).zone = ZONE_TYPES.GOAL;
            }
        });
        
        // Set ejection hexes
        BOARD_LAYOUT.EJECTION_POSITIONS.forEach(pos => {
            const key = this.getHexKey(pos.q, pos.r);
            if (this.hexData.has(key)) {
                this.hexData.get(key).zone = ZONE_TYPES.EJECTION;
            }
        });
    }
    
    /**
     * Get unique key for hex coordinates
     */
    getHexKey(q, r) {
        return `${q},${r}`;
    }
    
    /**
     * Draw the entire grid
     */
    draw() {
        // Clear canvas
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Draw all hexes
        for (let r = 0; r < this.height; r++) {
            for (let q = 0; q < this.width; q++) {
                this.drawHex(q, r);
            }
        }
    }
    
    /**
     * Draw a single hexagon
     */
    drawHex(q, r) {
        const hexData = this.hexData.get(this.getHexKey(q, r));
        if (!hexData) return;
        
        // Calculate pixel position
        const pixel = axialToPixel(q, r, this.hexSize);
        const centerX = pixel.x + this.offsetX;
        const centerY = pixel.y + this.offsetY;
        
        // Get hex corners
        const corners = hexCorners(centerX, centerY, this.hexSize);
        
        // Determine fill color based on zone
        const fillColor = this.getHexColor(q, r, hexData.zone);
        const borderColor = this.getHexBorderColor(hexData.zone);
        
        // Draw hex
        this.ctx.beginPath();
        this.ctx.moveTo(corners[0].x, corners[0].y);
        for (let i = 1; i < corners.length; i++) {
            this.ctx.lineTo(corners[i].x, corners[i].y);
        }
        this.ctx.closePath();
        
        // Fill
        if (hexData.zone === ZONE_TYPES.GOAL) {
            // Draw checkered pattern for goal hexes
            this.drawCheckeredHex(corners, centerX, centerY);
        } else {
            this.ctx.fillStyle = fillColor;
            this.ctx.fill();
        }
        
        // Border
        this.ctx.strokeStyle = borderColor;
        this.ctx.lineWidth = 2;
        this.ctx.stroke();
        
        // Highlight selected hex
        if (this.selectedHex && this.selectedHex.q === q && this.selectedHex.r === r) {
            this.ctx.fillStyle = COLORS.HEX_HOVER;
            this.ctx.fill();
        }
    }
    
    /**
     * Draw checkered pattern for goal hexes
     */
    drawCheckeredHex(corners, centerX, centerY) {
        // Create checkered pattern
        const patternSize = 8;
        const pattern = this.ctx.createPattern(this.createCheckeredPattern(patternSize), 'repeat');
        
        this.ctx.fillStyle = pattern;
        this.ctx.fill();
    }
    
    /**
     * Create checkered pattern canvas
     */
    createCheckeredPattern(size) {
        const patternCanvas = document.createElement('canvas');
        patternCanvas.width = size * 2;
        patternCanvas.height = size * 2;
        const pCtx = patternCanvas.getContext('2d');
        
        // Draw checkered pattern
        pCtx.fillStyle = COLORS.GOAL_PRIMARY;
        pCtx.fillRect(0, 0, size, size);
        pCtx.fillRect(size, size, size, size);
        
        pCtx.fillStyle = COLORS.GOAL_SECONDARY;
        pCtx.fillRect(size, 0, size, size);
        pCtx.fillRect(0, size, size, size);
        
        return patternCanvas;
    }
    
    /**
     * Get hex color based on zone and position
     */
    getHexColor(q, r, zone) {
        if (zone === ZONE_TYPES.EJECTION) {
            return COLORS.EJECTION;
        } else if (zone === ZONE_TYPES.GOAL) {
            return COLORS.GOAL_PRIMARY; // Will be overridden by checkered pattern
        } else {
            // Field: gradient from center (or use distance from center)
            // Calculate distance from center of board
            const centerQ = this.width / 2;
            const centerR = this.height / 2;
            const maxDistance = hexDistance(0, 0, centerQ, centerR);
            const distance = hexDistance(q, r, centerQ, centerR);
            const factor = distance / maxDistance;
            
            // Interpolate from light (center) to dark (edges)
            return interpolateColor(COLORS.FIELD_LIGHT, COLORS.FIELD_DARK, factor);
        }
    }
    
    /**
     * Get hex border color based on zone
     */
    getHexBorderColor(zone) {
        switch (zone) {
            case ZONE_TYPES.EJECTION:
                return COLORS.EJECTION_BORDER;
            case ZONE_TYPES.GOAL:
                return COLORS.GOAL_BORDER;
            default:
                return COLORS.FIELD_BORDER;
        }
    }
    
    /**
     * Handle canvas click
     */
    handleClick(event) {
        const rect = this.canvas.getBoundingClientRect();
        const x = event.clientX - rect.left - this.offsetX;
        const y = event.clientY - rect.top - this.offsetY;
        
        // Convert pixel to axial coordinates
        const axial = pixelToAxial(x, y, this.hexSize);
        
        // Check if hex is valid
        if (axial.q >= 0 && axial.q < this.width && axial.r >= 0 && axial.r < this.height) {
            this.selectedHex = axial;
            const hexData = this.hexData.get(this.getHexKey(axial.q, axial.r));
            
            // Update info overlay
            this.updateInfoOverlay(axial, hexData);
            
            // Redraw
            this.draw();
        }
    }
    
    /**
     * Update info overlay with hex information
     */
    updateInfoOverlay(axial, hexData) {
        const infoOverlay = document.getElementById('info-overlay');
        if (infoOverlay) {
            infoOverlay.innerHTML = `
                <p><strong>Hex Selected:</strong> (${axial.q}, ${axial.r})</p>
                <p><strong>Zone:</strong> ${hexData.zone.toUpperCase()}</p>
            `;
        }
    }
}

// Display Adapter for Web Canvas
class CanvasDisplayAdapter {
    constructor(canvasId) {
        this.canvas = document.getElementById(canvasId);
        this.ctx = this.canvas.getContext('2d');
        this.width = this.canvas.width;
        this.height = this.canvas.height;
        this.buffer = new Array(this.width * this.height).fill(0);
        
        // Set up canvas for pixel art
        this.ctx.imageSmoothingEnabled = false;
        this.ctx.webkitImageSmoothingEnabled = false;
        this.ctx.mozImageSmoothingEnabled = false;
        
        // Test pattern to verify display is working
        this.drawTestPattern();
    }

    drawTestPattern() {
        // Draw border
        for (let x = 0; x < this.width; x++) {
            this.setPixel(x, 0, 1);
            this.setPixel(x, this.height - 1, 1);
        }
        for (let y = 0; y < this.height; y++) {
            this.setPixel(0, y, 1);
            this.setPixel(this.width - 1, y, 1);
        }
        
        // Draw resolution text
        const text = "128x32";
        let x = 50;
        for (let i = 0; i < text.length; i++) {
            if (text[i] === '1') this.drawDigit(x, 10, 1);
            if (text[i] === '2') this.drawDigit(x, 10, 2);
            if (text[i] === '8') this.drawDigit(x, 10, 8);
            if (text[i] === '3') this.drawDigit(x, 10, 3);
            if (text[i] === 'x') {
                // Draw 'x'
                this.setPixel(x + 1, 11, 1);
                this.setPixel(x, 12, 1);
                this.setPixel(x + 2, 12, 1);
                this.setPixel(x + 1, 13, 1);
            }
            x += 4;
        }
        
        this.update();
        
        // Clear after 1 second
        setTimeout(() => {
            this.clear();
            this.update();
        }, 1000);
    }

    drawDigit(x, y, digit) {
        const digits = [
            [0x0E, 0x11, 0x11, 0x11, 0x0E],
            [0x04, 0x0C, 0x04, 0x04, 0x0E],
            [0x0E, 0x01, 0x0E, 0x10, 0x0F],
            [0x0E, 0x01, 0x06, 0x01, 0x0E],
            [0x11, 0x11, 0x0F, 0x01, 0x01],
            [0x0F, 0x10, 0x0E, 0x01, 0x0E],
            [0x0E, 0x10, 0x0E, 0x11, 0x0E],
            [0x0F, 0x01, 0x02, 0x04, 0x04],
            [0x0E, 0x11, 0x0E, 0x11, 0x0E],
            [0x0E, 0x11, 0x0E, 0x01, 0x0E]
        ];
        
        const pattern = digits[digit];
        for (let row = 0; row < 5; row++) {
            for (let col = 0; col < 3; col++) {
                if (pattern[row] & (1 << (2 - col))) {
                    this.setPixel(x + col, y + row, 1);
                }
            }
        }
    }

    clear() {
        this.buffer.fill(0);
    }

    setPixel(x, y, color) {
        if (x >= 0 && x < this.width && y >= 0 && y < this.height) {
            this.buffer[y * this.width + x] = color;
        }
    }

    update() {
        // Create image data
        const imageData = this.ctx.createImageData(this.width, this.height);
        const data = imageData.data;
        
        for (let i = 0; i < this.buffer.length; i++) {
            const color = this.buffer[i] ? 255 : 0;
            const idx = i * 4;
            data[idx] = color;     // R
            data[idx + 1] = color; // G
            data[idx + 2] = color; // B
            data[idx + 3] = 255;   // A
        }
        
        // Put image data to canvas
        this.ctx.putImageData(imageData, 0, 0);
    }

    getWidth() {
        return this.width;
    }

    getHeight() {
        return this.height;
    }
}

// Adapter for other displays (OLED, Console, etc.)
class DisplayAdapter {
    constructor(implementation) {
        this.impl = implementation;
    }

    clear() {
        return this.impl.clear();
    }

    setPixel(x, y, color) {
        return this.impl.setPixel(x, y, color);
    }

    update() {
        return this.impl.update();
    }

    getWidth() {
        return this.impl.getWidth();
    }

    getHeight() {
        return this.impl.getHeight();
    }
}
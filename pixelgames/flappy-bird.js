// Flappy Bird - Platform Independent Game Engine
// Optimized for 30 FPS

class FlappyBird {
    constructor(displayAdapter) {
        this.display = displayAdapter;
        this.reset();
        this.pipes = [];
        this.pipeWidth = 4;
        this.pipeGap = 16;         // Gap between top and bottom pipes
        this.pipeSpeed = 1;      // Adjusted for 30 FPS (was 1.0)
        this.pipeFrequency = 45;   // frames between pipes (was 60) - now ~1.5 seconds
        this.frameCount = 0;
        this.gravity = 0.25;       // Adjusted for 30 FPS (was 0.2)
        this.jumpForce = -2.0;     // Adjusted for 30 FPS (was -3.5)
        this.gameStarted = false;
        this.gameOver = false;
        this.score = 0;
        this.highScore = 0;
        this.lastPipeFrame = 0;
        this.backgroundOffset = 12;
        this.currentDrawPerFrame = 0;
    }

    reset() {
        this.bird = {
            x: 20,
            y: 16,
            velocity: 0,
            radius: 2,
            wingPhase: 0
        };
        this.pipes = [];
        this.frameCount = 0;
        this.lastPipeFrame = 0;
        this.gameStarted = false;
        this.gameOver = false;
        this.score = 0;
        this.backgroundOffset = 12;
    }

    jump() {
        if (!this.gameOver) {
            if (!this.gameStarted) {
                this.gameStarted = true;
            }
            this.bird.velocity = this.jumpForce;
            this.bird.wingPhase = 4; // Wing flap animation
        } else {
            this.reset();
        }
    }

    update() {
        if (!this.gameStarted || this.gameOver) return;

        // Update bird
        this.bird.velocity += this.gravity;
        this.bird.y += this.bird.velocity;

        // Update wing animation
        if (this.bird.wingPhase > 0) {
            this.bird.wingPhase--;
        }

        // Check boundaries
        if (this.bird.y < this.bird.radius) {
            this.bird.y = this.bird.radius;
            this.bird.velocity = 0;
        }
        if (this.bird.y > 32 - this.bird.radius) {
            this.bird.y = 32 - this.bird.radius;
            this.gameOver = true;
        }

        // Generate pipes
        this.frameCount++;
        if (this.frameCount - this.lastPipeFrame >= this.pipeFrequency) {
            const gapY = Math.floor(Math.random() * (32 - this.pipeGap - 8)) + 4;
            this.pipes.push({
                x: 128,
                gapY: gapY,
                passed: false
            });
            this.lastPipeFrame = this.frameCount;
        }

        // Update pipes
        for (let i = this.pipes.length - 1; i >= 0; i--) {
            this.pipes[i].x -= this.pipeSpeed;

            // Check collision
            if (this.checkCollision(this.pipes[i])) {
                this.gameOver = true;
                return; // Stop further updates on game over
            }

            // Check if passed
            if (!this.pipes[i].passed && this.pipes[i].x + this.pipeWidth < this.bird.x) {
                this.pipes[i].passed = true;
                this.score++;
                if (this.score > this.highScore) {
                    this.highScore = this.score;
                }
            }

            // Remove off-screen pipes
            if (this.pipes[i].x < -this.pipeWidth) {
                this.pipes.splice(i, 1);
            }
        }
    }

    checkCollision(pipe) {
        const bird = this.bird;

        // Simple AABB collision for better performance
        const birdLeft = bird.x - bird.radius;
        const birdRight = bird.x + bird.radius;
        const birdTop = bird.y - bird.radius;
        const birdBottom = bird.y + bird.radius;

        const pipeLeft = pipe.x;
        const pipeRight = pipe.x + this.pipeWidth;

        // Check if bird is within pipe horizontal range
        if (birdRight > pipeLeft && birdLeft < pipeRight) {
            // Check if bird is outside the gap
            if (birdTop < pipe.gapY || birdBottom > pipe.gapY + this.pipeGap) {
                return true;
            }
        }
        return false;
    }

    draw() {
        //TODO Optimize
        this.currentDrawPerFrame++;
        if(this.currentDrawPerFrame % 8 != 0) {
            return;
        }

        // Clear display
        this.display.clear();

        // Draw background
        this.drawBackground();

        // Draw bird
        this.drawBird();

        // Draw pipes
        this.drawPipes();

        // Draw UI
        this.drawUI();

        // Update display
        this.display.update();
    }

    drawBackground() {
        if (!this.gameStarted) {
            return;
        }

        // Draw background (subtle grid for visual reference)
        for (let y = 0; y < 32; y += 8) {
            for (let x = 15 - this.backgroundOffset % 16; x < 128; x += 8) {
                if ((x + y) % 16 === 15 - this.backgroundOffset % 16) {
                    this.display.setPixel(x, y, 1);
                }
            }
        }

        if (this.frameCount % 10 === 0) {
            this.backgroundOffset++;
        }
    }

    drawBird() {
        if (!this.gameStarted) {
            return;
        }

        const bird = this.bird;
        const birdX = Math.floor(bird.x);
        const birdY = Math.floor(bird.y);

        // Draw body
        const birdbody = [0x0E, 0x1D, 0x1F];
        for (let row = 0; row < 3; row++) {
            for (let col = 0; col < 5; col++) {
                if (birdbody[row] & (1 << (4 - col))) {
                    this.display.setPixel(birdX + col, birdY + row, 1);
                }
            }
        }

        //Draw wing
        let wing = [0x00, 0x00];
        if(this.bird.wingPhase === 4 || this.bird.wingPhase === 3) {
            wing = [0x07, 0x06];
        } else if(this.bird.wingPhase === 2 || this.bird.wingPhase === 1) {
            wing = [0x06, 0x00];
        }

        for (let row = 0; row < 2; row++) {
            for (let col = 0; col < 4; col++) {
                if (wing[row] & (1 << (3 - col))) {
                    this.display.setPixel(birdX + col, birdY + 3 + row, 1);
                }
            }
        }
    }

    drawPipes() {
        for (const pipe of this.pipes) {
            // Draw top pipe
            for (let y = 0; y < pipe.gapY; y++) {
                for (let x = 0; x < this.pipeWidth; x++) {
                    // Add some texture to pipes
                    if (y % 2 === 0 || x % 2 === 0) {
                        this.display.setPixel(pipe.x + x, y, 1);
                    }
                }
            }

            //Draw bottom pipe
            for (let y = pipe.gapY + this.pipeGap; y < 32; y++) {
                for (let x = 0; x < this.pipeWidth; x++) {
                    if (y % 2 === 0 || x % 2 === 0) {
                        this.display.setPixel(pipe.x + x, y, 1);
                    }
                }
            }

            // Draw pipe caps (thicker edges)
            for (let x = -1; x < this.pipeWidth + 1; x++) {
                const capX = pipe.x + x;
                if (capX >= 0 && capX < 128) {
                    this.display.setPixel(capX, pipe.gapY, 1);
                    this.display.setPixel(capX, pipe.gapY + this.pipeGap - 1, 1);
                }
            }
        }
    }

    drawUI() {
        if (this.gameStarted) {
            // Draw score with better visibility
            this.drawNumber(4, 4, this.score);

            // Draw high score in top right
            if (this.highScore > 0) {
                this.drawText(90, 4, "HI");
                this.drawNumber(110, 4, this.highScore);
            }
        }
        
        if (this.gameOver) {
            this.drawText(40, 12, "GAME OVER");
        } else if (!this.gameStarted) {
            this.drawStartScreen();
        }
    }

    drawStartScreen() {
        let screen = [0x00000000, 0x00000000, 0x00000000, 0x00000000, 0x00000000, 0x00000000, 0x00000000, 0x00000000, 
 0x00000000, 0x00000000, 0x00000000, 0x00000000, 0x00000000, 0x00000000, 0x00000000, 0x00000000, 
 0x00000000, 0x00000000, 0x0007FFE0, 0x00080060, 0x00100060, 0x00100060, 0x00100060, 0x00110FE0,
 0x00110800, 0x00110800, 0x00110800, 0x00110800, 0x001FFFE0, 0x00100060, 0x00100060, 0x00100060,
 0x00100060, 0x00100060, 0x001FFFE0, 0x00008080, 0x000100C0, 0x00010060, 0x00010060, 0x00011C60,
 0x00010060, 0x00010060, 0x00010060, 0x00010060, 0x0001FFFC, 0x0001000C, 0x0701000C, 0x0881000C,
 0x1861000C, 0x28511C7C, 0x28510060, 0x44890060, 0x430900C0, 0x40088080, 0x5C49FFFC, 0x62A9000C,
 0x4151000C, 0x2D51000C, 0x1151000C, 0x0F511C7C, 0x01610060, 0x00810060, 0x000100C0, 0x00008080,
 0x0003FF00, 0x00020300, 0x00020100, 0x000200FC, 0x0002008C, 0x0003F08C, 0x0002000C, 0x0002000C,
 0x0002000C, 0x00020018, 0x00020010, 0x001FFFE0, 0x00100060, 0x00100060, 0x00100060, 0x00100060,
 0x00118C60, 0x00100060, 0x00100060, 0x001000C0, 0x00080080, 0x0007FFE0, 0x00022060, 0x00022060,
 0x00022060, 0x00022060, 0x0003FFE0, 0x00008060, 0x00010060, 0x00010060, 0x00010060, 0x00010FE0,
 0x00011800, 0x00011000, 0xF80113F8, 0x0801FF0F, 0x08008088, 0x080100C8, 0x08010068, 0x08010068,
 0x081F1C68, 0x08100068, 0x08100068, 0x08100068, 0x08100068, 0x081FFFE8, 0x08000208, 0x08000208,
 0x08000208, 0x0800020F, 0xF80003F8, 0x00000000, 0x00000000, 0x00000000, 0x00000000, 0x00000000,
 0x00000000, 0x00000000, 0x00000000, 0x00000000, 0x00000000, 0x00000000, 0x00000000, 0x00000000];
        for (let col = 0; col < 32; col++) {
            for (let row = 0; row < 128; row++) {
                if (screen[row] & (1 << (127 - col))) {
                    this.display.setPixel(row, col, 1);
                }
            }
        }
    }

    drawNumber(x, y, number) {
        const digits = number.toString().split('');
        let currentX = x;

        currentX = x;
        for (const digit of digits) {
            this.drawDigit(currentX, y, parseInt(digit));
            currentX += 4;
        }
    }

    drawDigit(x, y, digit) {
        // Improved 3x5 digit font with better visibility
        const digits = [
            [0x0E, 0x11, 0x11, 0x11, 0x0E], // 0
            [0x04, 0x0C, 0x04, 0x04, 0x0E], // 1
            [0x0E, 0x01, 0x0E, 0x10, 0x0F], // 2
            [0x0E, 0x01, 0x06, 0x01, 0x0E], // 3
            [0x11, 0x11, 0x0F, 0x01, 0x01], // 4
            [0x0F, 0x10, 0x0E, 0x01, 0x0E], // 5
            [0x0E, 0x10, 0x0E, 0x11, 0x0E], // 6
            [0x0F, 0x01, 0x02, 0x04, 0x04], // 7
            [0x0E, 0x11, 0x0E, 0x11, 0x0E], // 8
            [0x0E, 0x11, 0x0E, 0x01, 0x0E]  // 9
        ];

        const pattern = digits[digit];
        for (let row = 0; row < 5; row++) {
            for (let col = 0; col < 5; col++) {
                if (pattern[row] & (1 << (4 - col))) {
                    this.display.setPixel(x + col, y + row, 1);
                }
            }
        }
    }

    drawText(x, y, text) {
        // Same font as before but with background for better visibility
        const font = {
            'A': [0x06, 0x09, 0x0F, 0x09, 0x09],
            'B': [0x0E, 0x09, 0x0E, 0x09, 0x0E],
            'C': [0x06, 0x09, 0x08, 0x09, 0x06],
            'D': [0x0E, 0x09, 0x09, 0x09, 0x0E],
            'E': [0x0F, 0x08, 0x0E, 0x08, 0x0F],
            'F': [0x0F, 0x08, 0x0E, 0x08, 0x08],
            'G': [0x06, 0x08, 0x0B, 0x09, 0x07],
            'H': [0x09, 0x09, 0x0F, 0x09, 0x09],
            'I': [0x07, 0x02, 0x02, 0x02, 0x07],
            'J': [0x07, 0x02, 0x02, 0x0A, 0x04],
            'K': [0x09, 0x0A, 0x0C, 0x0A, 0x09],
            'L': [0x08, 0x08, 0x08, 0x08, 0x0F],
            'M': [0x11, 0x1B, 0x15, 0x11, 0x11],
            'N': [0x11, 0x19, 0x15, 0x13, 0x11],
            'O': [0x06, 0x09, 0x09, 0x09, 0x06],
            'P': [0x0E, 0x09, 0x0E, 0x08, 0x08],
            'Q': [0x06, 0x09, 0x09, 0x0A, 0x05],
            'R': [0x0E, 0x09, 0x0E, 0x0A, 0x09],
            'S': [0x07, 0x08, 0x06, 0x01, 0x0E],
            'T': [0x0F, 0x04, 0x04, 0x04, 0x04],
            'U': [0x09, 0x09, 0x09, 0x09, 0x06],
            'V': [0x09, 0x09, 0x09, 0x06, 0x06],
            'W': [0x11, 0x11, 0x15, 0x15, 0x0A],
            'X': [0x11, 0x0A, 0x04, 0x0A, 0x11],
            'Y': [0x11, 0x0A, 0x04, 0x04, 0x04],
            'Z': [0x0F, 0x01, 0x02, 0x04, 0x0F],
            ' ': [0x00, 0x00, 0x00, 0x00, 0x00],
            '/': [0x01, 0x02, 0x04, 0x08, 0x10]
        };

        let currentX = x;
        for (const char of text.toUpperCase()) {
            if (font[char]) {
                const pattern = font[char];
                for (let row = 0; row < 5; row++) {
                    for (let col = 0; col < 5; col++) {
                        if (pattern[row] & (1 << (4 - col))) {
                            this.display.setPixel(currentX + col + 1, y + row, 1);
                        }
                    }
                }
                currentX += 6;
            } else {
                currentX += 3;
            }
        }
    }

    run() {
        // This is now called from main game loop
        // update() is called with fixed timestep
        // draw() is called every frame
        this.draw();
    }

    getScore() {
        return this.score;
    }

    getHighScore() {
        return this.highScore;
    }

    isGameOver() {
        return this.gameOver;
    }

    isGameStarted() {
        return this.gameStarted;
    }
}

// Export for use in different environments
if (typeof module !== 'undefined' && module.exports) {
    module.exports = FlappyBird;
}
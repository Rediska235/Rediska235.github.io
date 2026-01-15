// Game Controller for Web
class GameController {
    constructor(game) {
        this.game = game;
        this.keys = {};
        this.frameTimes = [];
        this.avgFPS = 30;
        this.setupInput();
    }

    setupInput() {
        // Keyboard input
        document.addEventListener('keydown', (e) => {
            this.keys[e.code] = true;
            
            if (e.code === 'Space') {
                e.preventDefault();
                this.game.jump();
            }
            
            if (e.code === 'KeyR') {
                this.game.reset();
            }
            
            // Debug keys
            if (e.code === 'KeyD' && e.ctrlKey) {
                this.toggleDebug();
            }
        });

        document.addEventListener('keyup', (e) => {
            this.keys[e.code] = false;
        });

        // Button click handlers
        const jumpButton = document.getElementById('jumpButton');
        
        if (jumpButton) {
            jumpButton.addEventListener('click', () => {
                this.game.jump();
            });
        }

        // Canvas click for jump
        const canvas = document.getElementById('gameCanvas');
        if (canvas) {
            canvas.addEventListener('click', (e) => {
                e.preventDefault();
                this.game.jump();
            });
            
            // Prevent context menu
            canvas.addEventListener('contextmenu', (e) => {
                e.preventDefault();
                return false;
            });
        }
    }

    recordFrame() {
        this.frameTimes.push(performance.now());
    }

    toggleDebug() {
        const canvas = document.getElementById('gameCanvas');
        canvas.classList.toggle('debug-mode');
    }

    isKeyPressed(key) {
        return this.keys[key] || false;
    }
}
// Main initialization
document.addEventListener('DOMContentLoaded', () => {
    // Initialize display adapter
    const display = new DisplayAdapter(new CanvasDisplayAdapter('gameCanvas'));
    
    // Initialize game
    const game = new FlappyBird(display);
    
    // Initialize controller
    const controller = new GameController(game);
    
    // Get UI elements
    const scoreElement = document.getElementById('score');
    const highScoreElement = document.getElementById('highScore');
    const fpsElement = document.getElementById('fps');
    
    // Game loop with fixed FPS
    const FPS = 30;
    const FRAME_TIME = 1000 / FPS;
    let lastTime = performance.now();
    let accumulator = 0;
    let frameCount = 0;
    let fps = 30;
    let lastFpsUpdate = performance.now();
    
    function gameLoop(currentTime) {
        // Calculate delta time
        const deltaTime = currentTime - lastTime;
        lastTime = currentTime;
        
        // Update FPS counter
        frameCount++;
        if (currentTime - lastFpsUpdate >= 1000) {
            fps = frameCount;
            frameCount = 0;
            lastFpsUpdate = currentTime;
            fpsElement.textContent = fps;
        }
        
        // Accumulate time for fixed timestep
        accumulator += deltaTime;
        
        // Process fixed timestep updates
        while (accumulator >= FRAME_TIME) {
            game.update();
            accumulator -= FRAME_TIME;
        }
        
        // Always draw on every frame for smoothness
        game.draw();
        
        // Update UI
        scoreElement.textContent = game.getScore();
        highScoreElement.textContent = game.getHighScore();
        
        // Continue loop
        requestAnimationFrame(gameLoop);
    }
    
    // Start game loop
    requestAnimationFrame(gameLoop);
    
    // Expose game for debugging
    window.game = game;
    window.FPS = FPS;
});
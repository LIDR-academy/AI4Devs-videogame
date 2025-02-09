export const GAME_CONFIG = {
    LEVELS: [
        {
            name: 'Messy Room',
            timeLimit: 30, // Changed from 180 to 30 seconds
            objectsToFind: 5,
            difficulty: 1
        },
        {
            name: 'Museum',
            timeLimit: 150, // 2.5 minutes
            objectsToFind: 7,
            difficulty: 2
        },
        {
            name: 'Dev Setup',
            timeLimit: 120, // 2 minutes
            objectsToFind: 10,
            difficulty: 3
        }
    ],
    SCORING: {
        BASE_POINTS: 100,
        TIME_BONUS: 10, // points per second remaining
        HINT_PENALTY: 50
    },
    POWERUPS: {
        MAGNIFYING_GLASS: {
            duration: 5000, // 5 seconds
            cooldown: 30000 // 30 seconds
        }
    }
};
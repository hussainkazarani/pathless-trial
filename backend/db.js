import pkg from 'pg';
const { Pool } = pkg;

export const pool = new Pool({
    user: 'judge',
    host: 'localhost', //'custom-postgres', 'host.docker.internal'
    database: 'pathless_trails',
    password: 'pathless',
    port: 5432,
});

// Helper for automatic client release
async function withClient(fn) {
    const client = await pool.connect();
    try {
        return await fn(client);
    } catch (error) {
        console.error('❌ Connection error:', error);
    } finally {
        client.release();
    }
}

// Test connection
export const verifyDbConnection = async () => {
    try {
        const client = await pool.connect();
        console.log('✅ Connected to PostgreSQL!');
        client.release();
    } catch (error) {
        console.error('❌ Connection error:', error);
    }
};

// ========== ROOM ==========
// Add a player if not exists
export const insertPlayerIfNotExists = async (username) => {
    if (!username) {
        console.warn('Tried to insert player with null/empty username.');
        return;
    }
    const result = await pool.query(`INSERT INTO players (username) VALUES ($1) ON CONFLICT (username) DO NOTHING`, [
        username,
    ]);
    console.log(result.rowCount > 0 ? '(B) Player added to DB' : '(B) Player already exists in DB');
};

// ========== GAME ==========
// Record completed room for multiple players IN-PROGRESS
export const saveCompletedRoomResults = async (player, room, timer) =>
    withClient(async (client) => {
        // for (const player of players) {
        await client.query(
            `INSERT INTO matches (username, room_name, flags, game_time)
         VALUES ($1, $2, $3, $4)`,
            [player.username, room, player.flags, timer],
        );

        await client.query(
            `UPDATE players
         SET total_flags = total_flags + $1,
             games_played = games_played + 1,
             rooms_played = array_append(rooms_played, $2)
         WHERE username = $3`,
            [player.flags, room, player.username],
        );
        // }
    });

// ========== OTHERS ==========
// Get player info and match history
export const fetchPlayerHistory = async (username) =>
    withClient(async (client) => {
        const playerRes = await client.query(
            `SELECT username, total_flags, games_played, rooms_played, created_at
       FROM players WHERE username=$1`,
            [username],
        );

        const gamesRes = await client.query(
            `SELECT room_name, flags, game_time, created_at
       FROM matches WHERE username=$1 ORDER BY created_at DESC`,
            [username],
        );

        return {
            player: playerRes.rows[0],
            game: gamesRes.rows.map((g) => ({
                room: g.room_name,
                flags: g.flags,
                timer: g.game_time,
                created: g.created_at,
            })),
        };
    });

// Get leaderboard ordered by total flags
export const fetchLeaderboards = async () => {
    const result = await pool.query(`SELECT * FROM players ORDER BY total_flags DESC`);
    return result.rows;
};

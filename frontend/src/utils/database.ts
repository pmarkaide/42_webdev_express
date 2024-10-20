// // src/utils/database.ts
// import { Pool } from 'pg';

// const pool = new Pool({
//   connectionString: process.env.DATABASE_URL,
// });

// export const connectToDatabase = async () => {
//   const client = await pool.connect();
//   return {
//     query: (text: string, params?: any[]) => client.query(text, params),
//     release: () => client.release(),
//   };
// };

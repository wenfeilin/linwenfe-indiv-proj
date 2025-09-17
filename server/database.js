import pg from "pg";
const { Pool, Client } = pg;

const pool = new Pool({
  user: "postgres",
  password: "root123",
  host: "localhost",
  port: 5432,
  database: "users",
});

console.log(await pool.query("SELECT NOW()"));

const client = new Client({
  user: "postgres",
  password: "root123",
  host: "localhost",
  port: 5432,
  database: "users",
});

await client.connect();

console.log(await client.query("SELECT NOW()"));

const text = "INSERT INTO userstable(username, id) VALUES($1, $2) RETURNING *";
const values = ["wenfei", "123"];

const res = await client.query(text, values);
console.log(res.rows[0]);
// { username: "wenfei", id: 123 }

await client.end();

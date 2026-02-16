use sqlx::{sqlite::SqlitePoolOptions, SqlitePool};
use anyhow::Result;

pub struct Database {
    pub pool: SqlitePool,
}

impl Database {
    pub async fn new() -> Result<Self> {
        let db_url = std::env::var("DATABASE_URL").unwrap_or_else(|_| "sqlite:dockium.db".into());
        
        let pool = SqlitePoolOptions::new()
            .max_connections(5)
            .connect(&db_url)
            .await?;

        Ok(Self { pool })
    }

    pub async fn run_migrations(&self) -> Result<()> {
        sqlx::query(
            "CREATE TABLE IF NOT EXISTS users (
                id TEXT PRIMARY KEY,
                username TEXT UNIQUE NOT NULL,
                password_hash TEXT NOT NULL,
                role TEXT NOT NULL,
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP
            )"
        )
        .execute(&self.pool)
        .await?;

        sqlx::query(
            "CREATE TABLE IF NOT EXISTS settings (
                key TEXT PRIMARY KEY,
                value TEXT NOT NULL
            )"
        )
        .execute(&self.pool)
        .await?;

        Ok(())
    }
}

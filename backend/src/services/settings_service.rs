use crate::db::Database;
use std::sync::Arc;
use anyhow::Result;

pub struct SettingsService {
    db: Arc<Database>,
}

impl SettingsService {
    pub fn new(db: Arc<Database>) -> Self {
        Self { db }
    }

    pub async fn get_setting(&self, key: &str) -> Result<Option<String>> {
        let row: Option<(String,)> = sqlx::query_as("SELECT value FROM settings WHERE key = ?")
            .bind(key)
            .fetch_optional(&self.db.pool)
            .await?;
        
        Ok(row.map(|(v,)| v))
    }

    pub async fn set_setting(&self, key: &str, value: &str) -> Result<()> {
        sqlx::query("INSERT OR REPLACE INTO settings (key, value) VALUES (?, ?)")
            .bind(key)
            .bind(value)
            .execute(&self.db.pool)
            .await?;
        
        Ok(())
    }

    pub async fn get_all_settings(&self) -> Result<std::collections::HashMap<String, String>> {
        let rows: Vec<(String, String)> = sqlx::query_as("SELECT key, value FROM settings")
            .fetch_all(&self.db.pool)
            .await?;
        
        Ok(rows.into_iter().collect())
    }
}

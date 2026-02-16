use std::process::Stdio;
use tokio::process::Command;
use anyhow::{Result, anyhow};
use serde::Serialize;

#[derive(Serialize)]
pub struct ComposeProject {
    pub name: String,
    pub status: String,
    pub config_path: String,
}

pub struct ComposeService {}

impl ComposeService {
    pub fn new() -> Self {
        Self {}
    }

    pub async fn list_projects(&self) -> Result<Vec<ComposeProject>> {
        // This is a simplified version. A real implementation would scan directories
        // or use 'docker compose ls' if available.
        let output = Command::new("docker")
            .args(["compose", "ls", "--format", "json"])
            .output()
            .await?;

        if !output.status.success() {
            return Err(anyhow!("Failed to list compose projects: {}", String::from_utf8_lossy(&output.stderr)));
        }

        let projects: Vec<serde_json::Value> = serde_json::from_slice(&output.stdout)?;
        let result = projects.into_iter().map(|p| ComposeProject {
            name: p["Name"].as_str().unwrap_or_default().to_string(),
            status: p["Status"].as_str().unwrap_or_default().to_string(),
            config_path: p["ConfigFiles"].as_str().unwrap_or_default().to_string(),
        }).collect();

        Ok(result)
    }

    pub async fn up(&self, project_path: &str) -> Result<()> {
        let output = Command::new("docker")
            .args(["compose", "-f", project_path, "up", "-d"])
            .output()
            .await?;

        if !output.status.success() {
            return Err(anyhow!("Failed to up compose project: {}", String::from_utf8_lossy(&output.stderr)));
        }
        Ok(())
    }

    pub async fn down(&self, project_path: &str) -> Result<()> {
        let output = Command::new("docker")
            .args(["compose", "-f", project_path, "down"])
            .output()
            .await?;

        if !output.status.success() {
            return Err(anyhow!("Failed to down compose project: {}", String::from_utf8_lossy(&output.stderr)));
        }
        Ok(())
    }
}

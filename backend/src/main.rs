use axum::{
    routing::{get, post},
    Router,
};
use std::net::SocketAddr;
use tower_http::cors::{Any, CorsLayer};
use tracing_subscriber::{layer::SubscriberExt, util::SubscriberInitExt};
use std::sync::Arc;
use dotenvy::dotenv;

mod api;
mod db;
mod models;
mod services;

use crate::services::docker_service::DockerService;
use crate::services::system_service::SystemService;
use crate::services::compose_service::ComposeService;
use crate::services::settings_service::SettingsService;
use crate::db::Database;

#[derive(Clone)]
pub struct AppState {
    pub docker: Arc<DockerService>,
    pub system: Arc<SystemService>,
    pub compose: Arc<ComposeService>,
    pub settings: Arc<SettingsService>,
    pub db: Arc<Database>,
}

#[tokio::main]
async fn main() -> anyhow::Result<()> {
    dotenv().ok();

    // Initialize logging
    tracing_subscriber::registry()
        .with(tracing_subscriber::EnvFilter::new(
            std::env::var("RUST_LOG").unwrap_or_else(|_| "dockium=debug,tower_http=debug".into()),
        ))
        .with(tracing_subscriber::fmt::layer())
        .init();

    tracing::info!("Starting Dockium Backend");

    // Initialize Database
    let db = Arc::new(Database::new().await?);
    db.run_migrations().await?;

    // Initialize Services
    let docker = Arc::new(DockerService::new()?);
    let system = Arc::new(SystemService::new());
    let compose = Arc::new(ComposeService::new());
    let settings = Arc::new(SettingsService::new(db.clone()));

    let state = AppState {
        docker,
        system,
        compose,
        settings,
        db,
    };

    // Configure CORS
    let cors = CorsLayer::new()
        .allow_origin(Any)
        .allow_methods(Any)
        .allow_headers(Any);

    // Define Routes
    let app = Router::new()
        .nest("/api/auth", api::auth::routes())
        .nest("/api/containers", api::containers::routes())
        .nest("/api/images", api::images::routes())
        .nest("/api/networks", api::networks::routes())
        .nest("/api/volumes", api::volumes::routes())
        .nest("/api/system", api::system::routes())
        .nest("/api/compose", api::compose::routes())
        .nest("/api/settings", api::settings::routes())
        .layer(cors)
        .with_state(state);

    // Start Server
    let host = std::env::var("HOST").unwrap_or_else(|_| "0.0.0.0".to_string());
    let port = std::env::var("PORT")
        .unwrap_or_else(|_| "8080".to_string())
        .parse::<u16>()
        .unwrap_or(8080);
    
    let addr: SocketAddr = format!("{}:{}", host, port).parse()?;
    tracing::info!("Listening on {}", addr);
    
    let listener = tokio::net::TcpListener::bind(addr).await?;
    axum::serve(listener, app).await?;

    Ok(())
}

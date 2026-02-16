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
mod config;
mod db;
mod middleware;
mod models;
mod services;
mod utils;

use crate::services::docker_service::DockerService;
use crate::services::system_service::SystemService;
use crate::db::Database;

#[derive(Clone)]
pub struct AppState {
    pub docker: Arc<DockerService>,
    pub system: Arc<SystemService>,
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

    let state = AppState {
        docker,
        system,
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
        .layer(cors)
        .with_state(state);

    // Start Server
    let addr = SocketAddr::from(([0, 0, 0, 0], 8080));
    tracing::info!("Listening on {}", addr);
    
    let listener = tokio::net::TcpListener::bind(addr).await?;
    axum::serve(listener, app).await?;

    Ok(())
}

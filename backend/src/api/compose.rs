use axum::{
    extract::{State, Path},
    response::IntoResponse,
    routing::{get, post},
    Json,
    Router,
};
use crate::AppState;
use serde::Deserialize;

#[derive(Deserialize)]
pub struct ComposeAction {
    pub project_path: String,
    pub action: String, // "up", "down", "restart"
}

pub fn routes() -> Router<AppState> {
    Router::new()
        .route("/projects", get(list_projects))
        .route("/action", post(project_action))
}

async fn list_projects(State(state): State<AppState>) -> impl IntoResponse {
    match state.compose.list_projects().await {
        Ok(projects) => Json(projects).into_response(),
        Err(e) => (axum::http::StatusCode::INTERNAL_SERVER_ERROR, e.to_string()).into_response(),
    }
}

async fn project_action(
    State(state): State<AppState>,
    Json(payload): Json<ComposeAction>,
) -> impl IntoResponse {
    match payload.action.as_str() {
        "up" => {
            match state.compose.up(&payload.project_path).await {
                Ok(_) => axum::http::StatusCode::OK.into_response(),
                Err(e) => (axum::http::StatusCode::INTERNAL_SERVER_ERROR, e.to_string()).into_response(),
            }
        },
        "down" => {
            match state.compose.down(&payload.project_path).await {
                Ok(_) => axum::http::StatusCode::OK.into_response(),
                Err(e) => (axum::http::StatusCode::INTERNAL_SERVER_ERROR, e.to_string()).into_response(),
            }
        },
        _ => (axum::http::StatusCode::BAD_REQUEST, "Invalid action").into_response(),
    }
}

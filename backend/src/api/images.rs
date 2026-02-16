use axum::{
    extract::{State, Path},
    response::IntoResponse,
    routing::{get, post, delete},
    Json,
    Router,
};
use crate::AppState;

pub fn routes() -> Router<AppState> {
    Router::new()
        .route("/", get(list_images))
        .route("/pull", post(pull_image))
}

async fn list_images(State(state): State<AppState>) -> impl IntoResponse {
    match state.docker.list_images().await {
        Ok(images) => Json(images).into_response(),
        Err(e) => (axum::http::StatusCode::INTERNAL_SERVER_ERROR, e.to_string()).into_response(),
    }
}

async fn pull_image(
    State(state): State<AppState>,
    Json(payload): Json<serde_json::Value>,
) -> impl IntoResponse {
    let image = payload["image"].as_str().unwrap_or_default();
    match state.docker.pull_image(image).await {
        Ok(_) => axum::http::StatusCode::OK.into_response(),
        Err(e) => (axum::http::StatusCode::INTERNAL_SERVER_ERROR, e.to_string()).into_response(),
    }
}

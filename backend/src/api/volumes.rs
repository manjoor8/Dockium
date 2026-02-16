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
        .route("/", get(list_volumes))
        .route("/", post(create_volume))
        .route("/:id", delete(remove_volume))
}

async fn list_volumes(State(state): State<AppState>) -> impl IntoResponse {
    match state.docker.list_volumes().await {
        Ok(volumes) => Json(volumes).into_response(),
        Err(e) => (axum::http::StatusCode::INTERNAL_SERVER_ERROR, e.to_string()).into_response(),
    }
}

async fn create_volume(
    State(state): State<AppState>,
    Json(payload): Json<bollard::volume::CreateVolumeOptions<String>>,
) -> impl IntoResponse {
    match state.docker.create_volume(payload).await {
        Ok(response) => Json(response).into_response(),
        Err(e) => (axum::http::StatusCode::INTERNAL_SERVER_ERROR, e.to_string()).into_response(),
    }
}

async fn remove_volume(
    State(state): State<AppState>,
    Path(id): Path<String>,
) -> impl IntoResponse {
    match state.docker.remove_volume(&id).await {
        Ok(_) => axum::http::StatusCode::OK.into_response(),
        Err(e) => (axum::http::StatusCode::INTERNAL_SERVER_ERROR, e.to_string()).into_response(),
    }
}

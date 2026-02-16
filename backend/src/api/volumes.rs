use axum::{
    extract::State,
    response::IntoResponse,
    routing::get,
    Json,
    Router,
};
use crate::AppState;

pub fn routes() -> Router<AppState> {
    Router::new()
        .route("/", get(list_volumes))
}

async fn list_volumes(State(state): State<AppState>) -> impl IntoResponse {
    match state.docker.list_volumes().await {
        Ok(volumes) => Json(volumes).into_response(),
        Err(e) => (axum::http::StatusCode::INTERNAL_SERVER_ERROR, e.to_string()).into_response(),
    }
}

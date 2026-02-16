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
        .route("/", get(list_networks))
}

async fn list_networks(State(state): State<AppState>) -> impl IntoResponse {
    match state.docker.list_networks().await {
        Ok(networks) => Json(networks).into_response(),
        Err(e) => (axum::http::StatusCode::INTERNAL_SERVER_ERROR, e.to_string()).into_response(),
    }
}

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
        .route("/", get(list_networks))
        .route("/", post(create_network))
        .route("/:id", delete(remove_network))
}

async fn list_networks(State(state): State<AppState>) -> impl IntoResponse {
    match state.docker.list_networks().await {
        Ok(networks) => Json(networks).into_response(),
        Err(e) => (axum::http::StatusCode::INTERNAL_SERVER_ERROR, e.to_string()).into_response(),
    }
}

async fn create_network(
    State(state): State<AppState>,
    Json(payload): Json<bollard::network::CreateNetworkOptions<String>>,
) -> impl IntoResponse {
    match state.docker.create_network(payload).await {
        Ok(response) => Json(response).into_response(),
        Err(e) => (axum::http::StatusCode::INTERNAL_SERVER_ERROR, e.to_string()).into_response(),
    }
}

async fn remove_network(
    State(state): State<AppState>,
    Path(id): Path<String>,
) -> impl IntoResponse {
    match state.docker.remove_network(&id).await {
        Ok(_) => axum::http::StatusCode::OK.into_response(),
        Err(e) => (axum::http::StatusCode::INTERNAL_SERVER_ERROR, e.to_string()).into_response(),
    }
}

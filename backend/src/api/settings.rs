use axum::{
    extract::State,
    response::IntoResponse,
    routing::get,
    Json,
    Router,
};
use crate::AppState;
use serde_json::Value;

pub fn routes() -> Router<AppState> {
    Router::new()
        .route("/", get(get_settings).post(update_settings))
}

async fn get_settings(State(state): State<AppState>) -> impl IntoResponse {
    match state.settings.get_all_settings().await {
        Ok(settings) => Json(settings).into_response(),
        Err(e) => (axum::http::StatusCode::INTERNAL_SERVER_ERROR, e.to_string()).into_response(),
    }
}

async fn update_settings(
    State(state): State<AppState>,
    Json(payload): Json<std::collections::HashMap<String, String>>,
) -> impl IntoResponse {
    for (key, value) in payload {
        if let Err(e) = state.settings.set_setting(&key, &value).await {
            return (axum::http::StatusCode::INTERNAL_SERVER_ERROR, e.to_string()).into_response();
        }
    }
    axum::http::StatusCode::OK.into_response()
}

use axum::{
    extract::{Path, State, Query, ws::{WebSocket, WebSocketUpgrade, Message}},
    response::IntoResponse,
    routing::{get, post, delete},
    Json,
    Router,
};
use serde::Deserialize;
use crate::AppState;
use futures::{StreamExt, SinkExt};

#[derive(Deserialize)]
pub struct ListOptions {
    pub all: Option<bool>,
}

pub fn routes() -> Router<AppState> {
    Router::new()
        .route("/", get(list_containers))
        .route("/:id/start", post(start_container))
        .route("/:id/stop", post(stop_container))
        .route("/:id/restart", post(restart_container))
        .route("/:id/remove", delete(remove_container))
        .route("/:id/inspect", get(inspect_container))
        .route("/:id/logs", get(logs_handler))
}

async fn list_containers(
    State(state): State<AppState>,
    Query(params): Query<ListOptions>,
) -> impl IntoResponse {
    let all = params.all.unwrap_or(false);
    match state.docker.list_containers(all).await {
        Ok(containers) => Json(containers).into_response(),
        Err(e) => (axum::http::StatusCode::INTERNAL_SERVER_ERROR, e.to_string()).into_response(),
    }
}

async fn start_container(
    State(state): State<AppState>,
    Path(id): Path<String>,
) -> impl IntoResponse {
    match state.docker.start_container(&id).await {
        Ok(_) => axum::http::StatusCode::OK.into_response(),
        Err(e) => (axum::http::StatusCode::INTERNAL_SERVER_ERROR, e.to_string()).into_response(),
    }
}

async fn stop_container(
    State(state): State<AppState>,
    Path(id): Path<String>,
) -> impl IntoResponse {
    match state.docker.stop_container(&id).await {
        Ok(_) => axum::http::StatusCode::OK.into_response(),
        Err(e) => (axum::http::StatusCode::INTERNAL_SERVER_ERROR, e.to_string()).into_response(),
    }
}

async fn restart_container(
    State(state): State<AppState>,
    Path(id): Path<String>,
) -> impl IntoResponse {
    match state.docker.restart_container(&id).await {
        Ok(_) => axum::http::StatusCode::OK.into_response(),
        Err(e) => (axum::http::StatusCode::INTERNAL_SERVER_ERROR, e.to_string()).into_response(),
    }
}

async fn remove_container(
    State(state): State<AppState>,
    Path(id): Path<String>,
) -> impl IntoResponse {
    match state.docker.remove_container(&id).await {
        Ok(_) => axum::http::StatusCode::OK.into_response(),
        Err(e) => (axum::http::StatusCode::INTERNAL_SERVER_ERROR, e.to_string()).into_response(),
    }
}

async fn inspect_container(
    State(state): State<AppState>,
    Path(id): Path<String>,
) -> impl IntoResponse {
    match state.docker.inspect_container(&id).await {
        Ok(details) => Json(details).into_response(),
        Err(e) => (axum::http::StatusCode::INTERNAL_SERVER_ERROR, e.to_string()).into_response(),
    }
}

async fn logs_handler(
    ws: WebSocketUpgrade,
    State(state): State<AppState>,
    Path(id): Path<String>,
) -> impl IntoResponse {
    ws.on_upgrade(move |socket| handle_logs_ws(socket, state, id))
}

async fn handle_logs_ws(mut socket: WebSocket, state: AppState, id: String) {
    let mut logs_stream = match state.docker.get_container_logs(&id).await {
        Ok(stream) => stream,
        Err(e) => {
            let _ = socket.send(Message::Text(format!("Error: {}", e))).await;
            return;
        }
    };

    while let Some(log) = logs_stream.next().await {
        match log {
            Ok(output) => {
                let msg = format!("{}", output);
                if socket.send(Message::Text(msg)).await.is_err() {
                    break;
                }
            }
            Err(_) => break,
        }
    }
}

use axum::{
    extract::{State, ws::{WebSocket, WebSocketUpgrade, Message}},
    response::IntoResponse,
    routing::get,
    Json,
    Router,
};
use crate::AppState;
use std::time::Duration;
use tokio::time::sleep;

pub fn routes() -> Router<AppState> {
    Router::new()
        .route("/stats", get(get_stats))
        .route("/stats/ws", get(stats_ws_handler))
}

async fn get_stats(State(state): State<AppState>) -> impl IntoResponse {
    let stats = state.system.get_stats();
    Json(stats)
}

async fn stats_ws_handler(
    ws: WebSocketUpgrade,
    State(state): State<AppState>,
) -> impl IntoResponse {
    ws.on_upgrade(move |socket| handle_stats_ws(socket, state))
}

async fn handle_stats_ws(mut socket: WebSocket, state: AppState) {
    loop {
        let stats = state.system.get_stats();
        let json = serde_json::to_string(&stats).unwrap_or_default();
        
        if socket.send(Message::Text(json.into())).await.is_err() {
            break;
        }
        
        sleep(Duration::from_secs(2)).await;
    }
}

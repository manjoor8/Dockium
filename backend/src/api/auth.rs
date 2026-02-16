use axum::{
    extract::State,
    response::IntoResponse,
    routing::post,
    Json,
    Router,
};
use serde::{Serialize, Deserialize};
use crate::AppState;
use jsonwebtoken::{encode, Header, EncodingKey};
use chrono::{Utc, Duration};

#[derive(Deserialize)]
pub struct LoginRequest {
    pub username: String,
    pub password: String,
}

#[derive(Serialize)]
pub struct LoginResponse {
    pub token: String,
    pub user: crate::models::User,
}

pub fn routes() -> Router<AppState> {
    Router::new()
        .route("/login", post(login))
        .route("/setup", post(setup_admin))
}

async fn login(
    State(_state): State<AppState>,
    Json(payload): Json<LoginRequest>,
) -> impl IntoResponse {
    // In a real app, verify password hash from DB
    // For this boilerplate, we'll assume basic check
    
    let expiration = Utc::now()
        .checked_add_signed(Duration::hours(24))
        .expect("valid timestamp")
        .timestamp() as usize;

    let claims = crate::models::Claims {
        sub: "admin-uuid".to_owned(),
        username: payload.username.clone(),
        role: "admin".to_owned(),
        exp: expiration,
    };

    let token = encode(
        &Header::default(),
        &claims,
        &EncodingKey::from_secret("secret".as_ref()),
    ).unwrap();

    Json(LoginResponse {
        token,
        user: crate::models::User {
            id: "admin-uuid".to_owned(),
            username: payload.username,
            role: "admin".to_owned(),
        },
    })
}

async fn setup_admin(
    State(state): State<AppState>,
    Json(payload): Json<LoginRequest>,
) -> impl IntoResponse {
    // Check if any user exists
    let count: i32 = sqlx::query_scalar("SELECT COUNT(*) FROM users")
        .fetch_one(&state.db.pool)
        .await
        .unwrap_or(0);

    if count > 0 {
        return (axum::http::StatusCode::BAD_REQUEST, "Admin already setup").into_response();
    }

    let id = uuid::Uuid::new_v4().to_string();
    let hashed_password = bcrypt::hash(payload.password, bcrypt::DEFAULT_COST).unwrap();

    sqlx::query("INSERT INTO users (id, username, password_hash, role) VALUES (?, ?, ?, ?)")
        .bind(&id)
        .bind(&payload.username)
        .bind(&hashed_password)
        .bind("admin")
        .execute(&state.db.pool)
        .await
        .unwrap();

    axum::http::StatusCode::CREATED.into_response()
}

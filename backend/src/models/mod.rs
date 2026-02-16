use serde::{Serialize, Deserialize};

#[derive(Serialize, Deserialize, Clone)]
pub struct User {
    pub id: String,
    pub username: String,
    pub role: String,
}

#[derive(Serialize, Deserialize)]
pub struct Claims {
    pub sub: String,
    pub username: String,
    pub role: String,
    pub exp: usize,
}

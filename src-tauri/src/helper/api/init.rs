use serde::{Deserialize, Serialize};
use std::env;
use reqwest::Client;

// --- Dictionary Structs ---
#[derive(Debug, Serialize, Deserialize)]
pub struct DictMatches {
    pub exact: Vec<(String, i32)>, 
    pub similar: Vec<(String, i32)>,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct DictResponse {
    pub q: String,
    pub cnt: i32,
    pub cmatch: i32,
    pub a: DictMatches,
}

#[tauri::command]
pub async fn suggest_word(query: String, dict: String) -> Result<DictResponse, String> {
    let client = Client::new();
    let encoded = urlencoding::encode(&query);
    let url = format!("https://ord.uib.no/api/suggest?q={}&dict={}&n=10&include=eis&dform=int", encoded, dict);

    let response = client
        .get(url)
        .header("accept", "application/json")
        .send()
        .await
        .map_err(|e| e.to_string())?;

    let data: DictResponse = response.json().await.map_err(|e| e.to_string())?;
    Ok(data)
}

// --- Gemini Structs ---
#[derive(Serialize)]
struct GeminiRequest {
    contents: Vec<Content>,
}

#[derive(Serialize)]
struct Content {
    parts: Vec<Part>,
}

#[derive(Serialize, Deserialize)]
struct Part {
    text: String,
}

#[derive(Deserialize)]
struct GeminiResponse {
    candidates: Vec<Candidate>,
}

#[derive(Deserialize)]
struct Candidate {
    content: ContentResponse,
}

#[derive(Deserialize)]
struct ContentResponse {
    parts: Vec<Part>,
}

#[tauri::command]
pub async fn gemini(prompt: String) -> Result<String, String> {
    let api_key = env::var("GEMINI_KEY")
        .map_err(|_| "Environment variable 'GEMINI_KEY' not found.")?;

    let url = "https://generativelanguage.googleapis.com/v1beta/models/gemini-3-flash-preview:generateContent";

    let client = Client::new();

    let body = GeminiRequest {
        contents: vec![Content {
            parts: vec![Part { text: prompt }],
        }],
    };

    let response = client
        .post(url)
        .header("x-goog-api-key", &api_key) 
        .header("Content-Type", "application/json")
        .json(&body)
        .send()
        .await
        .map_err(|e| e.to_string())?;

    if response.status().is_success() {
        let res_data: GeminiResponse = response.json().await.map_err(|e| e.to_string())?;
        
        if let Some(candidate) = res_data.candidates.get(0) {
            if let Some(part) = candidate.content.parts.get(0) {
                return Ok(part.text.clone());
            }
        }
        Err("Gemini returned an empty response".to_string())
    } else {
        let error_text = response.text().await.unwrap_or_default();
        Err(format!("Gemini API Error: {}", error_text))
    }
}
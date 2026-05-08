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

#[derive(Debug, Serialize, Deserialize)]
pub struct SuggestOptions {
    pub amt: i32,
    pub include_definitions: bool, 
}

impl Default for SuggestOptions {
    fn default() -> Self {
        Self { amt: 30, include_definitions: false }
    }
}

#[tauri::command]
pub async fn suggest_word(query: String, lang: String, options: Option<SuggestOptions> ) -> Result<DictResponse, String> {
    let options = options.unwrap_or_default();
    let client = Client::new();
    let encoded = urlencoding::encode(&query);
    
    let dict = match lang.as_str() {
        "no" => "bm",      // Norwegian Bokmål
        "en" => "en",      // English
        "es" => "es",      // Spanish
        "de" => "de",      // German
        _ => "bm",         // Default to Norwegian
    };
    
    let url = format!("https://ord.uib.no/api/suggest?q={}&dict={}&n={}&include=eis&dform=int", encoded, dict, options.amt);

    let response = client
        .get(&url)
        .header("accept", "application/json")
        .send()
        .await
        .map_err(|e| e.to_string())?;

    match response.json::<DictResponse>().await {
        Ok(mut data) => {
            if !data.a.exact.is_empty() || !data.a.similar.is_empty() {
                return Ok(data);
            }

            if query.len() > 3 {
                let fallback_url = format!("https://ord.uib.no/api/suggest?q={}&dict={}&n=30&include=eis", encoded, dict);
                
                if let Ok(fallback_response) = client
                    .get(&fallback_url)
                    .header("accept", "application/json")
                    .send()
                    .await
                {
                    if let Ok(fallback_data) = fallback_response.json::<DictResponse>().await {
                        if !fallback_data.a.exact.is_empty() || !fallback_data.a.similar.is_empty() {
                            return Ok(fallback_data);
                        }
                    }
                }

                let fuzzy_url = format!("https://ord.uib.no/api/suggest?sp={}*&dict={}&n=30&include=eis", encoded, dict);
                
                if let Ok(fuzzy_response) = client
                    .get(&fuzzy_url)
                    .header("accept", "application/json")
                    .send()
                    .await
                {
                    if let Ok(fuzzy_data) = fuzzy_response.json::<DictResponse>().await {
                        if !fuzzy_data.a.exact.is_empty() || !fuzzy_data.a.similar.is_empty() {
                            return Ok(fuzzy_data);
                        }
                    }
                }
            }

            Ok(data)
        }
        Err(e) => Err(e.to_string()),
    }
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
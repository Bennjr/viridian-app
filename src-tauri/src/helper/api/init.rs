use serde::{Deserialize, Serialize};

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
    let client = reqwest::Client::new();
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
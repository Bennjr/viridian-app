use std::{fs, string::String};
use serde_json::json;

#[tauri::command]
pub fn save_file(path: String) -> Result<(), String> {
    fs::copy(path, "test.txt").map_err(|e| e.to_string())?;
    Ok(())
}

#[tauri::command]
pub fn search_files(query: String) -> Vec<serde_json::Value> {
    let paths = fs::read_dir("../user/save/lib").map_err(|e| e.to_string()).unwrap();
    let mut vec = Vec::new();

    for files in paths {
        let file = files.unwrap();
        let file_name = file.file_name();
        let file_name_str = file_name.to_string_lossy();

        if query.is_empty() || file_name_str.contains(&query) {
            vec.push(json!({
                "name": file_name_str,
                "desc": "some desc"
            }));
        }
    }
    return vec
}

#[tauri::command]
pub fn get_content(path: String) -> String {
    let contents = fs::read_to_string(path)
        .expect("Should have been able to read the file");
    return contents
}
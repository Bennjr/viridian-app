use std::{fs, string::String, path::Path};
use serde_json::{json, Value};
use std::time::UNIX_EPOCH;
use tauri_plugin_opener::OpenerExt;
use std::process::Command;
use tauri::Manager;

#[tauri::command]
pub fn save_files(paths: Vec<String>, into: String, handle: tauri::AppHandle) -> Result<(), String> {
    let app_dir = handle.path().app_data_dir().map_err(|e| e.to_string())?;
    let target_dir = app_dir.join("Viridian").join(into);
    
    fs::create_dir_all(&target_dir).map_err(|e| e.to_string())?;

    for path_str in paths {
        let src_path = Path::new(&path_str);
        
        let file_name = src_path
            .file_name()
            .ok_or_else(|| format!("Could not get filename from: {}", path_str))?;
            
        let dest_path = target_dir.join(file_name);

        fs::copy(&src_path, &dest_path).map_err(|e| e.to_string())?;
    }
    
    Ok(())
}

#[tauri::command]
pub fn search_files(query: String, handle: tauri::AppHandle) -> Result<Vec<Value>, String> {
    let app_dir = handle.path().app_data_dir().map_err(|e| e.to_string())?;
    let target_dir = app_dir.join("Viridian").join("Files");

    let paths = fs::read_dir(target_dir).map_err(|e| e.to_string())?;
    
    let mut vec = Vec::new();

    for entry_result in paths {
        let entry = match entry_result {
            Ok(e) => e,
            Err(_) => continue,
        };

        let path = entry.path();
        
        let filename = path.file_name()
            .unwrap_or_default()
            .to_string_lossy()
            .to_string();

        let file_type = if path.is_dir() {
            "folder".to_string()
        } else {
            path.extension()
                .and_then(|ext| ext.to_str())
                .unwrap_or("file")
                .to_lowercase()
        };

        if query.is_empty() || filename.to_lowercase().contains(&query.to_lowercase()) {
            let metadata = entry.metadata().map_err(|e| e.to_string())?;
            
            let modified = metadata.modified()
                .unwrap_or(UNIX_EPOCH)
                .duration_since(UNIX_EPOCH)
                .unwrap_or_default()
                .as_secs();

            vec.push(json!({
                "name": filename,
                "path": path.to_string_lossy(),
                "type": file_type,
                "modified": modified,
                "size": metadata.len(),
                "desc": format!("{} fil", file_type.to_uppercase()) 
            }));
        }
    }

    Ok(vec)
}

#[tauri::command]
pub fn get_content(path: String) -> String {
    let contents = fs::read_to_string(path)
        .expect("Should have been able to read the file");
    return contents
}

#[tauri::command]
pub fn show_in_folder(path: String) {
    #[cfg(target_os = "windows")]
    {
        Command::new("explorer")
            .args(["/select,", &path])
            .spawn()
            .unwrap();
    }

    #[cfg(target_os = "macos")]
    {
        Command::new("open")
            .args(["-R", &path])
            .spawn()
            .unwrap();
    }

    #[cfg(target_os = "linux")]
    {
        let path = Path::new(&path);
        let dir = if path.is_dir() {
            path
        } else {
            path.parent().unwrap_or(Path::new("/"))
        };
        Command::new("xdg-open")
            .arg(dir)
            .spawn()
            .unwrap();
    }
}
use selection::get_text;
use regex::Regex;
use tauri::Manager;
// Note: Removed unused Emitter import to clear warning

use crate::helper::window::init::w_show;

#[tauri::command]
pub fn translate() -> String {
    let sel_text = get_text();
    
    let re = Regex::new(r"[^a-zA-Z0-9 ]").unwrap();
    let cleaned_text = re.replace_all(&sel_text, "").to_string();

    println!("Original: {}", sel_text);
    println!("Cleaned: {}", cleaned_text);

    cleaned_text
}

pub fn w_show_by_label(app: &tauri::AppHandle, label: &str) {
    if let Some(win) = app.get_window(label) {
        w_show(win);
    } else {
        println!("Window {} not found", label);
    }
}

fn get_w_by_label(app: &tauri::AppHandle, label: &str) -> Option<tauri::WebviewWindow> {
    app.get_webview_window(label)
}

pub fn trigger_settings(app: &tauri::AppHandle, label: &str) {
    if let Some(window) = get_w_by_label(app, label) {
        let js = "window.location.hash = '#/settings'";
        let _ = window.eval(js);
    } else {
        println!("Could not navigate: Window {} not found", label);
    }
}
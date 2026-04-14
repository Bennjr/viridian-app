use regex::Regex;
use tauri::{AppHandle, Emitter, Manager, WebviewWindow};

use selection::get_text;

// ------------------------------------------------------------------
// Commands 
// ------------------------------------------------------------------

#[tauri::command]
pub fn translate() -> String {
    let sel_text = get_text();
    
    let re = Regex::new(r"[^a-zA-Z0-9 ]").unwrap();
    let cleaned_text = re.replace_all(&sel_text, "").to_string();

    println!("Original: {}", sel_text);
    println!("Cleaned: {}", cleaned_text);

    cleaned_text
}

#[tauri::command]
pub fn trigger_settings(app: AppHandle) {
    let _ = app.emit("navigate", "/settings");
}

#[tauri::command]
pub fn trigger_w_len(app: AppHandle, len: usize) {
    const BASE: i32 = 75;

    if let Some(win) = get_w_by_label(&app, "overlayWin") {
        let new_len = BASE * len as i32;
        w_resize(win, new_len as u32);
    } else {
        println!("Window 'overlayWin' not found");
    }
}

// ------------------------------------------------------------------
// Helper functions
// ------------------------------------------------------------------

pub fn w_show_by_label(app: &AppHandle, label: &str) {
    if let Some(win) = get_w_by_label(app, label) {
        show_window(win);
    } else {
        println!("Window {} not found", label);
    }
}

fn get_w_by_label(app: &AppHandle, label: &str) -> Option<WebviewWindow> {
    app.get_webview_window(label)
}

fn w_resize(window: WebviewWindow, height: u32) {
    if let Ok(current_size) = window.inner_size() {
        let _ = window.set_size(tauri::Size::Physical(tauri::PhysicalSize {
            width: current_size.width,
            height,
        }));
    }
}

#[tauri::command]
pub fn show_window(window: tauri::WebviewWindow) {
    #[cfg(target_os = "windows")]
    unsafe {
        use windows::Win32::Foundation::HWND;
        use windows::Win32::UI::WindowsAndMessaging::*;

        let hwnd_wrapper = window.hwnd().expect("no hwnd");
        let raw_hwnd: *mut std::ffi::c_void = hwnd_wrapper.0;
        let hwnd = HWND(raw_hwnd);

        let _ = ShowWindow(hwnd, SW_SHOW);
    }
}
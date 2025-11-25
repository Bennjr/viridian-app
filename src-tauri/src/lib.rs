use selection::get_text;
use tauri::{Manager};
use tts::Tts;
use regex::Regex;

// ------------ WINDOW OPS ------------ //

#[tauri::command]
fn w_overlay_ops(window: tauri::Window) {
    #[cfg(target_os = "windows")]
    unsafe {
        use windows::Win32::Foundation::HWND;
        use windows::Win32::UI::WindowsAndMessaging::*;

        let hwnd_wrapper = window.hwnd().expect("no hwnd");
        let raw_hwnd: *mut std::ffi::c_void = hwnd_wrapper.0;
        let hwnd = HWND(raw_hwnd);

        let ex_style = GetWindowLongW(hwnd, GWL_EXSTYLE);
        let final_style = ex_style 
            | WS_EX_TOOLWINDOW.0 as i32
            | WS_EX_NOACTIVATE.0 as i32
            | WS_EX_TOPMOST.0 as i32;

        SetWindowLongW(hwnd, GWL_EXSTYLE, final_style);
        
        // Force window to hide from Alt+Tab by removing WS_EX_APPWINDOW
        let ex_style_after = GetWindowLongW(hwnd, GWL_EXSTYLE);
        let final_style = (ex_style_after & !(WS_EX_APPWINDOW.0 as i32)) 
            | WS_EX_TOOLWINDOW.0 as i32;
        
        SetWindowLongW(hwnd, GWL_EXSTYLE, final_style);
    }
}

#[tauri::command]
fn w_resize_plus(window: tauri::Window) {
    let _ = window.set_size(tauri::Size::Physical({
        tauri::PhysicalSize {
            width: window.inner_size().unwrap().width,
            height: 300,
        }
    }));
}

#[tauri::command]
fn w_resize_minus(window: tauri::Window) {
    let _ = window.set_size(tauri::Size::Physical({
        tauri::PhysicalSize {
            width: window.inner_size().unwrap().width,
            height: 75,
        }
    }));
}

#[tauri::command]
fn w_resize(window: tauri::Window, height: u32) {
    let max_height = 600;
    if height > max_height {
        return
    }

    let _ = window.set_size(tauri::Size::Physical(
        tauri::PhysicalSize {
            width: window.inner_size().unwrap().width,
            height,
        }
    ));
}

#[tauri::command]
fn w_focus(window: tauri::Window) {
    #[cfg(target_os = "windows")]
    unsafe {
        use windows::Win32::Foundation::HWND;
        use windows::Win32::UI::WindowsAndMessaging::*;

        let hwnd_wrapper = window.hwnd().expect("no hwnd");
        let raw_hwnd: *mut std::ffi::c_void = hwnd_wrapper.0;
        let hwnd = HWND(raw_hwnd);

        let ex_style = GetWindowLongW(hwnd, GWL_EXSTYLE);
        let final_style = ex_style & !(WS_EX_NOACTIVATE.0 as i32);

        SetWindowLongW(hwnd, GWL_EXSTYLE, final_style);
    }
}

#[tauri::command]
fn w_unfocus(window: tauri::Window) {
    #[cfg(target_os = "windows")]
    unsafe {
        use windows::Win32::Foundation::HWND;
        use windows::Win32::UI::WindowsAndMessaging::*;

        let hwnd_wrapper = window.hwnd().expect("no hwnd");
        let raw_hwnd: *mut std::ffi::c_void = hwnd_wrapper.0;
        let hwnd = HWND(raw_hwnd);

        let ex_style = GetWindowLongW(hwnd, GWL_EXSTYLE);
        let final_style = ex_style | WS_EX_NOACTIVATE.0 as i32;

        SetWindowLongW(hwnd, GWL_EXSTYLE, final_style);
    }
}

// ------------ OVERLAY FUNCTIONS ------------- //
#[tauri::command]
async fn overlay_speak() -> Result<(), String> {
    let sel_text = get_text();
    println!("{}", sel_text);
    
    let re = Regex::new(r"[^a-zA-Z0-9 ]").unwrap();
    let sel_text = re.replace_all(&sel_text, "");
    
    if sel_text.len() > 0 {
        let mut tts = Tts::default().map_err(|e| format!("{:?}", e))?;
        tts.speak(&*sel_text, true).map_err(|e| format!("{:?}", e))?;
        
        std::thread::sleep(std::time::Duration::from_secs(5));
    }
    Ok(())
}

#[tauri::command]
fn overlay_chat() {
    let sel_text = get_text();
    println!("{}", sel_text);

    let re = Regex::new(r"[^a-zA-Z0-9 ]").unwrap();
    let sel_text = re.replace_all(&sel_text, "");

    if sel_text.len() > 0 {
        
    }
}

// ------------ MAIN RUN FUNCTION ------------ //
#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
    // Put all commands which should be called from the front end here -->
    .invoke_handler(tauri::generate_handler![overlay_speak, w_resize_plus, w_resize_minus, w_focus, w_unfocus, w_resize])
        .setup(|app| {
            let _handle = app.handle().clone();

            // Call function to customize overlay window properties
            let overlay = app.get_window("overlayWin").unwrap();
            w_overlay_ops(overlay);

            #[cfg(desktop)]
            {
                use tauri_plugin_global_shortcut::{
                    Code, GlobalShortcutExt, Modifiers, Shortcut, ShortcutState,
                };

                let ctrl_alt_c =
                    Shortcut::new(Some(Modifiers::CONTROL | Modifiers::ALT), Code::KeyC);

                app.handle().plugin(
                    tauri_plugin_global_shortcut::Builder::new()
                        .with_handler(move |_app, shortcut, event| {
                            println!("{:?}", shortcut);
                            if shortcut == &ctrl_alt_c {
                                match event.state() {
                                    ShortcutState::Pressed => {
                                        println!("Ctrl-Alt-C Pressed!");
                                        let text = get_text();
                                        println!("{}", text);
                                    }

                                    ShortcutState::Released => {
                                        println!("Ctrl-Alt-C Released!");
                                    }
                                }
                            }
                        })
                        .build(),
                )?;
                app.global_shortcut().register(ctrl_alt_c)?;
            }
            Ok(())
        })
        .plugin(tauri_plugin_opener::init())
        .run(tauri::generate_context!())
        .expect("Viridian application failed to launch");
}

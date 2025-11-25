use regex::Regex;
use selection::get_text;
use tauri::Manager;
use tts::Tts;

mod appbar;
mod w_ops;

use appbar::{dock_window_top, undock_window};
use w_ops::{
    w_focus, w_hide, w_overlay_ops, w_resize, w_resize_minus, w_resize_plus, w_show, w_unfocus,
};

#[tauri::command]
fn dock(window: tauri::Window) {
    #[cfg(target_os = "windows")]
    unsafe {
        use windows::Win32::Foundation::HWND;

        let hwnd = HWND(window.hwnd().unwrap().0 as *mut _);
        dock_window_top(hwnd, 60);
    }
}

#[tauri::command]
fn undock(window: tauri::Window) {
    #[cfg(target_os = "windows")]
    unsafe {
        use windows::Win32::Foundation::HWND;

        let hwnd = HWND(window.hwnd().unwrap().0 as *mut _);
        undock_window(hwnd);
    }
}

// ------------ OVERLAY FUNCTIONS ------------- //
#[tauri::command]
async fn tts_speak() -> Result<(), String> {
    let sel_text = get_text();
    println!("{}", sel_text);

    let re = Regex::new(r"[^a-zA-Z0-9 ]").unwrap();
    let sel_text = re.replace_all(&sel_text, "");

    if sel_text.len() > 0 {
        let mut tts = Tts::default().map_err(|e| format!("{:?}", e))?;
        tts.speak(&*sel_text, true)
            .map_err(|e| format!("{:?}", e))?;

        std::thread::sleep(std::time::Duration::from_secs(5));
    }
    Ok(())
}

// ------------ MAIN RUN FUNCTION ------------ //
#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        // Put all commands which should be called from the front end here -->
        .invoke_handler(tauri::generate_handler![
            tts_speak,
            w_resize_plus,
            w_resize_minus,
            w_focus,
            w_unfocus,
            w_resize,
            dock,
            undock,
            w_hide,
            w_show
        ])
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

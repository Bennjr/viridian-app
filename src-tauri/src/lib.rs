use selection::get_text;
use tauri::{
    Manager
};

mod helper;
use helper::{
    tts_speak, 
    init_systray,
    w_focus, 
    w_hide, 
    w_is_visb, 
    w_init, 
    w_resize, 
    w_show, 
    w_unfocus
};

// ------------ MAIN RUN FUNCTION ------------ //
#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        // Put all commands which should be called from the front end here -->
        .invoke_handler(tauri::generate_handler![
            tts_speak,
            w_focus,
            w_unfocus,
            w_resize,
            w_hide,
            w_show,
        ])
        .setup(|app| {
            let _handle = app.handle().clone();

            // Call function to customize overlay window properties
            let overlay = app.get_window("overlayWin").unwrap();
            w_init(overlay);

            let _ = init_systray(app.handle());

            // Register global shortcuts
            #[cfg(desktop)]
            {
                use tauri_plugin_global_shortcut::{
                    Code, GlobalShortcutExt, Modifiers, Shortcut, ShortcutState,
                };

                let ctrl_alt_c =
                    Shortcut::new(Some(Modifiers::CONTROL | Modifiers::ALT), Code::KeyC);
                let ctrl_alt_h =
                    Shortcut::new(Some(Modifiers::CONTROL | Modifiers::ALT), Code::KeyH);

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
                            if shortcut == &ctrl_alt_h {
                                match event.state() {
                                    ShortcutState::Pressed => {
                                        println!("Ctrl-Alt-H Pressed!");
                                        if w_is_visb(_app.get_window("overlayWin").unwrap()) {
                                            w_hide(_app.get_window("overlayWin").unwrap());
                                        } else {
                                            w_show(_app.get_window("overlayWin").unwrap());
                                        }
                                    }

                                    ShortcutState::Released => {
                                        println!("Ctrl-Alt-H Released!");
                                    }
                                }
                            }
                        })
                        .build(),
                )?;
                
                // Unregister shortcuts if they already exist (from previous run)
                let _ = app.global_shortcut().unregister(ctrl_alt_c);
                let _ = app.global_shortcut().unregister(ctrl_alt_h);
                
                // Now register them
                app.global_shortcut().register(ctrl_alt_c)?;
                app.global_shortcut().register(ctrl_alt_h)?;
            }
            Ok(())
        })
        .on_window_event(|window, event| {
            match event {
                tauri::WindowEvent::CloseRequested { api, .. } => {
                    api.prevent_close();
                    let _ = window.hide(); 
                }
                _ => {} 
            }
        })
        .plugin(tauri_plugin_opener::init())
        .run(tauri::generate_context!() )
        .expect("Viridian application failed to launch");
}

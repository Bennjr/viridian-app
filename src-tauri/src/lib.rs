use selection::get_text;

// ------------ MAIN RUN FUNCTION ------------ //
#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    //configure webview2 to run entirely on cpu
    #[cfg(target_os = "windows")]
    {
        std::env::set_var("WEBVIEW2_ADDITIONAL_BROWSER_ARGUMENTS",
            "--use-angle=swiftshader --disable-gpu --disable-gpu-compositing --disable-software-rasterizer");
    }
    tauri::Builder::default()
        .setup(|app| {
            let _handle = app.handle().clone();

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

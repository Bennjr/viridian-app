use tauri::{
    Manager, 
    menu::{Menu, MenuItem},
    tray::{ TrayIconBuilder, TrayIconEvent, MouseButton, MouseButtonState },
};

pub fn init_systray(app: &tauri::AppHandle) -> tauri::Result<()> {
    let quit_i = MenuItem::with_id(app, "quit", "Quit", true, None::<&str>)?;
    let show_i = MenuItem::with_id(app, "show", "Show Window", true, None::<&str>)?;
    
    let menu = Menu::with_items(app, &[&show_i, &quit_i])?;


    let _tray = TrayIconBuilder::new()
        .menu(&menu)
        .icon(app.default_window_icon().unwrap().clone())
        .menu_on_left_click(false)
        .on_tray_icon_event(|tray, event| match event {
            TrayIconEvent::Click {
              button: MouseButton::Left,
              button_state: MouseButtonState::Up,
              ..
            } => {
              let app = tray.app_handle();
              if let Some(window) = app.get_window("mainWin") {
                let _ = window.unminimize();
                let _ = window.show();
                let _ = window.set_focus();
              }
            }
            _ => {}
        })
        .on_menu_event(|app, event| {
            match event.id.as_ref() {
                "quit" => app.exit(0),
                "show" => {
                    if let Some(window) = app.get_window("mainWin") {
                        let _ = window.show();
                        let _ = window.set_focus();
                    }
                }
                _ => {}
            }
        })
        .build(app);

    Ok(())
}
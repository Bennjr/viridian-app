// QUICK SUM OF ALL WIN32 API CALLS MADE FOR FUTRE DOCS
// WS_EX_TOOLWINDOW -- Hide from toolwind (self explanitory)
// WS_NO_NOACTIVE -- Hides the window from being selected via alt tab
// WS_EX_TOPMOST -- Makes the window always appear on top

use serde_json::{Value};
use windows::{
    core::Result,
    Win32::Foundation::*,
    Win32::UI::Shell::*,
    Win32::UI::WindowsAndMessaging::*,
};


#[tauri::command]
pub fn w_init(window: tauri::Window) {
    #[cfg(target_os = "windows")]

    // find out window style (with temp data)
    let data = r#"
        {
            "window_style": "overlay"
        }"#;

    let parsed: Value = serde_json::from_str(data).expect("JSON could not be formatted");
    println!("Window style is {}", parsed["window_style"]);

    if parsed["window_style"] == "overlay" {
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
    
            let ex_style_after = GetWindowLongW(hwnd, GWL_EXSTYLE);
            let final_style =
                (ex_style_after & !(WS_EX_APPWINDOW.0 as i32)) | WS_EX_TOOLWINDOW.0 as i32;
    
            SetWindowLongW(hwnd, GWL_EXSTYLE, final_style);
        }
    } else if parsed["window_style"] == "appbar" {
        w_appbar_init(&window, 50);
    } else {
        println!("Invalid window style");
    }
}

#[tauri::command]
pub fn w_resize(window: tauri::Window, height: u32) {
    let _ = window.set_size(tauri::Size::Physical(tauri::PhysicalSize {
        width: window.inner_size().unwrap().width,
        height,
    }));
}

// W FOCUS CMDS

#[tauri::command]
pub fn w_focus(window: tauri::Window) {
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
pub fn w_unfocus(window: tauri::Window) {
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

// VISB CMDS

#[tauri::command]
pub fn w_hide(window: tauri::Window) {
    #[cfg(target_os = "windows")]
    unsafe {
        use windows::Win32::Foundation::HWND;
        use windows::Win32::UI::WindowsAndMessaging::*;

        let hwnd_wrapper = window.hwnd().expect("no hwnd");
        let raw_hwnd: *mut std::ffi::c_void = hwnd_wrapper.0;
        let hwnd = HWND(raw_hwnd);

        let _ = ShowWindow(hwnd, SW_HIDE);
    }
}

#[tauri::command]
pub fn w_show(window: tauri::Window) {
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

#[tauri::command]
pub fn w_is_visb(window: tauri::Window) -> bool {
    #[cfg(target_os = "windows")]
    unsafe {
        use windows::Win32::Foundation::HWND;
        use windows::Win32::UI::WindowsAndMessaging::*;

        let hwnd_wrapper = window.hwnd().expect("no hwnd");
        let raw_hwnd: *mut std::ffi::c_void = hwnd_wrapper.0;
        let hwnd = HWND(raw_hwnd);

        IsWindowVisible(hwnd).as_bool()
    }
    #[cfg(not(target_os = "windows"))]
    false
}

pub fn w_appbar_init(window: &tauri::Window, height: i32) -> Result<()> {
    if !cfg!(target_os = "windows") {
        println!("Appbar style is only supported on Windows");
        return Ok(());
    }

    unsafe {
        let mut abd = APPBARDATA::default();
        abd.cbSize = std::mem::size_of::<APPBARDATA>() as u32;
        abd.uEdge = ABE_TOP;
        abd.hWnd = HWND(window.hwnd().expect("no hwnd").0 as *mut std::ffi::c_void);

        SHAppBarMessage(ABM_NEW, &mut abd);

        let screen_width = GetSystemMetrics(SM_CXSCREEN) as i32;

        abd.rc.left = 0;
        abd.rc.top = 0;
        abd.rc.right = screen_width;
        abd.rc.bottom = height;

        SHAppBarMessage(ABM_QUERYPOS, &mut abd);
        SHAppBarMessage(ABM_SETPOS, &mut abd);

        let _ = MoveWindow(
            abd.hWnd,
            abd.rc.left,
            abd.rc.top,
            abd.rc.right - abd.rc.left,
            abd.rc.bottom - abd.rc.top,
            true.into(),
        );
    }

    Ok(())
}
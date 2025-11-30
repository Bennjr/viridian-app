// Win32 properties for the overlay window
#[tauri::command]
pub fn w_overlay_ops(window: tauri::Window) {
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
        let final_style =
            (ex_style_after & !(WS_EX_APPWINDOW.0 as i32)) | WS_EX_TOOLWINDOW.0 as i32;

        SetWindowLongW(hwnd, GWL_EXSTYLE, final_style);
    }
}

#[tauri::command]
pub fn w_resize_plus(window: tauri::Window) {
    let _ = window.set_size(tauri::Size::Physical({
        tauri::PhysicalSize {
            width: window.inner_size().unwrap().width,
            height: 300,
        }
    }));
}

#[tauri::command]
pub fn w_resize_minus(window: tauri::Window) {
    let _ = window.set_size(tauri::Size::Physical({
        tauri::PhysicalSize {
            width: window.inner_size().unwrap().width,
            height: 75,
        }
    }));
}

#[tauri::command]
pub fn w_resize(window: tauri::Window, height: u32) {
    let max_height = 600;
    if height > max_height {
        return;
    }

    let _ = window.set_size(tauri::Size::Physical(tauri::PhysicalSize {
        width: window.inner_size().unwrap().width,
        height,
    }));
}

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

#[tauri::command]
pub fn w_hide(window: tauri::Window) {
    #[cfg(target_os = "windows")]
    unsafe {
        use windows::Win32::Foundation::HWND;
        use windows::Win32::UI::WindowsAndMessaging::*;

        let hwnd_wrapper = window.hwnd().expect("no hwnd");
        let raw_hwnd: *mut std::ffi::c_void = hwnd_wrapper.0;
        let hwnd = HWND(raw_hwnd);

        ShowWindow(hwnd, SW_HIDE);
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

        ShowWindow(hwnd, SW_SHOW);
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

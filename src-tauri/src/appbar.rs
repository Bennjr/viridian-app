use windows::Win32::{
    Foundation::{HWND, RECT},
    UI::Shell::{SHAppBarMessage, ABE_TOP, ABM_NEW, ABM_REMOVE, ABM_SETPOS, APPBARDATA},
    UI::WindowsAndMessaging::{GetSystemMetrics, SM_CXSCREEN},
};

static mut APPBAR_ID: u32 = 0;

pub unsafe fn dock_window_top(hwnd: HWND, height: i32) {
    let mut abd = APPBARDATA {
        cbSize: std::mem::size_of::<APPBARDATA>() as u32,
        hWnd: hwnd,
        ..Default::default()
    };

    // Register AppBar
    APPBAR_ID = SHAppBarMessage(ABM_NEW, &mut abd) as u32;

    let screen_width = GetSystemMetrics(SM_CXSCREEN);

    abd.uEdge = ABE_TOP;
    abd.rc = RECT {
        left: 0,
        top: 0,
        right: screen_width,
        bottom: height,
    };

    SHAppBarMessage(ABM_SETPOS, &mut abd);
}

pub unsafe fn undock_window(hwnd: HWND) {
    let mut abd = APPBARDATA {
        cbSize: std::mem::size_of::<APPBARDATA>() as u32,
        hWnd: hwnd,
        ..Default::default()
    };

    SHAppBarMessage(ABM_REMOVE, &mut abd);
}

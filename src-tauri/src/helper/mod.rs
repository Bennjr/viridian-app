pub mod tts_service;
pub mod window;

// Re-export commonly used items
pub use tts_service::init::tts_speak;
pub use window::{w_focus, w_hide, w_is_visb, w_init, w_resize, w_show, w_unfocus};
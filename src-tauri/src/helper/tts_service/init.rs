use regex::Regex;
use selection::get_text;
use tts::Tts;
use serde_json::Value::Null;

#[tauri::command]
pub async fn tts_speak(usr: String) -> Result<(), String> {
    if usr.len() >= 1 {
        let mut tts = Tts::default().map_err(|e| format!("{:?}", e))?;
            tts.speak(&*usr, true)
                .map_err(|e| format!("{:?}", e))?;

            std::thread::sleep(std::time::Duration::from_secs(5));
    } else{
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
    }
    Ok(())
}
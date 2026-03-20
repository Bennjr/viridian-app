use selection::get_text;
use regex::Regex;

#[tauri::command]
pub fn translate() -> String {
    let sel_text = get_text();
    
    let re = Regex::new(r"[^a-zA-Z0-9 ]").unwrap();
    let cleaned_text = re.replace_all(&sel_text, "").to_string();

    println!("Original: {}", sel_text);
    println!("Cleaned: {}", cleaned_text);

    return cleaned_text;
}
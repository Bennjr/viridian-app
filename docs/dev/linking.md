# Linking
This is a tauri project using react for the frontend webview, this means all linking happens through invoke api for calling on backend or imports when grabbing components props or hooks.

## Frontend 

All components lie in src/app/components/. and you will therefore need to refer to the components folder when importing a component. All components are exported as part of the index.ts as defaults as well as in the files themselves, which means you can grab a component as such:

``` tsx
import Foo from "../../components"

// TO USE THE COMPONENT
<div>
    <Foo>
</div>
```

Depending on the current dir of select file you may need more or less double punctation marks

## Backend

All calls on the backend should happen through tauri invoke, tauri invoke is a official api avaliable in the current version of Tauri. To call a backend function do as such:

``` tsx
import { invoke } from "@tauri-apps/api/core";

// TO USE INVOKE 
invoke(bar) 
```

## Rust multifile linking

For cleaner code i have seperated much of the code into different files for code cleanliness and for easier development and updates, all of which will be found in src-tauri/src/. where lib.rs is the main function you will need to work with to continue development

For splitting code into different files we mod.rs export pub fn functions you have in the seperate folders. Note that with this setup you will need to double export the code as i've grouped all helper files into the helper fodler and double grouped by function of the file. This wll lead to cleaner folder structure to link you do as such

``` rs
pub mod foo;

pub use foo::*; 
```

You will need to do this for both files as to be able to use it in the lib.rs file localed in src-tauri/src/.
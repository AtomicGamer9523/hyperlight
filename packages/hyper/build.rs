use deno_core::include_js_files;
use deno_core::Extension;
use std::env;
use std::path::PathBuf;

fn main() {
    let runjs_extension = Extension::builder("hyper")
        .esm(include_js_files!("runtime.ts",))
        .build();

    let out_dir = PathBuf::from(env::var_os("OUT_DIR").unwrap());
    let snapshot_path = out_dir.join("RUNJS_SNAPSHOT.bin");

    deno_core::snapshot_util::create_snapshot(deno_core::snapshot_util::CreateSnapshotOptions {
        cargo_manifest_dir: env!("CARGO_MANIFEST_DIR"),
        snapshot_path,
        startup_snapshot: None,
        extensions: vec![runjs_extension],
        compression_cb: None,
        snapshot_module_load_cb: None,
    })
}
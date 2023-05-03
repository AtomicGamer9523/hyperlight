extern crate hyper;
use hyper::*;

fn main() {
    let runtime = setup_thread().unwrap();
    let task = launch("./index.ts");
    runtime.block_on(task).unwrap();
}

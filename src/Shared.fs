module Shared

open Fable.Core.JsInterop

module HotReload =
    let connect(): unit = importMember "chrome-extension-hot-reload"
    let start(): unit = importMember "chrome-extension-hot-reload"
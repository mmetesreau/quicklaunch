module Shared

open Fable.Core

module HotReload =
    type IHotReload = 
        abstract start: unit -> unit
        abstract connect: unit -> unit

    [<Import("*", from="chrome-extension-hot-reload")>]
    let lib: IHotReload = jsNative
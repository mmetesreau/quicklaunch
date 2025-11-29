module Quicklaunch

module rec Global =
    open Fable.Core
    open Fable.Core.JS

    [<Global>]
    let chrome: IExports = jsNative

    type [<AllowNullLiteral>] IExports =
            abstract storage: Storage.IExports
            abstract tabs: Tabs.IExports

    module Storage =
        type [<AllowNullLiteral>] IExports =
            abstract local: LocalStorageArea

        type [<AllowNullLiteral>] StorageArea =
            abstract set: items: obj -> Promise<unit>
            abstract get<'T>: keys: string -> Promise<'T>

        type [<AllowNullLiteral>] LocalStorageArea =
            inherit StorageArea

    module Tabs =
        type [<AllowNullLiteral>] IExports =
            abstract create: args: CreateArgs -> Promise<unit>
        and CreateArgs = { url: string }

type Suggestion = {
        Link: string
        Tags: Tag array
}
and Tag = string

module Storage =
    let [<Literal>] storageKey = "suggestions"

    type SuggestionsState = {
        suggestions: Suggestion array
    }

    let loadAll () =
        Global.chrome.storage.local.get<SuggestionsState option> storageKey
        |> Promise.map (fun result ->
            result
            |> Option.map _.suggestions
            |> Option.defaultValue Array.empty<Suggestion>
        )

    let saveAll (suggestions: Suggestion array) =
        Global.chrome.storage.local.set { suggestions = suggestions }

module App =
    open Elmish

    type Model = {
        AllSuggestions: Suggestion array option
        SearchInput: string
        SearchOptions: Suggestion array
        SearchSuggest: string option
    }

    type Msg =
        | LoadSuggestions
        | SuggestionLoaded of Suggestion array
        | LoadSuggestionFailed of exn
        | AddSuggestion of Suggestion
        | SuggestionAdded
        | AddSuggestionFailed of exn
        | UpdateSearchInput of string

    let init () =
        {
            AllSuggestions = None
            SearchInput = ""
            SearchOptions = [||]
            SearchSuggest = None
        }, Cmd.ofMsg LoadSuggestions

    let update msg model =
        match msg with
        | LoadSuggestions ->
            let nextModel = { model with AllSuggestions = None }

            nextModel, Cmd.OfPromise.either (fun _ -> Storage.loadAll()) () SuggestionLoaded LoadSuggestionFailed

        | SuggestionLoaded suggestions ->
            let nextModel = { model with AllSuggestions = Some suggestions }

            nextModel, Cmd.none

        | AddSuggestion suggestion ->
            let allSuggestions =
                model.AllSuggestions
                |> Option.defaultValue [||]
                |> fun existingSuggestions ->
                    Array.append existingSuggestions [| suggestion |]

            let nextModel = { model with AllSuggestions = Some allSuggestions }

            nextModel, Cmd.OfPromise.either Storage.saveAll allSuggestions (fun _ -> SuggestionAdded) AddSuggestionFailed

        | SuggestionAdded ->
            model, Cmd.none

        | UpdateSearchInput value ->
            let nextModel = { model with SearchInput = value }

            nextModel, Cmd.none

        | AddSuggestionFailed _exn ->
            model, Cmd.none

        | LoadSuggestionFailed _exn ->
            model, Cmd.none

module View =
    open Lit
    open Lit.Elmish
    open Browser.Types

    [<LitElement("index-page")>]
    let IndexPage() =
        let _ =
            LitElement.init(fun config  ->
                config.useShadowDom <- false
            )
        let model, dispatch = Hook.useElmish(App.init, App.update)

        let getSuggestionTemplate (suggestion: Suggestion) =
            html $"""<li>{suggestion.Link}</li>"""

        match model.AllSuggestions with
        | None -> html $"<div>Loading</div>"
        | Some suggestions ->
            html
                $"""
                    <ul>{suggestions |> Lit.mapUnique _.Link getSuggestionTemplate }</ul>
                """

    [<LitElement("options-page")>]
    let OptionsPage() =
        let _ =
            LitElement.init(fun config  ->
                config.useShadowDom <- false
            )

        let model, dispatch = Hook.useElmish(App.init, App.update)
        let inputRef = Hook.useRef<HTMLInputElement>()

        let addSuggestion _ =
            match inputRef.Value with
            | None -> ()
            | Some input ->
                let value = input.value
                input.value <- ""
                match value.Trim() with
                | "" -> ()
                | v ->
                    App.AddSuggestion { Link = v; Tags = [||] }
                    |> dispatch

        let getSuggestionTemplate (suggestion: Suggestion) =
            html $"""<li>{suggestion.Link}</li>"""

        match model.AllSuggestions with
        | None -> html $"<div>Loading</div>"
        | Some suggestions ->
            html
                $"""
                    <div>
                        <input type="text" {Lit.refValue inputRef}>
                        <button @click={Ev addSuggestion}>Ajouter</button>
                    </div>
                    <ul>{suggestions |> Lit.mapUnique _.Link getSuggestionTemplate }</ul>
                """

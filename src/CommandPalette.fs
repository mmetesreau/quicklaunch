module CommandPalette.View

open Feliz
open Fable.Core.JsInterop

open Shared

importAll "./css/main.css"

type Url = { Name: string }

[<ReactComponent>]
let Suggestion (url: Url) : ReactElement = Html.div [ Html.text url.Name ]

[<ReactComponent>]
let Suggestions (urls: Url list) (search: string Option) : ReactElement =
    match search with
    | None -> Html.div []
    | Some search ->
        urls
        |> List.filter (fun x -> x.Name.Contains(search))
        |> List.map Suggestion
        |> Html.div

[<ReactComponent>]
let CommandPalette () =
    let (search, setSearch) = React.useState<string Option> (None)
    let data = [ { Name = "aaaaa" }; { Name = "baaa" } ]

    Html.div [ prop.className "app-container mx-auto p-2"
               prop.children [ Html.div [ prop.className "flex flex-col"
                                          prop.children [ Html.input [ prop.className "py-2 px-3"
                                                                       prop.value (defaultArg search "")
                                                                       prop.onChange (fun x -> setSearch (Some x))
                                                                       prop.type'.text
                                                                       prop.autoFocus true ] ] ]
                               Suggestions data search ] ]

open Browser.Dom

#if DEBUG
HotReload.connect()
#endif

ReactDOM.render (CommandPalette(), document.getElementById "app")

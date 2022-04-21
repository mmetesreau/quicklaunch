module Options.View

open Feliz
open Fable.Core.JsInterop

importAll "./css/main.css"

[<ReactComponent>]
let Counter () =
    let (count, setCount) = React.useState (0)
    Html.div [ Html.button [ prop.style [ style.marginRight 5 ]
                             prop.onClick (fun _ -> setCount (count + 1))
                             prop.text "Increment" ]

               Html.button [ prop.style [ style.marginLeft 5 ]
                             prop.onClick (fun _ -> setCount (count - 1))
                             prop.text "Decrement" ]

               Html.button [ prop.className "bg-blue-500 h-10 w-20 rounded text-gray-50"
                             prop.onClick (fun _ -> setCount (count - 1))
                             prop.text "Decrement" ]

               Html.h1 [ 
                        prop.classes [ 
                            "text-xl"
                        ] 
                        prop.text count ] 
               Fable.FontAwesome.Fa.i [ Fable.FontAwesome.Free.Fa.Solid.Star ] [ ]
    ]

open Browser.Dom

ReactDOM.render (Counter(), document.getElementById "app")

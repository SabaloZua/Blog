
const easyMDEComentatio = new EasyMDE(
    {element: document.getElementById('response'),
   toolbar: [
            
            {
                name: "bold",
                action: EasyMDE.toggleBold,
                className: "fa fa-bold",
                title: "Negrito",
            },

            "|",
            {
                name: "italic",
                action: EasyMDE.toggleItalic,
                className: "fa fa-italic",
                title: "Italico",
            },
            
            "|",
            {
                name: "quote",
                action: EasyMDE.toggleBlockquote,
                className: "fa fa-quote-left",
                title: "Citação",
            },

            "|",
            {
                        name: "link",
                        action: EasyMDE.drawLink,
                        className: "fa fa-link",
                        title: "Link",
            },
            "|",
            {
                        name: "ordered-list",
                        action: EasyMDE.toggleOrderedList,
                        className: "fa fa-list-ol",
                        title: "Lista Ordenada",
            },
            "|",
            {
                        name: "unordered-list",
                        action: EasyMDE.toggleUnorderedList,
                        className: "fa fa-list-ul",
                        title: "Lista não Ordenada",
            },

            "|",
    
            {
                        name: "code",
                        action: EasyMDE.toggleCodeBlock,
                        className: "fa fa-code",
                        title: "Codigo",
            },
            "|",
            {
                        name: "preview",
                        action: EasyMDE.togglePreview,
                        className: "fa fa-eye no-disable",
                        title: "pre-visualizar",
            },

        // [, ...]
    ],
    placeholder: "Digite seu Comentário Aqui",
    styleSelectedText: false,
    sideBySideFullscreen: false,
    NativeSpellcheck:false,
    autoDownloadFontAwesome:true,
    spellChecker:false
   
}
);


const easyMDE = new EasyMDE(
    {element: document.getElementById('corpoP'),
   toolbar: [{
                name: "heading",
                action: EasyMDE.toggleHeadingSmaller,
                className: "fa fa-header",
                title: "Headers",
                children:[
                    {
                        name: "heading-2",
                        action: EasyMDE.toggleHeading2,
                        className: "fa fa-header header-2",
                        title: "Titulo 2",
                    },
                    {
                        name: "heading-3",
                        action: EasyMDE.toggleHeading3,
                        className: "fa fa-header header-3",
                        title: "Titulo 3",
                    },
                ]
            },
            "|",
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
                        name:"upload-image",
                        action:EasyMDE.drawUploadedImage,
                        className:"fa fa-image",
                        title: "enviar imagem"
                       
                        
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
                        name: "side-by-side",
                        action: EasyMDE.toggleSideBySide,
                        className: "fa fa-columns no-disable no-mobile",
                        title: "Dividir tela",
            }

        // [, ...]
    ],
    imageAccept: 'image/jpeg,image/png,image/jpg,image/gif',
    imageUploadFunction:
        (file, onSuccess, onError) => {
            var formData = new FormData();
            formData.append('image', file);
    const maxSize = 1 * 1024 * 1024; // 1 MB
    if (file.size > maxSize) {
      onError('O arquivo é muito grande. Por favor, selecione uma imagem com menos de 1 MB.');
      return;
    }

            fetch('/postagens/upload', {
                method: 'POST',
                body: formData
            })
            .then(result => result.json())
            .then(result => {
                onSuccess(result.filepath);
            })
            .catch(error => {
                onError("An error occurred: " + error.message);
            });
        },
        uploadImage:true,
        
    placeholder: "Digite aqui a sua  publicação",
    // styleSelectedText: false,
    sideBySideFullscreen: false,
    NativeSpellcheck:false,
    autoDownloadFontAwesome:true,
    spellChecker:false
}
);


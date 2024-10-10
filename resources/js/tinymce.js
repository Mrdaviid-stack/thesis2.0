import axios from "axios"

tinymce.init({
    selector: '#editor',
    license_key: 'awa70o85dsvanz62tuz4f8l7u3xtw3vt8dqtjjr5yjf4rgdu',
    menubar: "file edit view insert format tools table help",
    plugins: 'advlist autolink lists link image charmap preview anchor searchreplace visualblocks code fullscreen insertdatetime media table code help wordcount',
    toolbar: 'undo redo | formatselect | bold italic backcolor | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | removeformat | help | bootstrapLayout',
    toolbar_sticky: true,
    relative_urls: false,
    remove_script_host: true,
    convert_urls: true,
    automatic_uploads: true,
    images_upload_handler: async (blobInfo) => new Promise((resolve, reject) => {
        const formData = new FormData()
        formData.append('image', blobInfo.blob(), blobInfo.filename())
        axios.post('/files/tinymce/uploads', formData)
            .then((response) => {
                resolve(response.data.location)
            })
            .catch((error) => {
                console.error(error)
                reject(error)
            })
    }),
    setup: function (editor) {
        var toggle = false;
        editor.ui.registry.addMenuButton(
            "bootstrapLayout",
            {
                text: "Layout",
                fetch: function (cb) {
                    var items = [
                        {
                            type: "menuitem",
                            text: "(col-6 | 2)",
                            onAction: function () {
                                toggle = !toggle;
                                editor.insertContent(
                                    `<p><div class="row"><div class="col border_dashed"><p>col-6</p></div><div class="col border_dashed"><p>col-6</p></div></div></p>`,
                                );
                            },
                        },
                        {
                            type: "menuitem",
                            text: "(col-4 | 3)",
                            onAction: function () {
                                toggle = !toggle;
                                editor.insertContent(
                                    '<p><div class="row"><div class="col border_dashed">col-4</div><div class="col border_dashed">col-4</div><div class="col border_dashed">col-4</div></div></p>',
                                );
                            },
                        },
                        {
                            type: "menuitem",
                            text: "(col-3 | 4)",
                            onAction: function () {
                                toggle = !toggle;
                                editor.insertContent(
                                    '<p><div class="row"><div class="col border_dashed">col-3</div><div class="col border_dashed">col-3</div><div class="col border_dashed">col-3</div><div class="col border_dashed">col-3</div></div></p>',
                                );
                            },
                        },
                        {
                            type: "menuitem",
                            text: "(col-2 | 6)",
                            onAction: function () {
                                toggle = !toggle;
                                editor.insertContent(
                                    '<p><div class="row"><div class="col border_dashed">col-2</div><div class="col border_dashed">col-2</div><div class="col border_dashed">col-2</div><div class="col border_dashed">col-2</div><div class="col border_dashed">col-2</div></div></p>',
                                );
                            },
                        },
                        {
                            type: "menuitem",
                            text: "(col-1 | 12)",
                            onAction: function () {
                                toggle = !toggle;
                                editor.insertContent(
                                    '<p><div class="row"><div class="col border_dashed">col-1</div><div class="col border_dashed">col-1</div><div class="col border_dashed">col-1</div><div class="col border_dashed">col-1</div><div class="col border_dashed">col-1</div><div class="col border_dashed">col-1</div></div></p>',
                                );
                            },
                        },
                    ];
                    cb(items);
                },
            },
        );
    },
    content_css: [
        "https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css",
    ],
    content_style:
        "body { font-family:Helvetica,Arial,sans-serif; font-size:14px; padding: 10px; } .border_dashed { border: 1px solid black!important; border-style: dashed!important; } ",
})


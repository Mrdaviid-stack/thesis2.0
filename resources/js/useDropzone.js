import Dropzone from "dropzone"
Dropzone.autoDiscover = false

export default function useDropzone(dropzoneClass, cb) {

    const dropzone = new Dropzone(`${dropzoneClass}`, {
        url: "/cms/files/uploads",
        paramName: 'image',
        headers: {'X-CSRF-TOKEN': document.querySelector('input[name="_csrf"]').value},
        dictDefaultMessage: 'Drop files here or click to upload.',
        uploadMultiple: true,
        parallelUploads: 10,
        maxfiles: 1,
        acceptedfiles: 'image/*',
        addRemoveLinks: true,
    });

    dropzone.on('success', (file, response) => {
        cb(response.location);
    });

    return dropzone;
    
}
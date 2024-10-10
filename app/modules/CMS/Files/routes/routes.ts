import router from "@adonisjs/core/services/router";
import { middleware } from "#start/kernel";
import UploadsController from "../controllers/uploads_controller.js";

export default function FileRoutes() {
    router.group(() => {
        
        router.post('/tinymce/uploads', [UploadsController, 'tinymceUpload']).as('files.upload')

    }).prefix("files").use(middleware.auth());
}
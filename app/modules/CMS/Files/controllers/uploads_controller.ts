import { cuid } from '@adonisjs/core/helpers'
import type { HttpContext } from '@adonisjs/core/http'
import app from '@adonisjs/core/services/app'

export default class UploadsController {
    async tinymceUpload({ request, response }: HttpContext) {
        const image = request.file('image')
        if(image) {
            const date = new Date()
            await image.move(app.makePath(`public/uploads/${date.getFullYear()}/${date.getMonth()}/${date.getDate()}/`), {
                name: `${cuid()}.${image.extname}`
            })
        }

        return response.status(200).json({
            location: `/uploads/${image?.filePath?.split('\\').slice(-4).join('/')}`
        })
    }
}
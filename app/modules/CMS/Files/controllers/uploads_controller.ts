import { cuid } from '@adonisjs/core/helpers'
import type { HttpContext } from '@adonisjs/core/http'
import app from '@adonisjs/core/services/app'

export default class UploadsController {
    async uploads({ request, response }: HttpContext) {
        const image = request.file('image')
        if(image) {
            const date = new Date()
            await image.move(app.makePath(`public/uploads/${date.getFullYear()}/${date.getMonth()}/${date.getDate()}/`), {
                name: `${cuid()}.${image.extname}`
            })
        }

        const index = image?.filePath?.indexOf('uploads/')
        const extractedPath = image?.filePath?.slice(index)
        console.log(extractedPath, 'image path')
        //default -4
        return response.status(200).json({
            location: `${extractedPath}`
        })
    }
}
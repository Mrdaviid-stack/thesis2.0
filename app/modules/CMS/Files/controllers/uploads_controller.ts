import { cuid } from '@adonisjs/core/helpers'
import type { HttpContext } from '@adonisjs/core/http'
import app from '@adonisjs/core/services/app'
import historyService from '../../Reports/services/historyServices.js'

export default class UploadsController {
  async uploads({ request, response, auth }: HttpContext) {
    const image = request.file('image')
    if (image) {
      const date = new Date()
      await image.move(
        app.makePath(`public/uploads/${date.getFullYear()}/${date.getMonth()}/${date.getDate()}/`),
        {
          name: `${cuid()}.${image.extname}`,
        }
      )
    }

    // console.log(image?.filePath)
    // const index = image?.filePath?.indexOf('uploads\\')
    // const extractedPath = image?.filePath?.slice(index)
    // //console.log(/uploads/${image?.filePath?.split('\\').slice(-4).join('/'), 'image path')
    // //default -4
    // //const path = `/uploads/${image?.filePath?.split('\\').slice(-4).join('/')}`
    // console.log(image?.filePath)

    const basePath = '/opt/render/project/src/build/public'
    const relativePath = image?.filePath?.replace(basePath, '')
    console.log(relativePath)
    await historyService(auth.user?.firstname!, `Upload File`)
    return response.status(200).json({
      //location: `\\${extractedPath}`
      location: `${relativePath}`,
    })
  }
}

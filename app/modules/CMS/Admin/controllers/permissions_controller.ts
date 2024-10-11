import type { HttpContext } from '@adonisjs/core/http'
import Permission from '../models/permission.js'
import Group from '../models/group.js'
import _ from 'lodash'

export default class PermissionsController {
    async form({view, params}: HttpContext) {
        const permissions = await Permission.all();
        const group = await Group.findOrFail(params.id)

        const groupPermissions = await group.related('permissions').query()

        const sync_permissions = permissions.map(permission => ({
            id: permission.id, 
            name: permission.name,
            description: permission.description,
            isChecked: groupPermissions.find(groupPermission => groupPermission.id === permission.id)?.id ? 'checked' : ''
        }))

        return view.render('pages/cms/admin/permissions/permissions_form', {
            permissions: _.groupBy(sync_permissions, item => item.name.split('-')[1]),
            groupId:group.id
        })
    }

    async store({ request, response, params }: HttpContext) {
        let { permissions } = request.body()
        const group = await Group.findOrFail(params.id)

        permissions = Array.isArray(permissions) ? permissions 
            : (typeof permissions === 'undefined') ? [] 
            : [permissions]

        await group.related('permissions').sync(
            permissions.map((permission: string) => parseInt(permission))
        )

        return response.status(200).json({ message: 'Permissions updated successfully!' })
    }
}
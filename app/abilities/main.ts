/*
|--------------------------------------------------------------------------
| Bouncer abilities
|--------------------------------------------------------------------------
|
| You may export multiple abilities from this file and pre-register them
| when creating the Bouncer instance.
|
| Pre-registered policies and abilities can be referenced as a string by their
| name. Also they are must if want to perform authorization inside Edge
| templates.
|
*/

import { Bouncer } from '@adonisjs/bouncer'
import User from '../modules/CMS/Admin/models/user.js'

/**
 * Delete the following ability to start from
 * scratch
 */
export const hasAccess = Bouncer.ability(async (user: User, permissions: string) => {
  const group = await user.related('groups').query()
  const group_permissions = await group[0].related('permissions').query()
  return group_permissions.some(permission => permission.name.includes(permissions))
})
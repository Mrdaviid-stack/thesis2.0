import { BaseSeeder } from '@adonisjs/lucid/seeders'
import Group from '../../app/modules/CMS/Admin/models/group.js'
import Permission from '../../app/modules/CMS/Admin/models/permission.js'
import User from '../../app/modules/CMS/Admin/models/user.js'

export default class extends BaseSeeder {
  async run() {
    // Write your database queries inside the run method

    await Group.createMany([
      { name: 'Superadmin', description: 'Superuser' },
      { name: 'Admin', description: 'admin' },
    ])

    await Permission.createMany([
      //
      { name: 'dashboard-dashboard-view', description: 'dashboard view'},
      { name: 'websites-websites-view', description: 'website view'},
      { name: 'admin-admin-view', description: 'admin view'},
      //
      { name: 'websites-pages-view', description: 'pages view'},
      { name: 'websites-pages-index', description: 'pages index'},
      { name: 'websites-pages-add', description: 'pages add'},
      { name: 'websites-pages-edit', description: 'pages edit'},
      { name: 'websites-pages-delete', description: 'pages delete'},
      //
      { name: 'admin-groups-view', description: 'groups view'},
      { name: 'admin-groups-index', description: 'groups index'},
      { name: 'admin-groups-add', description: 'groups add'},
      { name: 'admin-groups-edit', description: 'groups edit'},
      { name: 'admin-groups-delete', description: 'groups delete'},
      //
      { name: 'admin-users-view', description: 'users view'},
      { name: 'admin-users-index', description: 'users index'},
      { name: 'admin-users-add', description: 'users add'},
      { name: 'admin-users-edit', description: 'users edit'},
      { name: 'admin-users-delete', description: 'users delete'},
      { name: 'admin-permissions-edit', description: 'permission edit'},
    ])

    await User.create({
      lastname: 'admin',
      firstname: 'super',
      email: 'superadmin@noreply.com',
      address: 'Admin Address',
      password: 'password1234'
    })

    const group = await Group.findBy('name','Superadmin')
    await group?.related('permissions').sync(Array.from({ length: 19}, (_, index) => index + 1))
    await group?.related('users').sync([1])
  }
}
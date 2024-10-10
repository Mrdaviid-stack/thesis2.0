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
      { name: 'dashboard-view', description: 'dashboard view'},
      { name: 'websites-view', description: 'website view'},
      { name: 'admin-view', description: 'admin view'},
      //
      { name: 'pages-view', description: 'pages view'},
      { name: 'pages-index', description: 'pages index'},
      { name: 'pages-add', description: 'pages add'},
      { name: 'pages-edit', description: 'pages edit'},
      { name: 'pages-delete', description: 'pages delete'},
      //
      { name: 'groups-view', description: 'groups view'},
      { name: 'groups-index', description: 'groups index'},
      { name: 'groups-add', description: 'groups add'},
      { name: 'groups-edit', description: 'groups edit'},
      { name: 'groups-delete', description: 'groups delete'},
      //
      { name: 'users-view', description: 'users view'},
      { name: 'users-index', description: 'users index'},
      { name: 'users-add', description: 'users add'},
      { name: 'users-edit', description: 'users edit'},
      { name: 'users-delete', description: 'users delete'},
      { name: 'permissions-edit', description: 'permission edit'},
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
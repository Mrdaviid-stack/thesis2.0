import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'pages'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').primary().notNullable()
      table.string('name').unique().notNullable()
      table.string('slug').unique().notNullable()
      table.string('content').notNullable()
      table.enu('status', ['publish', 'draft']).notNullable().defaultTo('publish')
      table.string('files')
      table.timestamp('created_at')
      table.timestamp('updated_at')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
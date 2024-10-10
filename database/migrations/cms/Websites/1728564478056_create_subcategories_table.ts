import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'subcategories'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
        .primary()
        .notNullable()
      table.integer('category_id')
        .unsigned()
        .references('id')
        .inTable('categories')
        .onUpdate('RESTRICT')
        .onDelete('CASCADE')
      table.string('name')
        .unique()
        .notNullable()
      table.string('slug')
        .unique()
        .notNullable()
      table.string('description')
      table.enu('status', ['active', 'inactive'])
      table.timestamp('created_at').notNullable()
      table.timestamp('updated_at').nullable()
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
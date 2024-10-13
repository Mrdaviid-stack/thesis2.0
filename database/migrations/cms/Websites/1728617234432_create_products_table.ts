import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'products'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
        .primary()
        .notNullable()
      table.integer('category_id')
        .unsigned()
        .references('id')
        .inTable('subcategories')
        .onUpdate('RESTRICT')
        .onDelete('CASCADE')
      table.integer('subcategory_id')
        .unsigned()
        .references('id')
        .inTable('subcategories')
        .onUpdate('RESTRICT')
        .onDelete('CASCADE')
      table.string('name').notNullable()
      table.string('model_number').unique().notNullable()
      table.string('slug')
      table.string('content')
      table.enu('status', ['publish','draft']).defaultTo('draft')
      table.timestamp('created_at').notNullable()
      table.timestamp('updated_at').nullable()
      table.timestamp('deleted_at').nullable()
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
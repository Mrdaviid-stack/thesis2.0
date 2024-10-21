import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'product_variants'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
        .primary()
        .notNullable()
      table.integer('product_id')
        .unsigned()
        .references('id')
        .inTable('products')
        .onUpdate('RESTRICT')
        .onDelete('CASCADE')
      table.text('feature').notNullable()
      table.string('storage').nullable()
      table.string('color').notNullable()
      table.string('stock').notNullable()
      table.string('image').notNullable()
      table.string('sku').unique().notNullable()
      table.float('price').notNullable()
      table.timestamp('created_at').notNullable()
      table.timestamp('updated_at').nullable()
      table.timestamp('deleted_at').nullable()
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
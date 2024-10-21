import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'order_items'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
        .primary()
        .notNullable()
      table.integer('order_id')
        .unsigned()
        .references('id')
        .inTable('orders')
        .onUpdate('RESTRICT')
        .onDelete('CASCADE')
      table.integer('product_variant_id')
        .unsigned()
        .references('id')
        .inTable('product_variants')
        .onUpdate('RESTRICT')
        .onDelete('CASCADE')
      table.integer('quantity')
      table.float('price')
      table.timestamp('created_at').notNullable()
      table.timestamp('updated_at').nullable()
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
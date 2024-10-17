import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'cart_items'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
        .primary()
        .notNullable()
      table.integer('cart_id')
        .unsigned()
        .references('id')
        .inTable('carts')
        .onUpdate('RESTRICT')
        .onDelete('CASCADE')
      table.integer('product_variant_id')
        .unsigned()
        .references('id')
        .inTable('product_variants')
        .onUpdate('RESTRICT')
        .onDelete('CASCADE')
      table.integer('quantity').defaultTo(1)
      table.timestamp('created_at').notNullable()
      table.timestamp('updated_at').nullable()
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'product_variant_images'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
        .primary()
        .notNullable()
      table.integer('product_variant_id')
        .unsigned()
        .references('id')
        .inTable('product_variants')
        .onUpdate('RESTRICT')
        .onDelete('CASCADE')
      table.string('product_variant_image_url')
      table.integer('product_variant_image_count')
      table.timestamp('created_at').notNullable()
      table.timestamp('updated_at').nullable()
      table.timestamp('deleted_at').nullable()
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
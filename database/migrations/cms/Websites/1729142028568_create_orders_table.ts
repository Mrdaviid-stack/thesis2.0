import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'orders'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
        .primary()
        .notNullable()
      table.integer('user_id')
        .unsigned()
        .references('id')
        .inTable('users')
        .onUpdate('RESTRICT')
        .onDelete('CASCADE')
      table.string('first_name').nullable()
      table.string('last_name').nullable()
      table.string('address').nullable()
      table.string('city').nullable()
      table.string('phone').nullable()
      table.string('email').nullable()
      table.text('note').nullable()
      table.timestamp('created_at').notNullable()
      table.timestamp('updated_at').nullable()
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
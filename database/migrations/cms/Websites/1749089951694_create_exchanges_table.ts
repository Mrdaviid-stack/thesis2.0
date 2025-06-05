import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'exchanges'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').primary().notNullable()
      table.integer('transaction_id')
        .unsigned()
        .references('id')
        .inTable('transactions')
        .onUpdate('RESTRICT')
        .onDelete('CASCADE')
      table.enu('reason', ['Faulty Camera', 'Software Glitching / Bug', 'Wrong Item', 'Damaged Item', 'Other']).defaultTo('Damaged Item')
      table.string('proof').nullable()
      table.string('description').nullable()
      table.timestamp('created_at')
      table.timestamp('updated_at')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
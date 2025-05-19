import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'transactions'

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
      table.string('invoice')
      table.string('reference')
      table.float('downpayment')
      table.float('total_amount')
      table.enu('payment_method', ['cod','gcash','paymaya','cash','card','paypal']).defaultTo('cod')
      table.enu('delivery_status', ['pending','processing','to_ship', 'to_receive', 'received', 'delivered', 'returned']).defaultTo('pending')
      table.enu('order_type', ['online','onsite']).defaultTo('online')
      table.enu('status', ['request_cancel', 'cancelled', 'exchange', 'returned']).nullable()
      table.string('rider_name').nullable();
      table.timestamp('created_at').notNullable()
      table.timestamp('updated_at').nullable()
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
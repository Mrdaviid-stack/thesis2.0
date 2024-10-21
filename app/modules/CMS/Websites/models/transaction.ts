import { DateTime } from 'luxon'
import { BaseModel, belongsTo, column } from '@adonisjs/lucid/orm'
import Order from './order.js'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'

export default class Transaction extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare orderId: number

  @column()
  declare invoice: string

  @column()
  declare totalAmount: string

  @column()
  declare reference: string

  @column()
  declare downpayment: number

  @column()
  declare paymentMethod: 'cod' | 'gcash' | 'paymaya' | 'cash' | 'card'

  @column()
  declare deliveryStatus: 'pending' | 'processing' | 'in_transit' | 'delivered' | 'returned'

  @column()
  declare orderType: 'online' | 'onsite'

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime | null

  @belongsTo(() => Order)
  declare order: BelongsTo<typeof Order>
}
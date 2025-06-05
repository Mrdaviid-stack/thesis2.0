import { DateTime } from 'luxon'
import { BaseModel, column } from '@adonisjs/lucid/orm'

export default class Exchange extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare transactionId: number | string

  @column()   
  declare reason: 'Faulty Camera' | 'Software Glitching / Bug' | 'Wrong Item' | 'Damaged Item' | 'Other'

  @column()
  declare proof: string | null

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime
}
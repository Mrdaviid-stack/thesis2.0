import { DateTime } from 'luxon'
import { BaseModel, beforeSave, belongsTo, column } from '@adonisjs/lucid/orm'
import string from '@adonisjs/core/helpers/string'
import Category from './category.js'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'

export default class Subcategory extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare categoryId: string

  @column()
  declare name: string

  @column()
  declare slug: string

  @column()
  declare description: string | null

  @column()
  declare status: 'active' | 'inactive'

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  @belongsTo(() => Category)
  declare category: BelongsTo<typeof Category>

  @beforeSave()
  static async slugifyName(subcategory: Subcategory) {
    if (subcategory.name) {
      subcategory.slug = string.slug(subcategory.name, { lower: true })
    }
  }
}
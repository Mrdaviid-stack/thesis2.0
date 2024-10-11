import { DateTime } from 'luxon'
import { BaseModel, beforeSave, column, hasMany } from '@adonisjs/lucid/orm'
import string from '@adonisjs/core/helpers/string'
import Subcategory from './subcategory.js'
import type { HasMany } from '@adonisjs/lucid/types/relations'

export default class Category extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare name: string

  @column()
  declare slug: string

  @column()
  declare description: string

  @column()
  declare status: 'active' | 'inactive'

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  @hasMany(() => Subcategory)
  declare subcategories: HasMany<typeof Subcategory>

  @beforeSave()
  static async slugifyName(category: Category) {
    if (category.name) {
      category.slug = string.slug(category.name, { lower: true })
    }
  }
}
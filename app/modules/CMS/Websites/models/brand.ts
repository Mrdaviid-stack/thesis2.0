import { DateTime } from 'luxon'
import { BaseModel, beforeSave, column, hasMany } from '@adonisjs/lucid/orm'
import Product from './product.js'
import type { HasMany } from '@adonisjs/lucid/types/relations'
import string from '@adonisjs/core/helpers/string'

export default class Brand extends BaseModel {
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
  declare updatedAt: DateTime | null

  @column.dateTime()
  declare deletedAt: DateTime | null

  @hasMany(() => Product)
  declare products: HasMany<typeof Product>

  @beforeSave()
  static async slugifyName(brand: Brand) {
    if (brand.name) {
      brand.slug = string.slug(brand.name, { lower: true })
    }
  }
}

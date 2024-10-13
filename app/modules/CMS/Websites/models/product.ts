import { DateTime } from 'luxon'
import { BaseModel, beforeSave, belongsTo, column, hasMany } from '@adonisjs/lucid/orm'
import string from '@adonisjs/core/helpers/string'
import Subcategory from './subcategory.js'
import type { BelongsTo, HasMany } from '@adonisjs/lucid/types/relations'
import ProductVariant from './product_variant.js'
import Category from './category.js'

export default class Product extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare categoryId: number

  @column()
  declare subcategoryId: number

  @column()
  declare name: string

  @column()
  declare modelNumber: string

  @column()
  declare slug: string

  @column()
  declare content: string

  @column()
  declare status: 'publish' | 'draft'

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime | null

  @column.dateTime()
  declare deletedAt: DateTime | null

  @belongsTo(() => Category)
  declare category: BelongsTo<typeof Category>

  @belongsTo(() => Subcategory)
  declare subcategory: BelongsTo<typeof Subcategory>

  @hasMany(() => ProductVariant)
  declare productVariants: HasMany<typeof ProductVariant>

  @beforeSave()
  static async slugifyName(product: Product) {
    if (product.name) {
      product.slug = string.slug(product.name, { lower: true })
    }
  }
}
import { DateTime } from 'luxon'
import { BaseModel, beforeSave, belongsTo, column, hasMany } from '@adonisjs/lucid/orm'
import string from '@adonisjs/core/helpers/string'
import type { BelongsTo, HasMany } from '@adonisjs/lucid/types/relations'
import ProductVariant from './product_variant.js'
import Category from './category.js'
import Brand from './brand.js'

export default class Product extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare categoryId: number

  @column()
  declare brandId: number

  @column()
  declare name: string

  @column()
  declare modelNumber: string

  @column()
  declare slug: string

  @column()
  declare content: string

  @column()
  declare sale: number

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

  @belongsTo(() => Brand)
  declare subcategory: BelongsTo<typeof Brand>

  @hasMany(() => ProductVariant)
  declare productVariants: HasMany<typeof ProductVariant>

  @beforeSave()
  static async slugifyName(product: Product) {
    if (product.name) {
      product.slug = string.slug(product.name, { lower: true })
    }
  }
}
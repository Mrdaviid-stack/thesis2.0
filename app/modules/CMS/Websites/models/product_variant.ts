import { DateTime } from 'luxon'
import { BaseModel, belongsTo, column, hasMany } from '@adonisjs/lucid/orm'
import Product from './product.js'
import type { BelongsTo, HasMany } from '@adonisjs/lucid/types/relations'
import ProductVariantImage from './product_variant_image.js'

export default class ProductVariant extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare productId: number

  @column()
  declare feature: string

  @column()
  declare storage: string | null

  @column()
  declare color: string

  @column()
  declare stock: string

  @column()
  declare image: string
  
  @column()
  declare sku: string

  @column()
  declare price: number

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime | null

  @column.dateTime()
  declare deletedAt: DateTime | null

  @belongsTo(() => Product)
  declare product: BelongsTo<typeof Product>

  @hasMany(() => ProductVariantImage)
  declare productVariantImages: HasMany<typeof ProductVariantImage>

}
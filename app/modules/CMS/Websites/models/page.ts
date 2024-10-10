import { DateTime } from 'luxon'
import { BaseModel, beforeSave, column } from '@adonisjs/lucid/orm'
import string from '@adonisjs/core/helpers/string'

export default class Page extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare name: string

  @column()
  declare slug: string

  @column()
  declare content: string

  @column()
  declare status: 'publish' | 'draft'

  @column()
  declare files: string

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  @beforeSave()
  static async slugifyName(page: Page) {
    if (page.name) {
      page.slug = string.slug(page.name, { lower: true})
    }
  }
}
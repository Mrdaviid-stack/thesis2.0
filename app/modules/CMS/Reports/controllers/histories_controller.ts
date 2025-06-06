import type { HttpContext } from '@adonisjs/core/http'
import historyService from '../services/historyServices.js'
import History from '../../Websites/models/history.js'
import moment from 'moment'

export default class HistoriesController {
    async index({ view }: HttpContext) {
        //await historyService(auth.user?.firstname!, `View History Reports Page`)
        return view.render('pages/cms/reports/history/history_index')
    }
    async generate({ request, response, auth }: HttpContext) {

        let { start, end } = request.qs()

        const query = await History.query()
            .select('*')
            .whereBetween('created_at', [`${start} 00:00:00`, `${end} 23:59:59`])


        const histories = query.map((history) => ({
            user: history.user,
            action: history.action,
            date:  moment.parseZone(history.createdAt.toISO()).utcOffset(8).format("dddd, MMMM Do YYYY, h:mm:ss a")
        }))

        await historyService(auth.user?.firstname!, `Generate History log`)
        return response.status(200).json({data: histories})
    }
}
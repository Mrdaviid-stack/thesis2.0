import History from "../../Websites/models/history.js";


export default async function historyService(user: string, action: string) {
    const data = {
        user: user,
        action: action,
    }
    const history = await History.create(data)
    return history;
}
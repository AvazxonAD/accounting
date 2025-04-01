const { PodrazdelenieDB } = require('./db');
const { tashkentTime } = require('@helper/functions');

exports.PodrazdelenieService = class {
    static async createPodrazdelenie(data) {
        const result = await PodrazdelenieDB.createPodrazdelenie([
            data.user_id,
            data.name,
            tashkentTime(),
            tashkentTime()
        ]);
        return result;
    }
}
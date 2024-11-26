const { PodotchetDB } = require('../spravochnik/podotchet/db')
const { MainSchetDB } = require('../spravochnik/main.schet/db')

exports.PodotchetMonitoringService = class {
    static async getByIdPodotchetMonitoring(req, res) {
        const podotchet_id = req.params.id
        const { limit, page, main_schet_id, from, to, operatsii } = validationResponse(podotchetQueryValidation, req.query);
        const region_id = req.user.region_id;
        const offset = (page - 1) * limit;
        const podotchet = await PodotchetDB.getByIdPodotchet([region_id, podotchet_id])
        if (!podotchet) {
            return res.status(404).json({
                message: "podotchet not found"
            })
        }
        const main_schet = await MainSchetDB.getByIdMainSchet([region_id, main_schet_id]);
        if(!main_schet){
            return res.status(404).json({
                message: "main schet not found"
            })
        }
        
        const { total, summa_prixod, summa_rasxod, data, summa_from, summa_to } = await getByIdPodotchetMonitoringService(
            region_id,
            main_schet_id,
            offset,
            limit,
            from,
            to,
            podotchet_id,
            operatsii
        );
        const pageCount = Math.ceil(total / limit);
        const meta = {
            pageCount: pageCount,
            count: total,
            currentPage: page,
            nextPage: page >= pageCount ? null : page + 1,
            backPage: page === 1 ? null : page - 1,
            summa_from,
            summa_to,
            summa_prixod,
            summa_rasxod
        }
    }
}
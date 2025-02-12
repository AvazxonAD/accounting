const { PodrazdelenieDB } = require('../podrazdelenie/db');
const { ResponsibleDB } = require('./db');
const { tashkentTime } = require('@helper/functions');
const { ResponsibleService } = require('./service');
const { ResponsibleSchema } = require('./schema');

exports.Controller = class {
    static async import(req, res) {
        const user_id = req.user.id;
        const filePath = req.file.path;
        const region_id = req.user.region_id;

        const data = await ResponsibleService.readFile({ filePath });

        const { error, value } = ResponsibleSchema.importData(req.i18n).validate(data);
        if (error) {
            return res.error(error.details[0].message, 400);
        }

        for (let doc of value) {
            const responsible = await ResponsibleService.getByFio({ region_id, fio: doc.fio });
            if (responsible) {
                return res.error(req.i18n.t(`responsibleExists`, { data: doc.fio }), 404);
            }
        }

        await ResponsibleService.import({ responsibles: value, user_id });

        return res.success(req.i18n.t('createSuccess'), 201);
    }

    static async template(req, res) {
        const { fileName, fileRes } = await ResponsibleService.templateFile();

        res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        res.setHeader('Content-Disposition', `attachment; filename="${fileName}"`);
        return res.send(fileRes);
    }

    static async createResponsible(req, res) {
        const { id: user_id, region_id } = req.user
        const { spravochnik_podrazdelenie_jur7_id, fio } = req.body;

        const podrazdelenie = await PodrazdelenieDB.getByIdPodrazdelenie([region_id, spravochnik_podrazdelenie_jur7_id])
        if (!podrazdelenie) {
            return res.status(404).json({
                message: "podrazdelenie not found"
            })
        }

        const result = await ResponsibleDB.createResponsible([
            spravochnik_podrazdelenie_jur7_id,
            fio,
            user_id,
            tashkentTime(),
            tashkentTime()
        ]);

        return res.status(201).json({
            message: "Create responsible successfully",
            data: result
        })
    }

    static async getResponsible(req, res) {
        const region_id = req.user.region_id;
        const { page, limit, search, podraz_id, excel } = req.query;
        const offset = (page - 1) * limit;

        const { data, total } = await ResponsibleDB.getResponsible([region_id, offset, limit], search, podraz_id)

        if (podraz_id) {
            const podrazdelenie = await PodrazdelenieDB.getByIdPodrazdelenie([region_id, podraz_id])
            if (!podrazdelenie) {
                return res.status(404).json({
                    message: "podrazdelenie not found"
                })
            }
        }

        const pageCount = Math.ceil(total / limit);

        const meta = {
            pageCount: pageCount,
            count: total,
            currentPage: page,
            nextPage: page >= pageCount ? null : page + 1,
            backPage: page === 1 ? null : page - 1
        }

        if (excel === 'true') {
            const { fileName, filePath } = await ResponsibleService.export(data);

            res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
            res.setHeader('Content-Disposition', `attachment; filename="${fileName}"`);
            return res.sendFile(filePath);
        }

        return res.success(req.i18n.t('getSuccess'), 200, meta, data);
    }

    static async getById(req, res) {
        const region_id = req.user.region_id
        const id = req.params.id
        const data = await ResponsibleDB.getById([region_id, id], true)
        if (!data) {
            return res.status(404).json({
                message: "responsible not found"
            })
        }
        return res.status(201).json({
            message: "responsible successfully get",
            data
        });
    }

    static async updateResponsible(req, res) {
        const region_id = req.user.region_id
        const { spravochnik_podrazdelenie_jur7_id, fio } = req.body;
        const id = req.params.id
        const responsible = await ResponsibleDB.getById([region_id, id])
        if (!responsible) {
            return res.status(404).json({
                message: "responsible not found"
            })
        }
        const podrazdelenie = await PodrazdelenieDB.getByIdPodrazdelenie([region_id, spravochnik_podrazdelenie_jur7_id])
        if (!podrazdelenie) {
            return res.status(404).json({
                message: "podrazdelenie not found"
            })
        }
        const result = await ResponsibleDB.updateResponsible([
            fio,
            tashkentTime(),
            spravochnik_podrazdelenie_jur7_id,
            id
        ])
        return res.status(200).json({
            message: 'Update successful',
            data: result
        });
    }

    static async deleteResponsible(req, res) {
        const region_id = req.user.region_id
        const id = req.params.id
        const responsible = await ResponsibleDB.getById([region_id, id])
        if (!responsible) {
            return res.status(404).json({
                message: "responsible not found"
            })
        }
        await ResponsibleDB.deleteResponsible([id])
        return res.status(200).json({
            message: 'delete responsible successfully'
        })
    }

}
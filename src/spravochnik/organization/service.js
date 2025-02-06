const { OrganizationDB } = require('./db')
const { tashkentTime } = require('../../helper/functions')

exports.OrganizationService = class {
    static async getByInn(data) {
        const result = await OrganizationDB.getByInn([data.region_id, data.inn]);

        return result;
    }

    static async getByName(data) {
        const result = await OrganizationDB.getByName([data.region_id, data.name]);

        return result;
    }

    static async create(data) {
        const result = await OrganizationDB.create([
            data.name, data.bank_klient, data.raschet_schet,
            data.raschet_schet_gazna, data.mfo, data.inn, data.user_id,
            data.okonx, data.parent_id, tashkentTime(), tashkentTime()
        ]);

        return result;
    }

    static async get(data) {
        const result = await OrganizationDB.get(
            [data.region_id, data.offset, data.limit], data.search, data.organ_id
        );

        return result;
    }

    static async update(data) {
        const result = await OrganizationDB.update([
            data.name, data.bank_klient, data.raschet_schet,
            data.raschet_schet_gazna, data.mfo, data.inn, data.okonx,
            data.parent_id, data.id
        ]);

        return result;
    }

    static async delete(data) {
        const result = await OrganizationDB.delete([data.id]);

        return result;
    }

    static async getById(data) {
        const result = await OrganizationDB.getById([data.region_id, data.id], data.isdeleted);

        return result;
    }

    static async import(data) {
        
    }

    static async readFile(data) {
        const workbook = xlsx.readFile(data.filePath);
        const sheetName = workbook.SheetNames[3];
        const sheet = workbook.Sheets[sheetName];

        const result = xlsx.utils.sheet_to_json(sheet).map(row => {
            const newRow = {};

            for (const key in row) {
                if (Object.prototype.hasOwnProperty.call(row, key)) {
                    if (row < 4) {
                        continue
                    }
                    newRow[key] = row[key];
                }
            }

            return newRow;
        });

        return result;
    }
}



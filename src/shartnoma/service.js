const { ContractDB } = require('./db')

exports.ContractService = class {
    static async getContract(data) {
        const result = await ContractDB.getContract([
            data.region_id,
            data.budjet_id,
            data.offset,
            data.limit
        ], data.organ_id ? data.organ_id : null, (data.pudratchi !== null || data.pudratchi !== undefined) ? data.pudratchi : null, data.search ? data.search : null);
        return result;
    }

    static async getContractByOrganizations(data) {
        const result = await ContractDB.getContractByOrganizations([data.region_id], data.organ_id);
        return result;
    }

    static async getById(data) {
        const result = await ContractDB.getByIdContract([data.region_id, data.id]);
        
        return result;
    }
}
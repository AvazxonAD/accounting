const { SaldoDB } = require('@admin_saldo/db');

exports.SaldoService = class {
    static async getByResponsibles(data) {
        const month = new Date(data.to).getMonth() + 1;
        const year = new Date(data.to).getFullYear();

        for (let responsible of data.responsibles) {
            const products = await SaldoDB.get([year, month, 0, 99999], responsible.id, data.search, data.product_id, data.region_id);
            responsible.products = products.data;
            for (let product of responsible.products) {
                product.from = { kol: product.kol, sena: product.sena, summa: product.summa };

                product.internal = await SaldoDB.getKolAndSumma(
                    [product.naimenovanie_tovarov_jur7_id],
                    `${year}-${month < 10 ? `0${month}` : month}-01`,
                    data.to,
                    responsible.id
                );

                product.to = { kol: product.from.kol + product.internal.kol, summa: product.from.summa + product.internal.summa };
                product.to.sena = product.to.summa / product.to.kol;
            }

            responsible.products = responsible.products.filter(item => item.to.kol !== 0 && item.to.summa !== 0)
        }
        const result = await data.responsibles.filter(item => item.products.length !== 0);

        return result;
    }

    static async getByProduct(data) {
        const month = new Date(data.to).getMonth() + 1;
        const year = new Date(data.to).getFullYear();

        const { data: products, total } = await SaldoDB.get([year, month, data.offset, data.limit], data.responsible_id, data.search, data.product_id, data.region_id);
        for (let product of products) {
            product.from = { kol: product.kol, sena: product.sena, summa: product.summa };

            product.internal = await SaldoDB.getKolAndSumma(
                [product.naimenovanie_tovarov_jur7_id],
                `${year}-${month < 10 ? `0${month}` : month}-01`,
                data.to
            );

            product.to = { kol: product.from.kol + product.internal.kol, summa: product.from.summa + product.internal.summa };
            product.to.sena = product.to.summa / product.to.kol;
        }

        return { data: products, total }
    }
}

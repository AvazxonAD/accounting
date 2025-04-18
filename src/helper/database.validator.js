const ErrorResponse = require("@helper/error.response");
const { MainSchetService } = require(`@main_schet/service`);
const { BudjetService } = require(`@budjet/service`);
const { ResponsibleService } = require("@responsible/service");
const { GroupService } = require("@group/service");
const { ProductService } = require("@product/service");
const { OrganizationService } = require("@organization/service");
const { ContractService } = require("@contract/service");
const { AccountNumberService } = require("@account_number/service");

exports.ValidatorFunctions = class {
  static async responsibleJur7(data) {
    const responsible = await ResponsibleService.getById({
      region_id: data.region_id,
      id: data.responsible_id,
    });
    if (!responsible) {
      throw new ErrorResponse("responsibleNotFound", 404);
    }

    return responsible;
  }

  static async productJur7(data) {
    const product = await ProductService.getById({
      region_id: data.region_id,
      id: data.product_id,
    });
    if (!product) {
      throw new ErrorResponse("productNotFound", 404);
    }

    return product;
  }

  static async groupJur7(data) {
    const group = await GroupService.getById({ id: data.group_id });
    if (!group) {
      throw new ErrorResponse("groupNotFound", 404);
    }

    return group;
  }

  static async mainSchet(data) {
    const main_schet = await MainSchetService.getById({
      id: data.main_schet_id,
      region_id: data.region_id,
    });
    if (!main_schet) {
      throw new ErrorResponse("mainSchetNotFound", 404);
    }

    return main_schet;
  }

  static async budjet(data) {
    const budjet = await BudjetService.getById({ id: data.budjet_id });
    if (!budjet) {
      throw new ErrorResponse("budjetNotFound", 404);
    }

    return budjet;
  }

  static async organization(data) {
    const organization = await OrganizationService.getById({
      region_id: data.region_id,
      id: data.organ_id,
    });
    if (!organization) {
      throw new ErrorResponse("organizationNotFound", 404);
    }
  }

  static async contract(data) {
    const contract = await ContractService.getById({
      region_id: data.region_id,
      id: data.contract_id,
      organ_id: data.organ_id,
    });
    if (!contract) {
      throw new ErrorResponse("contractNotFound", 404);
    }
  }

  static async accountNumber(data) {
    const account_number = await AccountNumberService.getById({
      organ_id: data.organ_id,
      id: data.organ_account_id,
    });
    if (!account_number) {
      throw new ErrorResponse("contractNotFound", 404);
    }
  }
};

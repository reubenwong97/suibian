import Stall from "../models/stall.model";
import Sell from "../models/sell.model";
import { Json } from "sequelize/types/lib/utils";
import { any } from "bluebird";
// import { Sequelize } from "sequelize/types";
const { Op, Sequelize } = require("sequelize");
//

export async function getStallId(
  foodandvotesjson: string
): Promise<string | undefined> {
  let foodidarray = Object.keys(JSON.parse(foodandvotesjson));
  console.log(foodidarray);
  try {
    const stallidobject = await Sell.findAll({
      attributes: ["stallId"],
      where: {
        foodId: { [Op.in]: foodidarray }
      },
      raw: true
    });
    // contains sell entries that contain food people want
    return JSON.stringify(stallidobject);
  } catch (err) {
    console.log(err);
  }
}

export async function getPostalCode(hawkercenter: string) {
  try {
    const data = await Stall.findOne({
      attributes: ["postalcode"],
      where: {
        hawkercenter
      },
      raw: true
    });
    // console.log(Object.values(data)[0]);
    return data?.postalcode;
  } catch (err) {
    console.log(err);
  }
}

export async function getHawkerCenterStallName(foodandvotesjson: string) {
  const stallidsjson = await getStallId(foodandvotesjson);
  if (stallidsjson) {
    const stallidobject = JSON.parse(stallidsjson);
    const stallidarray = stallidobject.map((stallid: any) => {
      const stallidentry = Object.values(stallid);
      return stallidentry;
    });
    try {
      const hawkers = await Stall.findAll({
        attributes: [
          Sequelize.fn("DISTINCT", Sequelize.col("hawkercenter")),
          "hawkercenter",
          "stallname"
        ],
        where: {
          stallId: { [Op.in]: stallidarray }
        },
        // group: ["hawkercenter"],
        raw: true
      });

      // const hawkerobject = hawkers;
      let result: { [key: string]: string[] } = {};
      hawkers.forEach(object => {
        let key: string = Object.values(object)[0];
        result[key] = [];
      });
      hawkers.forEach(object => {
        let key: string = Object.values(object)[0];
        let value: string = Object.values(object)[1];
        result[key].push(value);
      });
      return JSON.stringify(result);
    } catch (err) {
      console.log(err);
    }
  }
}

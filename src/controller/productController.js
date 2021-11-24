const productModel = require("../model/productModel");

const createProduct = async function (req, res) {
  let product = req.body;
  let savedProduct = await productModel.create(product);
  res.send({ msg: savedProduct });
};
module.exports.createProduct=createProduct;
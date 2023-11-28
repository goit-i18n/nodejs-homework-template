const services = require("../services/index");

const get = async (req, res, next) => {
  try {
    const results = await services.getContacts();
    res.json({
      status: "Success",
      code: 200,
      data: results,
    });
  } catch (error) {
    res.status(404).json({
      status: "error",
      code: 404,
    });
    next(error);
  }
};

const getById = async (req, res, next) => {
  try {
    const { contactId } = req.params;
    const results = await services.getContactById(contactId);
    res.json({
      status: "Success",
      code: 200,
      data: results,
    });
  } catch (error) {
    res.status(404).json({
      status: "error",
      code: 404,
    });
    next(error);
  }
};

const create = async (req, res, next) => {
  try {
    const { name, email, phone, favorite = false } = req.body;
    const results = await services.createContact({
      name,
      email,
      phone,
      favorite,
    });
    res.json({
      status: "Success",
      code: 200,
      data: results,
    });
  } catch (error) {
    res.status(404).json({
      status: "error",
      code: 404,
    });
    next(error);
  }
};

const remove = async (req, res, next) => {
  try {
    const { contactId } = req.params;
    const results = await services.deleteContact(contactId);
    res.json({
      status: "Success",
      code: 200,
      data: results,
    });
  } catch (error) {
    res.status(404).json({
      status: "error",
      code: 404,
    });
    next(error);
  }
};

const change = async (req, res, next) => {
  try {
    const { contactId } = req.params;
    const { name, email, phone } = req.body;
    const results = await services.changeContact(contactId, {
      name,
      email,
      phone,
    });
    res.json({
      status: "Changed",
      code: 202,
      data: results,
    });
  } catch (error) {
    res.status(404).json({
      status: "error",
      code: 404,
    });
    next(error);
  }
};

const update = async (req, res, next) => {
  const { contactId } = req.params;
  const { favorite } = req.body;
  try {
    const result = await services.updateContact(contactId, { favorite });
    console.log(result);
    if (result) {
      res.status(200).json({
        status: "Updated",
        code: 200,
        data: result,
      });
    }
  } catch (error) {
    console.log(error);
    res.status(404).json({
      status: "error",
    });
  }
};

module.exports = {
  get,
  getById,
  create,
  remove,
  change,
  update,
};

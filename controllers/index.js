const {
  getAllContacts,
  getContactById,
  removeContact,
  createContact,
  updateContact,
  updateFavoriteContact,
} = require("../services/index");

const getAll = async (req, res, next) => {
  try {
    const results = await getAllContacts();
    res.json({
      status: "Succes",
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
  const { contactId } = req.params;
  try {
    const result = await getContactById(contactId);
    if (result) {
      res.json({
        status: "Success",
        code: 200,
        data: result,
      });
    }
  } catch (error) {
    res.error(404).json({
      status: "error",
      code: 404,
    });
    next(error);
  }
};

const remove = async (req, res, next) => {
  const { contactId } = req.params;
  try {
    const result = await removeContact(contactId);
    if (result) {
      res.json({
        status: "Success",
        code: 200,
        message: "Contact deleted",
      });
    }
  } catch (error) {
    res.status(404).json({
      status: "error",
      code: 404,
      message: "Not found",
    });
  }
};

const create = async (req, res, next) => {
  try {
    const { name, email, phone, favorite, age } = req.body;
    const result = await createContact({
      name,
      email,
      phone,
      favorite,
      age,
    });

    res.status(201).json({
      status: "succes",
      code: 201,
      data: result,
    });
    console.log();
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
  const { name, email, phone, age } = req.body;
  try {
    const result = await updateContact(contactId, { name, email, phone, age });
    if (result) {
      res.status(200).json({
        status: "Success",
        code: 200,
        data: result,
      });
    }
  } catch (error) {
    res.status(404).json({
      status: "error",
      code: 404,
    });
  }
};

const updateFavorite = async (req, res, next) => {
  const { contactId } = req.params;
  const { favorite } = req.body;
  try {
    const result = await updateFavoriteContact(contactId, { favorite });
    if (result) {
      res.status(200).json({
        status: "updated",
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
const uploadAvatarController = async (req, res, next) => {
  console.log("test");
  try {
    if (!req.file) {
      return res.status(404).json({ error: "Nu exista fisier de incarcat!" });
    }

    const image = await Jimp.read(req.file.path);
    await image.resize(250, 250).writeAsync(req.file.path);

    const uniqFilename = `${req.user._id}-${Date.now()}${path.extname(
      req.file.originalname
    )}`;

    const destinationPath = path.join(
      __dirname,
      `../public/avatars/${uniqFilename}`
    );

    fs.renameSync(req.file.path, destinationPath);

    req.user.avatarUrl = `/avatars/${uniqFilename}`;
    await req.user.save();

    res.status(200).json({ avatarUrl: req.user.avatarUrl });
  } catch (error) {
    res.status(404).json({ error: error.message });
    next(error);
  }
};
module.exports = {
  getAll,
  getById,
  remove,
  create,
  update,
  updateFavorite,
  uploadAvatarController,
};

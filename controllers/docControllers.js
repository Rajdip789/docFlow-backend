const documentModel = require("../models/documentModel");

const createDocController = async (req, res) => {
  try {
    const { content, title } = req.body;

    const newDoc = new documentModel({ content, title });

    await newDoc.save();

    return res.status(201).send({
      success: true,
      message: "Document created",
      newDoc,
    });
  } catch (error) {
    console.log(error);
    return res.status(400).send({
      success: false,
      message: "Error al crear el documento",
      error,
    });
  }
};

const renameDocController = async (req, res) => {
  try {
    const { id } = req.params;

    const doc = await documentModel.findByIdAndUpdate(
      id,
      { ...req.body },
      { new: true }
    );

    return res.status(200).send({
      success: true,
      message: "Document updated",
      doc,
    });
  } catch (error) {
    console.log(error);
    return res.status(400).send({
      success: false,
      message: "Error while updating documento",
      error,
    });
  }
};

const deleteDocController = async (req, res) => {
  try {
    const doc = await documentModel.findByIdAndDelete(req.params.id);

    return res.status(200).send({
      success: true,
      message: "Document deleted",
    });
  } catch (error) {
    console.log(error);
    return res.status(400).send({
      success: false,
      message: "Error while deleting documento",
      error,
    });
  }
};

module.exports = {
  createDocController,
  deleteDocController,
  renameDocController,
};

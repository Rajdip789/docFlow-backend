const documentModel = require("../models/documentModel");
const userModel = require("../models/userModel.js");
const emailAccessModel = require("../models/emailAccessModel");
const bcrypt = require("bcrypt");

const getAllDocs = async (req, res) => {
  try {
    const userId = req.params.id;

    const ownedDocuments = await documentModel.find({
      owner_id: userId,
    });

    // const sharedDocuments = await emailAccessModel.find({ });

    // const sharedDocuments = await documentModel.find({
    //   mail_access_id: "admin141@gmail.com",
    // });

    if (!ownedDocuments) {
      return res
        .status(404)
        .send({ success: false, message: "No user documents found" });
    }

    return res.status(200).send({
      success: true,
      message: "User documents get",
      ownedDocuments,
    });
  } catch (error) {
    console.log(error.message);
    return res
      .status(400)
      .send({ success: false, message: "Error while getting user documents" });
  }
};

const updateAccountController = async (req, res) => {
  try {
    const { id } = req.params;
    const { username, email, image, password } = req.body;
    const user = await userModel.findById(id);

    // if (password && password.length < 6) {
    //   return res.json({ error: "Password is required and 6 character long" });
    // }

    const hashedPassword = password
      ? await bcrypt.hash(password, 10)
      : undefined;
    const updatedUser = await userModel.findByIdAndUpdate(
      id,
      {
        username: username || user.username,
        password: hashedPassword || user.password,
        email: email || user.email,
        image: image || user.image,
      },
      { new: true }
    );
    res.status(200).send({
      success: true,
      message: "Profile updated successfully",
      updatedUser,
    });
  } catch (error) {
    console.log(error);
    res.status(400).send({
      success: false,
      message: "Error while updating profile",
      error,
    });
  }
};

const deleteAccountController = async (req, res) => {
  try {
    await userModel.findByIdAndDelete(req.params.id);

    return res.status(200).send({
      success: true,
      message: "Account deleted",
    });
  } catch (error) {
    console.log(error);
    return res.status(400).send({
      success: false,
      message: "Error while deleting account",
      error,
    });
  }
};

module.exports = {
  getAllDocs,
  updateAccountController,
  deleteAccountController,
};

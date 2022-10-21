const mongoose = require("mongoose");
const formidable = require("formidable");
const uploadFile = require("../../utils/uploadFile");
const ResponseModel = require("../models/ResponseModel");

const AnimalModel = require("../models/Animal");
const options = {
  use_filename: true,
  unique_filename: false,
  overwrite: true,
  folder: "bwd_love_us",
};

const form = new formidable.IncomingForm({ multiples: true });

class AnimalController {
  // [GET] /animal?limit=:limit
  getAllAnimal(req, res) {
    const LIMIT = req.query.limit || 10;
    AnimalModel.find({})
      .limit(LIMIT)
      .then((animals) => {
        return res
          .status(200)
          .json(ResponseModel(true, "Get all animal", animals));
      })
      .catch((err) => {
        return res
          .status(500)
          .json(ResponseModel(false, "Error get all animal", err.message));
      });
  }

  // [GET] /animal/:slugName
  getAnimalWithSlug(req, res) {
    const SLUG = req.params.slugName;
    AnimalModel.findOne({ slug: SLUG })
      .then((animal) => {
        return res
          .status(200)
          .json(
            ResponseModel(true, "Find one animal by slug successfully", animal)
          );
      })
      .catch((err) => {
        return res
          .status(200)
          .json(
            ResponseModel(true, "Find one animal by slug failed", err.message)
          );
      });
  }

  // [POST] /animal
  create(req, res) {
    form.parse(req, function (err, fields, files) {
      let uploadAvatar = [],
        uploadMutilImage = [],
        uploadImageEnv = [];

      if (files.avatar) {
        uploadAvatar = uploadFile(files.avatar.filepath, options);
      }

      if (files.imageEnv) {
        uploadImageEnv = uploadFile(files.imageEnv.filepath, options);
      }

      if (files.listImage) {
        uploadMutilImage = new Promise(function (resolve, reject) {
          let listDataImage = [];
          files.listImage.forEach((image) => {
            uploadFile(image.filepath, options)
              .then((data) => {
                listDataImage.push(data);
                if (listDataImage.length == files.listImage.length) {
                  resolve(listDataImage);
                }
              })
              .catch((err) => {
                reject(err);
              });
          });
        });
      }

      Promise.all([uploadAvatar, uploadImageEnv, uploadMutilImage]).then(
        ([avatar, imageEnv, listImage]) => {
          const listNewImage = listImage.map((image) => {
            return image.url;
          });
          //   res
          //     .status(200)
          //     .json(ResponseModel(true, "qua da", [avatar.url, listNewImage]));
          const dataAnimal = {
            name: fields.name,
            name_science: fields.name_science,
            avatar: avatar.url,
            listImage: listNewImage,
            imageEnv: imageEnv.url,
            surname: fields.surname,
            order: fields.order,
            sub_des: fields.sub_des,
            detection_time: fields.detection_time,
            number_individuals: parseInt(fields.number_individuals),
            description: fields.description || "",
            "reference_material.name": fields.re_ma_name,
            "reference_material.link": fields.re_ma_link,
            status: fields.status,
            habitat: fields.habitat,
            distribution: fields.distribution,
            size: fields.size,
            age: fields.age,
          };

          const newAnimal = new AnimalModel(dataAnimal);
          newAnimal
            .save()
            .then((data) => {
              res
                .status(200)
                .json(
                  ResponseModel(true, "create animal successfully", [data])
                );
            })
            .catch((err) => {
              res
                .status(500)
                .json(ResponseModel(false, "Server error", [err.message]));
            });
        }
      );
    });
  }
}

module.exports = new AnimalController();

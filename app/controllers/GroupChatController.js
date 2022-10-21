"use strict";

const mongoose = require("mongoose");

const memberModel = require("../models/CampaignMember");
const groupChatModel = require("../models/GroupChat");
const messengerrModel = require("../models/MessengerModel");

const campaignMemberController = require("./CampaignMemberController");

class GroupChatController {
  createGroupChatWithCampaign(formData) {
    return new Promise((resolve, reject) => {
      const newGroupchat = new groupChatModel(formData);
      newGroupchat
        .save()
        .then((member) => {
          resolve(member);
        })
        .catch((error) => {
          reject(error);
        });
    });
  }

  // [GET] /chat/group-chat/get-all
  getAllWithId(req, res) {
    memberModel
      .aggregate([
        {
          $match: { CM_list_members: new mongoose.Types.ObjectId(req.userId) },
        },
        {
          $lookup: {
            from: "group_chats",
            localField: "id_campaign",
            foreignField: "id_campaign",
            as: "dataGroupChat",
          },
        },
      ])
      .then((groupChats) => {
        return res.status(200).json({
          mess: "Get all group with id successfully",
          data: groupChats,
          success: true,
        });
      })
      .catch((error) => {
        return res.status(500).json({
          message: `Error of server ${error.message}`,
          code: "errour_server",
          success: false,
        });
      });
  }

  //[GET] /chat/messenger/:idGroupChat?limit&skip
  getMessengerOfGroupChat(req, res) {
    const limit = req.query.limit || 10;
    const skip = Number(req.query.skip) || 0;
    const idGroupChat = req.params.idGroupChat;

    if (idGroupChat) {
      messengerrModel
        .aggregate([
          {
            $match: { id_group_chat: new mongoose.Types.ObjectId(idGroupChat) },
          },
          {
            $lookup: {
              from: "users",
              localField: "id_sender",
              foreignField: "_id",
              as: "dataSender",
            },
          },
          { $limit: limit },
          { $skip: skip },
          { $sort: { createdAt: 1 } },
          {
            $project: {
              _id: 1,
              id_group_chat: 1,
              content: 1,
              id_sender: 1,
              createdAt: 1,
              "dataSender._id": 1,
              "dataSender.avatar": 1,
              "dataSender.name": 1,
            },
          },
        ])
        .then((listMessenger) => {
          return res.status(200).json({
            mess: "Get messenger with id group chat successfully",
            data: listMessenger,
            success: true,
          });
        })
        .catch((error) => {
          return res.status(500).json({
            message: `Error of server ${error.message}`,
            code: "errour_server",
            success: false,
          });
        });
    }
  }

  //
  getOneMessengerOfGroupChat(idMessenger) {
    return new Promise((resolve, reject) => {
      messengerrModel
        .aggregate([
          {
            $match: { _id: new mongoose.Types.ObjectId(idMessenger) },
          },
          {
            $lookup: {
              from: "users",
              localField: "id_sender",
              foreignField: "_id",
              as: "dataSender",
            },
          },
          { $limit: 1 },
          {
            $project: {
              _id: 1,
              id_group_chat: 1,
              content: 1,
              id_sender: 1,
              createdAt: 1,
              "dataSender._id": 1,
              "dataSender.avatar": 1,
              "dataSender.name": 1,
            },
          },
        ])
        .then((data) => {
          resolve(data);
        })
        .catch((err) => {
          reject(err);
        });
    });
  }

  // [POST] /campaign/messenger/:idGroupChat/create
  createMessengerOfGroupChat(content, to, from) {
    return new Promise((resolve, reject) => {
      const newMessenger = new messengerrModel({
        id_group_chat: to,
        content: content,
        id_sender: from,
      });

      newMessenger
        .save()
        .then((data) => {
          resolve(data);
        })
        .catch((err) => {
          reject(err);
        });
    });
  }
}
module.exports = new GroupChatController();

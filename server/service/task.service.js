
const { default: mongoose } = require("mongoose");
const taskModel = require("../models/task.model");

module.exports = {
    createOneTask: (params = {}) => {
        return taskModel.create(params);
    },
    findBySectionId: (params = {}) => {
        return taskModel.find(params);
    },
    findByIdAndUpdate: (id, params = {}) => {
        return taskModel.findByIdAndUpdate(id, params);
    },
    deleteOneTask: (params = {}) => {
        return taskModel.deleteOne(params);
    }
};

const { default: mongoose } = require("mongoose");
const { SectionModel } = require("../models");

module.exports = {
    createOneSection: (params = {}) => {
        return SectionModel.create(params);
    },
    getAllSection: (params = {}) => {
        return SectionModel.find(params);
    },
    deleteOneSection: (params = {}) => {
        return SectionModel.deleteOne(params);
    },
    updateById: (params = {}, sectionData, options = { new: true }) => {
        return SectionModel.findOneAndUpdate(params, sectionData, options);
    },
    getById: (params = {}) => {
        return SectionModel.findById(params);
    }
};
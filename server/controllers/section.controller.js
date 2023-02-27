const { sectionService } = require("../service");
const taskService = require("../service/task.service");

module.exports = {
    createSection: async (req, res, next) => {
        try {
            const section = await sectionService.createOneSection({ ...req.body });
            section._doc.tasks = [];
            res.status(200).json(section);
        } catch (e) {
            next(e);
        }
    },
    getAllSections: async (req, res, next) => {
        try {
            const sections = await sectionService.getAllSection();
            for (const section of sections) {
                const tasks = await taskService.findBySectionId({ section: section.id }).populate('section').sort('-position');
                section._doc.tasks = tasks;
            }
            res.status(200).json(sections);
        } catch (e) {
            next(e);
        }
    },
    deleteOneSection: async (req, res, next) => {
        try {
            const { id } = req.params;
            await sectionService.deleteOneSection({ _id: id });
            res.status(204);
        } catch (e) {
            next(e);
        }
    },
    updateOneSection: async (req, res, next) => {
        try {
            const { id } = req.params;
            const section = await sectionService.updateById({ _id: id }, req.body);
            section._doc.tasks = [];
            res.status(204).json(section);
        } catch (e) {
            next(e);
        }
    },
};
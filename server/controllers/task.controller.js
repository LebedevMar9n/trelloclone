const { sectionService } = require("../service");
const taskService = require("../service/task.service");


module.exports = {
    createTask: async (req, res, next) => {
        try {
            const { sectionId } = req.body;
            const section = await sectionService.getById(sectionId);
            const tasksCount = await taskService.findBySectionId({ section: sectionId }).count();
            const task = await taskService.createOneTask({
                section: sectionId,
                position: tasksCount > 0 ? tasksCount : 0
            });
            task._doc.section = section;
            res.status(201).json(task);
        } catch (e) {
            next(e);
        }

        // createSection: async (req, res, next) => {
        //     try {
        //         const newSection = await sectionService.createOneSection({ ...req.body });
        //         res.status(200).json(newSection);
        //     } catch (e) {
        //         next(e);
        //     }
        // },
        // getAllSections: async (req, res, next) => {
        //     try {
        //         const sections = await sectionService.getAllSection();
        //         res.status(200).json(sections);
        //     } catch (e) {
        //         next(e);
        //     }
        // },
        // deleteOneSection: async (req, res, next) => {
        //     try {
        //         const { id } = req.params;
        //         await sectionService.deleteOneSection({ _id: id });
        //         res.status(204);
        //     } catch (e) {
        //         next(e);
        //     }
        // },
        // updateOneSection: async (req, res, next) => {
        //     try {
        //         const { id } = req.params;
        //         await sectionService.updateById({ _id: id },req.body);
        //         res.status(204);
        //     } catch (e) {
        //         next(e);
        //     }
        // },
    },
    updateTask: async (req, res, next) => {
        try {
            const { id } = req.params;
            const task = await taskService.findByIdAndUpdate(id, { $set: req.body });
            res.status(201).json(task);
        } catch (e) {
            next(e);
        }
    },
    deleteTask: async (req, res, next) => {
        try {
            const { id } = req.params;
            await taskService.deleteOneTask({ _id: id });
            res.status(204);
        } catch (e) {
            next(e);
        }
    },
    updatePosition: async (req, res, next) => {
        const {
            resourceList,
            destinationList,
            resourceSectionId,
            destinationSectionId
        } = req.body;
        const resourceListReverse = resourceList.reverse();
        const destinationListReverse = destinationList.reverse();
        try {
            if (resourceSectionId !== destinationSectionId) {
                for (const key in resourceListReverse) {
                    await taskService.findByIdAndUpdate(
                        resourceListReverse[key]._id,
                        {
                            $set: {
                                section: resourceSectionId,
                                position: key
                            }
                        }
                    );
                }
            }
            for (const key in destinationListReverse) {
                await taskService.findByIdAndUpdate(
                    destinationListReverse[key]._id,
                    {
                        $set: {
                            section: destinationSectionId,
                            position: key
                        }
                    }
                );
            }
            res.status(200).json('updated');
        } catch (e) {
            next(e);
        }
    },
};

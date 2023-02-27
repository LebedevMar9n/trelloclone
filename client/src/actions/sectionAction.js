import { sectionApi } from "../api";
import { actionEnum } from "../enum/actionEnum";

export const getSections = () => async (dispatch) => {
    dispatch({ type: actionEnum.RETREIVING_START });
    try {
        const { data } = await sectionApi.getAll();
        dispatch({ type: actionEnum.RETREIVING_SUCCESS, data: data });
    } catch (error) {
        console.log(error);
        dispatch({ type: actionEnum.RETREIVING_FAIL });
    }
};
export const createSectionAction = () => async (dispatch) => {
    dispatch({ type: actionEnum.SECTION_CREATE_START });
    try {
        const section = await sectionApi.create();
        dispatch({ type: actionEnum.SECTION_CREATE_SUCCESS, data: section });
    } catch (error) {
        console.log(error);
        dispatch({ type: actionEnum.SECTION_CREATE_FAIL });
    }
};
import { actionEnum } from "../enum/actionEnum";


const sectionReducer = (state = { sections: [], uploading: false, error: false }, action) => {
    switch (action.type) {

        case actionEnum.RETREIVING_START:
            return { ...state, uploading: true, error: false };
        case actionEnum.RETREIVING_SUCCESS:
            return { ...state, sections: [...action.data], uploading: false, error: false };
        case actionEnum.RETREIVING_FAIL:
            return { ...state, uploading: false, error: true };

        case actionEnum.SECTION_CREATE_START:
            return { ...state, uploading: true, error: false };
        case actionEnum.SECTION_CREATE_SUCCESS:
            return { ...state, sections: [action.data, ...state.sections], uploading: false, error: false };
        case actionEnum.SECTION_CREATE_START:
            return { ...state, uploading: false, error: true };

        default:
            return state;
    }
};

export default sectionReducer;
import * as Actions from "./actions";
import { combineReducers } from "redux";

const initialState = {
  formData: {
    firstName: "",
    lastName: "",
    userName: "",
    email: "",
    phone: "",
    zip: "",
    birthDate: "",
    password: "",
    confirmPassword: "",
  },
  error: null,
};

export const formDataReducer = (state = initialState, action) => {
  switch (action.type) {
    case Actions.UPDATE_FORM_DATA:
      return {
        ...state,
        formData: {
          ...state.formData,
          ...action.payload,
        },
      };
    case Actions.LOGIN_ERROR:
      return {
        ...state,
        error: action.payload,
      };
    default:
      return state;
  }
};

export const rootReducer = combineReducers({
  formData: formDataReducer,
});

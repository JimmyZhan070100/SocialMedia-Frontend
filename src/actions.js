export const UPDATE_FORM_DATA = "UPDATE_FORM_DATA";
export const LOGIN_ERROR = "LOGIN_ERROR";

export const updateFormData = (formData) => {
  return {
    type: UPDATE_FORM_DATA,
    payload: formData,
  };
};

export const loginFail = (error) => {
  return {
    type: LOGIN_ERROR,
    payload: error,
  };
};

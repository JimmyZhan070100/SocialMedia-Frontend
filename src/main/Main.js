import React, { useState } from "react";
import Nav from "./nav";
import LeftSide from "./leftSide";
import Posts from "./posts";
import { connect } from "react-redux";
import { updateFormData } from "../actions"; // Import the action
import "../styles/style.css";
import "./main.css";
import { ArticleProvider } from "./postProvider";

const Main = ({ formData, updateForm }) => {
  // Pass updateForm as a prop
  return (
    <ArticleProvider>
      <div className="container-fluid">
        <Nav updateForm={updateForm} /> {/* Pass updateForm to Nav component */}
        <div className="row">
          <div className="col-md-3">
            <LeftSide data-testid="left-side" />
          </div>
          <div className="col-md-8">
            <Posts />
          </div>
        </div>
      </div>
    </ArticleProvider>
  );
};

const mapStateToProps = (state) => ({
  formData: state.formData.formData,
});

export default connect(mapStateToProps, { updateForm: updateFormData })(Main); // Connect Main to Redux and provide updateForm

import React, { Component } from 'react';

import {uploadFiles} from '../helpers/cloudinary';

export default class CreateQuestion extends Component{
  constructor(props){
    super(props);

    // binders

    this.handleQuestionChange = this.handleQuestionChange.bind(this);
  }

  handleQuestionChange(e){
    let response = this.validateQuestionText(e.target.value);
    if(response.error){
      console.log(response.message);
    }
    else{
      this.props.handleModifyQuestionTitle(this.props.activeQuestion, response.message);
      this.props.releaseQuestionLock();
    }
  }
  validateQuestionText(questionText){
    let error = false;
    let message = questionText + "";
    if(message.trim() == ''){
      error = false; // TODO handle error
      //message = 'Your question cannot be empty';
    }

    return {
      error: error,
      message: message
    }

  }
  handleImageUpload(e){
    const file = e.target.files[0];
    console.log(file);
    uploadFiles(file);
    console.log('fileUpload Call done');
  }
  render(){
    if(this.props.activeQuestion === 0){
      return(
        <div className="">
           No active question
        </div>
      );
    }
    return(
      <div>
        <h3>Design Question {this.props.activeQuestion}</h3>
        <br />
        <div className="form-group">
          <label htmlFor="questionInput">Question: </label>
          <input type="text" className="form-control" id="questionInput" aria-describedby="questionHelp" placeholder=""
            value={this.props.questions[this.props.activeQuestion - 1].title}
            onChange={this.handleQuestionChange}
          />
        </div>
        <div className="form-group">
          <label htmlFor="imageUpload">Image: (optional)</label>
          <input type="file" id="imageUpload"
            onChange={this.handleImageUpload}
          />
        </div>
        <div className="options-area">
          <h6>Options:</h6>
          <div className="row">
            <div className="col">
              1 of 2
            </div>
            <div className="col">
              1 of 2
            </div>
          </div>
        </div>
        <div className="submit-section">
          <input type="button" value="Submit" className="question-submit" />
        </div>
      </div>
    );
  }
}

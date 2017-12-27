import React, { Component } from 'react';

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
      </div>
    );
  }
}

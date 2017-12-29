import React, { Component } from 'react';

export default class ListQuestions extends Component {
  constructor(props){
    super(props);

    // binders

    let enableDelete = false;
  }

  renderQuestionList(){


    if(this.props.currentState.questions.length === 0){
      return(
        <div className="row question-warning">
          <div className="col">
            <span>You don't have any question's yet. Please add one</span>
          </div>
        </div>
      );
    }
    return this.props.currentState.questions.map((questions) => {
      let questionIndex = this.props.currentState.questions.indexOf(questions) + 1;
      let colorClass = 'question-item background-blue';
      if(questionIndex%2 === 0){colorClass = 'question-item background-green';}
      return(
        <div className={colorClass} key={questions.title} value={questions.title}
          onClick={() => this.props.handleActiveQuestion(questionIndex)}
        >{questionIndex}: {questions.title}</div>
      );
    });
  }

  render() {
    if(this.props.currentState.questions.length > 0){
      this.enableDelete = true;
    }
    return (
      <div>
        <h3>Questions:</h3>
        <div className="question-list">
          {this.renderQuestionList()}
        </div>
        <div className="question-buttons">
          <input className="btn btn-default addQuestion" type="button" value="Add"
            onClick={() => this.props.addQuestion("", "", null)}
            disabled={this.props.currentState.questionLock}
          />
          <input className="btn btn-default deleteQuestion" type="button" value="Delete"
            onClick={() => this.props.handleDeleteMode(true)}
            disabled={!this.enableDelete}
          />
        </div>
      </div>
    );
  }
}

import React, { Component } from 'react';

export default class ListQuestions extends Component {
  constructor(props){
    super(props);

    // binders
  }

  renderQuestionList(){


    if(this.props.currentState.questions.length === 0){
      return(<span>You don't have any question's yet. Please add one</span>);
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
    let enableDelete = false;
    if(this.props.currentState.questions.length > 0){
      enableDelete = true;
    }
    return (
      <div>
        <h3>Questions:</h3>
        <div className="question-list">
          {this.renderQuestionList()}
        </div>
        <div className="question-buttons">
          <input className="btn btn-default addQuestion" type="button" value="Add"
            onClick={() => this.props.addQuestion('', [], '')}
            disabled={this.props.currentState.questionLock}
          />
          <input className="btn btn-default deleteQuestion" type="button" value="Delete"
            onClick={() => this.props.handleDeleteMode(true)}
            disabled={!enableDelete}
          />
        </div>
      </div>
    );
  }
}

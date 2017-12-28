import React, { Component } from 'react';

export default class DeleteQuestions extends Component {
  constructor(props){
    super(props);
    this.state = {
      questions: this.props.currentState.questions,
    };

    // binders
  }

  handleDeleteQuestion(index){
    if(index > 0){
      let arrayIndex = index - 1;
      let newQuestions = Object.assign([], this.state.questions);
      newQuestions.splice(arrayIndex, 1);
      this.setState({
        questions: newQuestions
      });
    }
    else{
      return false;
    }
  }

  renderQuestionList(){
    if(this.state.questions.length === 0){
      return(<span>All questions will be deleted upon save.</span>);
    }
    return this.state.questions.map((questions) => {
      let questionIndex = this.state.questions.indexOf(questions) + 1;
      let colorClass = 'delete-question question-item background-blue';
      if(questionIndex%2 === 0){colorClass = 'delete-question question-item background-green';}
      return(
        <div className={colorClass} key={questions.title} value={questions.title}
          onClick={() => this.handleDeleteQuestion(questionIndex)}
        >{questionIndex}: {questions.title}
          <span className="closeIcon">x</span>
        </div>
      );
    });
  }

  render() {
    return (
      <div>
        <h3>Delete Questions:</h3>
        <div className="question-list">
          {this.renderQuestionList()}
        </div>
        <div className="question-buttons">
          <input className="btn btn-default addQuestion" type="button" value="Save"
            onClick={() => this.props.handleDeleteSave(this.state.questions)}
          />
          <input className="btn btn-default deleteQuestion" type="button" value="Cancel"
            onClick={() => this.props.handleDeleteMode(false)}
          />
        </div>
      </div>
    );
  }
}

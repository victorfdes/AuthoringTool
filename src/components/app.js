import React, { Component } from 'react';

// import other components/containers
import ListQuestion from './listQuestion';
import DeleteQuestions from './deleteQuestion';
import CreateQuestion from './createQuestion';


//const questionInfo = new Cookies(); // Declare cookie to store data

export default class App extends Component {
  constructor(props){
    super(props);
    let questions = Object.assign([]);
    if (typeof localStorage.questions != 'undefined'){
      let stringifiedQuestions = JSON.parse(localStorage.questions);
      let numberOfQuestions = stringifiedQuestions.length;
      //console.log(numberOfQuestions);
      try {
        let newQuestions = [];
        for(let i=0; i<numberOfQuestions; i++){
          newQuestions.push(JSON.parse(stringifiedQuestions[i]));
        }
        questions = Object.assign([], newQuestions);
        //console.log(questions);
      } catch (ex) {
        console.error(ex);
      }

    }
    this.state = {
      questions: questions,   // The entire questions object shall be stored here.
      activeQuestion: 0,    // indexOf the current question.
      questionLock: false,  // Prevent another question from being updated while one is edited.
      deleteMode: false,    // toggle between delete or add/modify question view.
    };


    // binders

    this.handleActiveQuestion = this.handleActiveQuestion.bind(this);
    this.handleModifyQuestionTitle = this.handleModifyQuestionTitle.bind(this);
    this.addQuestion = this.addQuestion.bind(this);
    this.handleDeleteSave = this.handleDeleteSave.bind(this);
    this.handleDeleteMode = this.handleDeleteMode.bind(this);
    this.releaseQuestionLock = this.releaseQuestionLock.bind(this);
  }

  addQuestion(title, options, img){
    const numberOfQuestions = this.state.questions.length;
    let newQuestion = {
      title: title,
      options: options,
      img: img
    };
    this.setState({
      questions: this.state.questions.concat([newQuestion]),
      activeQuestion: numberOfQuestions + 1,
      questionLock: true
    });
  }
  handleContitionalSidebar(deleteMode){
    if(deleteMode){
      return(
        <DeleteQuestions
          currentState={this.state}
          addQuestion={this.addQuestion}
          handleActiveQuestion={this.handleActiveQuestion}
          releaseQuestionLock={this.releaseQuestionLock}
          handleDeleteSave={this.handleDeleteSave}
          handleDeleteMode={this.handleDeleteMode}
        />
      );
    }
    return(
      <ListQuestion
        currentState={this.state}
        addQuestion={this.addQuestion}
        handleActiveQuestion={this.handleActiveQuestion}
        releaseQuestionLock={this.releaseQuestionLock}
        handleDeleteMode={this.handleDeleteMode}
      />
    );
  }
  handleModifyQuestionTitle(questionID, newQuestion){
    let newQuestions = Object.assign([], this.state.questions);
    newQuestions[questionID - 1] = Object.assign({}, this.state.questions[questionID - 1], {title: newQuestion});
    //console.log(this.stringifyQuestions(newQuestions));
    //questionInfo.set('questions', this.stringifyQuestions(newQuestions), { path: '/', maxAge: 31536000 });
    localStorage.questions = this.stringifyQuestions(newQuestions);
    this.setState({
      questions: newQuestions
    });
  }
  handleActiveQuestion(questionID){
    this.setState({activeQuestion: questionID});
  }
  handleDeleteSave(newQuestions){
    this.setState({
      questions: newQuestions,
      activeQuestion: newQuestions.length,
      deleteMode: false
    });
  }
  handleDeleteMode(mode){
    this.setState({deleteMode: mode});
  }
  releaseQuestionLock(){
    this.setState({questionLock: false});
  }
  stringifyQuestions(questions){
    let numberOfQuestions = questions.length;
    let newQuestions = [];
    for(let i=0; i<numberOfQuestions; i++){
      newQuestions.push(JSON.stringify(questions[i]));
    }
    return JSON.stringify(newQuestions);
  }

  render() {
    //console.log(localStorage.questions);
    return (
      <div>
        <div className="row">
          <div className="col-md-12 app-heading">
            <h3>Quiz Authoring Tool</h3>
          </div>
        </div>
        <div className="row quiz-body">
          <div className="left-section col-md-4">
            {this.handleContitionalSidebar(this.state.deleteMode)}
          </div>
          <div className="right-section col-md-8 createQuestion-container">
            <CreateQuestion
              questions={this.state.questions}
              activeQuestion={this.state.activeQuestion}
              handleModifyQuestionTitle={this.handleModifyQuestionTitle}
              releaseQuestionLock={this.releaseQuestionLock}
            />
          </div>
        </div>
      </div>
    );
  }
}
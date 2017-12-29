import React, { Component } from 'react';

// import other components/containers
import ListQuestion from './listQuestion';
import DeleteQuestions from './deleteQuestion';
import CreateQuestion from './createQuestion';

export default class App extends Component {
  constructor(props){
    super(props);
    let questions = Object.assign([]);
    // ********************** //   Check localStorage and assign question appropriately
    if (typeof localStorage.questions != 'undefined'){
      let stringifiedQuestions = JSON.parse(localStorage.questions);
      let numberOfQuestions = stringifiedQuestions.length;
      try {
        let newQuestions = [];
        for(let i=0; i<numberOfQuestions; i++){
          newQuestions.push(JSON.parse(stringifiedQuestions[i]));
        }
        questions = Object.assign([], newQuestions);
      } catch (ex) {
        console.error(ex);
      }

    }
    this.state = {
      questions: questions,   // The entire questions object shall be stored here.
      activeQuestion: 0,      // indexOf the current question.
      questionLock: false,    // Prevent another question from being updated while one is edited.
      deleteMode: false,      // toggle between delete or add/modify question view.
      questionOnMobile: false    // Switch for enhanced Portable device viewing
    };
    // binders
    this.handleActiveQuestion = this.handleActiveQuestion.bind(this);
    this.handleModifyQuestionTitle = this.handleModifyQuestionTitle.bind(this);
    this.handleModifyOptions = this.handleModifyOptions.bind(this);
    this.handleAddImage = this.handleAddImage.bind(this);
    this.addQuestion = this.addQuestion.bind(this);
    this.handleDeleteSave = this.handleDeleteSave.bind(this);
    this.handleDeleteMode = this.handleDeleteMode.bind(this);
    this.releaseQuestionLock = this.releaseQuestionLock.bind(this);
    this.handleQuestionMode = this.handleQuestionMode.bind(this);
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
      questionLock: true,
      questionOnMobile: true
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
        handleQuestionMode={this.handleQuestionMode}
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
  handleAddImage(questionID, image){
    //console.log('Question: ' + questionID);
    //console.log(image);

    if(image.resource_type === 'image'){
      //console.log('image');
      let imageData = {
        width: image.width,
        height: image.height,
        format: image.format,
        url: image.url,
      };
      let newQuestions = Object.assign([], this.state.questions);
      newQuestions[questionID - 1] = Object.assign({}, this.state.questions[questionID - 1], {img: JSON.stringify(imageData)});
      localStorage.questions = this.stringifyQuestions(newQuestions);
      this.setState({
        questions: newQuestions
      });
    }
    else{
      console.error('Not an image');
    }

  }
  handleActiveQuestion(questionID){
    this.setState({activeQuestion: questionID, questionOnMobile: true});
  }
  handleModifyOptions(questionID, optionID, optionText){
    let options = this.state.questions[questionID - 1].options;
    let optionData = ["", "", "", "", "", ""];
    if(options === null || typeof options === 'undefined' || options == ''){
      optionData[optionID - 1] = optionText;
    }
    else{
      optionData = JSON.parse(options);
      optionData[optionID - 1] = optionText;
    }
    let newQuestions = Object.assign([], this.state.questions);
    newQuestions[questionID - 1] = Object.assign({}, this.state.questions[questionID - 1], {options: JSON.stringify(optionData)});
    localStorage.questions = this.stringifyQuestions(newQuestions);
    this.setState({
      questions: newQuestions
    });
  }
  handleDeleteSave(newQuestions){
    localStorage.questions = this.stringifyQuestions(newQuestions);
    if(newQuestions.length === 0){
    }
    this.releaseQuestionLock(false);
    this.setState({
      questions: newQuestions,
      activeQuestion: newQuestions.length,
      deleteMode: false
    });
  }
  handleDeleteMode(mode){
    this.setState({deleteMode: mode});
  }
  // Toggle Question lock to validate question and options as well as prevent blank questions.
  releaseQuestionLock(lock){
    this.setState({questionLock: lock});
  }
  stringifyQuestions(questions){
    let numberOfQuestions = questions.length;
    let newQuestions = [];
    for(let i=0; i<numberOfQuestions; i++){
      newQuestions.push(JSON.stringify(questions[i]));
    }
    return JSON.stringify(newQuestions);
  }
  handleClassLeftOnMobile(){
    if(this.state.questionOnMobile){
      return('left-section col-md-4 hidden-sm-down');
    }
    return('left-section col-md-4');
  }
  handleClassRightOnMobile(){
    if(this.state.questionOnMobile){
      return('right-section col-md-8 createQuestion-container');
    }
    return('right-section col-md-8 createQuestion-container hidden-sm-down');
  }
  handleQuestionMode(mode){
    this.setState({questionOnMobile: mode});
  }
  render() {
    //console.log(this.state.questions);
    return (
      <div>
        <div className="row">
          <div className="col-md-12 app-heading">
            <h3>Quiz Authoring Tool</h3>
          </div>
        </div>
        <div className="row quiz-body">
          <div className={this.handleClassLeftOnMobile()}>
            {this.handleContitionalSidebar(this.state.deleteMode)}
          </div>
          <div className={this.handleClassRightOnMobile()}>
            <CreateQuestion
              currentState={this.state}
              activeQuestion={this.state.activeQuestion}
              handleModifyQuestionTitle={this.handleModifyQuestionTitle}
              handleModifyOptions={this.handleModifyOptions}
              handleAddImage={this.handleAddImage}
              releaseQuestionLock={this.releaseQuestionLock}
              handleQuestionMode={this.handleQuestionMode}
            />
          </div>
        </div>
      </div>
    );
  }
}

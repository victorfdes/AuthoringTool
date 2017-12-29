import React, { Component } from 'react';

import {cloudinaryKeys} from '../config';

//import {uploadFiles} from '../helpers/cloudinary';

export default class CreateQuestion extends Component{
  constructor(props){
    super(props);

    this.state = {
      options: null
    }

    // binders

    this.handleQuestionChange = this.handleQuestionChange.bind(this);
    this.uploadImage = this.uploadImage.bind(this);
    this.renderImage = this.renderImage.bind(this);
    this.renderOptions = this.renderOptions.bind(this);
  }

  handleQuestionChange(e){
    let response = this.validateText(e.target.value);
    if(response.error){
      console.error('Question Text cannot be empty');
      this.props.releaseQuestionLock(true);
      this.props.handleModifyQuestionTitle(this.props.activeQuestion, response.message);
    }
    else{
      this.props.releaseQuestionLock(false);
      this.props.handleModifyQuestionTitle(this.props.activeQuestion, response.message);
    }
  }
  validateText(questionText){
    let error = false;
    let message = questionText + "";
    if(message.trim() == ''){
      error = true; // TODO handle error
      //message = 'Your question cannot be empty';
    }

    return {
      error: error,
      message: message
    }

  }
  uploadImage(e){
    const file = e.target.files[0];

    const cloudName = cloudinaryKeys.cloudName;
    const unsignedUploadPreset = cloudinaryKeys.uploadPreset;
    let url = `https://api.cloudinary.com/v1_1/${cloudName}/upload`;
    let response = Object.assign({});
    var xhr = new XMLHttpRequest();
    var fd = new FormData();
    xhr.open('POST', url, true);
    xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest');

    xhr.upload.addEventListener("progress", function(e) {
      var progress = Math.round((e.loaded * 100.0) / e.total);
    });

    xhr.onreadystatechange = function(e) {
      if (xhr.readyState == 4 && xhr.status == 200) {
        // File uploaded successfully
        response = JSON.parse(xhr.responseText);
        this.props.handleAddImage(this.props.activeQuestion, response);
      }
    }.bind(this);

    fd.append('upload_preset', unsignedUploadPreset);
    fd.append('tags', 'debug'); // Optional - add tag for image admin in Cloudinary
    fd.append('file', file);
    xhr.send(fd);
  }
  renderImage(){
    let image = this.props.currentState.questions[this.props.activeQuestion - 1].img;
    if(image === null || typeof image === 'undefined'){
      return(<img
        src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAAEOElEQVR4XtWWT4hVZRjGf9+/8+fec+94Z+6dmTuOphOGQhoGmhi0CFpkC92Y4iKRigZqV0SbMFq4CIoIYhBbhLoI3Wi00ahFm0zIStPSZNQZx3HGpuv8vffce875Su4JLx1q56IPHl7eh4/n4X3ew+ET1loe5JE84KPTyhsrq2d/L69bLrAACEAIEGkjO3qR9nT0Im2FUjY3eXHiwOjk5k4Drg890//FjpEBNwYjQCnQArQEI0GrNi/b3H1etjmlBY6wKF+w6tBwnJlAG2ODrjx+dF9MdQqlUAJMap7yqM47eXC1FhkDV1l6PfDi/xTrRJYDVAGMbYjMkj0N5Rz05KDst1H5u97j/gkfenwo59N6Dx5UAjBRU5E1aAtVPFKBDiGvjXJHLfsp3LSm3GAZTNJQZCNqG5jW/UiUTBdtQStwDciOaIwGH7CmfUdF0OXAOLH8VwPdBE2avQPdgyBcWKqBngBTBBewTVhswF0X+lzwY1AKqgp8JZJMRL6jqOShugwG+2GgDx4u15n+aA+c+pSdA7B2EzTrEPjw+HrYuxGG18G2gZinV8Jjq6HfQJBz4oyBm8wzWARv+gL181+Sm7vJlSOvc/LDY4y8/BKfvL2XJ7Ds2wjProJ+m/BrbY633nyR557s5dC7u5n54XOUADcoJZmI5kbPiV8O7yeZ+JHZO9P8lu9h7MxXbN82yOWJaQ6+d5Spqcu8f/AMR44d5cCrw+x6KmbquyZJE6bcE4x8+w27DuTxXcgYzN6+zuTxD+jJSbo9zaWLIYkf4BUC1q8JqN0e5fDRs+zYc5J3XtlHbxzTnx9gYXNAPoqIXbh4bpITH++neq2WncAYh0KpByFA5hSrV2iaYczotSVKnmXrpiGW9dxhZHgnW6s5Xti+givjdW6MLyCxzHkwtLybsZ8v0RiblRmDlmzqGWcOGVpu1cDJC/qrsOVRQb0WE1bWsvv513BzvbTGP+Nq7WuuTrUY2pAnbDRpNDwiY/HdAmamLjIGi7YlLyV3MVbQMglEsDQpOBUKdD7BSU4T3LyNUywwPX+eR1aGRGsi4rphtmXwYo0rDabkU/i+lp1A41AoFglCiTUKIz0WGglqvkx9POSP02NcrV8gcNt/zFt6C7VSwkMbJH20CEoGZIQIlmH0mM0YOJ5D70AFL0xQUqGUYrmMcU2MzhuCgXX4YYBfKlCfXUDlm4SLgrghaCQ+RuewrQRV6UIEDtklB77trvbhNWKkFijfQSBQWpOoHEtGEsYJi/MKUapglCaKE3LVHMWkSeLEyEjhFIrMF3PZr8iTUvRajdYK4boIbZBGoL08rorRjkPUJRDWRzgtPOVge0BLH5ot4iTBaYXIpiWUKrtkPT47Hhz/yUprBUmihcQSCQkQWSFbJEoJa5HKEiIWJdbKWCjrJjgkQpE0tIyFY2x0Y+YW6fn/vyr+BEzTb/35gE/WAAAAAElFTkSuQmCC"
        alt="placeholder-image"/>);
    }
    else{
      let imageData = JSON.parse(image);
      let imageStyle = {
        width: imageData.width * 35 / imageData.height + 'px',
        height: '35px'
      };
      return(
        <img src={imageData.url} height="50" style={imageStyle}/>
      );
    }
  }
  renderOptions(){
    let options = this.props.currentState.questions[this.props.activeQuestion - 1].options;
    let optionData = ["", "", "", "", "", ""];
    if(options === null || typeof options === 'undefined' || options == ''){

    }
    else{
      optionData = JSON.parse(options);
    }
    return(<div className="options-area">
      <h6>Options:</h6>
      <div className="row">
        <div className="col">
          <input type="text" placeholder="Option 1 (required)" className="form-control"
            value={optionData[0]}
            onChange={(e) => this.props.handleModifyOptions(this.props.activeQuestion, 1, e.target.value)}
          />
        </div>
        <div className="col">
          <input type="text" placeholder="Option 2(required)" className="form-control"
            value={optionData[1]}
            onChange={(e) => this.props.handleModifyOptions(this.props.activeQuestion, 2, e.target.value)}
          />
        </div>
      </div>
      <div className="row">
        <div className="col">
          <input type="text" placeholder="Option 3" className="form-control"
          value={optionData[2]}
          onChange={(e) => this.props.handleModifyOptions(this.props.activeQuestion, 3, e.target.value)}
          />
        </div>
        <div className="col">
          <input type="text" placeholder="Option 4" className="form-control"
            value={optionData[3]}
            onChange={(e) => this.props.handleModifyOptions(this.props.activeQuestion, 4, e.target.value)}
          />
        </div>
      </div>
      <div className="row">
        <div className="col">
          <input type="text" placeholder="Option 5" className="form-control"
            value={optionData[4]}
            onChange={(e) => this.props.handleModifyOptions(this.props.activeQuestion, 5, e.target.value)}
          />
        </div>
        <div className="col">
          <input type="text" placeholder="Option 6" className="form-control"
            value={optionData[5]}
            onChange={(e) => this.props.handleModifyOptions(this.props.activeQuestion, 6, e.target.value)}
          />
        </div>
      </div>
    </div>);
  }

  render(){
    if(this.props.activeQuestion === 0){
      return(
        <div className="">
           No question selected
        </div>
      );
    }
    return(
      <div>
        <div className="row onlyonmobile back-to-questions-button" onClick={() => this.props.handleQuestionMode(false)}>
          <span>&#x1f519; &nbsp; Back to Questions</span>
        </div>
        <h3>Design Question {this.props.activeQuestion}</h3>
        <br />
        <div className="form-group">
          <label htmlFor="questionInput">Question Title: </label>
          <input type="text" className="form-control" id="questionInput" aria-describedby="questionHelp" placeholder=""
            value={this.props.currentState.questions[this.props.activeQuestion - 1].title}
            onChange={this.handleQuestionChange}
          />
        </div>
        <div className="row">
          <div className="form-group">
            <div className="col image-upload">
              <div className="form-group">
                <label htmlFor="imageUpload">Image: (optional)</label>
                <input type="file" id="imageUpload" accept="image/*"
                  onChange={this.uploadImage}
                />
              </div>
            </div>
            <div className="col image-preview">
              {this.renderImage()}
            </div>
          </div>
        </div>
        {this.renderOptions()}
      </div>
    );
  }
}

require('normalize.css/normalize.css');
require('styles/App.css');

import React from 'react';
import ReactDOM from 'react-dom';

// 获取图片相关数据
let imagesData = require('../data/images.json');
// 利用自执行函数，将图片名信息转换成图片URL路径信息
imagesData = (function genImageURL(imageDatasArr){
  for (var i = 0; i < imageDatasArr.length; i++) {
    let singleImageData = imageDatasArr[i];
    singleImageData.imageURL = require('../images/'+singleImageData.fileName);
  }
  return imageDatasArr;
})(imagesData)
/*
 * 获取区间内的一个随机数
 */
function getRangeRandom(low,high) {
  return Math.ceil(Math.random()*(high - low) + low);
}
class ImgFigure extends React.Component {
  render() {
    let styleObj = {};
    if(this.props.arrange.pos) {
      styleObj = this.props.arrange.pos;
    }
    return (
      <figure className="img-figure" style ={styleObj}>
        <img src={this.props.data.imageURL} alt={this.props.data.title}/>
        <figcaption>
          <h2 className="img-title">{this.props.data.title}</h2>
        </figcaption>
      </figure>
    );
  }
}

class AppComponent extends React.Component {
  constructor(props){
        super(props);
        this.state = { // define this.state in constructor
          imgsArrangeArr: [
            {
              pos:{
                left: '0',
                top: '0'
              }
            }
          ]
        }
  }
  /*
   * 重新布局所以图片
   * @param centerIndex 指定居中排布那个图片
   */
  rearrange(centerIndex) {
    let imgsArrangeArr = this.state.imgsArrangeArr,
        Constant = this.props.Constant,
        centerPos = Constant.centerPos,
        hPosRange = Constant.hPosRange,
        vPosRange = Constant.vPosRange,
        hPosRangeLeftSecX = hPosRange.leftSecX,
        hPosRangeRightSecX = hPosRange.rightSecX,
        hPosRangeY = hPosRange.y,
        vPosRangeTopY = vPosRange.topY,
        vPosRangeX = vPosRange.x,

        imgsArrangeTopArr = [],
        topImgNum = Math.ceil(Math.random()*2),
        // 取一个或者不取
        topImgSpliceIndex = 0,
        imgsArrangeCenterArr = imgsArrangeArr.splice(centerIndex,1);
        // 首先居中 centerIndex的图片
        imgsArrangeCenterArr[0].pos = centerPos;
        // 取出要布局上侧的图片的状态信息
        topImgSpliceIndex =  Math.ceil(Math.random()*(imgsArrangeArr.length -topImgNum));
        imgsArrangeTopArr = imgsArrangeArr.splice(topImgSpliceIndex,topImgNum);
        // 布局位于上侧的图片
        imgsArrangeTopArr.forEach(function(value,index){
          imgsArrangeTopArr[index].pos = {
            top: getRangeRandom(vPosRangeTopY[0],vPosRangeTopY[1]),
            left: getRangeRandom(vPosRangeX[0],vPosRangeX[1])
          }
        });
        // 布局左右两侧的图片
        for (var i = 0,j = imgsArrangeArr.length,k = j/2;i<j;i++) {
          let hPosRangeLORX = null;
          // 前半部分布局左边，后半部分布局右边
          if (i < k) {
            hPosRangeLORX = hPosRangeLeftSecX;
          } else {
            hPosRangeLORX = hPosRangeRightSecX;
          }

          imgsArrangeArr[i].pos = {
            top: getRangeRandom(hPosRangeY[0],hPosRangeY[1]),
            left: getRangeRandom(hPosRangeLORX[0],hPosRangeLORX[1])
          }
        }

        if(imgsArrangeTopArr && imgsArrangeTopArr[0]) {
          imgsArrangeArr.splice(topImgSpliceIndex,0,imgsArrangeTopArr[0]);

        }

        imgsArrangeArr.splice(centerIndex,0,imgsArrangeCenterArr[0]);
        this.setState({
          imgsArrangeArr:imgsArrangeArr
        })
  }

  // 组件加载以后，为每张图片计算其位置的范围
  componentDidMount() {
    // 首先拿到舞台的大小
    let stageDOM = ReactDOM.findDOMNode(this.refs.stage),
        stageW = stageDOM.scrollWidth,
        stageH = stageDOM.scrollHeight,
        halfStageW = stageW /2,
        halfStageH = stageH /2;
    // 拿到imageFigure舞台的大小
    let imgFigureDOM = ReactDOM.findDOMNode(this.refs.imgFigure0),
        imgW = imgFigureDOM.scrollWidth,
        imgH = imgFigureDOM.scrollHeight,
        halfImgW = Math.ceil(imgW /2),
        halfImgH = Math.ceil(imgH /2);

    // 计算中心图片的位置
    this.props.Constant.centerPos = {
      left: halfStageW -halfImgW,
      top: halfStageH -halfImgH
    }
    // 计算左，右侧区域图片排布位置的取值范围
    this.props.Constant.hPosRange.leftSecX[0] = -halfImgW;
    this.props.Constant.hPosRange.leftSecX[1] = halfStageW - halfImgW*3;
    this.props.Constant.hPosRange.rightSecX[0] = halfStageW + halfImgW;
    this.props.Constant.hPosRange.rightSecX[1] = stageW - halfImgW;
    this.props.Constant.hPosRange.y[0] =  -halfImgH;
    this.props.Constant.hPosRange.y[1] = stageH - halfImgH;
    // 计算上侧区域图片排布位置的取值范围
    this.props.Constant.vPosRange.topY[0] = -halfImgH;
    this.props.Constant.vPosRange.topY[1] = halfStageH - halfImgH*3;
    this.props.Constant.vPosRange.x[0] = halfStageW - imgW;
    this.props.Constant.vPosRange.x[1] = halfStageW;

    this.rearrange(0);

  }
  render() {
    let controllerUnits = [],
        ImgFigures = [];

    imagesData.forEach(function(value,index){
      if(!this.state.imgsArrangeArr[index]) {
        this.state.imgsArrangeArr[index] = {
          pos:{
            left: '0',
            top: '0'
          }
        }
      }
      ImgFigures.push(<ImgFigure key={value.fileName} data ={value} ref={'imgFigure'+index} arrange={this.state.imgsArrangeArr[index]}/>)
    }.bind(this));

    return (
      <div className="index" ref = "stage">
        <div className = "image-sec">
          {ImgFigures}
        </div>
        <nav className = "controller-nav">
          {controllerUnits}
        </nav>
      </div>
    );
  }
}

AppComponent.defaultProps = {
  Constant: {
    centerPos: {
      left: 0,
      right: 0
    },
    hPosRange: { //水平方向的取值范围
      leftSecX: [0,0],
      rightSecX: [0,0],
      y: [0,0]
    },
    vPosRange: { //垂直方向的取值范围
      x: [0,0],
      topY: [0,0]
    }
  }
};

export default AppComponent;

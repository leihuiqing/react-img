require('normalize.css/normalize.css');
require('styles/App.css');

import React from 'react';

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

console.log(imagesData)
class AppComponent extends React.Component {
  render() {
    return (
      <div className="index">
        <div className = "image-sec"></div>
        <nav className = "controller-nav"></nav>
      </div>
    );
  }
}

AppComponent.defaultProps = {
};

export default AppComponent;

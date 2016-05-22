require('normalize.css/normalize.css');
require('styles/App.css');

import React from 'react';
import ReactDOM from 'React-dom';



// 获取图片相关的信息
let imgDataInfo = require('json!../data/imageInfo.json');

// 利用自执行函数，将图片名信息转化成URL路径信息
let imgDatas = function getImgURL(imgDataArr) {
	for(var i = 0,j = imgDataArr.length; i < j; i++) {
		var singleImgData = imgDataArr[i];

		singleImgData.imgUrl = require('../images/' +
			singleImgData.fileName);
	}

	return imgDataArr;
}.call(this,imgDataInfo.content);
/*
 * 获取0-30deg 之间额任意正负
 */
function get30DegRandom () {
    return ((Math.random() > 0.5 ? '' : '-') + Math.ceil(Math.random() * 30));
}
/*
 * 获取区间内的一个随机值
*/
function getRangeRandom(low, high) {
    return Math.ceil(Math.random() * (high - low) + low);
}
class ImgFigure extends React.Component {
    /*
     *imgFigure 的click函数
     */
    handleClick(e) {
        if(this.props.arrange.isCenter) {
            this.props.inverse();
        } else {
            this.props.center();
        }
        e.stopPropagation();
        e.preventDefault();
    }

    render() {
        var styleObj = {};

        // 如果props属性中指定了这张图片的位置，则使用
        if(this.props.arrange.pos) {
            styleObj = this.props.arrange.pos
        }
        // 如果图片 的旋转角度you值并且不为0
        if(this.props.arrange.rotate) {
            (['MozT', 'msT', 'Webkit', 't']).forEach(function (value) {
                styleObj[value + 'ransform'] = 'rotate(' + this.props.arrange.rotate +
                'deg)';
            }.bind(this));
        }
       
        if(this.props.arrange.isCenter) {
           styleObj.zIndex = '201'
        }

        var imgFigureClassName = 'img-figure';
            imgFigureClassName += this.props.arrange.isInverse ? '  is-inverse' : '';

        return (
            <figure className = {imgFigureClassName} style = {styleObj} onClick = {this.handleClick.bind(this)} >
                <img src= {this.props.data.imgUrl}
                     alt = {this.props.data.title}
                />
                <figcaption class = "img-fagcation">
                    <h2 className = "img-title">{this.props.data.title}</h2>
                    <div className = "img-back" onClick = {this.handleClick.bind(this)}>
                        <p>{this.props.data.desc}</p>
                    </div>
                </figcaption>
            </figure>
        )
    }
}

class AppComponent extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            imagesArrangArr: new Array()
        };

    }

     /*
      *  翻转图片
      * @param index 输入当前被执行inverse操作的图片对应的图片信息数组的index的值
      * @return {function} 这是一个闭包函数 ，其内return一个真正待被执行的函数
      */
    inverse (index) {
        return function () {
            var imagesArrangArr = this.state.imagesArrangArr;

            imagesArrangArr[index].isInverse = !imagesArrangArr[index].isInverse;
            this.setState({
                imagesArrangArr:imagesArrangArr
            })
        }.bind(this);
    }

     /*
      * 重新布局所有图片
      * @param centerIndex  指定居中排布那个图片
      */
    rearrange(centerIndex){
        var imagesArrangArr = this.state.imagesArrangArr,
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
        topImgNum = Math.ceil(Math.random() * 2), // 娶一个或者不去
        topImgSpliceIndex = 0,

        imgsArrangeCenterArr = imagesArrangArr.splice(centerIndex,1);
    
        //首先居中 centerIndex d的图片  居中的图片不需要旋转
        imgsArrangeCenterArr[0] = {
            pos: centerPos,
            rotate: 0,
            isCenter: true
        }

        // 取出要布局上册的图片的状态信息
        Math.ceil(Math.random() * (imagesArrangArr.length - topImgNum));
        imgsArrangeTopArr = imagesArrangArr.splice(topImgSpliceIndex, topImgNum);

        //布局上册的图片

        imgsArrangeTopArr.forEach(function (value, index) {
            imgsArrangeTopArr[index] = {
                pos: {
                    top: getRangeRandom(vPosRangeTopY[0], vPosRangeTopY[1]),
                    left: getRangeRandom(vPosRangeX[0], vPosRangeX[1])
                },
                rotate: get30DegRandom(),
                isCenter: false
            }
        })

        // 布局俩测的图片
        for(var i = 0, j = imagesArrangArr.length, k = j / 2; i < j ; i++) {
            var hPosRangeLORX = null;

            // 前半部左边 后半部右边
            if(i < k) {
                hPosRangeLORX = hPosRangeLeftSecX;
            } else {
                hPosRangeLORX = hPosRangeRightSecX;
            }
            imagesArrangArr[i] = {
                pos: {
                    top: getRangeRandom(hPosRangeY[0], hPosRangeY[1]),
                    left: getRangeRandom(hPosRangeLORX[0], hPosRangeLORX[1])
                },
                rotate : get30DegRandom(),
                 isCenter: false
            }
        }

        if(imgsArrangeTopArr && imgsArrangeTopArr[0]) {
            imagesArrangArr.splice(topImgSpliceIndex, 0, imagesArrangArr[0]);
        }

        imagesArrangArr.splice(centerIndex, 0, imgsArrangeCenterArr[0]);

        this.setState({
            imagesArrangArr: imagesArrangArr
        })

    }

    // 组件加载以后为每张图片计算位子的范围
    componentDidMount() {
          // 首先拿到舞台的大小
    var stageDOM = ReactDOM.findDOMNode(this.refs.stage),
        stageW = stageDOM.scrollWidth,
        stageH = stageDOM.scrollHeight,
        halfStageW = Math.ceil(stageW / 2),
        halfStageH = Math.ceil(stageH / 2);
    //拿到一个imageFigure的大小
    var imgFigureDOM = ReactDOM.findDOMNode(this.refs.stage),
        imgW = 260,
        imgH = 390,
        halfImgW = Math.ceil(imgW / 2),
        halfImgH = Math.ceil(imgH / 2);
    this.props.Constant.centerPos = {
        left: halfStageW - halfImgW,
        top: halfStageH - halfImgH
    }

   
   // 计算左侧右侧区域的图片排布位置的取值范围
    this.props.Constant.hPosRange.leftSecX[0] = -halfImgW;
    this.props.Constant.hPosRange.leftSecX[1] = halfStageW - halfImgW * 3;
    this.props.Constant.hPosRange.rightSecX[0] = halfStageW + halfImgW;
    this.props.Constant.hPosRange.rightSecX[1] = stageW - halfImgW;
    this.props.Constant.hPosRange.y[0] = -halfImgH;
    this.props.Constant.hPosRange.y[1] = stageH - halfImgH;

    //计算上策区域图片排布位置的取值范围
    this.props.Constant.vPosRange.topY[0] = -halfImgH;
    this.props.Constant.vPosRange.topY[1] = halfStageH - halfImgH * 3;
    this.props.Constant.vPosRange.x[0] = halfStageW / 2 - imgW;
    this.props.Constant.vPosRange.x[1] = stageW * 3 / 4 ;
    this.rearrange(0);
    }
    /*
     * 利用rearrang函数 居中对应得INDEX的图片
     * @params index 需要被居中的图片的对应信息数组的index的值
     * return {function}
     */
    center(index) {
        return function () {
            this.rearrange(index);
        }.bind(this)
    }

	render() {
            let controllerUnits = [],
                imgFigures = [];

            imgDatas.forEach(function (value, index) {
                if(!this.state.imagesArrangArr[index]) {
                    this.state.imagesArrangArr[index] = {
                        pos: {
                            left: 0,
                            top: 0
                        },
                        rotate: 0,
                        isInverse: false, //图片是否反面
                        isCenter: false  //图片是否居中
                    }
                }

                imgFigures.push(<ImgFigure data = {value}  key={index} ref = {'imgFigure' +
                    index}  arrange = {this.state.imagesArrangArr[index]} inverse = {this.inverse(index)}
                    center = {this.center(index)}/>);
            }.bind(this));
		return (
			 <section className = "stage" ref = 'stage'>
                <section className = "img-sec">
                    {imgFigures}
                </section>
                <nav className = "controller-nav">
                    {controllerUnits}
                </nav>
            </section>
			);
	}
   
}

AppComponent.defaultProps = {
    Constant: {
        centerPos: {
            left: 0,
            right: 0
        },
        hPosRange: {  // 水平方向的取值范围
            leftSecX: [0,0],
            rightSecX: [0,0],
            y: [0,0]
        },
        vPosRange: {  // 垂直方向的取值范围
            x: [0,0],
            topY: [0,0]
        }
    }
};



export default AppComponent;

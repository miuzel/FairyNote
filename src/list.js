import React from 'react';
import {Timeline,Button} from 'antd';
import MyCard from './mycard';

class List extends React.Component {
  render = () => {
    if(this.props.items.length === 0) {
      return <div className="empty-state">
          <h1>点击添加按钮或者Ctrl+Shift+A添加记录</h1>
          <p class="caption"><em>I'm so empty and alone</em></p>
        </div>
    }
    return  <Timeline pending={
        <Button size="small" title="Ctrl/Command+Shift+A"
            shape="round" type="primary" id="addButton"
            icon="plus" onClick={this.props.appendTimeLine}>添加一项</Button>
        }>
        {
            this.props.items.map(
            (t, i) => <MyCard pos={i} cardData={t} key={i}
                handleCardChange={this.handleCardChange}
                handleCardDelete={this.handleCardDelete}
                handleCardInsert={this.handleCardInsert}
                handleTimeChange={this.cardSort}
                handleFocus={this.handleFocus}
                // highlight the active card , avoid confusion when re-sort cards.
                cardStyle={t.active? {background: "#fbfbfb"} : {}}
                knownGuests={this.state.knownGuests} root={document.querySelector("body > div")} />
            )
        }
        </Timeline>
  };
  componentWillReceiveProps = nextProps => {
    var component = this;
    if(this.props.items.length > 0) {
      var newState = this.props.items.reduce(function(state, child) {
        if(!child.key) return state;
        var currentState = component.state;
        var domNode = ReactDOM.findDOMNode(component.refs[child.key]);
        var boundingBox = domNode.getBoundingClientRect();

        currentState[child.key] = boundingBox;
        currentState.items = component.props.items;

        return currentState;
      });

      this.setState(newState);
    }
  };
  componentDidUpdate = previousProps => {
    if(!this.state) return;
    
    var component = this;
    var areDestroyed = [];
    var doNeedAnimation = [];
    
    previousProps.items.forEach(function(item) {
      if(component.doesNeedAnimation(item) === 0) {
        doNeedAnimation.push(item);
      }
    });
    
    doNeedAnimation.forEach(this.animateAndTransform.bind(this));
  };
  animateAndDestroy = (child, n) => {
    var domNode = ReactDOM.findDOMNode(this.refs[child.key]);
    
    requestAnimaytionFrame(function() {
      requestAnimationFrame(function() {
        domNode.style.opacity = "0";
        domNode.style.transform = "scale(2)"
      });
    });
  };
  animateAndTransform = (child, n) => {
    var domNode = ReactDOM.findDOMNode(this.refs[child.key]);
    
    var [dX, dY] = this.getPositionDelta(domNode, child.key);
    
    requestAnimationFrame(function(){
      domNode.style.transition = 'transform 0s';
      domNode.style.transform = 'translate('+ dX + 'px, ' + dY + 'px)';
      requestAnimationFrame(function() {
        domNode.style.transform  = '';
        domNode.style.transition = 'transform 400ms';
      })
    });
  };
  doesNeedAnimation = (child) => {
    var isNotMovable = !child.key;
    var isNew = !this.state[child.key];
    var isDestroyed = !this.refs[child.key];
    
    if(isDestroyed) return 2;
    if(isNotMovable || isNew) return;
    
    var domNode = ReactDOM.findDOMNode(this.refs[child.key]);
    var [dX, dY] = this.getPositionDelta(domNode, child.key);
    var isStationary = dX === 0 && dY === 0;

    return (isStationary === true) ? 1 : 0;
  };
  getPositionDelta = (domNode, key) => {
    var newBox = domNode.getBoundingClientRect();
    var oldBox = this.state[key];
    
    return [
      oldBox.left - newBox.left,
      oldBox.top - newBox.top
    ];
  },
  
})
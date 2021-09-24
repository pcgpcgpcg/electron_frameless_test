import React, { useEffect, useRef } from 'react';
import { MemoryRouter as Router, Switch, Route } from 'react-router-dom';
import icon from '../../assets/icon.svg';
import './App.global.css';
import Draggable, {DraggableCore} from 'react-draggable'; // Both at the same time
//import { ipcRenderer } from 'electron';

function isChildOf(child, parent) {
  var parentNode;
  if(child && parent) {
      parentNode = child.parentNode;
      while(parentNode) {
          if(parent === parentNode) {
              return true;
          }
          parentNode = parentNode.parentNode;
      }
  }
  return false;
}

const Hello = () => {
  const draggableDiv1 = useRef(null);
  const draggableDiv2 = useRef(null);
  const draggableVideo1 = React.createRef<HTMLVideoElement>();//useRef(null);
  const draggableVideo2 = React.createRef<HTMLVideoElement>();

  useEffect( async () => {
    const stream = await navigator.mediaDevices.getUserMedia({
      audio: false,
      video: true,
    });
    draggableVideo1.current.srcObject = stream;
    draggableVideo2.current.srcObject = stream;
    // window.addEventListener('mousemove', (event) => {
    //   const flag = (event.target === draggableVideo1.current
    //     || event.target === draggableVideo2.current
    //     || event.target.parentNode === );
    //   window.electron.ipcRenderer.sendMouseMove(flag);
    // });
    window.addEventListener('mousemove', (event)=>{
      const flag = (isChildOf(event.target,draggableDiv1.current)
      || isChildOf(event.target,draggableDiv2.current)
      || event.target === draggableDiv1.current
      || event.target === draggableDiv2.current);
      window.electron.ipcRenderer.sendMouseMove(flag);
    })
    return () => {
      window.removeEventListener('mousemove', (event) => {});
    };
  }, []);

  function handleClick(name) {
    console.log(`handleClick ${name}`);
  }
  return (
    <div>
      <h1>测试被控端窗口方案</h1>
      <Draggable>
        <div ref={draggableDiv1} className="App-share">
          <video className="App-share-video"
          ref={draggableVideo1}
          autoPlay
          muted
          controls={false}>
          </video>
          <button className="App-button" onClick={()=>handleClick("button1")}>静音</button>
        </div>
      </Draggable>
      <Draggable>
        <div ref={draggableDiv2} className="App-share">
          <video className="App-share-video"
          ref={draggableVideo2}
          autoPlay
          muted
          controls={false}>
          </video>
          <button className="App-button" onClick={()=>handleClick("button2")}>静音</button>
        </div>
      </Draggable>
    </div>
  );
};

export default function App() {
  return (
    <Router>
      <Switch>
        <Route path="/" component={Hello} />
      </Switch>
    </Router>
  );
}

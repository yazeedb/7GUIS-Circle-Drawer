import React, { useReducer, useRef } from 'react';
import { reducer, initialState } from './state';
import './App.css';

function App() {
  const [state, dispatch] = useReducer(reducer, initialState);
  console.log(state.circles);
  const boardRef = useRef<HTMLElement>(null);

  return (
    <main className="App">
      <h1>Circle Drawer</h1>

      <section
        ref={boardRef}
        style={{
          height: '100vh',
          position: 'relative',
        }}
        onClick={({ pageX, pageY }) => {
          if (!boardRef.current) {
            return;
          }

          const { offsetLeft, offsetTop } = boardRef.current;

          dispatch({
            type: 'DRAW_CIRCLE',
            x: pageX - offsetLeft,
            y: pageY - offsetTop,
          });
        }}
      >
        {state.circles.map((c, index) => (
          <div
            style={{
              borderRadius: '50%',
              border: '1px solid white',
              width: c.diameter,
              height: c.diameter,
              position: 'absolute',
              left: c.x,
              top: c.y,
              transform: 'translate(-50%, -50%)',
            }}
            className="circle"
            key={index.toString()}
            onClick={(event) => {
              // clicking a circle shouldn't
              // trigger a board click
              event.stopPropagation();
            }}
          />
        ))}
      </section>
    </main>
  );
}

export default App;

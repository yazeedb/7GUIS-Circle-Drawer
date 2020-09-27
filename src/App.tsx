import React, { useReducer, useRef } from 'react';
import { reducer, initialState } from './state';
import './App.css';

function App() {
  const [
    { circles, contextMenuOpen, selectedCircle, pastCircles, futureCircles },
    dispatch,
  ] = useReducer(reducer, initialState);

  const boardRef = useRef<HTMLElement>(null);

  return (
    <main>
      <header>
        <h1>Circle Drawer</h1>

        <button
          onClick={() => dispatch({ type: 'UNDO' })}
          disabled={pastCircles.length === 0}
        >
          Undo
        </button>
        <button
          onClick={() => dispatch({ type: 'REDO' })}
          disabled={futureCircles.length === 0}
        >
          Redo
        </button>
      </header>

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
        {circles.map((c, index) => {
          const circleToUse = c.id === selectedCircle.id ? selectedCircle : c;

          return (
            <div
              key={index.toString()}
              className="circle"
              style={{
                width: circleToUse.diameter,
                height: circleToUse.diameter,
                position: 'absolute',
                left: circleToUse.x,
                top: circleToUse.y,
              }}
              onClick={(event) => {
                // clicking a circle shouldn't trigger a board click
                event.stopPropagation();

                dispatch({
                  type: 'OPEN_CONTEXT_MENU',
                  circle: c,
                });
              }}
            />
          );
        })}
      </section>
      {contextMenuOpen && (
        <div
          style={{
            position: 'fixed',
            width: '100%',
            height: '100%',
            top: 0,
            left: 0,
          }}
          onClick={(event) => {
            // clicking menu shouldn't trigger a board click
            event.stopPropagation();

            dispatch({ type: 'CLOSE_CONTEXT_MENU' });
          }}
        >
          <div
            style={{
              left: selectedCircle.x,
              top: selectedCircle.y,
            }}
            className="diameter-popup"
            onClick={(event) => event.stopPropagation()}
          >
            <h3>
              Adjust diameter of circle at ({selectedCircle.x},{' '}
              {selectedCircle.y})
            </h3>

            <input
              type="range"
              min={5}
              max={500}
              value={selectedCircle.diameter}
              step={1}
              onChange={(event) =>
                dispatch({
                  type: 'CHANGE_DIAMETER',
                  diameter: parseFloat(event.target.value),
                })
              }
            />
          </div>
        </div>
      )}
    </main>
  );
}

export default App;

import React, { useEffect, useReducer, useRef } from 'react';
import { reducer, initialState, Circle } from './state';
import './App.css';

function App() {
  const [
    { circles, contextMenuOpen, selectedCircle, pastCircles, futureCircles },
    dispatch,
  ] = useReducer(reducer, initialState);

  const boardRef = useRef<HTMLElement>(null);

  const listener = ({ pageX, pageY }: MouseEvent) => {
    const closest = getClosest(pageX, pageY, circles);

    if (!closest) {
      dispatch({ type: 'CLEAR_SELECTION' });
    } else {
      dispatch({ type: 'SELECT_CIRCLE', circle: closest });
    }
  };

  useEffect(() => {
    document.addEventListener('mousemove', listener);

    return () => {
      document.removeEventListener('mousemove', listener);
    };
  }, [listener]);

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
        {circles.map((c) => {
          const isSelected = c.id === selectedCircle.id;
          const circleToUse = isSelected ? selectedCircle : c;

          return (
            <div
              key={c.id}
              className="circle"
              data-selected={isSelected}
              style={{
                width: circleToUse.diameter,
                height: circleToUse.diameter,
                left: circleToUse.x,
                top: circleToUse.y,
              }}
              onClick={(event) => {
                // clicking a circle shouldn't trigger a board click
                event.stopPropagation();

                dispatch({
                  type: 'OPEN_CONTEXT_MENU',
                });
              }}
            />
          );
        })}
      </section>
      {contextMenuOpen && (
        <div
          className="backdrop"
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
            className="menu"
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

const distanceBetween2Points = (
  x1: number,
  y1: number,
  x2: number,
  y2: number
) => {
  const { sqrt, pow } = Math;

  // √((x_2-x_1)²+(y_2-y_1)²)
  return sqrt(pow(x2 - x1, 2) + pow(y2 - y1, 2));
};

const getClosest = (x: number, y: number, circles: Circle[]) => {
  let closest;
  let minDistance = Number.MAX_VALUE;

  circles.forEach((c) => {
    const distance = distanceBetween2Points(x, y, c.x, c.y);
    const radius = c.diameter / 2;

    if (distance <= radius && distance < minDistance) {
      closest = c;
      minDistance = distance;
    }
  });

  return closest;
};

export default App;

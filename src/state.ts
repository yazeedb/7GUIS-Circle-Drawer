type Circle = {
  diameter: number;
  x: number;
  y: number;
};

export type Action =
  | { type: 'DRAW_CIRCLE'; x: number; y: number }
  | { type: 'OPEN_CONTEXT_MENU'; index: number }
  | { type: 'CLOSE_CONTEXT_MENU' }
  | { type: 'CHANGE_DIAMETER'; diameter: number }
  | { type: 'UNDO' }
  | { type: 'REDO' };

type State = {
  circles: Circle[];
  selectedCircleIndex: number;
  contextMenuOpen: boolean;
  pastCircles: Circle[][];
  futureCircles: Circle[][];
};

export const initialState: State = {
  circles: [],
  selectedCircleIndex: -1,
  contextMenuOpen: false,
  pastCircles: [],
  futureCircles: [],
};

export const reducer = (state: State, action: Action): State => {
  const { pastCircles, futureCircles, circles } = state;

  switch (action.type) {
    case 'DRAW_CIRCLE': {
      const { x, y } = action;

      return {
        ...state,
        circles: [...state.circles, createCircle(x, y)],
        pastCircles: [...pastCircles, state.circles],
        futureCircles: [],
      };
    }

    case 'OPEN_CONTEXT_MENU':
      return {
        ...state,
        selectedCircleIndex: action.index,
        contextMenuOpen: true,
      };

    case 'CLOSE_CONTEXT_MENU':
      return {
        ...state,
        contextMenuOpen: false,
        selectedCircleIndex: initialState.selectedCircleIndex,
      };

    case 'CHANGE_DIAMETER':
      return {
        ...state,
        pastCircles: [...pastCircles, state.circles],
        futureCircles: [],
        circles: state.circles.map((c, index) =>
          index !== state.selectedCircleIndex
            ? c
            : {
                ...c,
                diameter: action.diameter,
              }
        ),
      };

    case 'UNDO': {
      if (pastCircles.length === 0) {
        return state;
      }

      const len = pastCircles.length - 1;
      const lastCircles = pastCircles[len];

      return {
        ...state,
        pastCircles: pastCircles.slice(0, len),
        circles: lastCircles,
        futureCircles: [circles, ...futureCircles],
      };
    }

    case 'REDO': {
      if (futureCircles.length === 0) {
        return state;
      }

      const [lastCircles, ...rest] = futureCircles;

      return {
        ...state,
        futureCircles: rest,
        circles: lastCircles,
        pastCircles: [...pastCircles, circles],
      };
    }
  }
};

const createCircle = (x: number, y: number): Circle => ({
  diameter: 30,
  x,
  y,
});

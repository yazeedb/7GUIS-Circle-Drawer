let globalId = 0;

export type Circle = {
  id: number;
  diameter: number;
  x: number;
  y: number;
};

export type Action =
  | { type: 'DRAW_CIRCLE'; x: number; y: number }
  | { type: 'SELECT_CIRCLE'; circle: Circle }
  | { type: 'CLEAR_SELECTION' }
  | { type: 'OPEN_CONTEXT_MENU' }
  | { type: 'CLOSE_CONTEXT_MENU' }
  | { type: 'CHANGE_DIAMETER'; diameter: number }
  | { type: 'UNDO' }
  | { type: 'REDO' };

type State = {
  circles: Circle[];
  selectedCircle: Circle;
  contextMenuOpen: boolean;
  pastCircles: Circle[][];
  futureCircles: Circle[][];
};

export const initialState: State = {
  circles: [],
  selectedCircle: { id: -1, diameter: 0, x: 0, y: 0 },
  contextMenuOpen: false,
  pastCircles: [],
  futureCircles: [],
};

export const reducer = (state: State, action: Action): State => {
  const { pastCircles, futureCircles, circles, selectedCircle } = state;

  if (
    state.contextMenuOpen &&
    action.type !== 'CHANGE_DIAMETER' &&
    action.type !== 'CLOSE_CONTEXT_MENU'
  ) {
    return state;
  }

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
        contextMenuOpen: true,
      };

    case 'SELECT_CIRCLE':
      return {
        ...state,
        selectedCircle: action.circle,
      };

    case 'CLEAR_SELECTION':
      if (state.contextMenuOpen) {
        return state;
      }

      return {
        ...state,
        selectedCircle: initialState.selectedCircle,
      };

    case 'CLOSE_CONTEXT_MENU':
      return {
        ...state,
        pastCircles: [...pastCircles, state.circles],
        futureCircles: [],
        contextMenuOpen: false,
        selectedCircle: initialState.selectedCircle,
        circles: state.circles.map((c) =>
          c.id !== selectedCircle.id
            ? c
            : {
                ...c,
                diameter: selectedCircle.diameter,
              }
        ),
      };

    case 'CHANGE_DIAMETER':
      if (selectedCircle === null) {
        return state;
      }

      return {
        ...state,
        selectedCircle: {
          ...selectedCircle,
          diameter: action.diameter,
        },
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
  id: globalId++,
  diameter: 30,
  x,
  y,
});

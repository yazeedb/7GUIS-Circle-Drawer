type Circle = {
  diameter: number;
  x: number;
  y: number;
};

export type Action =
  | { type: 'DRAW_CIRCLE'; x: number; y: number }
  | { type: 'OPEN_CONTEXT_MENU'; index: number }
  | { type: 'CLOSE_CONTEXT_MENU' }
  | { type: 'CHANGE_DIAMETER'; diameter: number };

type State = {
  circles: Circle[];
  selectedCircleIndex: number;
  contextMenuOpen: boolean;
};

export const initialState: State = {
  circles: [],
  selectedCircleIndex: -1,
  contextMenuOpen: false,
};

export const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case 'DRAW_CIRCLE': {
      const { x, y } = action;

      return {
        ...state,
        circles: [...state.circles, createCircle(x, y)],
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
        circles: state.circles.map((c, index) =>
          index !== state.selectedCircleIndex
            ? c
            : {
                ...c,
                diameter: action.diameter,
              }
        ),
      };
  }
};

const createCircle = (x: number, y: number): Circle => ({
  diameter: 30,
  x,
  y,
});

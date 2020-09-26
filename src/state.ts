type Circle = {
  diameter: number;
  x: number;
  y: number;
};

export type Action = {
  type: 'DRAW_CIRCLE';
  x: number;
  y: number;
};

type State = {
  circles: Circle[];
};

export const initialState: State = {
  circles: [],
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
  }
};

const createCircle = (x: number, y: number): Circle => ({
  diameter: 30,
  x,
  y,
});

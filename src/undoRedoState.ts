export type Action =
  | { type: 'PLUS' }
  | { type: 'MINUS' }
  | { type: 'DOUBLE' }
  | { type: 'UNDO' }
  | { type: 'REDO' };

type State = {
  count: number;
  pastCounts: number[];
  futureCounts: number[];
};

export const initialState: State = {
  count: 0,
  pastCounts: [],
  futureCounts: [],
};

const reducerImpl = (state: State, action: Action): State => {
  const { count, pastCounts, futureCounts } = state;

  switch (action.type) {
    case 'PLUS':
      return {
        count: count + 1,
        pastCounts: [...pastCounts, count],
        futureCounts: [],
      };

    case 'MINUS':
      return {
        count: count - 1,
        pastCounts: [...pastCounts, count],
        futureCounts: [],
      };

    case 'DOUBLE':
      return {
        count: count * 2,
        pastCounts: [...pastCounts, count],
        futureCounts: [],
      };

    case 'UNDO': {
      if (pastCounts.length === 0) {
        return state;
      }

      const len = pastCounts.length - 1;
      const lastCount = pastCounts[len];

      return {
        pastCounts: pastCounts.slice(0, len),
        count: lastCount,
        futureCounts: [count, ...futureCounts],
      };
    }

    case 'REDO': {
      if (futureCounts.length === 0) {
        return state;
      }

      const [lastCount, ...rest] = futureCounts;

      return {
        futureCounts: rest,
        count: lastCount,
        pastCounts: [...pastCounts, count],
      };
    }
  }
};

export const reducer = (state: State, action: Action) => {
  const result = reducerImpl(state, action);

  console.log(
    action.type,
    '-->',
    result.pastCounts,
    result.count,
    result.futureCounts
  );

  return result;
};

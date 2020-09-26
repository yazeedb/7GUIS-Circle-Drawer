import { Action, initialState, reducer } from './undoRedoState';

describe('undo', () => {
  it('can be safely spammed', () => {
    const actions: Action[] = [
      { type: 'PLUS' },
      { type: 'PLUS' },
      { type: 'UNDO' },
      { type: 'UNDO' },
      { type: 'UNDO' },
      { type: 'UNDO' },
    ];

    const result = actions.reduce(reducer, initialState);

    expect(result.count).toBe(0);
  });
});

describe('redo', () => {
  it('can be safely spammed', () => {
    console.log('-------------test 2-------------');
    const actions: Action[] = [
      { type: 'PLUS' },
      { type: 'PLUS' },

      { type: 'UNDO' },
      { type: 'UNDO' },
      { type: 'REDO' },
      { type: 'REDO' },
      { type: 'REDO' },
      { type: 'REDO' },
      { type: 'REDO' },
      { type: 'REDO' },

      { type: 'DOUBLE' },

      { type: 'REDO' },
      { type: 'REDO' },
      { type: 'REDO' },

      { type: 'DOUBLE' },

      { type: 'UNDO' },
      { type: 'UNDO' },

      { type: 'REDO' },
      { type: 'DOUBLE' },
      { type: 'UNDO' },
      { type: 'DOUBLE' },
    ];

    const result = actions.reduce(reducer, initialState);

    expect(result.count).toBe(8);
  });
});

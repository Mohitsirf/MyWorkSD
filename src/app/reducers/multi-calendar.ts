import {MultiCalendar} from '../models/multi-calendar';
import {Action} from '../actions/action';
import {INDEX_REQUEST, INDEX_SUCCESS} from '../actions/multi-calendar';

export interface State {
  entities: { [key: string]: MultiCalendar };
  loading: string[];
  loaded: string[];

}

export const initialState: State = {
  entities: {},
  loading: [],
  loaded: []
};


export function reducer(state = initialState, action: Action): State {
  switch (action.type) {
    case INDEX_REQUEST: {
      const index = action.payload;
      let loadingIndices = state.loading;

      if (state.loading.indexOf(index) === -1) {
        loadingIndices = [
          ...state.loading,
          index
        ];
      }

      return {
        ...state,
        loading: loadingIndices
      };
    }
    case INDEX_SUCCESS: {
      const index = action.payload.key;
      const data = action.payload.data;

      const newLoadingIndices = state.loading.filter(item => {
        return item !== index;
      });

      let newLoadedIndices = state.loaded;
      if (state.loaded.indexOf(index) === -1) {
        newLoadedIndices = [
          ...state.loaded,
          index
        ];
      }

      return {
        ...state,
        loading: newLoadingIndices,
        loaded: newLoadedIndices,
        entities: {
          ...state.entities,
          [index]: data
        }
      };
    }
    default: {
      return state;
    }
  }
}


export const getIsMonthCalendarLoading = (state: State, month: number, year: number) => {
  const index = month + '/' + year;
  return state.loading.indexOf(index) > -1;
};
export const getIsMonthCalendarLoaded = (state: State, month: number, year: number) => {
  const index = month + '/' + year;
  return state.loaded.indexOf(index) > -1;
};

export const getByMonth = (state: State, month: number, year: number) => {
  const index = month + '/' + year;
  return state.entities[index];
};



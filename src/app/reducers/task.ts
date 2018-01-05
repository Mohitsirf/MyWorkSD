import {Task} from '../models/task';
import {Action} from '../actions/action';
import {
  CREATE_REQUEST, CREATE_SUCCESS, INDEX_REQUEST, INDEX_SUCCESS, UPDATE_REQUEST,
  UPDATE_SUCCESS, AUTO_TASK_INDEX_REQUEST, AUTO_TASK_INDEX_SUCCESS, AUTO_TASK_CREATE_REQUEST, AUTO_TASK_CREATE_SUCCESS,
  AUTO_TASK_UPDATE_REQUEST,
  AUTO_TASK_UPDATE_SUCCESS, AUTO_TASK_DELETE_SUCCESS, DELETE_SUCCESS
} from '../actions/task';
import Utils from '../utils';
import {createSelector} from 'reselect';
import {AutoTask} from '../models/auto-task';

export interface State {
  ids: number[];
  entities: { [id: number]: Task };
  loading: boolean;
  loaded: boolean;

  autoTasksIds: number[],
  autoTaskEntities: { [id: number]: AutoTask };
  autoTasksLoading: boolean,
  autoTasksLoaded: boolean
}

export const initialState: State = {
  ids: [],
  entities: {},
  loading: false,
  loaded: false,

  autoTasksIds: [],
  autoTaskEntities: {},
  autoTasksLoading: false,
  autoTasksLoaded: false

};

export function reducer(state = initialState, action: Action): State {
  switch (action.type) {
    case INDEX_REQUEST: {
      return Object.assign({}, state, {loading: true});
    }
    case INDEX_SUCCESS: {
      const tasks = action.payload;
      const taskIds = tasks.map(task => task.id);
      const entities = Utils.normalize(tasks);
      return Object.assign({}, state, {ids: taskIds, entities: entities, loaded: true, loading: false});
    }

    case CREATE_REQUEST: {
      return Object.assign({}, state, {});
    }

    case CREATE_SUCCESS: {
      const newTask = action.payload;
      const newTaskId = newTask.id;

      return {
        ...state,
        entities: {
          ...state.entities,
          [newTaskId]: newTask
        },
        ids: [
          ...state.ids,
          newTaskId
        ]
      };
    }

    case UPDATE_REQUEST: {
      return Object.assign({}, state, {});
    }

    case UPDATE_SUCCESS: {
      const newTask = action.payload;
      const newTaskId = newTask.id;

      let taskIds = state.ids;
      if (state.ids.indexOf(newTaskId) === -1) {
        taskIds = [
          ...state.ids,
          newTaskId
        ];
      }

      return {
        ...state,
        entities: {
          ...state.entities,
          [newTaskId]: newTask
        },
        ids: taskIds
      };
    }

    case DELETE_SUCCESS: {
      const taskId = action.payload.taskId;

      let tasks = Utils.getObjectValues(state.entities);


      tasks = tasks.filter(task =>  task.id != taskId);

      const taskIds = tasks.map(message => message.id);
      const entities = Utils.normalize(tasks);

      return {
        ...state,
        entities: entities,
        ids : taskIds
      };
    }


    // Auto Tasks

    case AUTO_TASK_INDEX_REQUEST: {
      return Object.assign({}, state, {autoTasksLoading: true});
    }
    case AUTO_TASK_INDEX_SUCCESS: {
      const autoTasks = action.payload;
      const autoTasksIds = autoTasks.map(autoTask => autoTask.id);
      const entities = Utils.normalize(autoTasks);
      return Object.assign({}, state, {autoTasksIds: autoTasksIds, autoTaskEntities: entities, autoTasksLoaded: true, autoTasksLoading: false});
    }

    case AUTO_TASK_CREATE_REQUEST: {
      return Object.assign({}, state, {});
    }

    case AUTO_TASK_CREATE_SUCCESS: {
      const newAutoTask = action.payload;
      const newAutoTaskId = newAutoTask.id;

      return {
        ...state,
        autoTaskEntities: {
          ...state.autoTaskEntities,
          [newAutoTaskId]: newAutoTask
        },
        autoTasksIds: [
          ...state.autoTasksIds,
          newAutoTaskId
        ]
      };
    }

    case AUTO_TASK_UPDATE_REQUEST: {
      return Object.assign({}, state, {});
    }

    case AUTO_TASK_UPDATE_SUCCESS: {
      const newAutoTask = action.payload;
      const newAutoTaskId = newAutoTask.id;

      let autoTaskIds = state.autoTasksIds;
      if (state.autoTasksIds.indexOf(newAutoTaskId) === -1) {
        autoTaskIds = [
          ...state.autoTasksIds,
          newAutoTaskId
        ];
      }

      return {
        ...state,
        autoTaskEntities: {
          ...state.autoTaskEntities,
          [newAutoTaskId]: newAutoTask
        },
        autoTasksIds: autoTaskIds
      };
    }

    case AUTO_TASK_DELETE_SUCCESS: {
      const taskId = action.payload.taskId;

      let autoTasks = Utils.getObjectValues(state.autoTaskEntities);


      autoTasks = autoTasks.filter(task =>  task.id != taskId);

      const taskIds = autoTasks.map(message => message.id);
      const entities = Utils.normalize(autoTasks);

      return {
        ...state,
        autoTaskEntities: entities,
        autoTasksIds : taskIds
      };
    }


    default: {
      return state;
    }
  }
}


export const getIsLoading = (state: State) => state.loading;
export const getIsLoaded = (state: State) => state.loaded;
export const getEntities = (state: State) => state.entities;

export const getIds = (state: State) => state.ids;

export const getAll = createSelector(getEntities, getIds, (entities, ids) => {
  return ids.map(id => entities[id]);
});

export const getById = (state: State, taskId: number) => state.entities[taskId];

// Auto Tasks

export const getIsAutoTaskLoading = (state: State) => state.autoTasksLoading;
export const getIsAutoTaskLoaded = (state: State) => state.autoTasksLoaded;
export const getAutoTaskEntities = (state: State) => state.autoTaskEntities;

export const getAutoTaskIds = (state: State) => state.autoTasksIds;

export const getAllAutoTasks = createSelector(getAutoTaskEntities, getAutoTaskIds, (entities, ids) => {
  return ids.map(id => entities[id]);
});

export const getAutoTaskById = (state: State, taskId: number) => state.autoTaskEntities[taskId];

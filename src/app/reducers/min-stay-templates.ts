import {Action} from '../actions/action';
import {
  CREATE_REQUEST,
  CREATE_SUCCESS, DELETE_SUCCESS, INDEX_REQUEST, INDEX_SUCCESS,
  UPDATE_REQUEST,
  UPDATE_SUCCESS
} from '../actions/min-stays-template';
import {createSelector} from 'reselect';
import Utils from '../utils';
import {MinimumStay} from "../models/minimum-stay";


export interface State {

  templateIds:number[];
  templates: { [id: string]: MinimumStay };
  templatesLoading: boolean;
  templatesLoaded: boolean;

}

export const initialState: State = {

  templateIds:[],
  templates: {},
  templatesLoading: false,
  templatesLoaded: false,

};

export function reducer(state = initialState, action: Action): State {
  switch (action.type) {


    case INDEX_REQUEST: {
      return Object.assign({}, state, {templatesLoading: true});

    }

    case INDEX_SUCCESS: {
      const templates = action.payload.templates;
      const templateIds = templates.map(template => template.id);
      const entities = Utils.normalize(templates);
      return Object.assign({}, state, {templatesLoaded: true, templateIds: templateIds, templatesLoading: false, templates: entities});

    }

    case DELETE_SUCCESS: {
      const templateId = action.payload.templateId;

      let templates = Utils.getObjectValues(state.templates);


      templates = templates.filter(template =>  template.id != templateId);

      const templateIds = templates.map(template => template.id);
      const entities = Utils.normalize(templates);

      return {
        ...state,
        templates: entities,
        templateIds : templateIds
      };
    }

    case CREATE_SUCCESS: {
      const newTemplate = action.payload.template;
      const newTemplateId = newTemplate.id;


      return {
        ...state,
        templates: {
          ...state.templates,
          [newTemplateId]: newTemplate
        },
        templateIds: [
          ...state.templateIds,
          newTemplateId
        ]
      };
    }

    case UPDATE_SUCCESS: {
      const updatedTemplate = action.payload.template;
      const id = updatedTemplate.id;


      return {
        ...state,
        templates: {
          ...state.templates,
          [id]: updatedTemplate
        }

      };
    }


    default: {
      return state;
    }
  }
}


export const getMinStaysTemplateEntities = (state: State) => state.templates;
export const getMinStaysTemplateIds = (state: State) => state.templateIds;

export const isMinStaysTemplatesLoading = (state: State) => state.templatesLoading;
export const isMinStaysTemplatesLoaded = (state: State) => state.templatesLoaded;
export const getMinStaysTemplates = createSelector(getMinStaysTemplateEntities, getMinStaysTemplateIds, (entities, ids) => {
  return ids.map(id => entities[id]);
});

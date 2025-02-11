import { productConfig } from '../../config';
import { reduxTypes } from '../types';
import { reduxHelpers } from '../common/reduxHelpers';
import { RHSM_API_QUERY_SET_TYPES as RHSM_API_QUERY_TYPES } from '../../services/rhsm/rhsmConstants';

/**
 * View query related user state reducer.
 *
 * @memberof Reducers
 * @module ViewReducer
 */

/**
 * Initial state.
 *
 * @private
 * @type {{product: {}, graphTallyQuery: {}, inventoryHostsQuery: {}, inventorySubscriptionsQuery: {},
 *     query: {}, productConfig: {}, inventoryGuestsQuery: {}}}
 */
const initialState = {
  query: {},
  graphTallyQuery: {},
  inventoryGuestsQuery: {},
  inventoryHostsQuery: {},
  inventorySubscriptionsQuery: {},
  product: {},
  productConfig: {}
};

/**
 * Apply user observer/reducer logic for views to state, against actions.
 *
 * @param {object} state
 * @param {object} action
 * @returns {object|{}}
 */
const viewReducer = (state = initialState, action) => {
  switch (action.type) {
    case reduxTypes.app.SET_PRODUCT_VARIANT_QUERY_RESET_ALL:
      const updateVariantResetQueries = (query = {}, id) => {
        const queryIds =
          productConfig.sortedConfigs().byGroupIdConfigs[id]?.map(({ viewId }) => viewId) || (query[id] && [id]) || [];
        const updatedQuery = { ...query };

        queryIds.forEach(queryId => {
          delete updatedQuery[queryId];
        });

        return updatedQuery;
      };

      return reduxHelpers.setStateProp(
        null,
        {
          ...state,
          query: updateVariantResetQueries(state.query, action.productGroup),
          graphTallyQuery: updateVariantResetQueries(state.graphTallyQuery, action.productGroup),
          inventoryGuestsQuery: updateVariantResetQueries(state.inventoryGuestsQuery, action.productGroup),
          inventoryHostsQuery: updateVariantResetQueries(state.inventoryHostsQuery, action.productGroup),
          inventorySubscriptionsQuery: updateVariantResetQueries(state.inventorySubscriptionsQuery, action.productGroup)
        },
        {
          state,
          reset: false
        }
      );
    case reduxTypes.query.SET_QUERY_RESET_INVENTORY_LIST:
      const updateResetQueries = (query = {}, id) => {
        const queryIds = productConfig.sortedConfigs().byViewIds[id] || (query[id] && [id]) || [];
        const updatedQuery = { ...query };

        queryIds.forEach(queryId => {
          const productQuery = updatedQuery[queryId] || {};

          if (typeof productQuery[RHSM_API_QUERY_TYPES.OFFSET] === 'number') {
            productQuery[RHSM_API_QUERY_TYPES.OFFSET] = 0;
          }

          delete productQuery[RHSM_API_QUERY_TYPES.DIRECTION];
          delete productQuery[RHSM_API_QUERY_TYPES.SORT];
        });

        return updatedQuery;
      };

      return reduxHelpers.setStateProp(
        null,
        {
          ...state,
          inventoryHostsQuery: updateResetQueries(state.inventoryHostsQuery, action.viewId),
          inventorySubscriptionsQuery: updateResetQueries(state.inventorySubscriptionsQuery, action.viewId)
        },
        {
          state,
          reset: false
        }
      );
    case reduxTypes.query.SET_QUERY_CLEAR_INVENTORY_LIST:
      const updateClearQueries = (query = {}, id) => {
        const queryIds = productConfig.sortedConfigs().byViewIds[id] || (query[id] && [id]) || [];
        const updatedQuery = { ...query };

        queryIds.forEach(queryId => {
          const productQuery = updatedQuery[queryId] || {};

          if (typeof productQuery[RHSM_API_QUERY_TYPES.OFFSET] === 'number') {
            productQuery[RHSM_API_QUERY_TYPES.OFFSET] = 0;
          }
        });

        return updatedQuery;
      };

      return reduxHelpers.setStateProp(
        null,
        {
          ...state,
          inventoryHostsQuery: updateClearQueries(state.inventoryHostsQuery, action.viewId),
          inventorySubscriptionsQuery: updateClearQueries(state.inventorySubscriptionsQuery, action.viewId)
        },
        {
          state,
          reset: false
        }
      );
    case reduxTypes.query.SET_QUERY_CLEAR_INVENTORY_GUESTS_LIST:
      const updateClearGuestQuery = (query = {}, id) => {
        const queryIds = productConfig.sortedConfigs().byViewIds[id] || (query[id] && [id]) || [];
        const updatedQuery = { ...query };

        queryIds.forEach(queryId => {
          const productQuery = updatedQuery[queryId] || {};

          if (typeof productQuery[RHSM_API_QUERY_TYPES.OFFSET] === 'number') {
            productQuery[RHSM_API_QUERY_TYPES.OFFSET] = 0;
          }
        });

        return updatedQuery;
      };

      return reduxHelpers.setStateProp(
        null,
        {
          ...state,
          inventoryGuestsQuery: updateClearGuestQuery(state.inventoryGuestsQuery, action.viewId)
        },
        {
          state,
          reset: false
        }
      );
    case reduxTypes.query.SET_QUERY_CLEAR:
      return reduxHelpers.setStateProp(
        'query',
        {
          [action.viewId]: {
            ...state.query[action.viewId],
            ...action.clearFilters
          }
        },
        {
          state,
          reset: false
        }
      );
    case reduxTypes.query.SET_QUERY:
      return reduxHelpers.setStateProp(
        'query',
        {
          [action.viewId]: {
            ...state.query[action.viewId],
            [action.filter]: action.value
          }
        },
        {
          state,
          reset: false
        }
      );
    case reduxTypes.query.SET_QUERY_RHSM_TYPES[RHSM_API_QUERY_TYPES.GRANULARITY]:
      return reduxHelpers.setStateProp(
        'graphTallyQuery',
        {
          [action.viewId]: {
            ...state.graphTallyQuery[action.viewId],
            [RHSM_API_QUERY_TYPES.GRANULARITY]: action[RHSM_API_QUERY_TYPES.GRANULARITY]
          }
        },
        {
          state,
          reset: false
        }
      );
    case reduxTypes.query.SET_QUERY_RHSM_TYPES[RHSM_API_QUERY_TYPES.START_DATE]:
      return reduxHelpers.setStateProp(
        'query',
        {
          [action.viewId]: {
            ...state.query[action.viewId],
            [RHSM_API_QUERY_TYPES.START_DATE]: action[RHSM_API_QUERY_TYPES.START_DATE]
          }
        },
        {
          state,
          reset: false
        }
      );
    case reduxTypes.query.SET_QUERY_RHSM_TYPES[RHSM_API_QUERY_TYPES.END_DATE]:
      return reduxHelpers.setStateProp(
        'query',
        {
          [action.viewId]: {
            ...state.query[action.viewId],
            [RHSM_API_QUERY_TYPES.END_DATE]: action[RHSM_API_QUERY_TYPES.END_DATE]
          }
        },
        {
          state,
          reset: false
        }
      );
    case reduxTypes.query.SET_QUERY_RHSM_TYPES[RHSM_API_QUERY_TYPES.BILLING_PROVIDER]:
      return reduxHelpers.setStateProp(
        'query',
        {
          [action.viewId]: {
            ...state.query[action.viewId],
            [RHSM_API_QUERY_TYPES.BILLING_PROVIDER]: action[RHSM_API_QUERY_TYPES.BILLING_PROVIDER]
          }
        },
        {
          state,
          reset: false
        }
      );
    case reduxTypes.query.SET_QUERY_RHSM_TYPES[RHSM_API_QUERY_TYPES.SLA]:
      return reduxHelpers.setStateProp(
        'query',
        {
          [action.viewId]: {
            ...state.query[action.viewId],
            [RHSM_API_QUERY_TYPES.SLA]: action[RHSM_API_QUERY_TYPES.SLA]
          }
        },
        {
          state,
          reset: false
        }
      );
    case reduxTypes.query.SET_QUERY_RHSM_TYPES[RHSM_API_QUERY_TYPES.UOM]:
      return reduxHelpers.setStateProp(
        'query',
        {
          [action.viewId]: {
            ...state.query[action.viewId],
            [RHSM_API_QUERY_TYPES.UOM]: action[RHSM_API_QUERY_TYPES.UOM]
          }
        },
        {
          state,
          reset: false
        }
      );
    case reduxTypes.query.SET_QUERY_RHSM_TYPES[RHSM_API_QUERY_TYPES.USAGE]:
      return reduxHelpers.setStateProp(
        'query',
        {
          [action.viewId]: {
            ...state.query[action.viewId],
            [RHSM_API_QUERY_TYPES.USAGE]: action[RHSM_API_QUERY_TYPES.USAGE]
          }
        },
        {
          state,
          reset: false
        }
      );
    case reduxTypes.query.SET_QUERY_RHSM_GUESTS_INVENTORY_TYPES[RHSM_API_QUERY_TYPES.LIMIT]:
      return reduxHelpers.setStateProp(
        'inventoryGuestsQuery',
        {
          [action.viewId]: {
            ...state.inventoryGuestsQuery[action.viewId],
            [RHSM_API_QUERY_TYPES.LIMIT]: action[RHSM_API_QUERY_TYPES.LIMIT]
          }
        },
        {
          state,
          reset: false
        }
      );
    case reduxTypes.query.SET_QUERY_RHSM_GUESTS_INVENTORY_TYPES[RHSM_API_QUERY_TYPES.OFFSET]:
      return reduxHelpers.setStateProp(
        'inventoryGuestsQuery',
        {
          [action.viewId]: {
            ...state.inventoryGuestsQuery[action.viewId],
            [RHSM_API_QUERY_TYPES.OFFSET]: action[RHSM_API_QUERY_TYPES.OFFSET]
          }
        },
        {
          state,
          reset: false
        }
      );
    case reduxTypes.query.SET_QUERY_RHSM_HOSTS_INVENTORY_TYPES[RHSM_API_QUERY_TYPES.DISPLAY_NAME]:
      return reduxHelpers.setStateProp(
        'inventoryHostsQuery',
        {
          [action.viewId]: {
            ...state.inventoryHostsQuery[action.viewId],
            [RHSM_API_QUERY_TYPES.DISPLAY_NAME]: action[RHSM_API_QUERY_TYPES.DISPLAY_NAME]
          }
        },
        {
          state,
          reset: false
        }
      );
    case reduxTypes.query.SET_QUERY_RHSM_HOSTS_INVENTORY_TYPES[RHSM_API_QUERY_TYPES.LIMIT]:
      return reduxHelpers.setStateProp(
        'inventoryHostsQuery',
        {
          [action.viewId]: {
            ...state.inventoryHostsQuery[action.viewId],
            [RHSM_API_QUERY_TYPES.LIMIT]: action[RHSM_API_QUERY_TYPES.LIMIT]
          }
        },
        {
          state,
          reset: false
        }
      );
    case reduxTypes.query.SET_QUERY_RHSM_HOSTS_INVENTORY_TYPES[RHSM_API_QUERY_TYPES.OFFSET]:
      return reduxHelpers.setStateProp(
        'inventoryHostsQuery',
        {
          [action.viewId]: {
            ...state.inventoryHostsQuery[action.viewId],
            [RHSM_API_QUERY_TYPES.OFFSET]: action[RHSM_API_QUERY_TYPES.OFFSET]
          }
        },
        {
          state,
          reset: false
        }
      );
    case reduxTypes.query.SET_QUERY_RHSM_HOSTS_INVENTORY_TYPES[RHSM_API_QUERY_TYPES.DIRECTION]:
      return reduxHelpers.setStateProp(
        'inventoryHostsQuery',
        {
          [action.viewId]: {
            ...state.inventoryHostsQuery[action.viewId],
            [RHSM_API_QUERY_TYPES.DIRECTION]: action[RHSM_API_QUERY_TYPES.DIRECTION]
          }
        },
        {
          state,
          reset: false
        }
      );
    case reduxTypes.query.SET_QUERY_RHSM_HOSTS_INVENTORY_TYPES[RHSM_API_QUERY_TYPES.SORT]:
      return reduxHelpers.setStateProp(
        'inventoryHostsQuery',
        {
          [action.viewId]: {
            ...state.inventoryHostsQuery[action.viewId],
            [RHSM_API_QUERY_TYPES.SORT]: action[RHSM_API_QUERY_TYPES.SORT]
          }
        },
        {
          state,
          reset: false
        }
      );
    case reduxTypes.query.SET_QUERY_RHSM_SUBSCRIPTIONS_INVENTORY_TYPES[RHSM_API_QUERY_TYPES.LIMIT]:
      return reduxHelpers.setStateProp(
        'inventorySubscriptionsQuery',
        {
          [action.viewId]: {
            ...state.inventorySubscriptionsQuery[action.viewId],
            [RHSM_API_QUERY_TYPES.LIMIT]: action[RHSM_API_QUERY_TYPES.LIMIT]
          }
        },
        {
          state,
          reset: false
        }
      );
    case reduxTypes.query.SET_QUERY_RHSM_SUBSCRIPTIONS_INVENTORY_TYPES[RHSM_API_QUERY_TYPES.OFFSET]:
      return reduxHelpers.setStateProp(
        'inventorySubscriptionsQuery',
        {
          [action.viewId]: {
            ...state.inventorySubscriptionsQuery[action.viewId],
            [RHSM_API_QUERY_TYPES.OFFSET]: action[RHSM_API_QUERY_TYPES.OFFSET]
          }
        },
        {
          state,
          reset: false
        }
      );
    case reduxTypes.query.SET_QUERY_RHSM_SUBSCRIPTIONS_INVENTORY_TYPES[RHSM_API_QUERY_TYPES.DIRECTION]:
      return reduxHelpers.setStateProp(
        'inventorySubscriptionsQuery',
        {
          [action.viewId]: {
            ...state.inventorySubscriptionsQuery[action.viewId],
            [RHSM_API_QUERY_TYPES.DIRECTION]: action[RHSM_API_QUERY_TYPES.DIRECTION]
          }
        },
        {
          state,
          reset: false
        }
      );
    case reduxTypes.query.SET_QUERY_RHSM_SUBSCRIPTIONS_INVENTORY_TYPES[RHSM_API_QUERY_TYPES.SORT]:
      return reduxHelpers.setStateProp(
        'inventorySubscriptionsQuery',
        {
          [action.viewId]: {
            ...state.inventorySubscriptionsQuery[action.viewId],
            [RHSM_API_QUERY_TYPES.SORT]: action[RHSM_API_QUERY_TYPES.SORT]
          }
        },
        {
          state,
          reset: false
        }
      );
    case reduxTypes.app.SET_PRODUCT:
      return reduxHelpers.setStateProp(
        'product',
        {
          config: action.config
        },
        {
          state,
          reset: false
        }
      );
    case reduxTypes.app.SET_PRODUCT_VARIANT:
      return reduxHelpers.setStateProp(
        'product',
        {
          variant: {
            ...state?.product?.variant,
            [action.productGroup]: action.variant
          }
        },
        {
          state,
          reset: false
        }
      );
    default:
      return state;
  }
};

viewReducer.initialState = initialState;

export { viewReducer as default, initialState, viewReducer };

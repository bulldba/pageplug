import {
  ReduxAction,
  ReduxActionErrorTypes,
  ReduxActionTypes,
} from "@appsmith/constants/ReduxActionConstants";
import { createBrandColorsFromPrimaryColor } from "utils/BrandingUtils";
import { createReducer } from "utils/ReducerUtils";

export interface TenantReduxState {
  userPermissions: string[];
  tenantConfiguration: Record<string, any>;
  new: boolean;
}

export const defaultBrandingConfig = {
  brandFaviconUrl: "/static/img/favicon-pageplug.ico",
  brandColors: {
    ...createBrandColorsFromPrimaryColor("#2CBBA6"),
  },
  brandLogoUrl: "/static/img/pageplug_logo_black.svg",
};

export const initialState: TenantReduxState = {
  userPermissions: [],
  tenantConfiguration: {
    brandColors: {
      ...createBrandColorsFromPrimaryColor("#000"),
    },
  },
  new: false,
};

export const handlers = {
  [ReduxActionTypes.FETCH_CURRENT_TENANT_CONFIG_SUCCESS]: (
    state: TenantReduxState,
    action: ReduxAction<TenantReduxState>,
  ) => ({
    ...state,
    userPermissions: action.payload.userPermissions || [],
    tenantConfiguration: {
      ...defaultBrandingConfig,
      ...action.payload.tenantConfiguration,
    },
  }),
  [ReduxActionErrorTypes.FETCH_CURRENT_TENANT_CONFIG_ERROR]: (
    state: TenantReduxState,
  ) => ({
    ...state,
  }),
};

export default createReducer(initialState, handlers);

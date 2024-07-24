'use client';

import { useEffect, useReducer, useCallback, useMemo } from 'react';
// utils
import axios, { endpoints } from 'src/utils/axios';
//
import {
  saveAccessToken,
  getCurrentUser,
  saveCurrentUser,
  clearStorage,
} from 'src/utils/SessionManager';
import { AuthContext } from './auth-context';
import { ActionMapType, AuthStateType, AuthUserType } from '../../types';

// ----------------------------------------------------------------------

// NOTE:
// We only build demo at basic level.
// Customer will need to do some extra handling yourself if you want to extend the logic and other features...

// ----------------------------------------------------------------------

enum Types {
  INITIAL = 'INITIAL',
  LOGINWITHOTP = 'LOGINWITHOTP',
  LOGINWITHPASSWORD = 'LOGINWITHPASSWORD',
  REGISTER = 'REGISTER',
  LOGOUT = 'LOGOUT',
}

type Payload = {
  [Types.INITIAL]: {
    user: AuthUserType;
  };
  [Types.LOGINWITHPASSWORD]: {
    user: AuthUserType;
  };
  [Types.LOGINWITHOTP]: {
    user: AuthUserType;
  };
  [Types.REGISTER]: {
    user: AuthUserType;
  };
  [Types.LOGOUT]: undefined;
};

type ActionsType = ActionMapType<Payload>[keyof ActionMapType<Payload>];

// ----------------------------------------------------------------------

const initialState: AuthStateType = {
  user: null,
  loading: true,
};

const reducer = (state: AuthStateType, action: ActionsType) => {
  if (action.type === Types.INITIAL) {
    return {
      loading: false,
      user: action.payload.user,
    };
  }
  if (action.type === Types.LOGINWITHPASSWORD) {
    return {
      ...state,
      user: action.payload.user,
    };
  }
  if (action.type === Types.LOGINWITHOTP) {
    return {
      ...state,
      user: action.payload.user,
    };
  }
  if (action.type === Types.REGISTER) {
    return {
      ...state,
      user: action.payload.user,
    };
  }
  if (action.type === Types.LOGOUT) {
    return {
      ...state,
      user: null,
    };
  }
  return state;
};

// ----------------------------------------------------------------------

const STORAGE_KEY = 'accessToken';

type Props = {
  children: React.ReactNode;
};

export function AuthProvider({ children }: Props) {
  const [state, dispatch] = useReducer(reducer, initialState);
  const currentUser = getCurrentUser();

  const initialize = useCallback(async () => {
    try {
      if (currentUser) {
        const response = await axios.get('/auth/verify-jwt');

        if (response.status === 401) {
          clearStorage();
          dispatch({
            type: Types.LOGOUT,
          });
        }

        dispatch({
          type: Types.INITIAL,
          payload: {
            user: currentUser,
          },
        });
      } else {
        dispatch({
          type: Types.INITIAL,
          payload: {
            user: null,
          },
        });
      }
    } catch (error) {
      console.error(error);
      dispatch({
        type: Types.INITIAL,
        payload: {
          user: null,
        },
      });
    }
  }, [currentUser]);

  useEffect(() => {
    initialize();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  // Login with password
  const loginWithPassword = useCallback(async (email: string, password: string) => {
    const response = await axios.post('/auth/login', {
      email,
      password,
    });

    const {
      data: {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        access_token,
        refresh_token,
        createdAt,
        updatedAt,
        lastLoggedIn,
        profileImage,
        ...rest
      },
    } = response;

    const user = {
      ...rest,
      displayName: rest?.name,
      photoURL: profileImage,
    };

    saveCurrentUser(user);
    saveAccessToken(access_token);

    dispatch({
      type: Types.LOGINWITHPASSWORD,
      payload: {
        user,
      },
    });
  }, []);
  // LOGIN WITH OTP
  const loginWithOTP = useCallback(async (email: string, otp: string) => {
    const response = await axios.post('/auth/login', {
      email,
      otp,
    });

    const {
      data: {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        access_token,
        refresh_token,
        createdAt,
        updatedAt,
        lastLoggedIn,
        profileImage,
        ...rest
      },
    } = response;

    const user = {
      ...rest,
      displayName: rest?.name,
      photoURL: profileImage,
    };

    saveCurrentUser(user);
    saveAccessToken(access_token);

    dispatch({
      type: Types.LOGINWITHOTP,
      payload: {
        user,
      },
    });
  }, []);

  // REGISTER
  const register = useCallback(
    async (email: string, password: string, firstName: string, lastName: string) => {
      const data = {
        email,
        password,
        firstName,
        lastName,
      };

      const response = await axios.post(endpoints.auth.register, data);

      const { accessToken, user } = response.data;

      sessionStorage.setItem(STORAGE_KEY, accessToken);

      dispatch({
        type: Types.REGISTER,
        payload: {
          user,
        },
      });
    },
    []
  );

  // LOGOUT
  const logout = useCallback(async () => {
    clearStorage();
    dispatch({
      type: Types.LOGOUT,
    });
  }, []);

  // ----------------------------------------------------------------------

  const checkAuthenticated = state.user ? 'authenticated' : 'unauthenticated';

  const status = state.loading ? 'loading' : checkAuthenticated;

  const memoizedValue = useMemo(
    () => ({
      user: state.user,
      method: 'jwt',
      loading: status === 'loading',
      authenticated: status === 'authenticated',
      unauthenticated: status === 'unauthenticated',
      loginWithPassword,
      loginWithOTP,
      register,
      logout,
    }),
    [loginWithOTP, logout, register, loginWithPassword, state.user, status]
  );

  return <AuthContext.Provider value={memoizedValue}>{children}</AuthContext.Provider>;
}

import React, { createContext, ReactNode, useContext, useReducer } from "react";
import type { Reducer } from "react";

export const StateContext = createContext<any>({});

export const StateProvider = function <I>({
	reducer,
	initialState,
	children,
}: {
	reducer: Reducer<any, any>;
	initialState: I;
	children: ReactNode;
}) {
	const [state, setAppState] = useReducer(reducer, initialState);
	return (
		<StateContext.Provider value={[state, setAppState]}>
			{children}
		</StateContext.Provider>
	);
};

export const useAppState = () => useContext(StateContext);

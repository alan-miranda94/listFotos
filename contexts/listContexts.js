import React,{createContext, useReducer} from 'react'
import {initialState,initialState2, ListReducer} from '../reducers/listReducer'


export const ListContext = createContext()

export default ({children}) => {
  const [state, dispatch] = useReducer(ListReducer, initialState)
 
  return (
    <ListContext.Provider value={{state, dispatch}}>
      {children}
    </ListContext.Provider>
  )
}
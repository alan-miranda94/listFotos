import js from '../lista2.json'

export const initialState = js

export const initialState2 = {
  newRack: js['rackNovo'],
  ampliation: js['ampliacao'],
  existent: js['existente']
}

export const ListReducer = (state, action) => {
  switch (action.type) {
    case 'take':{
      const novaList = state[action.payload.list].map((item) => {        
        if (item.id === action.payload.id) {
          let img = action.payload.img
          //let base64 = action.payload.base64
          return { ...item, img }
        }else{
          return item
        }
      })            
      
      state[action.payload.list] = novaList
      //console.log(state)   
      return {...state, }      
    }
        
    case 'clear':
      return { ...initialState }
    default:
      return state;
  }
};

import js from '../lista2.json'

export const initialState = { 
  allLista: js,
  atualLista: [],
  title:'FOTOS',
  nameStation:''
}

export const ListReducer = (state, action) => {
  switch (action.type) {
    
    //PEGA AS FOTOS E ATUALIZA NA LISTA
    case 'take':{
      const novaList = state.atualLista.map((item) => {        
        if (item.id === action.payload.id) {
          let img = action.payload.img
          let b64 = action.payload.b64
          //let base64 = action.payload.base64
          return { ...item, img, b64 }
        }else{
          return item
        }
      }) 
      
      //console.log(novaList)
      
      //state[action.payload.list] = novaList
      //console.log(state)   
      return {...state, atualLista:novaList}      
    }
    //COLOCA OS DADOS DA LISTA SELECIONADO COM A LISTA ATUAL
    case 'novoItem':
      let newList = [...state.atualLista, action.payload]
      return {...state,atualLista:newList}

    case'atualLista'    :
      //console.log("REDUCER - ",action.payload[1])
      if (action.payload[1] === 'branco') return {...state,title:action.payload[0], atualLista:[]}
     
      if (state.title === action.payload[0]) return state
     
      return {...state,title:action.payload[0], atualLista: [...state.allLista[action.payload[1]]]}

    case 'gerar':
      return {...state, nameStation:action.payload}
    
      //APAGA TODOS AS IMAGENS DA LISTA
    case 'zerar':
      console.log('REDUCER ZERAR')
      return {...initialState}
    
    default:
      return state;
  }
};

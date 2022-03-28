import js from '../lista2.json'
import {rackNovo, existente, ampliacao} from '../listData'
import modelo from '../modeloList'
export const initialState = { 
  //allLista: listData,
  atualLista: [],
  rackNovo: rackNovo,
  existente:existente,
  ampliacao:ampliacao,
  modelo:modelo,
  title:'FOTOS',
  branco:[],
  nameStation:''
}

export const ListReducer = (state, action) => {
  switch (action.type) {    
    //PEGA AS FOTOS E ATUALIZA NA LISTA
    case 'take':{
      //console.log('TAKE',action.payload.item.img)     
      const novaList = state[action.payload.list].map((item) => {        
        if (item.id === action.payload.item.id) {
          // let img = action.payload.item.img
          // let b64 = action.payload.item.b64
          //let base64 = action.payload.base64
          return { 
            ...item, 
            img:action.payload.item.img,
            b64:action.payload.item.b64,
            width:action.payload.width,
            height:action.payload.height,
          }
        }else{
          return item
        }
      }) 
      
      //console.log(novaList)
      
      //state[action.payload.list] = novaList
      //console.log(state)   
     
      return {...state, [action.payload.list]:novaList}      
    }
    
    //COLOCA OS DADOS DA LISTA SELECIONADO COM A LISTA ATUAL
    case 'novoItem':    
      let newList = [...state.branco, action.payload.item]
      return {
        ...state, 
       branco:newList
      }

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

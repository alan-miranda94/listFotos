import js from '../lista2.json'
import { rackNovo, existente, ampliacao } from '../listData'
import modelo, { AMPLIACAO } from '../modeloList'

export const initialState = {
  ampliacao: AMPLIACAO,
  atualLista: [],
  modelo: modelo,
  galeria: [],
  title: 'FOTOS',
  branco: [],
  nameStation: ''
}

export const ListReducer = (state, action) => {
  switch (action.type) {
    //PEGA AS FOTOS E ATUALIZA NA LISTA
    case 'take': {
      //console.log('TAKE',action.payload.item.img)     
      const novaList = state[action.payload.list].map((item) => {
        if (item.id === action.payload.item.id) {

          return {
            ...item,
            img: action.payload.item.img,
            b64: action.payload.item.b64,
            width: action.payload.width,
            height: action.payload.height,
          }
        } else {
          return item
        }
      })

      //console.log(novaList)

      //state[action.payload.list] = novaList
      //console.log(state)   

      return { ...state, [action.payload.list]: novaList }
    }

    //COLOCA OS DADOS DA LISTA SELECIONADO COM A LISTA ATUAL
    case 'novoItem':
      let newList = [...state.branco, action.payload.item]
      return {
        ...state,
        branco: newList
      }

    case 'removeItem':
      console.log('REDUCER - REMOVE ITEM')
      const list = state[action.payload.list].map((item) => {
        if (item.id === action.payload.item.id) {
          return {
            id: item.id,
            title: item.title
          }
        } else {
          return item
        }
      })
      return { ...state, [action.payload.list]: list }

    case 'clearOne':
      console.log('CHAMOU CLEAR ONE')
      const novaList = state[action.payload.list].map((item) => {
        if (item.img || item.b64) {
          return {
            id: item.id,
            title: item.title
          }
        } else {
          return item
        }
      })
      return { ...state, [action.payload.list]: novaList }

    case 'galeria':
        console.log('CHAMOU',  action.payload.site)
        
        return { ...state,[action.payload.list]:  action.payload.site}
      

     
    //APAGA TODOS AS IMAGENS DA LISTA
    case 'zerar':
      console.log('REDUCER ZERAR')
      return { ...initialState }

    default:
      return state;
  }
};

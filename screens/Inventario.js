import React, { useEffect, useState, useContext } from 'react'
import { Text, SafeAreaView, StyleSheet, FlatList, View, TouchableOpacity } from 'react-native'
import Item from '../components/Item'
import { useNavigation, useRoute } from '@react-navigation/native'
import { ListContext } from '../contexts/listContexts'
import { Ionicons } from '@expo/vector-icons'
//import * as Sharing from 'expo-sharing'
import * as ImagePicker from 'expo-image-picker'
import MyTextInput from '../components/MyTextInput'
import { IconButton, } from 'react-native-paper'
import Constants from 'expo-constants'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { Menu, MenuItem, List} from 'react-native-material-menu'
import Toast from 'react-native-toast-message'

export default props => {
  //const { otherParam , title} = props.route.params  
  // const [name, setName] = useState('')
  const [visible, setVisible] = useState(false)
  // const [hasPermission, setHasPermission] = useState(null)

  // //pega a lista pelo reducer 
  // const { state, dispatch } = useContext(ListContext)
   const [lista, setLista] = useState([])
  // const [add, setAdd] = useState(false)
  // //const {dispatch} = useContext(ListContext)
  const navigation = useNavigation()
  const route = useRoute()

  // //MOSTRA A LISTA ATUAL
  // useEffect(() => {
  //   //console.log('NL',state[route.params.listName])
  //   if(route.params.listName){
  //     setLista(state[route.params.listName])
  //   }
    
  // }, [state])


  //ADICIONA ITEM NA LISTA
  const addItemList = (item) => {
    dispatch({
      type: 'novoItem',
      payload: {
        list: route.params.type,
        item: {
          id: Math.floor(Math.random() * 1000),
          title: name
        }
      }
    })
  }

  // //VAI PARA A TELA DE GERAR EXCEL
  // const pressGerar = () => {
  //   navigation.navigate('GeradorExcel', { list: route.params.listName, title: route.params.title })
  // }

  //REMOVE A FOTO DE UM ITEM
  const pressClear = () => {
    dispatch({
      type: 'clearOne',
      payload: {
        list: route.params.listName,
      }
    })
  }

  //SALVA AS IMAGEM ATUAL NO APARELHO
  const saveData = async (name, item) => {
    try {
      const jItem = JSON.stringify(item)
      await AsyncStorage.setItem('@' + name, jItem)
      Toast.show({
        type: 'success',
        text1: 'Salvo com sucesso'
      })
    } catch (e) {
      Toast.show({
        type: 'error',
        text1: 'Erro ao Salvar'
      })
      console.log(e)
    }
  }

  //CHAMA SALVA FOTOS
  const pressSave = async () => {
    // salvar item no assinc storage 
    await saveData(route.params.title, lista).then(e => {
      setVisible(false)
    })
    // //limpa a lista
    // dispatch({
    //   type: 'zerar'
    // })
    // navigation.reset({ index: 0, routes: [{ name: 'Home' }] })
  }

  //ESCONDE MENU
  const hideMenu = () => setVisible(false);

  //MOSTRA MEN
  const showMenu = () => setVisible(true);

  //RETORNA PARA TELA ANTERIOR
  const pressArrow = () => {
    if (route.params.listName === 'galeria') {
      navigation.goBack()
      return
    }
    navigation.navigate('Home')

  }

  return (
    <View style={styles.container}>
      <View style={styles.barra}>
        <IconButton
          icon='arrow-left'
          size={26}
          onPress={pressArrow} />
        {
          //route.params.title&&<Text>{route.params.title}</Text>
          <Text>NOME DO SITE</Text>
        }  
         
        <View style={{ flexDirection: 'row', }}>
        <IconButton
          icon='note-plus'
          //color={'red'}
          size={26}
          onPress={()=> navigation.navigate('AddItemInventario',{title:'CEPIC09', listName:'inventario'} )} />{/*title:route.params.title, listName:route.params.listName*/}
          <Menu
            visible={visible}
            anchor={<IconButton icon='menu' size={26} onPress={showMenu} />}
            onRequestClose={hideMenu}
          >
            <MenuItem onPress={()=>{pressSave}}><Text>Salvar</Text></MenuItem>
            <MenuItem onPress={()=>{pressGerar}}>Gerar Excel</MenuItem>
            <MenuItem onPress={()=>{pressClear}}>Limpar</MenuItem>
          </Menu>
        </View>

      </View>

      

      <FlatList
        data={lista}
        style={{ flexGrow: 1 }}
        initialNumToRender={12}
        contentContainerStyle={{ padding: 10, paddingBottom: 20, }}
        showsVerticalScrollIndicator={false}
        ListFooterComponent={() => <Text style={styles.logo}>FROM MSTUDIO</Text>}
        renderItem={({ item }) => (
          <Item data={item} />//site={route.params.title} list={route.params.listName} 
        )}
        keyExtractor={item => item.id}
      />


    </View>

  )
}

const styles = StyleSheet.create({
  container: {
    //flex:1,
    //alignItems: 'center',
    //justifyContent: 'center',
    width: '100%',

    //backgroundColor: '#696969',
    //marginVertical:10  
  },
  menu: {
    position: 'absolute',
    top: -20,
    left: 30,
    flex: 1

  },
  barra: {
    width: '100%',
    paddingTop: Constants.statusBarHeight + 4,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'white',
    shadowColor: "black",
    elevation: 4,
  },

  inputContatiner: {
    margin: 10,
    width: '90%'
  },
  texto: {

    marginRight: 10
  },
  button: {
    width: '100%',
    padding: 4,
    marginTop: 16
  },
  logo: {
    height: 80,
    width: '100%',
    alignItems: 'center',
    textAlign: 'center'
  },
});



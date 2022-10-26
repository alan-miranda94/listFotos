import React, { useEffect, useState, useContext, useRef } from 'react'
import { Text, SafeAreaView, StyleSheet, FlatList, View, TouchableOpacity, Modal } from 'react-native'
import Item from '../components/Item'
import { useNavigation, useRoute } from '@react-navigation/native'
import { ListContext } from '../contexts/listContexts'
import { Ionicons } from '@expo/vector-icons'
//import * as Sharing from 'expo-sharing'
import * as ImagePicker from 'expo-image-picker'
import MyTextInput from '../components/MyTextInput'
import { IconButton, List, Searchbar, RadioButton, TextInput, Button } from 'react-native-paper'
import Constants from 'expo-constants'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { Menu, MenuItem, MenuDivider } from 'react-native-material-menu'
import Toast from 'react-native-toast-message'
import { ROT, SFP } from '../ROT-FPS'
import easyDB from "easy-db-react-native";
import uuid from 'react-native-uuid'


export default props => {
  //const { otherParam , title} = props.route.params
  const modalizeRef = useRef(null);
  const [name, setName] = useState('')
  const [visible, setVisible] = useState(false)
  const [dePara, setDePara] = useState(null)
  const [equipamentos, setEquipamentos] = useState(ROT)
  const [equipamento, setEquipamento] = useState(null)
  const [expanded, setExpanded] = useState(false)
  const [expandedDePara, setExpandedDePara] = useState(false)
  const [textDe, setTextDe] = React.useState("");
  const [textPara, setTextPara] = React.useState("")
  const [modalDePara, setModalDePara] = useState(false)

  //pega a lista pelo reducer 
  const { state, dispatch } = useContext(ListContext)
  const [lista, setLista] = useState([])
  const [add, setAdd] = useState(false)
  //const {dispatch} = useContext(ListContext)
  const navigation = useNavigation()
  const route = useRoute()
  const { insert, select, update, remove } = easyDB()
  const [loading, setLoading] = useState(false)
  const [saved, setSaved] = useState(null)



  //MOSTRA A LISTA ATUAL
  useEffect(() => {
    setLista(state[route.params.listName])
    setLoading(false)
  }, [state])


  //ADICIONA ITEM NA LISTA
  const addItemList = (item) => {
    dispatch({
      type: 'novoItem',
      payload: {
        list: 'blank',
        item: {
          id: uuid.v4(),
          title: name
        }
      }
    })
  }

  //VAI PARA A TELA DE GERAR EXCEL
  const pressGerar = () => {
    hideMenu()
    navigation
      .navigate(
        'GeradorExcel',
        {
          list: route.params.listName,
          title: route.params.title,
          type: route.params.type,
          equipName: '',
        })

  }

  //REMOVE A FOTO DE UM ITEM
  const pressClear = () => {
    dispatch({
      type: 'clearOne',
      payload: {
        list: route.params.listName,
      }
    })
  }



  const pressFinalizar = async () => {
    try {
      dispatch({
        type: 'zerar'
      })

      navigation.navigate('Home')
    } catch (e) {
      console.log(e)
      alert('ERRO AO SALVAR')
    }

  }
  //ESCONDE MENU
  const hideMenu = () => setVisible(false);

  //MOSTRA MEN
  const showMenu = () => setVisible(true);
  const handlePress = () => setExpanded(!expanded)
  const handlePressDePara = () => setExpandedDePara(!expandedDePara)
  //REDUZ A LISTA DE ACORDO COM A PESQUISA
  const onChangeSearch = (query, t) => {
    let equip = ROT.filter(item => item['MODELO'].includes(query) || item['PN'].includes(query))
    setEquipamentos(equip)
  }


  const pressSelectEquip = (equip) => {
    setEquipamento(equip)
    handlePress()
  }


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

        <Text style={{ flex: 1, textAlign: "center" }}>{route.params.title}</Text>
        <View style={{ flexDirection: 'row' }}>
          <Menu
            visible={visible}
            anchor={<IconButton icon='menu' size={26} onPress={showMenu} />}
            onRequestClose={hideMenu}
          >
            <MenuItem onPress={pressGerar}>Gerar Excel</MenuItem>
            <MenuItem onPress={pressClear}>Limpar</MenuItem>
            <MenuDivider />
            <MenuItem onPress={pressFinalizar}>Finalizar</MenuItem>
          </Menu>
        </View>

      </View>



      <View style={{ flexDirection: "row", justifyContent: "center", alignItems: "center" }}>

        <MyTextInput
          style={{ width: '80%' }}
          title={'NOME'}
          value={name}
          placeholder='EX:ENTRADA DO SITE'
          onChangeText={(t) => setName(t)}
        />
        <IconButton icon='plus' size={26} onPress={addItemList} />
      </View>
      <FlatList
        data={state['blank']}
        style={{ flexGrow: 1 }}
        initialNumToRender={12}
        contentContainerStyle={{ padding: 10, paddingBottom: 100, }}
        showsVerticalScrollIndicator={false}
        ListFooterComponent={() => <Text style={styles.logo}>FROM MSTUDIO</Text>}
        renderItem={({ item }) => (
          <Item data={item} site={route.params.title} list={route.params.listName} />
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
    height: 150,
    width: '100%',
    alignItems: 'center',
    textAlign: 'center'
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    //paddingTop: Constants.statusBarHeight,
    backgroundColor: 'rgba(0,0,0,0.5)',
    alignItems: 'center'
    //padding: 8,

  },
  modalDePara: {
    flexDirection: 'row',
    backgroundColor: '#2196f3',
    borderBottomWidth: 1,
    borderBottomColor: 'gray',
    height: 48,
    borderTopEndRadius: 20,
    borderTopStartRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    width: '90%'

  }
});



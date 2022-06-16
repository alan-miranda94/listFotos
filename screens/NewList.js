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

  //pega permisão do usuario par atirar foto
  useEffect(() => {



  }, [])

  //MOSTRA A LISTA ATUAL
  useEffect(() => {
   
    //
    //setDePara(newDePara)
    //console.log('NL',state[route.params.listName][route.params.listName.length])
    setLista(state[route.params.listName])
  }, [state])


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

  //VAI PARA A TELA DE GERAR EXCEL
  const pressGerar = () => {
    hideMenu()
    if (equipamento && dePara) {
      navigation
        .navigate(
          'GeradorExcel',
          {
            list: route.params.listName,
            title: route.params.title,
            type: route.params.type,
            equipName: equipamento['MODELO'],
            dePara: dePara


          })
      return
    }

    hideMenu()
    Toast.show({
      type: 'info',
      text1: 'VERIFIQUE SE SELECIONOU',
      text2:`- EQUIPAMENTO e o DE<>PARA`
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

  //SALVA AS IMAGEM ATUAL NO APARELHO
  const saveData = async (name, item) => {
    try {
      // const site = {
      //   dePara:dePara,
      //   equipamento: equipamento['MODELO'],
      //   list:item
      // }

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

  const handleDeParaAdd = () => {
    const newDePara = dePara?[...dePara]:[]
    if (textDe && textPara) {
      newDePara.push(
        {
          de: textDe,
          para: textPara
        }
      )
      setDePara(newDePara)
      setModalDePara(false)
    }else{
      Toast.show({
        type: 'info',
        text1: 'PREENCHA TODOS OS CAMPOS'
      })
    }

  }

  const removeDePara = (file)=>{
    const newDePara = dePara.filter((item)=>item.de !== file.de)
    setDePara(newDePara)
  }

  const onOpen = () => {
    setTextDe('')
    setTextPara("")
    setModalDePara(true)
  };

  return (
    <View style={styles.container}>
      <View style={styles.barra}>
        {/* <IconButton
          icon='arrow-left'
          size={26}
          onPress={pressArrow} /> */}
        <Text style={{ flex: 1, textAlign: "center" }}>{route.params.title}</Text>
        <View style={{ flexDirection: 'row' }}>
          <Menu
            visible={visible}
            anchor={<IconButton icon='menu' size={26} onPress={showMenu} />}
            onRequestClose={hideMenu}
          >
            {
              //esta dando erro quando tem muitas fotos
              //<MenuItem onPress={pressSave}><Text>Salvar</Text></MenuItem>
            }
            <MenuItem onPress={pressGerar}>Gerar Excel</MenuItem>
            <MenuItem onPress={pressClear}>Limpar</MenuItem>
            <MenuDivider />
            <MenuItem onPress={pressFinalizar}>Finalizar</MenuItem>
          </Menu>
        </View>

      </View>


      <List.Section>
        <List.Accordion
          style={{ backgroundColor: 'white', elevation: 2 }}
          title={'DE <> PARA'}
          id={0}
          expanded={expandedDePara}
          onPress={handlePressDePara}
        >
          <Button color='#2196f3' icon="plus" mode="contained" onPress={onOpen}>
            ADICIONAR
          </Button>

          <FlatList
            data={dePara}
            style={{ flexGrow: 1, backgroundColor: 'white', paddingBottom: 0, }}
            initialNumToRender={12}
            contentContainerStyle={{ padding: 10, paddingBottom: 20, }}
            showsVerticalScrollIndicator={false}
            //ListFooterComponent={() => <Text style={styles.logo}>FROM MSTUDIO</Text>}
            renderItem={({ item }) => (
              <List.Item
                key = {Math.random()}
                titleStyle={{ fontSize: 11 }}
                title={`DE: ${item.de} PARA: ${item.para}`}
                left={props => <IconButton {...props} icon="delete" size={26} onPress={() => removeDePara(item)} />}
              />
            )}
            keyExtractor={item => Math.random()}
          />
        </List.Accordion>

        <List.Accordion
          style={{ backgroundColor: 'white', elevation: 2 }}
          title={equipamento ? equipamento['MODELO'] : 'SELECIONE O EQUIPAMENTO'}
          id={1}
          expanded={expanded}
          onPress={handlePress}
        >
          <Searchbar
            style={{ elevation: 2, }}
            placeholder="Search"
            onChangeText={onChangeSearch}
            autoCapitalize={"characters"}
          />
          <FlatList
            data={equipamentos}
            style={{ flexGrow: 1, backgroundColor: 'white', paddingBottom: 100, }}
            initialNumToRender={12}
            contentContainerStyle={{ padding: 10, paddingBottom: 100, }}
            showsVerticalScrollIndicator={false}
            ListFooterComponent={() => <Text style={styles.logo}>FROM MSTUDIO</Text>}
            renderItem={({ item }) => (
              <List.Item
                title={`${item["MODELO"]} | ${item['PN']}`}
                description={`${item["DESCRIÇÃO"]}`}
                onPress={() => pressSelectEquip(item)}
              />
            )}
            keyExtractor={item => item.id}
          />
        </List.Accordion>
      </List.Section>

      <FlatList
        data={lista}
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

      <Modal
        transparent={true}
        visible={modalDePara}
        animationType='fade'
        statusBarTranslucent
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalDePara}>
            <IconButton
              icon='close'
              color='white'
              size={26}
              onPress={() => setModalDePara(false)}
            />
            <Text style={{ fontWeight: 'bold', color: 'white', }}>ADICIONAR DE - PARA</Text>
          </View>
          <View style={{ height: 300, backgroundColor: 'white', alignItems: 'center', justifyContent: 'center' ,width:"90%",}}>

            <TextInput
              style={{
                color: 'white', width: '75%', height: 50, marginBottom: 10
              }}
              label="De"
              value={textDe}
              onChangeText={text => setTextDe(text)}
            />
            <TextInput
              style={{
                color: 'white', width: '75%', height: 50, marginBottom: 32
              }}
              label="Para"
              value={textPara}
              onChangeText={text => setTextPara(text)}
            />
            <Button
              color='#2196f3'
              icon="plus"
              mode="contained"
              onPress={handleDeParaAdd}>
              ADICIONAR
            </Button>
          </View>
        </View>
      </Modal>

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
    alignItems:'center'
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
    width:'90%'
    
  }
});



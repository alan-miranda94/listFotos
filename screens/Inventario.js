import React, { useEffect, useState, useContext } from 'react'
import { Text, SafeAreaView, StyleSheet, FlatList, View, TouchableOpacity } from 'react-native'
import ItemInventario from '../components/ItemInventario'
import { useNavigation, useRoute } from '@react-navigation/native'
import { ListContext } from '../contexts/listContexts'
import { Ionicons } from '@expo/vector-icons'
//import * as Sharing from 'expo-sharing'
import * as ImagePicker from 'expo-image-picker'
import { ROT, SFP } from '../ROT-FPS'
import { IconButton, List, Searchbar, RadioButton, TextInput } from 'react-native-paper'
import Constants from 'expo-constants'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { Menu, MenuItem, MenuDivider } from 'react-native-material-menu'
import Toast from 'react-native-toast-message'

export default props => {
  const [visible, setVisible] = useState(false)
  // //pega a lista pelo reducer 
  const { state, dispatch } = useContext(ListContext)
  const [lista, setLista] = useState([])
  const navigation = useNavigation()
  const route = useRoute()
  const [expanded, setExpanded] = useState(false)
  const [expandedEquipamento, setExpandedEquipamento] = useState(false)
  const [equipamentos, setEquipamentos] = useState(ROT)
  const [equipamento, setEquipamento] = useState(null)
  const [type, setType] = useState('Instalação')
  
  //MOSTRA A LISTA ATUAL
  useEffect(() => {
    //pode receber a lista da galeria 
    setLista(state[route.params.listName])

  }, [state])


  //ADICIONA ITEM NA LISTA
  const addItemList = (item) => {
    if (equipamento) {
      hideMenu()
      navigation.navigate(
        'AddItemInventario',
        {
          title: route.params.title,
          listName: 'inventario',
          equipName: equipamento['MODELO'],
          
        }
      )
      return
    }
    Toast.show({
      type: 'info',
      text1: 'SELECIONE O EQUIPAMENTO PRIMEIRO'
    })

  }

  //VAI PARA A TELA DE GERAR EXCEL
  const pressGerar = () => {
    if (equipamento) {
      hideMenu()
      navigation.navigate(
        'GeradorExcel',
        {
          list: route.params.listName,
          title: route.params.title,
          inventario: true,
          equipName: equipamento['MODELO'],
          type:type
        })
      return
    }
    hideMenu()
    Toast.show({
      type: 'info',
      text1: 'SELECIONE O EQUIPAMENTO PRIMEIRO'
    })
  }

  //REMOVE A FOTO DE UM ITEM
  const pressClear = () => {
    dispatch({
      type: 'clearInventario',
      payload: {
        list: route.params.listName,
      }
    })
  }

  //SALVA AS IMAGEM ATUAL NO APARELHO
  const saveData = async (name, item) => {
    try {
      const jItem = JSON.stringify(item)
      await AsyncStorage.setItem('@inventario:' + name, jItem)
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


  const handlePress = () => setExpanded(!expanded)
  const handlePressEquipamento = () => setExpandedEquipamento(!expandedEquipamento)

  //REDUZ A LISTA DE ACORDO COM A PESQUISA
  const onChangeSearch = (query, t) => {
    let equip = ROT.filter(item => item['MODELO'].includes(query) || item['PN'].includes(query))
    setEquipamentos(equip)
  }


  //RETORNA PARA TELA ANTERIOR
  const pressArrow = () => {
    if (route.params.listName === 'galeria') {
      navigation.goBack()
      return
    }
    navigation.navigate('Home')

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

  const pressSelectEquip = (equip) => {
    setEquipamento(equip)
    handlePress()
  }

  return (
    <View style={styles.container}>
      <View style={styles.barra}>
        <IconButton
          icon='note-plus'
          //color={'red'}
          size={26}
          onPress={addItemList} />{/*title:route.params.title, listName:route.params.listName*/}

        {
          //route.params.title&&<Text>{route.params.title}</Text>
          <Text>{route.params.title}</Text>
        }

        <View style={{ flexDirection: 'row', }}>
          <Menu
            visible={visible}
            anchor={<IconButton icon='menu' size={26} onPress={showMenu} />}
            onRequestClose={hideMenu}
          >
            {
              //ESTA DANDO ERRO QUANDO TEM MUITAS IMAGENS
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
        <RadioButton.Group style={{ flexDirection: 'row-reverse', }} onValueChange={newType => setType(newType)} value={type}>
          <View style={{ flexDirection: 'row', backgroundColor: "white" , width:'100%'}}>
            <RadioButton.Item label="Instalação" value="Instalação" labelStyle={{fontSize:12}}/>
            <RadioButton.Item label='Migração' value="Migração" labelStyle={{fontSize:12}}/>
            <RadioButton.Item label='Ampliação' value="Ampliação" labelStyle={{fontSize:12}}/>
          </View>
        </RadioButton.Group>
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
            style={{ flexGrow: 1, backgroundColor: 'white' }}
            initialNumToRender={12}
            contentContainerStyle={{ padding: 10, paddingBottom: 40, }}
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
        contentContainerStyle={{ padding: 10, paddingBottom: 20, }}
        showsVerticalScrollIndicator={false}
        ListFooterComponent={() => <Text style={styles.logo}>FROM MSTUDIO</Text>}
        renderItem={({ item }) => (
          <ItemInventario data={item} />//site={route.params.title} list={route.params.listName} 
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



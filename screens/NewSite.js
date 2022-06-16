import React, { useEffect, useState, useContext, useRef, useCallback } from 'react'
import { Text, StyleSheet, View, TouchableOpacity } from 'react-native'
import { useNavigation, useRoute } from '@react-navigation/native'
import { ListContext } from '../contexts/listContexts'
import { Ionicons } from '@expo/vector-icons'
//import * as Sharing from 'expo-sharing'
import * as ImagePicker from 'expo-image-picker'
import ViewShot, { captureRef } from "react-native-view-shot"
import * as MediaLibrary from 'expo-media-library'
import MyTextInput from '../components/MyTextInput'
import { Button, Checkbox } from 'react-native-paper'
import Constants from 'expo-constants'
import Toast from 'react-native-toast-message'

export default props => {
  //const { otherParam , title} = props.route.params  
  const coverRef = useRef()
  const [title, setTitle] = useState(null)
  //pega a lista pelo reducer 
  const { state, dispatch } = useContext(ListContext)
  //const {dispatch} = useContext(ListContext)
  const navigation = useNavigation()
  const [hasPermission, setHasPermission] = useState(null)
  const route = useRoute()

  //pega permisão do usuario par atirar foto
  useEffect(() => {
    (async () => {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync()
      setHasPermission(status === 'granted');
    })()
    
  }, [])

  const onCapture = useCallback(async () => coverRef.current.capture())

  const pressButton = async (title, listName,type ) => {
    if (!title) {
      alert('DIGITE O NOME DO SITE')
      return
    }
    //CRIAR UMA FOTO PADRÃO COM O NOME DO SITE 
    const name = title + '-inventario' 
    const coverUri = await onCapture()
    //CRIAR PASTA NA GALERIA COM NOME DA ESTAÇÃO
    const  asset = await MediaLibrary.createAssetAsync(coverUri)
    await MediaLibrary.createAlbumAsync(name, asset, false)
    navigation.reset(
      { 
        index: 0, 
        routes: [
          {
            name:type==='inventario'?'Inventario':'NewList', 
            params:{ 
              title: title , 
              listName: listName,
              type:type , 
              capa:coverUri
            }
          }
        ] 
      }
    )
  }

  return (

    <View style={styles.container}>

      <View style={styles.barra}>
        <TouchableOpacity style={styles.texto} onPress={() => navigation.goBack()}>
          <Ionicons
            style={{ justifyContent: 'flex-end' }}
            name="arrow-back-outline"
            size={26}
          />
        </TouchableOpacity>
        <Text>NOVO SITE</Text>
        <View style={{ flexDirection: 'row' }}>
        </View>

      </View>

      <View style={{ margin: 16, alignItems: 'center' }}>
        <MyTextInput
          title={'NOME DO SITE'}
          value={title}
          placeholder='EX:PERSOL01'
          onChangeText={(t) => setTitle(t)}
        />
        {
          <View style={{marginTop: 8 }}>
          <View style={{width:50, height:20, backgroundColor: "#0a9ffc", marginBottom:-3}}/>
          <ViewShot style={{ width: 150, height: 100, alignItems: "center", justifyContent: 'center', backgroundColor: "#0a9ffc", }} ref={coverRef} >
            <Text style={{ padding: 10, fontWeight: "bold", color:'white'}}>
              {title}
            </Text>
          </ViewShot>
          </View>
        }
        <Button
          style={styles.button}
          onPress={() => pressButton(title, 'modelo','Instalação')}
          mode='contained'
          color="#2196f3"
        >
          INSTALAÇÃO
        </Button>
        <Button
          style={styles.button}
          onPress={() => pressButton(title, 'ampliacao','Ampliação')}
          mode='contained'
          color="#2196f3"
        >
         AMPLIAÇÃO
        </Button>
        <Button
          style={styles.button}
          onPress={() => pressButton(title, 'migracao','Migração')}
          mode='contained'
          color="#2196f3"
        >
          MIGRAÇÃO
        </Button>
        <Button
          style={styles.button}
          onPress={() =>  pressButton(title, 'inventario','inventario')}
          mode='contained'
          color="#2196f3"
          disabled={false}
        >
          INVENTÁRIO
        </Button>
      </View>
    </View >

  )
}

const styles = StyleSheet.create({
  container: {
    width: '100%',

  },
  checkBox: {
    flexDirection: 'row',
    width: '100%',
    padding: 4,
    //justifyContent: 'center',
    alignItems: 'center',

  },
  barra: {
    width: '100%',
    paddingTop: Constants.statusBarHeight + 4,
    padding: 10,
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



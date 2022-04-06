import React, { useState, useContext, useEffect } from 'react';
import { List, Avatar, Colors } from 'react-native-paper';
import { Text, View, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons'
import { useNavigation } from '@react-navigation/native'
import * as ImagePicker from 'expo-image-picker'
import * as MediaLibrary from 'expo-media-library'
import { ListContext } from '../contexts/listContexts'
import * as FileSystem from 'expo-file-system'
import * as ImageManipulator from 'expo-image-manipulator'

const MyComponent = props => {
  const [expanded, setExpanded] = useState(true)
  const [desc, setDesc] = useState(false);
  const [imgWidth, setImgWidth] = useState(null)
  const [imgHeight, setImgHeight] = useState(null)
  const handlePress = () => setExpanded(!expanded)
  const [image, setImage] = useState(props.data.img ? props.data.img : null)
  const { state, dispatch } = useContext(ListContext)


  useEffect(() => {
    if (props.data.img) {
      console.log('tem imagem')
      setImage(props.data.b64.toString())

    }
    //console.log('ITEM 2',props.data.image)
  }, [props.data])


  //USA A CAMERA PARA TIRAR IMAGEM
  const pickImage = async () => {
    let resize
    let b64
    const options = {
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      //aspect: [1, 1],
      quality: .7,
    }
    const result = await ImagePicker.launchCameraAsync(options)

    if (!result.cancelled) {
      resize = await ImageManipulator.manipulateAsync(
        result.uri,
        [{ resize: { width: result.width * 0.5 } }],
        {
          compress: 0.7,
          format: ImageManipulator.SaveFormat.JPEG,
          base64: true
        },
      )

      b64 = resize.base64 //await FileSystem.readAsStringAsync(result.uri, { encoding: 'base64' })
      //console.log(b64)
      setImage(resize.uri)
      setImgHeight(resize.height)
      setImgWidth(resize.width)
      savePicture(resize.uri, props.data.id, b64)

    }
  }

  //PEGA IMAGEM DA GALERIA
  const getImage = async () => {
    let b64
    let resize
    const options = {
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      //base64: true,
      //aspect: [1, 1],
      quality: .7,
    }
    const result = await ImagePicker.launchImageLibraryAsync(options)

    if (!result.cancelled) {
      //DIMINUI O TAMANHO DA IMAGEM PARA 50%
      resize = await ImageManipulator.manipulateAsync(
        result.uri,
        [{ resize: { width: result.width * 0.5 } }],
        {
          compress: 0.7,
          format: ImageManipulator.SaveFormat.JPEG,
          base64: true
        },
      )


      b64 = resize.base64 //await FileSystem.readAsStringAsync(result.uri, { encoding: 'base64' })
      setImage(resize.uri)


      dispatch({
        type: 'take',
        payload: {
          list: props.list,
          item: {
            id: props.data.id,
            img: result.uri,
            width: resize.width,
            height: resize.height,
            b64: `data:image/png;base64,${b64}`
          }
        }
      })
      //savePicture(result.uri,props.data.id, b64)
    }
  }


  //SALVA A IMAGEM DA CAMERA NA GALERIA
  const savePicture = async (picture, id, base64) => {
    try {
      const asset = await MediaLibrary.createAssetAsync(picture)
      const existAlbum = await MediaLibrary.getAlbumAsync('Relatorio/' + props.site)

      //verifica se o album existe e move a imagem para o existente
      if (existAlbum !== null) {
        await MediaLibrary.addAssetsToAlbumAsync(asset, existAlbum.id, false)
      } else {
        await MediaLibrary.createAlbumAsync('Relatorio/' + props.site, asset)
      }

      //MediaLibrary.deleteAssetsAsync(asset) 
      //chama o dispatch aqui depois que salvar na galeria
      dispatch({
        type: 'take',
        payload: {
          list: props.list,
          item: {
            id: id,
            width: imgWidth,
            height: imgHeight,
            img: picture,
            b64: `data:image/png;base64,${base64}`
          }
        }
      })
      //navigation.navigate('NewList')        
    } catch (error) {
      console.error(error)
    }


  }

  //REMOVE IMAGEM DA LISTA 
  const pressRemove = () => {
    dispatch({
      type: 'removeItem',
      payload: {
        list: props.list,
        item: {
          id: props.data.id
        }
      }
    })
  }

  //console.log('AQUI',props.data)
  const openClose = () => {
    if (desc) {
      setDesc(false)
    } else {
      setDesc(true)
    }
  }

  return (
    <View style={[styles.container]}>
      <View style={styles.container2}>
        {props.data.img &&
          <TouchableOpacity style={{ marginLeft: 4 }} onPress={pressRemove} >

            <Ionicons name="close-outline" size={26} />

          </TouchableOpacity>
        }

        {props.data.b64 &&
          <Avatar.Image size={42} source={{ uri: props.data.b64 }} />
        }
        <View style={{ width: '65%' }}>
          <Text style={styles.texto} numberOfLines={2}>{props.data.title}</Text>
        </View>

        <View style={{ flexDirection: "column", }}>

          <TouchableOpacity onPress={pickImage} >
            <Ionicons name="camera" size={26} />
          </TouchableOpacity>

          <TouchableOpacity onPress={getImage}>
            <Ionicons name="image-outline" size={26} />
          </TouchableOpacity>
        </View>
      </View>
    </View>

  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: 60,
    borderRadius: 5,
    shadowColor: "black",
    elevation: 2,
    backgroundColor: '#ffffff',
    marginBottom: 10,
    overflow: 'hidden',
    //width: '100%',
  },

  container2: {
    //flex:1,
    paddingHorizontal: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between'
    //backgroundColor: '#ffffff',  

  },
  texto: {

    fontSize: 10,
    padding: 6,
  },

  image: {
    height: 40,
    width: 40,
  },

  barra: {
    height: 6,
    backgroundColor: '#39FF14'
  }

});

export default MyComponent;

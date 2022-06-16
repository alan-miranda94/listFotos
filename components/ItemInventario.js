import React, { useState, useContext, useEffect } from 'react';
import { List, Avatar, Colors } from 'react-native-paper';
import { Text, View, StyleSheet, TouchableOpacity, Image, Modal } from 'react-native';
import { Ionicons } from '@expo/vector-icons'
import { useNavigation } from '@react-navigation/native'
import * as ImagePicker from 'expo-image-picker'
import * as MediaLibrary from 'expo-media-library'
import { ListContext } from '../contexts/listContexts'
import * as FileSystem from 'expo-file-system'
import * as ImageManipulator from 'expo-image-manipulator'
import AvatarImage from './AvatarImage'


const MyComponent = props => {
  const [expanded, setExpanded] = useState(false)
  const [modalImage, setModalImage] = useState(false)
  const { state, dispatch } = useContext(ListContext)

  useEffect(() => {

    //console.log(props.data)
  }, [])

  const handlePress = () => setExpanded(!expanded)

  //REMOVE IMAGEM DA LISTA 
  const pressRemove = () => {
    dispatch({
      type: 'removeItemInventario',
      payload: {
        list: 'inventario',
        item: { ...props.data }

      }
    })
  }

  return (
    <TouchableOpacity style={styles.container} onPress={handlePress} >
      <View style={styles.container2}>
        {
          <TouchableOpacity style={{ marginHorizontal: 4 }} onPress={pressRemove} >
            <Ionicons name="close-outline" size={26} />
          </TouchableOpacity>
        }
        {props.data.imgMain &&
          <AvatarImage source={props.data.imgMain.b64}/>
        }
        <Text style={{ flex: 1, marginHorizontal: 8 }}> {props.data.modelo + ' | ' + props.data.pn}</Text>
      </View >
      {expanded &&
        <View style={{ flexDirection: "column", paddingHorizontal: 16, paddingVertical: 8, borderColor: 'gray', borderTopWidth: 1 }}>
          <Text style={styles.texto}>NS: {props.data.numSerie}</Text>
          <Text style={styles.texto}>DESC: {props.data.desc}</Text>
          <Text style={styles.texto}>BP/SGP: {props.data.numBPSGP}</Text>
          <Text style={styles.texto}>SAP: {props.data.sap}</Text>
        </View>}
    </TouchableOpacity >
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    borderRadius: 5,
    shadowColor: "black",
    elevation: 2,
    backgroundColor: '#ffffff',
    marginBottom: 10,
    //overflow: 'hidden',
    //width: '100%',
  },

  container2: {
    //flex:1,
    paddingHorizontal: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    margin: 8,
    padding: 4
    //backgroundColor: '#ffffff',  

  },
  texto: {

    fontSize: 12,
    //padding: 6,
  },

  image: {
    height: 40,
    width: 40,
  },

  barra: {
    height: 6,
    backgroundColor: '#39FF14'
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    //paddingTop: Constants.statusBarHeight,
    backgroundColor: 'rgba(0,0,0,0.5)',
    alignItems: 'center'
    //padding: 8,

},
});

export default MyComponent;

import React, {useState, useContext, useEffect} from 'react';
import { List, IconButton, Colors  } from 'react-native-paper';
import { Text, View, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons'
import {useNavigation} from '@react-navigation/native'
import * as ImagePicker from 'expo-image-picker'
import * as MediaLibrary from 'expo-media-library'
import {ListContext} from '../contexts/listContexts'
import * as FileSystem from 'expo-file-system'
import AsyncStorage from '@react-native-async-storage/async-storage'

import { Avatar } from 'react-native-paper';

const MyComponent = props => {
  const navigation = useNavigation()
  const {dispatch} = useContext(ListContext)
  
  const openData = async(name)=>{
    try {
      const response = await AsyncStorage.getItem(name)
      const data = response?JSON.parse(response):[]
      //console.log(data)
      return data
    } catch (error) {
      console.log(error)
    }
  }

  const pressButton = async ()=>{
    //console.log(props.site)
    const site = await openData(props.site)
    let title= props.site.replace('@','')
    const isInvetario = title.includes('inventario')
    console.log(isInvetario)

    dispatch({
      type: 'galeria',
      payload: {
        list: isInvetario?'inventario':'galeria',
        site: site
      }
    })

    if(isInvetario){
      title = title.replace('inventario:','')
      navigation.navigate('Inventario',{listName:'inventario', title})
      return
    }
    navigation.navigate('NewList',{listName:'galeria', title})
    
    
  }

  return (
    <TouchableOpacity style={styles.container} onPress={pressButton}>    
      <View style={{ flex:1}}>
      <Text style={{fontWeight:'bold', fontSize:16, alignSelf:'center'}}>
        {props.site.replace('@','')}
      </Text>
      </View>  
      
      <TouchableOpacity style={styles.texto} onPress={()=>props.remove(props.site)}>
            <Ionicons
              style={{ justifyContent: 'flex-end' }}
              name="trash-outline"
              size={26}
            />
      </TouchableOpacity>
    </TouchableOpacity>
   
  );
};

const styles = StyleSheet.create({
  container: {       
    flexDirection:'row',
    height:80,
    alignItems:'center',
    justifyContent:'space-between',
    borderRadius:5,
    backgroundColor: "#0a9ffc",
    shadowColor: "black",
    elevation:2,
    marginBottom:10,
    overflow: 'hidden',
    padding:8
  },

  container2:{   
    //width:'100%',
    flexDirection:'row', 
    alignItems:'center',
    
    //backgroundColor: '#ffffff',  
    
    
       
  },
  texto:{
    //width:'80%',
    borderLeftWidth:1,
    padding:10,
  },
  
  desc:{
    color: '#808080',
    width:'95%',
    marginHorizontal:3,

    
  },
  barra:{   
    height: 6,
   backgroundColor:'#39FF14'
  }

  
});

export default MyComponent;

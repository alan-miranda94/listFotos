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
  

  const pressButton = async ()=>{
   
    const site =  props.site.list
    let title = props.site.name //.replace('@','')
    const isInvetario = props.site.inventario?props.site.inventario.length > 0:false
   
   
    //VAI PARA LISTA DE INVENTARIO
    if(isInvetario){
      title = title.replace('inventario:','')
      
      dispatch({
        type: 'galeria',
        payload: {
          list:'inventario',
          site: props.site.inventario
        }
      })
      navigation.navigate(
        'Inventario',
        {
          route:'galeria',
          listName:'inventario', 
          title, 
          equipamento: props.site.equipamento,
          type:props.site.type,
          id:props.site['id'],
        }
      )
      return
    }

    dispatch({
      type: 'galeria',
      payload: {
        list: isInvetario?'inventario':'galeria',
        site: site
      }
    })

    //VAI PARA LISTA DE RELATORIOS
    navigation.navigate(
      'NewList',
      {
        listName:'galeria', 
        id:props.site['id'],
        title,
        dePara:props.site.dePara,
        equipamento:props.site.equipamento,
        type:props.site.type
      }
    )
    
    
  }

 
  return (
    <TouchableOpacity style={styles.container} onPress={pressButton}>    
      <View style={{ flex:1}}>
      <Text style={{fontWeight:'bold', fontSize:16, alignSelf:'center'}}>
        {props.site.name} | {props.site.list&&props.site.list.length >0? props.site.type:'inventario'}
      </Text>
      </View>  
      
      <TouchableOpacity style={styles.texto} onPress={()=>props.remove(props.site['id'])}>
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

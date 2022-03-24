import React, {useState, useContext, useEffect} from 'react';
import { List, IconButton, Colors  } from 'react-native-paper';
import { Text, View, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons'
import {useNavigation} from '@react-navigation/native'
import * as ImagePicker from 'expo-image-picker'
import * as MediaLibrary from 'expo-media-library'
import {ListContext} from '../contexts/listContexts'
import * as FileSystem from 'expo-file-system'

const MyComponent = props => {
  const [expanded, setExpanded] = useState(true)
  const [desc, setDesc] = useState(false);
  const handlePress = () => setExpanded(!expanded)
  const [corItem, setCorItem] = useState('#ffffff')
  const navigation = useNavigation()
  const [image, setImage] = useState(null)
  const {dispatch} = useContext(ListContext)
  

  const convert = async (img)=>{
    const base64 = await FileSystem.readAsStringAsync(img, { encoding: 'base64' })
    const b64 = `data:image/png;base64,'+ ${base64}` 
    return b64
  }
   

  const pickImage = async () => {
   
    const options = {
      //mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    }

    const result = await ImagePicker.launchCameraAsync(options)
    if (!result.cancelled) {
      const b64 = await FileSystem.readAsStringAsync(result.uri, { encoding: 'base64' })
      //console.log(b64)
      setImage(result.uri)     
      savePicture(result.uri,props.data.id, b64)

    }
  }
  
  const getImage = async () => {
    const options = {
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    }
    const result = await ImagePicker.launchImageLibraryAsync(options)
    if (!result.cancelled) {
      const b64 = await FileSystem.readAsStringAsync(result.uri, { encoding: 'base64' })
      //console.log(b64)
      setImage(result.uri)     
    
      dispatch({
        type: 'take',
        payload: {
          id: props.data.id,
          img:result.uri,
          b64: `data:image/png;base64,${b64}` 
        }
      })
      

      //savePicture(result.uri,props.data.id, b64)

    }
  }


  const savePicture = async (picture, id,base64) =>{
    try {
      const asset = await MediaLibrary.createAssetAsync(picture)
      const existAlbum = await MediaLibrary.getAlbumAsync('Relatorio')

      //verifica se o album existe e move a imagem para o existente
      if(existAlbum){
        await MediaLibrary.addAssetsToAlbumAsync(asset,existAlbum.id,false)
      }else{
        await MediaLibrary.createAlbumAsync('Relatorio', asset)
      }    
        
      //MediaLibrary.deleteAssetsAsync(asset) 
      //chama o dispatch aqui depois que salvar na galeria
      dispatch({
        type: 'take',
        payload: {
          id: id,
          img:picture,
          b64: `data:image/png;base64,${base64}` 
        }
      })
      
      //navigation.navigate('NewList')        
      
    } catch (error) {
      console.error(error)
    }
    
       
  }

  //console.log('AQUI',props.data)
  const openClose = ()=>{
    if (desc) {
      setDesc(false)
    }else {
      setDesc(true)
    }
  }
  
  return (
    <View style={[styles.container]}>
      <View style={styles.container2}>       
        <TouchableOpacity 
          style={styles.texto} 
          onPress= {openClose}
        >             
          <Text>{props.data.title}</Text>  
          {desc? 
            <View style={{flexDirection:'row', alignItems:'center'}}>
              {image&&<Image style={{width:50,height:50}} source={{uri:image}}/>}
              <Text style={styles.desc}>{props.data.desc}</Text>
            </View>           
              
          :false}           
        </TouchableOpacity>   
        
        <View style={{flexDirection:"row"}}>
          <TouchableOpacity 
            onPress = {pickImage}
          >   
            <Ionicons  name="camera" size={32}/>
          </TouchableOpacity>      
          <TouchableOpacity 
            onPress = {getImage}
          >   
            <Ionicons  name="image-outline" size={32}/>
          </TouchableOpacity>
          
        </View>
         
         
      </View>
      {props.data.img && <View style= {[styles.barra]}/>}      
    </View>
   
  );
};

const styles = StyleSheet.create({
  container: {       
    borderRadius:5,
    shadowColor: "black",
    elevation:2,
    backgroundColor:'#ffffff',
    marginBottom:10,
    overflow: 'hidden'
  },

  container2:{   
    //width:'100%',
    flexDirection:'row', 
    alignItems:'center',
    
    //backgroundColor: '#ffffff',  
    
    
       
  },
  texto:{
    width:'80%',
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

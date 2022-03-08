import React, {useState, useEffect, useRef,useContext} from 'react'
import { Text, View, SafeAreaView, 
         StyleSheet,TouchableOpacity,
         Dimensions, Modal,Image
} from 'react-native';
import {width, height} from '../constantes'
import { Camera } from 'expo-camera'
import * as Permissions from 'expo-permissions'
import * as MediaLibrary from 'expo-media-library'
import { Ionicons } from '@expo/vector-icons'
import * as ImageManipulator from 'expo-image-manipulator'
import {useNavigation} from '@react-navigation/native'
import {ListContext} from '../contexts/listContexts'


//REFAZER ELE TODO PQ ESSE TA DANDO ERROR

const Cam = props => {
  const camRef = useRef(null)
  const [hasPermission, setHasPermission] = useState(null)
  const [type, setType] = useState(Camera.Constants.Type.back)
  const [image,setImage] = useState(null)
  const [open,setOpen] = useState(false)
  //pega o nome da lista e id do item
  const {idItem, listType} = props.route.params
  const {dispatch} = useContext(ListContext)
  const navigation = useNavigation()
  

  useEffect(() => {    
    // (async () => {
    //   const { status } = await Camera.requestCameraPermissionsAsync();
    //   setHasPermission(status === 'granted');
    // })();

    (async () => {
      const { status } = await Permissions.askAsync(Permissions.CAMERA_ROLL);      
      setHasPermission(status === 'granted');
    })();
  }, []);

  if (hasPermission === null) {
   
    return <Text>Acesso A Camera null</Text>;
  }
  if (hasPermission === false) {
    
    return <Text>Acesso A Camera negado</Text>;
  }

  async function takePicture(){
     if (camRef){
       const data = await camRef.current.takePictureAsync()       
       setImage(data.uri)
       setOpen(true)
       //salva o arquivo base 64 tbm ?? to na duvida
       //setMVisible(true)
       
     }

  }

  const savePicture = async () =>{
    const asset = await MediaLibrary.createAssetAsync(image)
      .then(()=>{     
        
        //apos salvar a foto muda a lista de fotos tirada e 
        //salva a foto na mesma lista  
        //chama o dispatch aqui depois que salvar na galeria
        console.log('CAMERA SAVE PIC',idItem)
        dispatch({
          type: 'take',
          payload: {
            list: listType,
            id: idItem,
            img:image}
        })
        navigation.navigate('NewList')        
      })
      .catch(error =>{
        console.log(error)
      })    
  }
 
  //corta a foto para um tamanho quadrado 
  const cropImage = async (data) =>{
    ImageManipulator.manipulateAsync(
      data,
      [{ crop: {
                originX: 0,
                originY: (image.height - image.width)/2,
                width: image.width/2,
                height: image.width/2
              }}],
      
    ).then(r=>{
       console.log('->',r)
       setOpen(true)
       setImage(r.uri)
    })
   
  }


  return (
    <View style={styles.container}>
    
      <Camera
        style= {{flex:1}}
        ref= {camRef}
        //define as dimenções da camera 
        //pensando em pega a camera do android em vez do expo
        ratio= '16:9'        
        type={type}>
        <View style={styles.borderContainer}>
          <View style={styles.border}/>
        </View>   
      </Camera>            
      <View style={styles.containerButton}>
          <TouchableOpacity 
            style={styles.flip} 
            onPress={
              ()=> setType(type === Camera.Constants.Type.back?
                                    Camera.Constants.Type.front:
                                    Camera.Constants.Type.back
                                    )}>
            <Text style={{color:'#ffffff'}}>FLIP</Text>
            
          </TouchableOpacity>
          <TouchableOpacity style ={styles.take} onPress = {takePicture}>
              <Ionicons name='camera' size={32} color='#ffffff'/>
          </TouchableOpacity>
      </View>     
    
      {image&&
      <Modal 
        style={{flex:1}}
        transparent={false} 
        visible={open}>

        <Image style ={{width:'100%',height:'100%'}}
                    source={{uri:image}}/>  
        <TouchableOpacity style={styles.salvaButton} onPress={()=> savePicture()}>
          <Text style={{color:'#ffffff', fontSize:25}}>SALVAR</Text> 
        </TouchableOpacity> 
        <TouchableOpacity style={styles.repetirButton} onPress={()=> setImage(null)}>
          <Text style={{color:'#ffffff', fontSize:25}}>REPETIR</Text> 
        </TouchableOpacity> 
      </Modal> }
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex:1,
        
  },
  salvaButton:{
    position:'absolute', 
    bottom:20, 
    right:20
  },
  repetirButton:{
    position:'absolute', 
    bottom:20, 
    left:20
  },
  containerButton:{
    height:'6%',
    flexDirection:'row',    
    backgroundColor:'#000000',
    opacity: 0.5,
    alignItems:'center',
    justifyContent:'space-between'

  },
  borderContainer:{
    flex:1,
    alignItems:'center',
    justifyContent:'center'
  },
  border:{
    position:'relative',
    borderWidth: 2,
    width:width-10,
    height:width-10,
    borderColor:'#ffffff',
    opacity: 0.5,
    borderRadius: 10
    //top: width
  },
  flip:{
    marginLeft: 10,    
  },
  take:{    
    marginRight: 10
  },
});

export default Cam

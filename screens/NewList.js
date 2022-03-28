import  React, {useEffect, useState, useContext} from 'react'
import { Text, SafeAreaView, StyleSheet, FlatList ,View, TouchableOpacity} from 'react-native'
import Item from '../components/Item'
import {useNavigation, useRoute} from '@react-navigation/native'
import {ListContext} from '../contexts/listContexts'
import { Ionicons } from '@expo/vector-icons'
//import * as Sharing from 'expo-sharing'
import * as ImagePicker from 'expo-image-picker'
import MyTextInput from '../components/MyTextInput'
import {Button,ProgressBar, Colors } from 'react-native-paper'

export default props => {
  //const { otherParam , title} = props.route.params  
  const [name, setName] = useState('')
  const [nameEstacao, setNameEstacao] = useState('PEIPS05-RMD02')
  const [hasPermission, setHasPermission] = useState(null)
  const [params, setParams] = useState(null)
  const [title, setTitle] = useState(null)
  //pega a lista pelo reducer 
  const {state, dispatch} = useContext(ListContext)
  const [lista,setLista] = useState([])
  const [add, setAdd] = useState(false)
  //const {dispatch} = useContext(ListContext)
  const navigation = useNavigation()
  const route = useRoute()

  //pega permisão do usuario par atirar foto
  useEffect(() => {    

    (async () => {
      const {status} = await  ImagePicker.requestMediaLibraryPermissionsAsync()      
      setHasPermission(status === 'granted');
    })()  

  }, [])

  const addItemList = (item) => {
    dispatch({
      type: 'novoItem',
      payload:{
        list:route.params.type, 
        item:{
          id:Math.floor(Math.random()*1000), 
          title:name
        }
      }
    })
  } 

  useEffect(()=>{
    //console.log('NL',state[route.params.listName])
    setLista(state[route.params.listName])
  },[state])
 
  //muda o titulo do header
  useEffect(()=>{    
    props.navigation.setOptions({ title:route.params.title,
        headerRight: () => (
        //ao clicar no botão muda de tela e gera relatorio
        <View style={{flexDirection:'row'}}>
          <TouchableOpacity style={styles.texto} onPress = {pressGerar}>             
            <Ionicons 
              style= {{justifyContent:'flex-end'}} 
              name="checkmark-done-sharp" 
              size={32}
            />
          </TouchableOpacity>
        </View>
        )})
  }, [])
  
  const pressGerar = ()=>{
    navigation.navigate('GeradorExcel',{list:route.params.listName})
  }
 
  return (
    <View style={styles.container}>     
      { route.params.title === 'EM BRANCO'&&
      <View style={styles.inputContatiner}>
        <MyTextInput 
          title={'LEGENDA DA FOTO'}
          value={name}
          placeholder = 'EX:ENTRADA DO SITE'
          onChangeText = {(t)=> setName(t)}
        />
        <View style={{flexDirection:'row'}}>
          <Button 
              style={styles.button} 
              onPress={addItemList}
              mode='contained' 
              color= "#2196f3"
            >
              ADICIONA
            </Button>
        </View>
      </View>   
      }  
      <FlatList
        data={lista}
        initialNumToRender = {10}
        contentContainerStyle={{ paddingVertical: 10 ,paddingBottom:30}}
        showsVerticalScrollIndicator={false}
        ListFooterComponent={()=><Text style={styles.logo}>FROM MSTUDIO</Text>}
        renderItem={({ item }) => (          
          <Item data = {item} list = {route.params.listName}/>          
          )}
        keyExtractor={item =>item.id}        
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {    
    
    alignItems: 'center',
    justifyContent: 'center',    
    width:'100%'
    //backgroundColor: '#696969',
    //marginVertical:10  
  },

  inputContatiner:{
    margin:10,
    width:'90%'
  },
  texto:{    
   marginRight:10
  },
  button:{
    width:'100%',
    padding:4,
    marginTop:16
  },
  logo:{
    height:80,
    alignItems:'center',
    textAlign:'center'
  },
});



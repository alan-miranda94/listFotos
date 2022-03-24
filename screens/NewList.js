import  React, {useEffect, useState, useContext} from 'react'
import { Text, SafeAreaView, StyleSheet, FlatList ,View, TouchableOpacity} from 'react-native'
import Item from '../components/Item'
import {useNavigation} from '@react-navigation/native'
import {ListContext} from '../contexts/listContexts'
import { Ionicons } from '@expo/vector-icons'
//import * as Sharing from 'expo-sharing'
import * as ImagePicker from 'expo-image-picker'
import MyTextInput from '../components/MyTextInput'
import {Button,ProgressBar, Colors } from 'react-native-paper'

export default props => {
  //const { otherParam , title} = props.route.params  
  const [name, setName] = useState('ENTRADA DO SITE')
  const [nameEstacao, setNameEstacao] = useState('PEIPS05-RMD02')
  const [hasPermission, setHasPermission] = useState(null)
  const [otherParam, setOtherParam] = useState(null)
  const [title, setTitle] = useState(null)
  //pega a lista pelo reducer 
  const {state, dispatch} = useContext(ListContext)
  const [lista,setLista] = useState([])
  const [add, setAdd] = useState(false)
  //const {dispatch} = useContext(ListContext)
  const navigation = useNavigation()

  useEffect(() => {    
    (async () => {
      const {status} = await  ImagePicker.requestMediaLibraryPermissionsAsync()      
      setHasPermission(status === 'granted');
    })()
  }, [])

  const addItemList = (item) => {
    dispatch({
      type: 'novoItem',
      payload: {id:Math.floor(Math.random()*1000), title:name}
    })
  } 
  useEffect(()=>{
    setLista(state.atualLista)
  },[state])
 
  useEffect(()=>{    
    props.navigation.setOptions({ title:state.title,
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
    navigation.navigate('GeradorExcel')
  }
 
  return (
    <View style={styles.container}>     
      { state.title === 'EM BRANCO'&&
      <View style={styles.inputContatiner}>
        <MyTextInput 
          title={'LEGENDA DA FOTO'}
          value={name}
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
        contentContainerStyle={{ paddingVertical: 10 ,}}
        showsVerticalScrollIndicator={false}
        ListFooterComponent={()=><Text style={styles.logo}>FEMATEL</Text>}
        renderItem={({ item }) => (          
          <Item data = {item}/>          
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



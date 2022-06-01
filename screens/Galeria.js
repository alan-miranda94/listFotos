import  React, {useEffect, useState, useContext} from 'react'
import { Text, SafeAreaView, StyleSheet, FlatList ,View, TouchableOpacity} from 'react-native'
import ItemGaleria from '../components/ItemGaleria'
import {useNavigation} from '@react-navigation/native'
import {ListContext} from '../contexts/listContexts'
import {Button,ProgressBar, Colors } from 'react-native-paper'
import AsyncStorage from '@react-native-async-storage/async-storage'

export default props => {
  const {state, dispatch} = useContext(ListContext)
  const [lista,setLista] = useState([])
  //const {dispatch} = useContext(ListContext)
  const navigation = useNavigation()

  useEffect(() => {       
    getLista()    
  }, [])

  const getLista = async ()=>{
    const list = await  getData()
    if(list){
      setLista(list)
    }
  }

  const removeData = async (name) => {
    try {
      await AsyncStorage.removeItem(name).then((r)=>{
       getLista()
      })
     
    } catch(e) {
      // error reading value
      console.log(e)
    }
  }

  const getData = async (name='@salvos') => {
    try {
      const jsonValue = await AsyncStorage.getAllKeys()
      return jsonValue 
    } catch(e) {
      // error reading value
      console.log(e)
    }
  }

  useEffect(()=>{    
    navigation.setOptions({ title:'Relatórios Salvos'})
  }, [])
  

  return (
    <View style={styles.container}>   
      
      <FlatList
        data={lista}
        initialNumToRender = {10}
        contentContainerStyle={{ paddingVertical: 10 ,}}
        showsVerticalScrollIndicator={false}
        ListFooterComponent={()=><Text style={styles.logo}>FROM MSTUDIO</Text>}
        renderItem={({ item }) => (          
          <ItemGaleria remove={removeData} site = {item}/>          
          )}
        keyExtractor={item =>Math.random()}        
      />
    </View>
  );
};


const styles = StyleSheet.create({
  container: {    
    flex:1,
    //alignItems: 'center',
    //justifyContent: 'center',    
   
    margin:10  
  },
  texto:{    
   marginRight:10
  },
  button:{
   
    marginTop:16
  },
  logo:{
    marginTop:100,
    height:100,
    alignItems:'center',
    textAlign:'center',
    width:"100%",
  },
});



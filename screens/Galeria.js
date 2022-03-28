import  React, {useEffect, useState, useContext} from 'react'
import { Text, SafeAreaView, StyleSheet, FlatList ,View, TouchableOpacity} from 'react-native'
import ItemGaleria from '../components/ItemGaleria'
import {useNavigation} from '@react-navigation/native'
import {ListContext} from '../contexts/listContexts'
import {Button,ProgressBar, Colors } from 'react-native-paper'
import AsyncStorage from '@react-native-async-storage/async-storage'

export default props => {
  //const { otherParam , title} = props.route.params  
  const [name, setName] = useState('ENTRADA DO SITE')
  //pega a lista pelo reducer 
  const {state, dispatch} = useContext(ListContext)
  const [lista,setLista] = useState([])
  //const {dispatch} = useContext(ListContext)
  const navigation = useNavigation()

  useEffect(() => {    
    const getLista = async ()=>{
      const list = await  getData()
      if(list){
        console.log('GALERIA', list)
        setLista(list)
      }
    }
    getLista()
    
  }, [])

  const getData = async (name='@salvos') => {
    try {
      const jsonValue = await AsyncStorage.getItem(name)
      return jsonValue != null ? JSON.parse(jsonValue) : null;
    } catch(e) {
      // error reading value
      console.log(e)
    }
  }

 
  useEffect(()=>{    
    navigation.setOptions({ title:'Relatórios Feitos'})
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
          <ItemGaleria data = {item}/>          
          )}
        keyExtractor={item =>item.id}        
      />
    </View>
  );
};


const styles = StyleSheet.create({
  container: {    
    //flex:1,
    alignItems: 'center',
    justifyContent: 'center',    
    width:'100%',
    backgroundColor: '#696969',
    //marginVertical:10  
  },
  texto:{    
   marginRight:10
  },
  button:{
   
    marginTop:16
  },
  logo:{
    marginTop:30,
    height:80,
    alignItems:'center',
    textAlign:'center',
    width:"100%",
  },
});



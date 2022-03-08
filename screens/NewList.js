import  React, {useEffect, useState, useContext} from 'react'
import { Text, SafeAreaView, StyleSheet, FlatList ,Modal, TouchableOpacity} from 'react-native'
import Item from '../components/Item'
import {useNavigation} from '@react-navigation/native'
import {ListContext} from '../contexts/listContexts'
import { Ionicons } from '@expo/vector-icons'
//import * as Sharing from 'expo-sharing'

const Home = (props) => {
  const { itemId, otherParam , title} = props.route.params  
  //const isShared = useState(Sharing.isAvailableAsync())
  const [thisList,setThisList] = useState()
  //pega a lista pelo reducer 
  const {state} = useContext(ListContext)
  const lista = state[otherParam]
  const {dispatch} = useContext(ListContext)
  const navigation = useNavigation()

  // //console.log(lista)
  const share = (arquivo)=>{
    dispatch({
      type: 'clear'
    })
    navigation.navigate('Home')
  //  let url = arquivo.filter(item => {     
  //    let x = item.img?true:false     
  //    return x
  //  })
  //  console.log(url)
  //  Sharing.shareAsync(url)
  }

 

  useEffect(()=>{    
    props.navigation.setOptions({ title:title,
         headerRight: () => (
           //butão no hodape
          //ao clicar no botão muda de tela e gera relatorio
        <TouchableOpacity style={styles.texto} onPress= {()=>{share(lista)}}>             
          <Ionicons 
            style= {{justifyContent:'flex-end'}} 
            name="checkmark-done-sharp" 
            size={32}
          />
        </TouchableOpacity>)})
  }, [])
  
 
  return (
    <SafeAreaView style={styles.container}>      
      <FlatList
        data={lista}
        ListFooterComponent={()=><Text style={styles.logo}>FEMATEL</Text>}
        renderItem={({ item }) => (          
          <Item tipo ={otherParam} data = {item}/>          
          )}
        keyExtractor={item =>item.id}        
      />
      
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {    
    
    alignItems: 'center',
    justifyContent: 'center',    
    //backgroundColor: '#696969',
    marginVertical:10  
    
  },
  texto:{    
   marginRight:10
  },
  logo:{
    height:70,
    alignItems:'center',
    textAlign:'center'
  },
});

export default Home;

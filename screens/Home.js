import React,{useContext, useEffect} from 'react';
import {View, StyleSheet,  } from 'react-native'
import {useNavigation} from '@react-navigation/native'
import Constants from 'expo-constants'
import {Button} from 'react-native-paper'
import {ListContext} from '../contexts/listContexts'

const  App = props => {
  const navigation = useNavigation()
  const {state, dispatch} = useContext(ListContext)

  useEffect(()=>{
    //console.log()
  },[])

  const pressButton = (title, type)=>{
    //console.log(state[type])
    navigation.navigate('NewList',{listName: type,title:title})

    // dispatch({
    //   type: 'atualLista',
    //   payload: [title, type]
    // })
    // navigation.navigate(
    //   'NewList',
    // //  {
    // //    itemId: Math.floor(Math.random()*100), 
    // //    otherParam: type,
    // //    title:title
    // //  }
    //  )
  }
  return (
    <View style={styles.container}>      
      <Button  
        style={styles.button} 
        onPress = {()=> pressButton('MODELO', 'modelo')}
        mode='contained' 
        color= '#ffea00' 
        
      >
        Relatório com modelo
      </Button>
      {
      false&&
        <>
        <Button 
        style={styles.button} 
        onPress = {()=> pressButton('AMPLIAÇÃO DE PLACA', 'ampliacao')}
        mode='contained' 
        color= '#ffea00'
        >
          Ampliação de Placa
        </Button>
        <Button 
          style={styles.button} 
          onPress = {()=> pressButton('INST. DE CHELF EXISTENTE','existente')}
          mode='contained' 
          color= '#ffea00'
        >
          Instalação de chelf Existente
        </Button>
        <Button 
         
          style={styles.button} 
          onPress = {()=> navigation.navigate("Galeria")}
          mode='contained' 
          color= '#ffea00'
        >
          Relatórios Feitos
        </Button>
        </>
      }
      
      <Button 
        style={styles.button} 
        onPress = {()=> pressButton('EM BRANCO','branco')}
        mode='contained' 
        color= '#ffea00'
        
      >
        Relatório em Branco
      </Button>
      
      
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection:'column',
    justifyContent: 'center',
    alignItems:"center",
    paddingTop: Constants.statusBarHeight,
    backgroundColor: '#2196f3',
    padding: 8,
   
  },
  button:{
    margin:10,
    width:'90%',
    height:'10%',
    justifyContent: 'center',
    alignItems:"center",
  }
  
});


export default App

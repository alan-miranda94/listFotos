import * as React from 'react';
import {View, StyleSheet } from 'react-native'
import {useNavigation} from '@react-navigation/native'
import Constants from 'expo-constants'
import {Button} from 'react-native-paper'

const  App = props => {
  const navigation = useNavigation()
  const pressButton = (title, type)=>{
    navigation.navigate(
      'NewList',
     {
       itemId: 86, 
       otherParam: type,
       title:title
     })
  }
  return (
    <View style={styles.container}>      
      <Button  
        style={styles.button} 
        onPress = {()=> pressButton('NOVO RACK', 'rackNovo')}
        mode='contained' 
        color= '#ffea00' 
      >
        NOVO RACK
      </Button>
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
      
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    paddingTop: Constants.statusBarHeight,
    backgroundColor: '#2196f3',
    padding: 8,
   
  },
  button:{
    marginTop:10
  }
  
});


export default App

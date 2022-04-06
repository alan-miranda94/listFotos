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

  

  return (
    <View style={styles.container}>      
     
      
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

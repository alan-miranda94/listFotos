import { StatusBar } from 'expo-status-bar'
import React, {useEffect, useState} from 'react'
import { StyleSheet, Text, View } from 'react-native'
import * as Updates from 'expo-updates'
import { 
  NavigationContainer,
} from '@react-navigation/native'
import MainStack from './navigation/MainStack'
import ListContextProvider from './contexts/listContexts'
import Toast from 'react-native-toast-message'
export default function App() {
  
  //verifica se tem atualizações no codigo do aplicativo
  useEffect(()=>{
    async function updateApp(){
      const {isAvailable} = Updates.checkForUpdateAsync()
      if(isAvailable){
        await Updates.fetchUpdateAsync()
        await Updates.reloadAsync()
      }
    }
    updateApp()
  },[])
 


  return (
    <ListContextProvider>
      <NavigationContainer >       
          <MainStack/>
          <StatusBar style="auto" />          
      </NavigationContainer>
      <Toast />
    </ListContextProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

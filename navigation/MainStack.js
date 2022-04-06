import React from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack'

import Home from '../screens/Home'
import NewList from '../screens/NewList'
import NewSite from '../screens/NewSite'
import GeradorExcel from '../screens/GeradorExcel'
import Galeria from '../screens/Galeria'

const Stack = createNativeStackNavigator()

export default () => (
  <Stack.Navigator 
    initialRouteName=  'Home'
    screenOptions={{
        headerShown: false
    }}>
      <Stack.Screen name = 'Home' component = {Home}/> 
      <Stack.Screen name = 'NewSite' component = {NewSite} />     
      <Stack.Screen name = 'NewList' component = {NewList} />     
      <Stack.Screen name = 'GeradorExcel' component = {GeradorExcel} />
      <Stack.Screen name = 'Galeria'  options ={{headerShown:true}} component = {Galeria} />
     

      
  </Stack.Navigator>

)
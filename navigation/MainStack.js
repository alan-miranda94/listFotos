import React from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack'

import Home from '../screens/Home'
import NewList from '../screens/NewList'
import GeradorExcel from '../screens/GeradorExcel'

const Stack = createNativeStackNavigator()

export default () => (
  <Stack.Navigator 
    initialRouteName=  'Home'
    screenOptions={{
        headerShown: false
    }}>
      <Stack.Screen name = 'Home' component = {Home}/> 
      <Stack.Screen name = 'NewList' component = {NewList} options ={{headerShown:true}}/>     
     { 
      <Stack.Screen name = 'GeradorExcel' component = {GeradorExcel} options ={{headerShown:true}}/>
     }

      
  </Stack.Navigator>

)
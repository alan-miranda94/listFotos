import React from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack'

import Home from '../screens/Home'
import NewList from '../screens/NewList'
import GeradorExcel from '../screens/GeradorExcel'
import Galeria from '../screens/Galeria'

const Stack = createNativeStackNavigator()

export default () => (
  <Stack.Navigator 
    initialRouteName=  'Home'
    screenOptions={{
        headerShown: true
    }}>
      <Stack.Screen name = 'Home' component = {Home} options ={{headerShown:false}}/> 
      <Stack.Screen name = 'NewList' component = {NewList} />     
      <Stack.Screen name = 'GeradorExcel' component = {GeradorExcel} />
      <Stack.Screen name = 'Galeria' component = {Galeria} />
     

      
  </Stack.Navigator>

)
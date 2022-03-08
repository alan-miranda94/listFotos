import React from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack'

import Home from '../screens/Home'
import NewList from '../screens/NewList'
import Camera from '../screens/Camera'

const Stack = createNativeStackNavigator()

export default () => (
  <Stack.Navigator 
    initialRouteName=  'Home'
    screenOptions={{
        headerShown: false
    }}>
      <Stack.Screen name = 'Home' component = {Home}/> 
      <Stack.Screen name = 'NewList' component = {NewList} options ={{headerShown:true}}/>     
      <Stack.Screen name = 'Camera' component = {Camera} />

      
  </Stack.Navigator>

)
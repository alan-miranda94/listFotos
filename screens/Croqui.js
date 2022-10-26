import React, { useContext, useEffect } from 'react';
import { View, StyleSheet,Text ,Image} from 'react-native'
import { useNavigation } from '@react-navigation/native'
import Constants from 'expo-constants'
import { Button, Checkbox } from 'react-native-paper'
import { ListContext } from '../contexts/listContexts'
import Logo from '../assets/icon.png'
import { DragResize } from '../components/DragResize';
import { Draggable } from '../components/Draggable';
const App = props => {
  const navigation = useNavigation()
  const { state, dispatch } = useContext(ListContext)
  

  useEffect(() => {
    //console.log()
  }, [])

  const pressButton = (title, type) => {
    //console.log(state[type])
    navigation.navigate('NewList', { listName: type, title: title })

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
      <Draggable>
      <Text style={{color:'white', alignItems:"center", justifyContent:"center"}}>
        V.3.0.0
      </Text>
      </Draggable>

     
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: "center",
    paddingTop: Constants.statusBarHeight,
    backgroundColor: '#2196f3',
    padding: 8,

  },
  button: {
    margin: 10,
    width: '100%',
    //height:'10%',

  },
  logo: {
    height: 100,
    marginTop: 30,
    //justifyContent: 'flex-start',
    //alignItems: 'center',
  },
  phrase: {
    height: '70%',

  },

});


export default App

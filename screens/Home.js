import React, { useContext, useEffect } from 'react';
import { View, StyleSheet, } from 'react-native'
import { useNavigation } from '@react-navigation/native'
import Constants from 'expo-constants'
import { Button, Checkbox } from 'react-native-paper'
import { ListContext } from '../contexts/listContexts'

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
      <Button
        style={{ width: '100%', heigth: '10%', marginBottom: 10 }}
        contentStyle={{ margin: 10 , fontSize:25}}
        onPress={() => navigation.navigate('NewSite')}// pressButton('MODELO', 'modelo')}
        icon='folder-plus'
        mode='contained'
        color='#ffea00'

      >
        NOVO SITE
      </Button>
      
      <Button
        style={{ width: '100%', heigth: '10%', marginBottom: 10 }}
        contentStyle={{ margin: 10 }}
        onPress={() =>navigation.navigate('Galeria')}
        mode='contained'
        color='#ffea00'
        icon='folder-multiple-image'
        disabled={true}

      >
        GALERIA
      </Button>


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

  }

});


export default App

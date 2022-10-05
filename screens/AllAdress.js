import React, { useEffect, useState, useContext } from 'react'
import { Text, SafeAreaView, StyleSheet, FlatList, View, Linking } from 'react-native'
import { IconButton, List, Searchbar, } from 'react-native-paper'
import Constants from 'expo-constants'
import AllAdress from '../adress.json'

export default props => {
 
  const [maps, setMaps] = useState(AllAdress["AllAdress"])


  //REDUZ A LISTA DE ACORDO COM A PESQUISA
  const onChangeSearch = (name, t) => {
    let rota = AllAdress["AllAdress"].filter(item => item.Nome.includes(name))
    setMaps(rota)
  }

  useEffect(() => {
    
  }, [])

  const openURL = async (lat,long) => {
    
      let url= `http://maps.google.com/maps?z=12&t=m&q=${lat.replace(",",'.')},${long.replace(",",'.')}`
      console.log(url)
    
      const supported = await Linking.canOpenURL(url)  
      if (supported) {        
        await Linking.openURL(url)
      }
   
  }

  return (
    <View style={styles.container}>

      <Searchbar
        style={{ elevation: 2, }}
        placeholder="Search"
        onChangeText={onChangeSearch}
        autoCapitalize={"characters"}
      />
      <FlatList
        data={maps}
        style={{ flexGrow: 1, }}
        initialNumToRender={12}
        contentContainerStyle={{ padding: 10, paddingBottom: 40, }}
        showsVerticalScrollIndicator={false}
        ListFooterComponent={() => <Text style={styles.logo}>FROM MSTUDIO</Text>}
        renderItem={({ item }) => (
          <View style={{ padding: 10, alignItems:'center',borderBottomWidth: 1, borderBottomColor: '#C1C1C1', flexDirection: 'row', justifyContent:'space-between' }}>
            <View>
              <Text style={{ fontWeight: "bold" }}>{item.Nome}</Text>
              <Text style={{ fontSize:10}}>{`${item["tipo logradouro"]} ${item["logradouro"] ? item["logradouro"] : 'NA'}  ${item["numero"] ? item["numero"] : 'NA'}`}</Text>
              <Text style={{ fontSize:10}}>{`lat.: ${item["latitude"]}, long.: ${item["longitude"]}`}</Text>

            </View>

            <IconButton
              icon='google-maps'
              color={'#DC143C'}
              size={26}
              onPress={() => openURL(item["latitude"],item["longitude"])}
            />
          </View>
        )}
        keyExtractor={item => item.ID + Math.random()}
      />



    </View>

  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    //alignItems: 'center',
    //justifyContent: 'center',
    width: '100%',
    backgroundColor: 'white' ,
    //backgroundColor: '#696969',
    padding:10  
  },
  menu: {
    position: 'absolute',
    top: -20,
    left: 30,
    flex: 1

  },
  barra: {
    width: '100%',
    paddingTop: Constants.statusBarHeight + 4,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'white',
    shadowColor: "black",
    elevation: 4,
  },

  inputContatiner: {
    margin: 10,
    width: '90%'
  },
  texto: {

    marginRight: 10
  },
  button: {
    width: '100%',
    padding: 4,
    marginTop: 16
  },
  logo: {
    height: 80,
    width: '100%',
    alignItems: 'center',
    textAlign: 'center'
  },
});



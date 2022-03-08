import React, {useState} from 'react';
import { List, IconButton, Colors  } from 'react-native-paper';
import { Text, View, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons'
import {useNavigation} from '@react-navigation/native'


const MyComponent = props => {
  const [expanded, setExpanded] = useState(true);
  const [desc, setDesc] = useState(false);
  const handlePress = () => setExpanded(!expanded);
  const [corItem, setCorItem] = useState('#ffffff')
  const navigation = useNavigation()

  //console.log('AQUI',props.data)
  const openClose = ()=>{
    if (desc) {
      setDesc(false)
    }else {
      setDesc(true)
    }
  }
  
  return (
    <View style={[styles.container]}>
      <View style={styles.container2}>       

        <TouchableOpacity 
          style={styles.texto} 
          onPress= {openClose}
        >             
          <Text>{props.data.title}</Text>  
          {desc?            
              <Text style={styles.desc}>{props.data.desc}</Text>
          :false}           
        </TouchableOpacity>   
        
        <TouchableOpacity 
          onPress = {()=>navigation.navigate('Camera', {idItem: props.data.id, listType: props.tipo})}>   
          <Ionicons style= {{justifyContent:'flex-end'}} name="camera" size={32}/>
        </TouchableOpacity>        
         
      </View>
      {props.data.img && <View style= {[styles.barra]}/>}      
    </View>
   
  );
};

const styles = StyleSheet.create({
  container: {       
    borderRadius:5,
    shadowColor: "black",
    elevation:2,
    backgroundColor:'#ffffff',
    marginBottom:10,
  },

  container2:{   
    width:'100%',
    flexDirection:'row', 
    alignItems:'center',
    //backgroundColor: '#ffffff',  
    
    
       
  },
  texto:{
    width:'90%',
    padding:10,
  },
  
  desc:{
    color: '#808080'
    
  },
  barra:{   
    height: 6,
   backgroundColor:'#39FF14'
  }

  
});

export default MyComponent;

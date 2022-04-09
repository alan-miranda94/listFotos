import React, { useState, useRef} from 'react'
import { StyleSheet, View, TextInput,Text, TouchableWithoutFeedback } from 'react-native'



export default props => {
  const [text, setText] = useState("")
  const inputRef = useRef()

  return (
    <TouchableWithoutFeedback
      onPress={()=>inputRef.current.focus()}
    >
      <View style={styles.container}>
      <Text style={styles.title}>
        {props.title}
      </Text>
      <TextInput              
        onChangeText={props.onChangeText}
        autoCapitalize = {"characters"}
        value={props.value}   
        ref = {inputRef}
        placeholder={props.placeholder?props.placeholder:""}
        secureTextEntry={props.secureTextEntry}
      />
    </View>
    </TouchableWithoutFeedback>
   
  );
}

const styles = StyleSheet.create({
  container: {
    width:'100%',
    borderRadius: 15,   
    borderWidth:1,
    height:50,
    marginTop:15,
    padding: 8
  },
  
  input:{
    flex:1,
    fontSize: 15,
		//height: 40,
  },
  title:{
      fontSize: 8,
      color:'red'
  }
});
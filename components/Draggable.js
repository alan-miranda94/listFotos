import React, { useEffect, useState, useRef } from 'react'
import { Pressable } from 'react-native'
import { StyleSheet, View, Text, PanResponder, Animated, TouchableOpacity } from "react-native"
import { TouchableWithoutFeedback } from 'react-native-gesture-handler'



export function Draggable({ children, ...rest }) {
  const pan = useRef(new Animated.ValueXY()).current
  const opacity = new Animated.Value(1)
  const [showDraggable, setShowDraggable] = useState(true)
  const [showOpc, setShowOpc] = useState(false)
  const [dropAreaValues, setDropAreaValues] = useState(null)
  const [selected, setSelected] = useState()


  let panResponder = useRef(PanResponder.create({
    onStartShouldSetPanResponder: (e, gesture) => true,
    onPanResponderGrant: (e, gesture) => {
      pan.setOffset({
        x: _val.x,
        y: _val.y
      })
      pan.setValue({ x: 0, y: 0 })
    },
    onPanResponderMove: Animated.event([
      null, { dx: pan.x, dy: pan.y }
    ], { useNativeDriver: false }),
    onPanResponderStart: () => { setShowOpc(false) }
    ,
    onPanResponderEnd: (e, gesture) => { setShowOpc(true) },
  })).current

  
  let _val = { x: 0, y: 0 }

  useEffect(() => {
    pan.addListener((value) => _val = value)

  }, [])

  const slowMe = () => {
    setShowDraggable(false)
  }

  const panStyle = {
    transform: [...pan.getTranslateTransform(),],
  }

  return (
    <TouchableOpacity style={{ position: "absolute" }}>
      <Animated.View
        {...panResponder.panHandlers}
        style={[panStyle, styles.container]}
      >
        {children}

        {false &&
          <View style={styles.opc}>
            <Text>R</Text>
            <Text>X</Text>
            <Text>2x</Text>

          </View>}
      </Animated.View>
    </TouchableOpacity>
  )
}


let CIRCLE_RADIUS = 30;
const styles = StyleSheet.create({
  container: {
    

  },
  opc:{
    position:'absolute',
    flexDirection:'row',
    top:-30,
    backgroundColor:"white",
    elevation:3,
    padding:2,
    borderWidth: 1,
    borderRadius: 10,
  },
  dot: {
    position: "absolute",
    width: 10,
    height: 10,
    borderRadius: 100,
    backgroundColor: 'red',
    top: -5,
    left: -5
  }

});
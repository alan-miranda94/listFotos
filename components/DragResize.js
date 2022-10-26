import React from 'react';
import { StyleSheet, View } from 'react-native';
import { PanGestureHandler } from 'react-native-gesture-handler';
import Animated, { useAnimatedGestureHandler, useAnimatedStyle, useSharedValue } from 'react-native-reanimated';


export function DragResize({ children, ...rest }) {
    const x = useSharedValue(0)
    const y = useSharedValue(0)

    const onGestureEvent =()=>{ 
        console.log("sss")
        return useAnimatedGestureHandler({
        onStart:(_, ctx)=>{
            ctx.x = x.value,
            ctx.y = y.value
        },
        //quando o evento for ativado
        onActive: ({ translationX, translationY }, ctx) => {
            x.value =ctx.x + translationX,
            y.value =ctx.y + translationY
        },
    })
}

    //transição que sera aplicada 
    const style = useAnimatedStyle(() => ({
        transform: [
            { translateX: x.value }, 
            { translateY: y.value }
        ]
    }))

    return (
        <View style={styles.container}  pointerEvents="box-none">
            <PanGestureHandler onGestureEvent={onGestureEvent}>
                <Animated.View style={ style}>
                    {children}
                </Animated.View>
            </PanGestureHandler>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: 'blue',
       position:"absolute"
    },
    opc: {
        position: 'absolute',
        flexDirection: 'row',
        top: -30,
        backgroundColor: "white",
        elevation: 3,
        padding: 2,
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
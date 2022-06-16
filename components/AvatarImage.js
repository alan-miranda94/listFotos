import React, { useState } from 'react'
import { SafeAreaView, Image, View, TouchableOpacity, Modal, Dimensions, StyleSheet, } from 'react-native'
import Lottie from 'lottie-react-native'
import { IconButton, Avatar } from 'react-native-paper'


const Width = Dimensions.get('screen').width
const height = Dimensions.get('screen').height

export default props => {
    const [modalImage, setModalImage] = useState(false)

    const showImage = () => {
        console.log('APERTOU')
        setModalImage(true)
    }
    return (

        <TouchableOpacity style={{ marginHorizontal: 4 }} onPress={showImage}  >
            <Avatar.Image size={42} source={{ uri: props.source }} />

            <Modal
                transparent={true}
                visible={modalImage}
                animationType='fade'
                statusBarTranslucent
            >
                <View style={styles.modalContainer}>
                    <View style={{ width: Width * .9, height: Width * .9, backgroundColor:'white'}}>
                        <IconButton
                            icon='close'
                            color={'#2196f3'}
                            style={{ position: 'absolute', right: '1%', top: '1%', zIndex: 5, backgroundColor: 'white' }}
                            size={26}
                            onPress={() => setModalImage(false)} />
                        <Image
                            style={{ width: '100%', height: '100%' }}
                            resizeMode="contain" source={{ uri: props.source }} />
                    </View>
                </View>
            </Modal>
        </TouchableOpacity>

    )
}


const styles = StyleSheet.create({


    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        //paddingTop: Constants.statusBarHeight,
        backgroundColor: 'rgba(0,0,0,0.5)',
        alignItems: 'center'
        //padding: 8,

    },
});
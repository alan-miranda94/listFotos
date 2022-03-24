import React from 'react'
import {SafeAreaView} from 'react-native'
import Lottie from 'lottie-react-native'

export default props => {
    return(    
        <Lottie 
            resizeMode='contain' 
            autoSize 
            source={props.source}
            autoPlay
            loop
            style={{
                width: '100%',
                height: "100%",
                //backgroundColor: '#eee',
              }}
        />  
    )
}
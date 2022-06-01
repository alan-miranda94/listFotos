import React, { useContext, useEffect, useState, useRef, useCallback } from 'react'
import { View, StyleSheet, FlatList, Text, Image, ScrollView } from 'react-native'
import { useNavigation, useRoute } from '@react-navigation/native'
import Constants from 'expo-constants'
import { IconButton, Surface, List, RadioButton, Searchbar, TextInput } from 'react-native-paper'
import { ListContext } from '../contexts/listContexts'
import { ROT, SFP } from '../ROT-FPS'
import FotoInventario from '../components/FotoInventario'
import ViewShot, { captureRef } from "react-native-view-shot"
import * as ImageManipulator from 'expo-image-manipulator'


export default props => {
    const navigation = useNavigation()
    const route = useRoute()
    const { state, dispatch } = useContext(ListContext)
    const [rotPlacaSFP, setRotPlacaSFP] = useState([])
    const [selectRotPlacaSFP, setSelectRotPlacaSFP] = useState('')
    const [type, setType] = useState('Roteado | Placa')
    const [searchQuery, setSearchQuery] = useState('')
    const [expanded, setExpanded] = useState(false)
    const [expandedEquipamento, setExpandedEquipamento] = useState(false)
    const [numSerie, setNumSerie] = useState('')
    const [imgNumSerie, setImgNumSerie] = useState(null)
    const [numBPSGP, setNumBPSGP] = useState('')
    const [imgNumBPSGP, setImgNumBPSGP] = useState(null)
    const [equipamento, setEquipamento] = useState(null)
    const [sfpEquip, setSfpEquip] = useState(null)
    const [listSfpEquip, setListSfpEquip] = useState(ROT)
    const coverRef = useRef()


    const handlePress = () => setExpanded(!expanded)
    const handlePressEquipamento = () => setExpandedEquipamento(!expandedEquipamento)

    const onCapture = useCallback(async () =>{ 
        const joinImage = await coverRef.current.capture()
        const resize = await ImageManipulator.manipulateAsync(
            joinImage,
            [{ resize: { width:700 } }],
            {
              compress: 1,
              format: ImageManipulator.SaveFormat.JPEG,
              base64: true
            },
          )
        return {
            b64:`data:image/png;base64,${resize.base64}`,
            img:joinImage
        }
        
    })

    const onChangeSearch = (query,t) => {
        const origin = whatTypeIs()
        const data = origin.filter(item => item['MODELO'].includes(query) || item['PN'].includes(query))
       let sfpEquip = ROT.filter(item => item['MODELO'].includes(query) || item['PN'].includes(query))

        if(t === 'SFP'){
            setListSfpEquip(sfpEquip)
            return 
        }
        setListSfpEquip(null)
        setRotPlacaSFP(data)
    }

    const pressSendInventario =async ()=>{
        if(!equipamento){
            alert('ESCOLHA O EQUIPAMENTO')
            return 
        }
        
        const imgMain =imgNumSerie && imgNumBPSGP?await onCapture():imgNumSerie
        console.log('PASSO O MAIN')
        const data = {
            id:Math.random(),
            modelo:equipamento["MODELO"],
            pn:equipamento['PN'],
            desc:equipamento["DESCRIÇÃO"],
            sap:equipamento["SAP"],
            numSerie: numSerie,
            imgNumSerie:imgNumSerie,
            numBPSGP: numBPSGP,
            imgNumBPSGP:imgNumBPSGP,
            imgMain: imgMain,
            sfpEquip:sfpEquip
        }
         dispatch({
        type: 'addInventario',
        payload: {
          list:route.params.listName,
          item: data
        }
      })
      setEquipamento(null)
      navigation.goBack()
    }

    const onTakeImage = (typeImg, image) => {
        if (typeImg === 'BPSGP') {
            setImgNumBPSGP(image)
            return
        }
        setImgNumSerie(image)
    }

    useEffect(() => {
        const whatIs = whatTypeIs()
        setRotPlacaSFP(whatIs)

    }, [type])

    const whatTypeIs = () => {
        if (type === 'SFP') {
            return SFP
        }
        return ROT
    }

    useEffect(() => {
        navigation.setOptions({ title: 'NOVO ITEM' })
    }, [])

    const selectedRotPlacaSFP = (item) => {
        setEquipamento(item)       
        setSelectRotPlacaSFP(`${item["MODELO"]} | ${item['PN']}`)
        handlePress()
    }

    return (

        <View style={styles.container}>
            <View style={styles.barra}>
                <IconButton
                    icon='arrow-left'
                    size={26}
                    onPress={() => navigation.goBack()} />
                <Text style={{ flex: 1, textAlign: "center" }}>{route.params.title}</Text>
                <View style={{ flexDirection: 'row' }}>
                    <IconButton
                        icon='send'
                        size={26}
                        onPress={pressSendInventario} />
                </View>

            </View>
            
            <List.Section>
                <RadioButton.Group style={{ flexDirection: 'row-reverse', }} onValueChange={newType => setType(newType)} value={type}>
                    <View style={{ flexDirection: 'row', backgroundColor: "white" }}>
                        <RadioButton.Item label="Roteado | Placa" value="Roteado | Placa" />
                        <RadioButton.Item label='SFP' value="SFP" />
                    </View>
                </RadioButton.Group>
                <List.Accordion
                    style={{ backgroundColor: 'white',elevation:2 }}
                    title={selectRotPlacaSFP}
                    id={1}
                    expanded={expanded}
                    onPress={handlePress}
                >
                    <Searchbar
                        style={{ elevation: 2, }}
                        placeholder="Search"
                        onChangeText={onChangeSearch}
                        autoCapitalize={"characters"}
                    //value={searchQuery}

                    />
                    <FlatList
                        data={rotPlacaSFP}
                        style={{ flexGrow: 1, backgroundColor:'white' }}
                        initialNumToRender={12}

                        contentContainerStyle={{ padding: 10, paddingBottom: 40, }}
                        showsVerticalScrollIndicator={false}
                        ListFooterComponent={() => <Text style={styles.logo}>FROM MSTUDIO</Text>}
                        renderItem={({ item }) => (
                            <List.Item
                                
                                title={`${item["MODELO"]} | ${item['PN']}`}
                                description={`${item["DESCRIÇÃO"]}`}
                                onPress={() => selectedRotPlacaSFP(item)}
                            />//site={route.params.title} list={route.params.listName} 
                        )}
                        keyExtractor={item => item.id}
                    />
                </List.Accordion>
                {type==='SFP'&&
                    <List.Accordion
                    style={{ backgroundColor: 'white',elevation:2 }}
                    title={sfpEquip?sfpEquip:'EQUIPAMENTO'}
                    id={2}
                    expanded={expandedEquipamento}
                    onPress={handlePressEquipamento}
                >
                    <Searchbar
                        style={{ elevation: 2, }}
                        placeholder="Search"
                        onChangeText={(e) => onChangeSearch(e, 'SFP')}
                        autoCapitalize={"characters"}
                    //value={searchQuery}

                    />
                    <FlatList
                        data={listSfpEquip}
                        style={{ flexGrow: 1, backgroundColor:'white' }}
                        initialNumToRender={12}

                        contentContainerStyle={{ padding: 10, paddingBottom: 40, }}
                        showsVerticalScrollIndicator={false}
                        ListFooterComponent={() => <Text style={styles.logo}>FROM MSTUDIO</Text>}
                        renderItem={({ item }) => (
                            <List.Item                                
                                title={`${item["MODELO"]} | ${item['PN']}`}                               
                                onPress={() => {
                                    handlePressEquipamento()
                                    setSfpEquip(item["MODELO"])}}
                            />
                        )}
                        keyExtractor={item => item.id}
                    />
                </List.Accordion>
                }

            </List.Section>

            <TextInput
                style={{ backgroundColor: 'white', }}
                autoCapitalize = {"characters"}
                label="Número Série"
                value={numSerie}
                onChangeText={text => setNumSerie(text)}
                activeUnderlineColor='#2196f3'
            />
            <FotoInventario
                takeImage={(img) => onTakeImage('NS', img)}
                image={imgNumSerie ? imgNumSerie.b64 : null}
                data={{ id: Math.random(), title: 'FOTO DO NÚMERO DE SÉRIE' }}
                site={route.params.title}
                list={route.params.listName}
            />
            <TextInput
                style={{ backgroundColor: 'white', }}
                autoCapitalize = {"characters"}
                label="Número BP | SGP"
                value={numBPSGP}
                onChangeText={text => setNumBPSGP(text)}
                activeUnderlineColor='#2196f3'
            />
            <FotoInventario
                takeImage={(img) => onTakeImage('BPSGP', img)}
                image={imgNumBPSGP ? imgNumBPSGP.b64 : null}
                data={{ id: Math.random(), title: 'FOTO DO NÚMERO BPSGP' }}
                site={route.params.title}
                list={route.params.listName}
            />
        {imgNumSerie &&imgNumBPSGP&&
                <ViewShot style={{ flex: 1, alignItems: "center", justifyContent: 'center', borderRadius: 8 }} ref={coverRef} >
                    <View style={{ flex: 1 }}>
                        <Image style={{ width: '100%', aspectRatio: imgNumSerie && imgNumBPSGP ? 2 : 1 }} resizeMode="stretch" source={{ uri: imgNumSerie ? imgNumSerie.b64 : '' }} />
                    </View>
                    <View style={{ flex: 1 }}>
                        <Image style={{ width: '100%', aspectRatio: 2 }} resizeMode="stretch" source={{ uri: imgNumBPSGP ? imgNumBPSGP.b64 : '' }} />
                    </View>
                </ViewShot>
            }

        </View>

    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        //width:'100%',
        //justifyContent: 'center',
        //alignItems: "center",

        //padding: 8,

    },
    button: {
        margin: 10,
        width: '100%',
        //height:'10%',

    },
    surface: {
        elevation: 4,
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

});



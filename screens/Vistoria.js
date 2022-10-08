import React, { useEffect, useState, useContext, useRef } from 'react'
import { Text, SafeAreaView, StyleSheet, FlatList, View, TouchableOpacity, Modal } from 'react-native'
import Item from '../components/Item'
import { useNavigation, useRoute } from '@react-navigation/native'
import { ListContext } from '../contexts/listContexts'
import { IconButton, List, Searchbar, RadioButton, TextInput, Button, ToggleButton } from 'react-native-paper'
import Constants from 'expo-constants'
import { Menu, MenuItem, MenuDivider } from 'react-native-material-menu'
import Toast from 'react-native-toast-message'
import { ROT, SFP } from '../ROT-FPS'


export default props => {

    const [visible, setVisible] = useState(false)
    const [dePara, setDePara] = useState(null)
    const [equipamentos, setEquipamentos] = useState(ROT)
    const [equipamento, setEquipamento] = useState(null)
    const [expanded, setExpanded] = useState(false)
    const [listType, setListType] = React.useState("vistoria")
    //pega a lista pelo reducer 
    const { state, dispatch } = useContext(ListContext)


    const navigation = useNavigation()
    const route = useRoute()



    useEffect(() => {
       


    }, [state])


    //VAI PARA A TELA DE GERAR EXCEL
    const pressGerar = () => {
        hideMenu()
        if (equipamento) {
            navigation
                .navigate(
                    'GeradorExcel',
                    {
                        list: route.params.listName,
                        title: route.params.title,
                        type: route.params.type,
                        equipName: equipamento['MODELO'],
                    


                    })
            return
        }

        hideMenu()
        Toast.show({
            type: 'info',
            text1: 'VERIFIQUE SE SELECIONOU',
            text2: `- EQUIPAMENTO e o DE<>PARA`
        })
    }

    //REMOVE A FOTO DE UM ITEM
    const pressClear = () => {
        dispatch({
            type: 'clearOne',
            payload: {
                list: route.params.listName,
            }
        })
    }

    const pressFinalizar = async () => {
        try {
            dispatch({
                type: 'zerar'
            })

            navigation.navigate('Home')
        } catch (e) {
            console.log(e)
            alert('ERRO AO SALVAR')
        }

    }
    //ESCONDE MENU
    const hideMenu = () => setVisible(false);

    //MOSTRA MEN
    const showMenu = () => setVisible(true);
    const handlePress = () => setExpanded(!expanded)

    //REDUZ A LISTA DE ACORDO COM A PESQUISA
    const onChangeSearch = (query, t) => {
        let equip = ROT.filter(item => item['MODELO'].includes(query) || item['PN'].includes(query))
        setEquipamentos(equip)
    }


    const pressSelectEquip = (equip) => {
        setEquipamento(equip)
        handlePress()
    }

    const handleListTypePress = (type)=>{
        setListType(type)
    }

  

    return (
        <View style={styles.container}>
            <View style={styles.barra}>
                <Text style={{ flex: 1, textAlign: "center" }}>{route.params.title}</Text>
                <View style={{ flexDirection: 'row' }}>
                    <Menu
                        visible={visible}
                        anchor={<IconButton icon='menu' size={26} onPress={showMenu} />}
                        onRequestClose={hideMenu}
                    >

                        <MenuItem onPress={pressGerar}>Gerar Excel</MenuItem>
                        <MenuItem onPress={pressClear}>Limpar</MenuItem>
                        <MenuDivider />
                        <MenuItem onPress={pressFinalizar}>Finalizar</MenuItem>
                    </Menu>
                </View>

            </View>

            {listType === 'qtm'&&
                <View style = {{marginVertical:8,backgroundColor:'white', elevation: 2, padding:8}}>
                <Text style={{color:"red", textAlign:'justify'}}>
                ATENÇÃO SÓ USAR ESSA ABA quando o display da retificadora estiver apagado e quando não houver a opção de tirar o consumo com alicate amperímetro nos cabos das retificadoras, medir as fases R, S, T no QTM com alicate amperímetro (tirar foto do display apagado também)
                </Text>
            </View>
            }
            <List.Section>

                <List.Accordion
                    style={{ backgroundColor: 'white', elevation: 2 }}
                    title={equipamento ? equipamento['MODELO'] : 'SELECIONE O EQUIPAMENTO'}
                    id={1}
                    expanded={expanded}
                    onPress={handlePress}
                >
                    <Searchbar
                        style={{ elevation: 2, }}
                        placeholder="Search"
                        onChangeText={onChangeSearch}
                        autoCapitalize={"characters"}
                    />
                    <FlatList
                        data={equipamentos}
                        style={{ flexGrow: 1, backgroundColor: 'white', paddingBottom: 100, }}
                        initialNumToRender={12}
                        contentContainerStyle={{ padding: 10, paddingBottom: 100, }}
                        showsVerticalScrollIndicator={false}
                        ListFooterComponent={() => <Text style={styles.logo}>FROM MSTUDIO</Text>}
                        renderItem={({ item }) => (
                            <List.Item
                                title={`${item["MODELO"]} | ${item['PN']}`}
                                description={`${item["DESCRIÇÃO"]}`}
                                onPress={() => pressSelectEquip(item)}
                            />
                        )}
                        keyExtractor={item => item.id}
                    />
                </List.Accordion>
            </List.Section>
            <View style={{ flexDirection: 'row', justifyContent:'space-around' }}>
  

                <Button
                    color='#2196f3'
                    contentStyle={{
                        borderBottomColor:'#2196f3',
                        borderBottomWidth:listType === 'vistoria'?2:0
                    }}
                    onPress={()=>handleListTypePress('vistoria')}
              
                    >
                    VISTORIA
                </Button>
                <Button
                    color='#2196f3'
                    contentStyle={{
                        borderBottomColor:'#2196f3',
                        borderBottomWidth:listType==='outdoor'?2:0
                    }}
                    onPress={()=>handleListTypePress('outdoor')}
                  
                    
                   >
                    OUTDOOR
                </Button>
                <Button
                    color='#2196f3'
                    contentStyle={{
                        borderBottomColor:'#2196f3',
                        borderBottomWidth:listType === 'qtm'?2:0
                    }}
                    onPress={()=>handleListTypePress('qtm')}
                   >
                    QTM
                </Button>
            </View>


            <FlatList
                data={state[listType]}
                style={{ flexGrow: 1 }}
                initialNumToRender={12}
                contentContainerStyle={{ padding: 10, paddingBottom: 100, }}
                showsVerticalScrollIndicator={false}
                ListFooterComponent={() => <Text style={styles.logo}>FROM MSTUDIO</Text>}
                renderItem={({ item }) => (
                    <Item data={item} site={route.params.title} list={listType} />
                )}
                keyExtractor={item => item.id + Math.random(36)}
            />



        </View>

    )
}

const styles = StyleSheet.create({
    container: {
        //flex:1,
        //alignItems: 'center',
        //justifyContent: 'center',
        width: '100%',

        //backgroundColor: '#696969',
        //marginVertical:10  
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
        height: 150,
        width: '100%',
        alignItems: 'center',
        textAlign: 'center'
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        //paddingTop: Constants.statusBarHeight,
        backgroundColor: 'rgba(0,0,0,0.5)',
        alignItems: 'center'
        //padding: 8,

    },
    modalDePara: {
        flexDirection: 'row',
        backgroundColor: '#2196f3',
        borderBottomWidth: 1,
        borderBottomColor: 'gray',
        height: 48,
        borderTopEndRadius: 20,
        borderTopStartRadius: 20,
        alignItems: 'center',
        justifyContent: 'center',
        width: '90%'

    }
});



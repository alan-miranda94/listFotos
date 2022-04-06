import React, {useEffect, useState, useContext, useCallback} from 'react'
import { StyleSheet, View, Image,Text, Linking, WebView} from 'react-native'
import {useNavigation, useRoute} from '@react-navigation/native'
import {ListContext} from '../contexts/listContexts'
import { MaterialCommunityIcons } from '@expo/vector-icons'
import ExcelJS from 'exceljs'
import * as FileSystem from 'expo-file-system'
import * as Sharing from 'expo-sharing'
import { Buffer as NodeBuffer } from 'buffer'
import MyTextInput from '../components/MyTextInput'
import {Button,ProgressBar, Colors } from 'react-native-paper'
import {claroLogo, nokiaLogo} from '../assets/imgBase64'
import loadding from '../loadding.json'
import Lottie from '../components/Lottie'
import AsyncStorage from '@react-native-async-storage/async-storage'
import * as MediaLibrary from 'expo-media-library'
//import libre from 'libreoffice-convert'
//libre.convertAsync = require('util').promisify(libre.convert)

export default props => {
    const navigation = useNavigation()
    const route = useRoute()
    const [listFotos, setListFotos] = useState(null)
    const {state, dispatch} = useContext(ListContext)
    const [excel, setExcel] = useState(null)
    const [progress, setProgress] = useState(false)
    const [name, setName] = useState(null)
    const [status, setStatus] = useState(false)
    const workbook = new ExcelJS.Workbook()
    const now = new Date()
    workbook.creator = 'APP RELATORIO'
    workbook.created = now
    const worksheet = workbook.addWorksheet('RELÁTORIO FOTOGRÁFICO', 
      {
        pageSetup:{
          paperSize:9, 
          orientation:'portrait',
         
        },
        views: [{showGridLines: false}]
      }
    )
   // 

    useEffect(()=>{
      setListFotos(state[route.params.list])

    },[])

    useEffect(()=>{    
      navigation.setOptions({ title:'Gerador Excel'})
    }, [])

    const getAllImage = (list)=>{
      
      let newList = list.filter((l)=> l.b64&&true)
     
      setListFotos(newList)
    }

    const downloadExcel = useCallback(async (fileUri) => {
      const downloadUri = fileUri
      const localPath = `${FileSystem.cacheDirectory}spreadsheet.xlsx`
      try {
        await FileSystem.downladAsync(downloadUri, localPath)
          .then(async ({ uri }) => {
            const contentURL = await FileSystem.getContentUriAsync(uri)
            await Linking.openURL(contentURL)
          })
          .catch((err) => console.log(err))
      } catch (err) {
        console.log(err)
      }
    }, [])

    const getData = async (name='@salvos') => {
      try {
        const jsonValue = await AsyncStorage.getItem(name)
        const endValue = JSON.parse(jsonValue)
        return jsonValue != null ?endValue: null;
      } catch(e) {
        // error reading value
      }
    }


    const finalizeSave = async () =>{      
      try{
        // let newListSalvos = []
        // const salvosList = await getData()
        // const nameFake ='R-'+ Math.floor(Math.random()*10000)
        // const jvalue = JSON.stringify(state.atualLista)
        // const endName = name?name:nameFake
        
        // //salva a lista completa com as fotos e os caminhos 
        // await AsyncStorage.setItem(`@${endName}-Editavel`,jvalue)
        // if(excel){
        //   //salva o caminho do arquivo excel
        //   await AsyncStorage.setItem(`@${endName}-Excel`,excel)
        // }
        // newListSalvos.push(endName)

        // if(salvosList){
        //   newListSalvos = newListSalvos.concat(salvosList)          
        // }
        
        // await AsyncStorage.setItem("@salvos", JSON.stringify(newListSalvos))
        dispatch({
          type: 'zerar'
        })

        navigation.navigate('Home')
      } catch(e){
        console.log(e)
        alert('ERRO AO SALVAR')
      }
     
    }

    const saveExcel = (nameDoc)=>{
      return new Promise (async (resolve, reject) => {
        const fileName = `Relatório_Fotográfico_`
        //const pat = await MediaLibrary.getAlbumAsync('Relatorio')
        //muda para dirotio para ficar permanente???
        const fileUri = FileSystem.cacheDirectory + fileName + nameDoc.toUpperCase() + '.xlsx'
        workbook.xlsx.writeBuffer().then( (buffer) => {          
         // console.log(pat)
          // Do this to use base64 encoding
          const nodeBuffer = NodeBuffer.from(buffer)
          const bufferStr = nodeBuffer.toString('base64')
          
          //gravando arquivo
          FileSystem.writeAsStringAsync(fileUri, bufferStr, {
            encoding: FileSystem.EncodingType.Base64
          }).then(async() => {
            //converte o pdf
            
            setExcel(fileUri)
            alert('ARQUIVO GERADO COM SUCESSO')
            resolve(true)
          })
        })
      })
    }

    //adiciona as logos e o nome do site no inicio
    const creatHeard = (nameSite)=>{
      //CARREGANDO IMAGENS DA LOGO  E ADICIONANDO NA PLANILHA
      setStatus("ADICIONANDO LOGOS DA NOKIA E CLARO")
      const cLogo = workbook.addImage({
        base64: claroLogo,
        extension: 'png',
      })
      worksheet.addImage(cLogo, 'P1:P3')
      const nLogo = workbook.addImage({
        base64: nokiaLogo,
        extension: 'png',
      })
      worksheet.addImage(nLogo, 'A2:C3')

      //ADICIONA A ESAÇÃO
      setStatus('COLOCANDO ESTAÇÃO')
      worksheet.getCell('M4').value = 'Estação'
      worksheet.getCell('N4').value = nameSite
      worksheet.getCell('N4').font = {color:{argb:"FF0000"}}

      
    }

    const mergeCells = (start, end) =>{

    }

    //adiciona todas as fotos e suas bordas 
    const addFotos = async (lista) =>{
      let controle = 1
      let linhas = {
        1:['B', 'E'],
        2:['G','J'],
        3:['L','O']
      }
      let number = [6,17]
      let imgCol = 1
      let imgRow = 5

      
      lista.forEach(async( element, index )=> {
        try {
          //MESCLANDO CELULARS
          worksheet.mergeCells(linhas[controle][0] +( number[0]),linhas[controle][1] + number[1])
          worksheet.mergeCells(linhas[controle][0] +( number[0]+13),linhas[controle][1] +( number[1]+4))
        } catch (error) {
          console.log(error)
        }
        //COLOCANDO BORDAS DA FOTO
        let fotoContainer = worksheet.getCell(linhas[controle][0] + number[0])
        fotoContainer.border={
          top: {style:'medium', color: {argb:'000000'}},
          left: {style:'medium', color: {argb:'000000'}},
          bottom: {style:'medium', color: {argb:'000000'}},
          right: {style:'medium', color: {argb:'000000'}}
        }

        
        
        //ADICIONAR LEGENDA  e COLOCANDO BORDAS DA LEGENDA      
        let legenda = worksheet.getCell(linhas[controle][0] +( number[0]+13))
        legenda.border={
          top: {style:'medium', color: {argb:'000000'}},
          left: {style:'medium', color: {argb:'000000'}},
          bottom: {style:'medium', color: {argb:'000000'}},
          right: {style:'medium', color: {argb:'000000'}}
        }
        legenda.font = {size:8, bold:true}
        legenda.value = element.title
        legenda.alignment = { vertical: 'middle', horizontal: 'center',wrapText: true }
      
        
       
       if(element.b64){
         //ADDICIONANDO FOTOS 
         let foto = workbook.addImage({
          base64: element.b64,
          extension: 'jpg',
        })
        //console.log('GERADOR',element.width)
        worksheet.addImage(foto, {
          tl: { col: imgCol + 0.05, row: imgRow + 0.05 },
          ext: { height: 236 , width:238},
          editAs: 'undefined'
        } )//(`${linhas[controle][0] + number[0]}:${linhas[controle][1] + number[1]}`))

       }else{
         fotoContainer.value = 'N/A'
         fotoContainer.alignment = { vertical: 'middle', horizontal: 'center',wrapText: true }
       }
       
       
        if (controle === 3){
          imgRow += 17
          number[0] += 17
          number[1] += 17
        }
        
        controle === 3? controle = 1 : controle += 1 
        imgCol === 11? imgCol = 1:imgCol += 5
        

      })
      
    }

    const generateExcel = async ()=>{   
      //if(!name) return(alert('DIGITE O NOME DO SITE'))
      if(listFotos.length === 0) return(alert("NÃO TEM FOTOS NO RELATÓRIO"))

      setProgress(true)   
      //pega apenas as imagens da lista
      //const itens = getAllImage(state.atualLista)
      creatHeard(route.params.title)
      addFotos(listFotos)
      worksheet.pageSetup.printArea = 'A1:P72'
      //worksheet.pageSetup.printArea = 'A1:P72&&A73:P140&&A141:P208&&A209:P276&&A77:P344&&A345:378'
      //salva arquivo como excel
      saveExcel(route.params.title).then((e)=>{
        setProgress(false) 
      })
      
  
    }
    
    const shareExcel = async () => {
        //const shareableExcelUri = await generateExcel();
        Sharing.shareAsync(excel, {
          mimeType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', // Android
          dialogTitle: 'RELATORIO FEITO COMPARTILHAR COM?', // Android and Web
          UTI: 'com.microsoft.excel.xlsx' // iOS
        }).catch(error => {
          console.error('Error', error);
        }).then(() => {
          console.log('Return from sharing dialog');
        });
    }

    return(
        <View style={styles.container}>            
            <Text style={{fontSize:22, fontWeight:'bold'}}>{name?name.toUpperCase() + '.xlsx':''}</Text>
            {progress?
              <View style={styles.containerImage}>
                <Lottie source ={loadding} />
              </View>
            :              
              <MaterialCommunityIcons
              //style= {{justifyContent:'flex-end'}} 
              name="microsoft-excel" 
              size={200}
            >
              <View style={{backgroundColor:"red"}}>

              </View>
            </MaterialCommunityIcons>
            }
            {false&&
              <MyTextInput 
              title={'NOME DO SITE'}
              value={name}
              placeholder = 'EX:NOME-DO-SITE'
              onChangeText = {(t)=> setName(t)}
            />
            }
            <Button 
              style={styles.button} 
              onPress={generateExcel}
              mode='contained' 
              color= "#2196f3"
            >
              Gerar Relatorio
            </Button>
            {false&&
              <Button  
                disabled= {!excel}
                style={[styles.button]} 
                onPress={shareExcel}             
                mode='contained' 
                color= "#2196f3"
              >
                Baixar
              </Button>
            }
            <Button  
              disabled= {!excel}
              style={[styles.button]} 
              onPress={shareExcel}             
              mode='contained' 
              color= "#2196f3"
            >
              Compartilhar
            </Button>
            {true&&
              <Button 
                style={styles.button} 
                onPress = {finalizeSave}
                mode='contained' 
                color= "#2196f3"
              >
               FINALIZAR
              </Button>
              }
        </View>
    )

}

const styles = StyleSheet.create({
  container: {    
    flex:1,
    alignItems: 'center',
    justifyContent: 'center',    
    //backgroundColor: '#696969',
    margin:10  

    
  },
  containerButton:{
    width:'100%',
    justifyContent:'space-between',
    //flexDirection:'colum'
  },
  button:{
    width:'100%',
    padding:4,
    marginTop:16
  },
  containerImage:{
     height:200,
     width:200,
     alignItems:'center',
     marginTop:15
   },

})
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
import * as MediaLibrary from 'expo-media-library'

export default props => {
    const navigation = useNavigation()
    const [image, setImage] = useState(null)
    const {state, dispatch} = useContext(ListContext)
    const [excel, setExcel] = useState(null)
    const [progress, setProgress] = useState(false)
    const [name, setName] = useState('EX:NOME-DO-SITE')
    const [status, setStatus] = useState(false)
    const workbook = new ExcelJS.Workbook()
    const now = new Date();
    workbook.creator = 'APP FEMATEL'
    workbook.created = now
    const worksheet = workbook.addWorksheet('RELÁTORIO FOTOGRÁFICO', {views: [{showGridLines: false}]})

    useEffect(()=>{
      //console.log('GERADOR EXCEL',state.atualLista[0].b64)
      //setImage(state.atualLista[0].b64)
    },[])

    const getAllImage = (list)=>{
      let newList = list.filter((l)=> l.b64&&true)
      return newList
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


    const saveExcel = (nameDoc)=>{
      return new Promise (async (resolve, reject) => {
        const fileName = `Relatório_Fotográfico_`
        //const pat = await MediaLibrary.getAlbumAsync('Relatorio')
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

            setExcel(fileUri)
            alert('ARQUIVO GERADO COM SUCESSO')
            
            resolve(true)
          })
        })
      })
    }

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
        worksheet.getCell(linhas[controle][0] + number[0]).border={
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
        legenda.font = {size:10, bold:true}
        legenda.value = element.title
        legenda.alignment = { vertical: 'middle', horizontal: 'center',wrapText: true }
      
        
       
       
        //ADDICIONANDO FOTOS 
        let foto = workbook.addImage({
          base64: element.b64,
          extension: 'jpg',
        })
        worksheet.addImage(foto, {
          tl: { col: imgCol, row: imgRow },
          ext: { width: 242, height: 238 }
        } )//(`${linhas[controle][0] + number[0]}:${linhas[controle][1] + number[1]}`))

       
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
      setProgress(true)   
      //pega apenas as imagens da lista
      
      const itens = getAllImage(state.atualLista)
      creatHeard(name)
      addFotos(itens)
      //salva arquivo como excel
      saveExcel(name).then((e)=>{
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
            <Text style={{fontSize:22, fontWeight:'bold'}}>{name.toUpperCase() + '.xlsx'}</Text>
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
            <MyTextInput 
              title={'NOME DO SITE'}
              value={name}
              onChangeText = {(t)=> setName(t)}
            />
            
            <Button 
              style={styles.button} 
              onPress={generateExcel}
              mode='contained' 
              color= "#2196f3"
            >
              Gerar Relatorio
            </Button>
            <Button 
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
                onPress = {()=>navigation.navigate('Home')}
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
import React, { useEffect, useState, useContext, useCallback } from 'react'
import { StyleSheet, View, Image, Text, Linking, WebView, Alert, Share } from 'react-native'
import { useNavigation, useRoute } from '@react-navigation/native'
import { ListContext } from '../contexts/listContexts'
import { MaterialCommunityIcons } from '@expo/vector-icons'
import ExcelJS from 'exceljs'
import * as FileSystem from 'expo-file-system'
import * as Sharing from 'expo-sharing'
import { Buffer as NodeBuffer } from 'buffer'
import MyTextInput from '../components/MyTextInput'
import { Button, ProgressBar, Colors, IconButton } from 'react-native-paper'
import { claroLogo, nokiaLogo } from '../assets/imgBase64'
import loadding from '../loadding.json'
import Lottie from '../components/Lottie'
import AsyncStorage from '@react-native-async-storage/async-storage'
import * as MediaLibrary from 'expo-media-library'
import Constants from 'expo-constants'
import Toast from 'react-native-toast-message'
import JSZip from 'jszip'



export default props => {
  const navigation = useNavigation()
  const route = useRoute()
  const [listFotos, setListFotos] = useState(null)
  const { state, dispatch } = useContext(ListContext)
  const [excel, setExcel] = useState(null)
  const [progress, setProgress] = useState(false)
  const [name, setName] = useState(null)
  const [b64Excel, setB64Excel] = useState()
  const [filesZipe, setFileZip] = useState()
  const [pdf, setPDF] = useState()
  const workbook = new ExcelJS.Workbook()
  const zip = new JSZip()
  const now = new Date()
  workbook.creator = 'APP RELATORIO'
  workbook.created = now
  const worksheet = workbook.addWorksheet('RELÁTORIO FOTOGRÁFICO',
    {
      pageSetup: {
        paperSize: 9,
        orientation: 'portrait',

      },
      views: [{ showGridLines: false }]
    }
  )
  // 

  useEffect(() => {
    setListFotos(state[route.params.list])
    console.log(route.params)

  }, [])

  useEffect(() => {
    navigation.setOptions({ title: 'Gerador Excel' })
  }, [])

  //INICIALIZA ARQUIVO EXCEL
  const creatWorkbook = () => {
    return new ExcelJS.Workbook()
  }

  //CRIA UMA PLANILHA NO ARQUIVO
  const creatWorksheet = (wb, name, orientation = 'portrait') => {
    const opc = {
      pageSetup: {
        paperSize: 9,
        orientation: orientation,
      },
      views: [{ showGridLines: false }]
    }
    return wb.addWorksheet(name, opc)
  }

  //ADICIONA IMAGEM NO FORMATO BASE64
  const addImageB64 = (wb, img) => {
    return wb.addImage({
      base64: img,
      extension: 'png',
    })
  }

  //MESCLA AS CELULAS
  const mergeCells = (ws, start, end) => {
    try {
      ws.mergeCells(start, end)
      return true
    } catch (error) {
      console.log(error)
      return false
    }

  }

  //ADD BORDA TOTAL
  const addBorder = (ws, cell) => {
    ws.getCell(cell).border = {
      top: { style: 'medium', color: { argb: '000000' } },
      left: { style: 'medium', color: { argb: '000000' } },
      bottom: { style: 'medium', color: { argb: '000000' } },
      right: { style: 'medium', color: { argb: '000000' } }
    }
  }

  //ADD BORDA TOTAL
  const addBorderFull = (ws, cell) => {
    ws.getCell(cell).border = {
      top: { style: 'thin', color: { argb: '000000' } },
      left: { style: 'thin', color: { argb: '000000' } },
      bottom: { style: 'thin', color: { argb: '000000' } },
      right: { style: 'thin', color: { argb: '000000' } }
    }
  }


  const saveWorkbook = (wb, name) => {
    return new Promise(async (resolve, reject) => {
      //Relatório_Fotográfico_7705 SAR-X_CEAER13-RMP01_(Ampliação)_Rev.0
      const fileName = `${route.params.inventario ? 'Planilha Padrão de Inventário_' : 'Relatório_Fotográfico_'}${route.params.equipName}_${name.toUpperCase()}_(${route.params.type})`
      const fileUri = FileSystem.cacheDirectory + fileName + '_Rev.0.xlsx'
      try {
        wb.xlsx.writeBuffer().then((buffer) => {

          // Do this to use base64 encoding
          const nodeBuffer = NodeBuffer.from(buffer)
          const bufferStr = nodeBuffer.toString('base64')

          //gravando arquivo
          FileSystem.writeAsStringAsync(fileUri, bufferStr, {
            encoding: FileSystem.EncodingType.Base64
          }).then(async () => {
            setExcel(fileUri)
            setB64Excel(buffer)

            Toast.show({
              type: 'success',
              text1: 'Gerado com sucesso'
            })
            resolve(true)
          })
        })
      } catch (error) {
        alert('ERRO AO TENTAR SALVAR', error)
        setProgress(false)
      }
    })
  }

  //CRIA O CABEÇARIO DO INVENTARIO
  const creatHeardInvetario = (wb, ws) => {
    const claroImg = addImageB64(wb, claroLogo)
    const nokiaImg = addImageB64(wb, nokiaLogo)
    const cols = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O']
    const text3rows = ['NOME DO SITE (ID SAP)',
      'REGIONAL',
      'TIPO EQUIPAMENTO',
      'PART NUMBER',
      'NÚMERO SÉRIE',
      'DESCRIÇÃO',
      'NÚMERO DO BP/SGP',
      'Nº NOTA FISCAL COMPRA',
      'Código SAP do equipamento,',
      'FORNECEDOR',
      'PO 1',
      'PO 2',
      'Nº Item PO',
      'DATA INÍCIO PROJETO',
      'DATA TÉRMINO PROJETO'
    ]
    const sizes = [20, 15, 15, 25, 20, 60, 25, 11, 15, 15, 10, 10, 10, 10, 10]
    //COLOCANDO NOME INVENTARIO E IMAGENS
    mergeCells(ws, 'A1', 'O1')
    let row = ws.getRow(1)
    row.height = 50.5
    ws.getCell('A1').value = 'PLANILHA PADRÃO DE INVENTÁRIO'
    ws.getCell('A1').font = { size: 14, bold: true }
    ws.getCell('A1').alignment = { vertical: 'middle', horizontal: 'center', wrapText: true }
    addBorderFull(ws, 'A1')
    ws.addImage(claroImg, {
      tl: { col: 0.1, row: 0.1 },
      //br: { col: 1.1, row: 1.0 },
      ext: { width: 60, height: 60 },
      editAs: 'undefined'

    })
    ws.addImage(nokiaImg, {
      tl: { col: 12.5, row: 0.4 },
      ext: { width: 130, height: 40 },
      editAs: 'undefined'

    })
    mergeCells(ws, 'A2', 'K2')
    ws.getCell('A2').value = 'OBRIGATÓRIO'
    ws.getCell('A2').font = { size: 10, bold: true }
    ws.getCell('A2').alignment = { vertical: 'middle', horizontal: 'center', wrapText: true }

    addBorderFull(ws, 'A2')
    addBorderFull(ws, 'L2')
    mergeCells(ws, 'M2', 'O2')
    addBorderFull(ws, 'M2')

    ws.getCell('M2').value = 'OPCIONAL'
    ws.getCell('M2').font = { size: 10, bold: true, }
    ws.getCell('M2').alignment = { vertical: 'middle', horizontal: 'center', wrapText: true }

    row = ws.getRow(3)
    row.height = 60.5

    cols.forEach((i, index) => {

      let cell = ws.getCell(i + '3')
      let column = ws.getColumn(i)
      column.width = sizes[index]
      cell.value = text3rows[index]
      cell.font = { size: 10, bold: true, color: { argb: 'FFFFFFFF' } }
      cell.alignment = { vertical: 'middle', horizontal: 'center', wrapText: true }
      addBorderFull(ws, i + '3')
      cell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FF0000' },
      }
    })
    ///FIM--------------------
  }

  //ADICIONA INTEM NO INVENTARIO
  const addItemInventario = async (wb, ws, wsFoto) => {
    const cols = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O']
    let rows = 4
    let controle = 1
    let linhas = {
      1: ['B', 'E'],
      2: ['G', 'J'],
      3: ['L', 'O']
    }
    let legLinhas = {
      1: ['B', 'D', 'C', 'E'],
      2: ['G', 'I', 'H', 'J'],
      3: ['L', 'N', 'M', 'O']
    }
    let number = [6, 17]
    let imgCol = 1
    let imgRow = 5
    wsFoto.getCell('P1').value = ' '

    ///ADICIONA INTENS VAZIO SE A LISTA FOR MENOR QUE 9 ITENS
    let copyList = [...listFotos]
    if (listFotos.length < 9) {

      for (var i = 0; i < 9 - listFotos.length; i++) {

        copyList.push({
          id: Math.random(),
          modelo: null,
          pn: ' ',
          desc: ' ',
          sap: ' ',
          numSerie: ' ',
          imgNumSerie: ' ',
          numBPSGP: ' ',
          imgNumBPSGP: ' ',
          imgMain: null,
          sfpEquip: ' '

        })
      }

    }

    //PEGA A LISTA DE FOTOS E ADICIONA NA PLANILHA 
    copyList.forEach((item, index) => {

      //ADICONA OS ITEM DA PRIMEIRA LISTA 

      //separa cada item e verifica o que tem e não tem
      const dataItens = [
        //NOME DO SITE
        item.modelo ? route.params.title : ' ',
        //REGIONAL
        item.modelo ? 'NE' : ' ',
        //TIPO DE EQUIPAMENTO 
        item.modelo ? route.params.equipName : ' ',//item.sfpEquip ? item.sfpEquip : item.modelo,
        //PART NUMBER
        item.pn,
        //NÚMERO DE SERIE
        item.numSerie,
        //DESCRIÇÃO
        item.desc,
        //NUMERO DO BP/SGP
        item.numBPSGP ? item.numBPSGP : 'NÃO ETIQUETAVEL',
        //NOTA FISCAL COMPRA
        item.modelo ? 'N/A' : ' ',
        //CÓDIGO SAP
        item.sap,
        //FORNECEDOR
        item.modelo ? 'NOKIA' : ' ',
        ' ', ' ', ' ', ' ', ' '
      ]

      //PERCORRE CADA COLUNA DE A - O
      cols.forEach((c, index) => {
        let gCell = ws.getCell(c + rows)
        gCell.value = dataItens[index]
        gCell.font = { size: 10, }
        gCell.alignment = { vertical: 'middle', horizontal: 'center', wrapText: true }
        addBorderFull(ws, c + rows)
      })

      //ADICIONA ITEM NA SEGUNDA PAGINA --------------------------------
      let start = linhas[controle][0] + (number[0])
      let end = linhas[controle][1] + number[1]

      wsFoto.getCell('A3').value = 'FOTOS'
      wsFoto.getCell('A3').font = { size: 10, bold: true }
      wsFoto.getCell('M2').value = 'Estação:'
      wsFoto.getCell('N2').value = route.params.title
      wsFoto.getCell('N2').font = { size: 10, color: { argb: 'FF0000' } }

      mergeCells(wsFoto, start, end)
      addBorder(wsFoto, linhas[controle][0] + (number[0]))

      //console.log('GE ADDINV - ITEM ', Object.keys(item.imgMain))
      console.log('------------------------------')
      //ADICIONA A IMAGEM PROPORCIONALMENTE
      if (item.imgMain !== null) {
        console.log('GE ADD INV - ITEM ', item.imgMain.width)
        let img = addImageB64(wb, item.imgMain.b64)

        //TAMANHO DO QUADRADO NA PLANILHA
        let height = 216
        let width = 233

        //PORCENTAGEM DE REDUÇÃO DA ALTURA E LARGURA 
        //DO TAMANHO ORIGINAL DA IMAGEM
        let porcentH = ((height * 100) / item.imgMain.height) / 100
        let porcentW = ((width * 100) / item.imgMain.width) / 100

        //VERIFICA SE A ALTURA É MAIOR QUE A LARGURA
        let quemEmaior = (item.imgMain.height > item.imgMain.width) ? true : false

        //SE FOR MAIOR REDUZ A LARGURA PROPORCIONAL A REDUÇÃODA ALTURA
        if (quemEmaior) {
          width = item.imgMain.width * porcentH

        }
        //SE NÃO REDUZ A ALTURA PROPORCIONAL A REDUÇÃO DA LARGURA
        else {
          height = item.imgMain.height * porcentW
        }

        //ADICIONA A FOTO COM AS MEDIDAS CERTAS
        wsFoto.addImage(img, {
          tl: { col: imgCol + 0.05, row: imgRow + 0.5 },
          ext: {
            height: height,
            width: width
          },
          editAs: 'undefined'
        })
      } else {
        wsFoto.getCell(start).value = ("NA")
        wsFoto.getCell(start).alignment = { vertical: 'middle', horizontal: 'center', wrapText: true }
      }

      //LEGENDAS DA IMAGEM SUAS BORDAS 
      mergeCells(wsFoto, legLinhas[controle][0] + (number[0] + 13), legLinhas[controle][2] + (number[0] + 13))
      let pnL1 = wsFoto.getCell(legLinhas[controle][0] + (number[0] + 13))
      pnL1.value = 'P/N'
      pnL1.font = { size: 10, bold: true }
      pnL1.border = {
        top: { style: 'thin', color: { argb: '000000' } },
        left: { style: 'thin', color: { argb: '000000' } },
      }

      mergeCells(wsFoto, legLinhas[controle][1] + (number[0] + 13), legLinhas[controle][3] + (number[0] + 13))
      let pnL2 = wsFoto.getCell(legLinhas[controle][1] + (number[0] + 13))
      pnL2.font = { size: 10, }
      pnL2.value = item.pn
      pnL2.border = {
        top: { style: 'thin', color: { argb: '000000' } },
        right: { style: 'thin', color: { argb: '000000' } }
      }

      mergeCells(wsFoto, legLinhas[controle][0] + (number[0] + 14), legLinhas[controle][2] + (number[0] + 14))
      let bpL1 = wsFoto.getCell(legLinhas[controle][0] + (number[0] + 14))
      bpL1.value = 'BP/SGP'
      bpL1.font = { size: 9, bold: true }
      bpL1.border = {
        left: { style: 'thin', color: { argb: '000000' } },
      }

      mergeCells(wsFoto, legLinhas[controle][1] + (number[0] + 14), legLinhas[controle][3] + (number[0] + 14))
      let bpL2 = wsFoto.getCell(legLinhas[controle][1] + (number[0] + 14))
      bpL2.font = { size: 10, }
      bpL2.value = item.numBPSGP ? item.numBPSGP : 'NÃO ETIQUETAVEL'
      bpL2.border = {
        right: { style: 'thin', color: { argb: '000000' } }
      }

      mergeCells(wsFoto, legLinhas[controle][0] + (number[0] + 15), legLinhas[controle][2] + (number[0] + 15))
      let nsL1 = wsFoto.getCell(legLinhas[controle][0] + (number[0] + 15))
      nsL1.value = 'Nº de série'
      nsL1.font = { size: 10, bold: true }
      nsL1.border = {
        left: { style: 'thin', color: { argb: '000000' } },
        bottom: { style: 'thin', color: { argb: '000000' } },
      }

      mergeCells(wsFoto, legLinhas[controle][1] + (number[0] + 15), legLinhas[controle][3] + (number[0] + 15))
      let nsL2 = wsFoto.getCell(legLinhas[controle][1] + (number[0] + 15))
      nsL2.value = item.numSerie
      nsL2.font = { size: 10, }
      nsL2.border = {
        bottom: { style: 'thin', color: { argb: '000000' } },
        right: { style: 'thin', color: { argb: '000000' } }
      }
      //-----------------------------------------
      rows += 1
      if (controle === 3) {
        imgRow += 17
        number[0] += 17
        number[1] += 17
      }

      controle === 3 ? controle = 1 : controle += 1
      imgCol === 11 ? imgCol = 1 : imgCol += 5

    })


  }

  //INICIALIZA A CRIAÇÃO DO INVENTARIO
  const gerarInventario = async () => {
    setProgress(true)
    setTimeout(() => {
      const wbInventario = creatWorkbook()
      const now = new Date()
      wbInventario.creator = 'APP RELATORIO'
      wbInventario.created = now
      const wsInventario = creatWorksheet(wbInventario, 'inventário', 'landscape')
      const wsRBPSGP = creatWorksheet(wbInventario, 'Relatório_Fotos_BP_SGP')

      creatHeardInvetario(wbInventario, wsInventario)
      addItemInventario(wbInventario, wsInventario, wsRBPSGP)

      saveWorkbook(wbInventario, route.params.title).then(() => setProgress(false))
    }, 1 * 1000)


  }

  //PEGA AS IMAGENS E DEIXA SO O CODIGO BASE6
  const getAllImage = (list= null) => {

    const listType = route.params.inventario ? 'imgMain' : 'img'
    let newList = []
    console.log("get all images", list.length)
    list.forEach((file, index) => {


      if (file[listType]) {
        let b64Img = file[listType].b64.replace('data:image/png;base64', '')

        if (file['imgNumSerie'] && file['imgNumBPSGP']) {

          let imgNumSerie = file['imgNumSerie'].b64.replace('data:image/png;base64', '')
          let imgNumBPSGP = file['imgNumBPSGP'].b64.replace('data:image/png;base64', '')
          newList.push({ img: imgNumBPSGP, name: index + 'A' })
          newList.push({ img: imgNumSerie, name: index + 'B' })
        }
        newList.push({ img: b64Img, name: index })
      }

    })
    return (newList)


  }

  const downloadExcel = useCallback(async (fileUri) => {
    const downloadUri = fileUri
    const localPath = `${FileSystem.cacheDirectory}_spreadsheet.xlsx`
    try {
      await FileSystem.downloadAsync(downloadUri, localPath)
        .then(async ({ uri }) => {
          const contentURL = await FileSystem.getContentUriAsync(uri)
          await Linking.openURL(contentURL)
        })
        .catch((err) => console.log(err))
    } catch (err) {
      console.log(err)
    }
  }, [])

  const getData = async (name = '@salvos') => {
    try {
      const jsonValue = await AsyncStorage.getItem(name)
      const endValue = JSON.parse(jsonValue)
      return jsonValue != null ? endValue : null;
    } catch (e) {
      // error reading value
    }
  }

  //ZERA TODO OS ARQUIVOS
  const finalize = async () => {
    try {
      dispatch({
        type: 'zerar'
      })

      navigation.navigate('Home')
    } catch (e) {
      console.log(e)
      //alert('ERRO AO SALVAR')
    }

  }

  //SALVA ARQUIVO DO RELATORIO SEM SER INVENTARIO
  const saveExcel = (nameDoc) => {
    return new Promise(async (resolve, reject) => {
      //const fileName = `Relatório_Fotográfico_${route.params.equipName}`
      const fileName = `Relatório_Fotográfico_${route.params.equipName}_${nameDoc.toUpperCase()}_(${route.params.type})`

      //Relatório_Fotográfico_7705 SAR-X_CEAER13-RMP01_(Ampliação)_Rev.0

      //muda para dirotio para ficar permanente???

      //SALVA NO CACHE DIRECTORY TEMPORARIAMENTE
      const fileUri = FileSystem.cacheDirectory + fileName + '_Rev.0.xlsx'
      //TRANSFORMA O ARQUIVO EXCEL EM BUFFER
      console.log('GE SAVEEXCEK ', fileUri)
      workbook.xlsx.writeBuffer().then((buffer) => {
        // console.log(pat)
        // Do this to use base64 encoding
        //CODIFICA PARA BASE64
        const nodeBuffer = NodeBuffer.from(buffer)
        const bufferStr = nodeBuffer.toString('base64')
        setB64Excel(buffer)

        //SALVA O ARQUIVO NA MEMORIA TEMPORARIA
        FileSystem.writeAsStringAsync(fileUri, bufferStr, {
          encoding: FileSystem.EncodingType.Base64
        }).then(async () => {
          //converte o pdf

          setExcel(fileUri)
          Toast.show({
            type: 'success',
            text1: 'ARQUIVO GERADO COM SUCESSO'
          })
          // alert('ARQUIVO GERADO COM SUCESSO')
          resolve(true)
        })
      })
    })
  }

  //adiciona as logos e o nome do site no inicio
  const creatHeard = (nameSite) => {
    //CARREGANDO IMAGENS DA LOGO  E ADICIONANDO NA PLANILHA

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

    worksheet.getCell('M4').value = 'Estação'
    worksheet.getCell('N4').value = nameSite
    worksheet.getCell('N4').font = { color: { argb: "FF0000" } }


  }

  //adiciona todas as fotos e suas bordas 
  const addFotos = async (lista) => {
    let controle = 1
    let linhas = {
      1: ['B', 'E'],
      2: ['G', 'J'],
      3: ['L', 'O']
    }
    let number = [6, 17]
    let imgCol = 1
    let imgRow = 5


    lista.forEach(async (element, index) => {
      try {
        //MESCLANDO CELULARS
        worksheet.mergeCells(linhas[controle][0] + (number[0]), linhas[controle][1] + number[1])
        worksheet.mergeCells(linhas[controle][0] + (number[0] + 13), linhas[controle][1] + (number[1] + 4))
      } catch (error) {
        console.log(error)
      }
      //COLOCANDO BORDAS DA FOTO
      let fotoContainer = worksheet.getCell(linhas[controle][0] + number[0])
      fotoContainer.border = {
        top: { style: 'medium', color: { argb: '000000' } },
        left: { style: 'medium', color: { argb: '000000' } },
        bottom: { style: 'medium', color: { argb: '000000' } },
        right: { style: 'medium', color: { argb: '000000' } }
      }


      //ADICIONAR LEGENDA  e COLOCANDO BORDAS DA LEGENDA      
      let legenda = worksheet.getCell(linhas[controle][0] + (number[0] + 13))
      legenda.border = {
        top: { style: 'medium', color: { argb: '000000' } },
        left: { style: 'medium', color: { argb: '000000' } },
        bottom: { style: 'medium', color: { argb: '000000' } },
        right: { style: 'medium', color: { argb: '000000' } }
      }
      legenda.font = { size: 8, bold: true }
      legenda.value = element.title
      legenda.alignment = { vertical: 'middle', horizontal: 'center', wrapText: true }


      if (element.img) {
        //ADDICIONANDO FOTOS

        let foto = workbook.addImage({
          base64: element.img.b64,
          extension: 'jpg',
        })


        if (element.img.b64) {
          //let img = addImageB64(workbook, element.b64)
          //TAMANHO DO QUADRADO NA PLANILHA
          let height = 216
          let width = 233

          //PORCENTAGEM DE REDUÇÃO DA ALTURA E LARGURA 
          //DO TAMANHO ORIGINAL DA IMAGEM
          let porcentH = ((height * 100) / element.img.height) / 100
          let porcentW = ((width * 100) / element.img.width) / 100

          //VERIFICA SE A ALTURA É MAIOR QUE A LARGURA
          let quemEmaior = (element.img.height > element.img.width) ? true : false

          //SE FOR MAIOR REDUZ A LARGURA PROPORCIONAL A REDUÇÃODA ALTURA
          if (quemEmaior) {
            width = element.img.width * porcentH

          }
          //SE NÃO REDUZ A ALTURA PROPORCIONAL A REDUÇÃO DA LARGURA
          else {
            height = element.img.height * porcentW
          }

          //ADICIONA A FOTO COM AS MEDIDAS CERTAS
          worksheet.addImage(foto, {
            tl: { col: imgCol + 0.05, row: imgRow + 0.5 },
            ext: {
              height: height,
              width: width
            },
            editAs: 'undefined'
          })
        }


      } else {
        fotoContainer.value = 'N/A'
        fotoContainer.alignment = { vertical: 'middle', horizontal: 'center', wrapText: true }
      }


      if (controle === 3) {
        imgRow += 17
        number[0] += 17
        number[1] += 17
      }

      controle === 3 ? controle = 1 : controle += 1
      imgCol === 11 ? imgCol = 1 : imgCol += 5


    })

  }

  const generateExcel = async () => {
    //if(!name) return(alert('DIGITE O NOME DO SITE'))
    if (listFotos.length === 0) return (alert("NÃO TEM FOTOS NO RELATÓRIO"))

    setProgress(true)
    setTimeout(() => {
      creatHeard(route.params.title)
      addFotos(listFotos)
      //salva arquivo como excel
      saveExcel(route.params.title).then((e) => {
        setProgress(false)
      })
    }, 1 * 1000)



  }

  const zipFiles = async (list = null) => {

    return new Promise(async (resolve, reject) => {
      try {
        const typeDoc = route.params.inventario ? 'Planilha Padrão de Inventário_' : 'Relatório_Fotográfico_'
        const name = `${typeDoc}_${route.params.equipName}_${route.params.title.toUpperCase()}_(${route.params.type})_Rev.0`
        let fileUri = FileSystem.cacheDirectory + name + '.zip'
        const imgs = getAllImage(list)
        console.log(imgs.length)
        const nodeBuffer = NodeBuffer.from(b64Excel)
        const bufferStr = nodeBuffer.toString('base64')


        //ADICIONA AS FOTOS NO ARQUIVO 

        let fotos = zip.folder("FOTOS")
        for (const item of imgs) {

          if (item) {
            fotos.file(`${route.params.inventario ? "I_" : 'R_'}${item.name}.jpg`, item.img, { base64: true })
          }
        }

        //ADICIONA O EXCEL NO ARQUIVO ZIP
        zip.file(name + '.xlsx', bufferStr, { base64: true })

        if (route.params.dePara) {
          let textDePara = []
          const text = route.params.dePara.map((item, index) => {
            return (`${index + 1}. DE ${item.de} <> PARA ${item.para}\n`)
          })
          zip.file('DePara.txt', text.toString())

        }

        //CRIA O ARQUIVO ZIP
        zip.generateAsync({ type: "base64" }).then(function (base64) {
          //console.log(base64)
          //saveAs(base64, "hello.zip")
          FileSystem.writeAsStringAsync(fileUri, base64, {
            encoding: FileSystem.EncodingType.Base64
          }).then(async () => {
            //converte o pdf

            setFileZip(fileUri)
            resolve(fileUri)
            setProgress(false)
            //alert('ARQUIVO GERADO COM SUCESSO')

          })

        })



      } catch (error) {
        setProgress(false)
        console.log(error)
        Alert.alert(
          'ERRO AO ANEXAR ',
          'ENVIAR O ERRO PARA O ADMINISTRADOR DO APLICATIVO',
          [
            {
              text: 'Cancel',
              onPress: () => console.log('Cancel Pressed'),
              style: 'cancel',
            },
            { text: 'OK', onPress: () => Share.share({ title: 'ERRO AO ANEXAR FOTOS', message: error }) },
          ]
        )
      }
    })


  }

  const shareExcel = async () => {
    //const shareableExcelUri = await generateExcel();
    setProgress(true)
    let allFotos = listFotos

    if(route.params.type == 'Vistória'){
      allFotos = [...state['vistoria'],...state['outdoor'], ...state['qtm']]
      console.log('SHAREEXCEL - ', allFotos.length)
      setListFotos(allFotos)
    }


    setTimeout(async () => {
      const file = await zipFiles(allFotos)
      if (file) {
        setProgress(false)
        Sharing.shareAsync(file)
      }
      else {
        setProgress(false)
      }
    }, 1 * 1000)


  }

  const shareExcelOnly = async () => {

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


  const shareDePara = async () => {
    let msg = ''
    let dePara = route.params.dePara.forEach(item => {
      msg += `\nDE: ${item.de} PARA: ${item.para} `
    })

    const options = {
      title: "DE <> PARA",
      message: msg,

    }
    await Share.share(options)

  }


  const sendEmail = async () => {
    const mailerConfig = {
      defaults: {
        from: {
          name: "Check Report App",
          address: "checkreportapp@gmail.com"
        }
      },
      transport: {
        host: "smtp.gmail.com",
        secure: true,
        auth: {
          user: "checkreportapp@gmail.com",
          pass: "17132023"
        }
      }
    };

    const emailsList = {
      //PasswordEmail,
      ReminderEmail,
    }

    const ReminderEmail = () => ({
      subject: `Don't forget!`,
      body: (
        <div>
          <p>Hello ,</p>
          <p>You asked me to remind you about !</p>
          <p>See you!</p>
        </div>
      ),
    })



  }

  const creatHeardVistoria = (wb, ws) => {
    const nokiaImg = addImageB64(wb, nokiaLogo)

    mergeCells(ws, 'A1', 'H4')
    addBorderFull(ws, 'A1')
    ws.addImage(nokiaImg, {
      tl: { col: 1.5, row: 0.2 },
      ext: { width: 140, height: 30 },
      editAs: 'undefined'
    })

    mergeCells(ws, 'I1', 'W2')
    addBorderFull(ws, 'I1')
    ws.getCell('I1').value = '14 - RELATÓRIO FOTOGRÁFICO'
    ws.getCell('I1').font = { size: 12, bold: true, name: 'Arial', }
    ws.getCell('I1').alignment = { vertical: 'middle', horizontal: 'center', wrapText: true }

    mergeCells(ws, 'I3', 'K4')
    addBorderFull(ws, 'I3')
    ws.getCell('I3').value = 'SITE:'
    ws.getCell('I3').font = { size: 12, bold: true, name: 'Arial' }
    ws.getCell('I3').alignment = { vertical: 'middle', horizontal: 'center', wrapText: true }

    mergeCells(ws, 'L3', 'W4')
    addBorderFull(ws, 'L3')
    ws.getCell('L3').value = route.params.title
    ws.getCell('L3').font = { size: 16, bold: true, name: 'Arial', color: { argb: 'FF0000' } }
    ws.getCell('L3').alignment = { vertical: 'middle', horizontal: 'center', wrapText: true }

    ws.getCell('A1').width = 10




  }

  const addItemVistoria = (wb, ws) => {
    let controle = 1
    let number = [6, 17]
    let infinit = 0
    const columns = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W']
    const column = {
      1: ['B', 'K'],
      2: ['M', 'V']
    }
    let imgCol = 1
    let imgRow = 5

    let makePage = 1

    state.vistoria.forEach((item) => {

      let start = column[controle][0] + (number[0])
      let end = column[controle][1] + number[1]

      mergeCells(ws, start, end)
      addBorderFull(ws, column[controle][0] + (number[0]))

      if (item.img) {
        try {
          let img = addImageB64(wb, item.img.b64)

          //TAMANHO DO QUADRADO NA PLANILHA
          let height = 176
          let width = 233

          let newHeight = height
          let newWidth = width

          //PORCENTAGEM DE REDUÇÃO DA ALTURA E LARGURA 
          //DO TAMANHO ORIGINAL DA IMAGEM
          let porcentH = ((height * 100) / item.img.height) / 100
          let porcentW = ((width * 100) / item.img.width) / 100

          //VERIFICA SE A ALTURA É MAIOR QUE A LARGURA
          let quemEmaior = (item.img.height > item.img.width) ? true : false

         // do {
            if (infinit === 100) return alert('LOOP INFINITO')
            if (quemEmaior) {
              newWidth = item.img.width * porcentH

            }
            //SE NÃO REDUZ A ALTURA PROPORCIONAL A REDUÇÃO DA LARGURA
            else {
              newHeight = item.img.height * porcentW
            }
          //  quemEmaior = (height > width) ? true : false
         // } while (newHeight > height || newWidth > width)
          //SE FOR MAIOR REDUZ A LARGURA PROPORCIONAL A REDUÇÃODA ALTURA


          //ADICIONA A FOTO COM AS MEDIDAS CERTAS
          ws.addImage(img, {
            tl: { col: imgCol + 0.05, row: imgRow + 0.5 },
            ext: {
              height: newHeight,
              width: newWidth
            },
            editAs: 'undefined'
          })
        } catch (error) {
          alert("Erro ao redimencionar fotos - ", error)
        }
      } else {
        ws.getCell(start).value = ("NA")
        ws.getCell(start).alignment = { vertical: 'middle', horizontal: 'center', wrapText: true }
      }

      try {
        //ADICIONA A LEGENDA
        mergeCells(ws, (column[controle][0] + (number[0] + 13)), (column[controle][1] + (number[1] + 3)))
        let legenda = ws.getCell(column[controle][0] + (number[0] + 13))
        legenda.font = { size: 9, bold: true, name: 'Arial' }
        legenda.value = item.title
        legenda.alignment = { vertical: 'middle', horizontal: 'center', wrapText: true }
        addBorderFull(ws, column[controle][0] + (number[0] + 13))

        //ADICIONNA O MARCADO DE PAGINAS 
        if (makePage === 8) {
          mergeCells(ws, 'A' + (number[0] + 16), 'W' + (number[0] + 16))
          addBorderFull(ws, 'A' + (number[0] + 16))
          let pagText = ws.getCell('A' + (number[0] + 16))
          pagText.font = { size: 10, bold: true, name: 'Arial' }
          pagText.value = 'Folha XX de XXXX'
          pagText.alignment = { vertical: 'bottom', horizontal: 'right' }
        }

      } catch (error) {
        alert('Erro em adicionar legenda - ', error)
      }

      if (controle === 2) {
        imgRow += makePage === 8 ? 18 : 16
        number[0] += makePage === 8 ? 18 : 16
        number[1] += makePage === 8 ? 18 : 16
      }

      controle === 2 ? controle = 1 : controle += 1
      imgCol === 12 ? imgCol = 1 : imgCol += 11
      makePage === 8 ? makePage = 1 : makePage += 1


    })

    ws.getCell('X1').value = ' '
    for (let i = 5; i <= 201; i++) {
      if (i != 70 && i != 136) {
        ws.getCell('W' + i).border = {
          right: { style: 'thin', color: { argb: '000000' } }
        }
      }
    }
    // AO ADICIONAR O CROQUI NÃO PRECISA MAIS
    // columns.forEach(letter => {
    //   if (letter === 'W') {
    //     ws.getCell('W' + 186).border = {
    //       bottom: { style: 'thin', color: { argb: '000000' } },
    //       right: { style: 'thin', color: { argb: '000000' } }
    //     }
    //   } else {
    //     ws.getCell(letter + 186).border = {
    //       bottom: { style: 'thin', color: { argb: '000000' } },
    //     }
    //   }

    // })
    ws.pageSetup.printArea = 'A1:X187'
  }

  const createHeardDefault = (wb, ws) => {
    //CARREGANDO IMAGENS DA LOGO  E ADICIONANDO NA PLANILHA
    const claroImg = addImageB64(wb, claroLogo)
    const nokiaImg = addImageB64(wb, nokiaLogo)

    ws.addImage(claroImg, 'P1:P3')
    ws.addImage(nokiaImg, 'A2:C3')

    //ADICIONA A ESAÇÃO  
    ws.getCell('M4').value = 'Estação'
    ws.getCell('N4').value = route.params.title
    ws.getCell('N4').font = { color: { argb: "FF0000" } }

  }

  const addItemDefault = async (wb, ws, list) => {
    try {
      let controle = 1
      let column = {
        1: ['B', 'E'],
        2: ['G', 'J'],
        3: ['L', 'O']
      }
      let number = [6, 17]
      let imgCol = 1
      let imgRow = 5

      createHeardDefault(wb, ws)

      state[list].forEach((item) => {
        let start = column[controle][0] + (number[0])
        let end = column[controle][1] + number[1]

        mergeCells(ws, start, end)
        addBorderFull(ws, column[controle][0] + (number[0]))

        if (item.img) {

          let img = addImageB64(wb, item.img.b64)

          //TAMANHO DO QUADRADO NA PLANILHA
          let height = 216
          let width = 233

          let newHeight = height
          let newWidth = width

          //PORCENTAGEM DE REDUÇÃO DA ALTURA E LARGURA 
          //DO TAMANHO ORIGINAL DA IMAGEM
          let porcentH = ((height * 100) / item.img.height) / 100
          let porcentW = ((width * 100) / item.img.width) / 100

          //VERIFICA SE A ALTURA É MAIOR QUE A LARGURA
          let quemEmaior = (item.img.height > item.img.width) ? true : false


          if (quemEmaior) {
            newWidth = item.img.width * porcentH

          }
          //SE NÃO REDUZ A ALTURA PROPORCIONAL A REDUÇÃO DA LARGURA
          else {
            newHeight = item.img.height * porcentW
          }


          //SE FOR MAIOR REDUZ A LARGURA PROPORCIONAL A REDUÇÃODA ALTURA


          //ADICIONA A FOTO COM AS MEDIDAS CERTAS
          ws.addImage(img, {
            tl: { col: imgCol + 0.05, row: imgRow + 0.5 },
            ext: {
              height: newHeight,
              width: newWidth
            },
            editAs: 'undefined'
          })
        } else {
          ws.getCell(start).value = ("NA")
          ws.getCell(start).alignment = { vertical: 'middle', horizontal: 'center', wrapText: true }
        }
        //ADICIONA A LEGENDA
        mergeCells(ws, (column[controle][0] + (number[0] + 13)), (column[controle][1] + (number[1] + 4)))
        addBorderFull(ws, column[controle][0] + (number[0] + 13))

        let legenda = ws.getCell(column[controle][0] + (number[0] + 13))
        legenda.font = { size: 9, bold: true, name: 'Arial' }
        legenda.value = item.title
        legenda.alignment = { vertical: 'middle', horizontal: 'center', wrapText: true }

        if (controle === 3) {
          imgRow += 17
          number[0] += 17
          number[1] += 17
        }

        controle === 3 ? controle = 1 : controle += 1
        imgCol === 11 ? imgCol = 1 : imgCol += 5

      })
    } catch (error) {
      console.log('ERRO EM DEFAULT', error)
    }

  }

  const gerarVistoria = async () => {

    setProgress(true)
    setTimeout(() => {
      const wb = creatWorkbook()
      const now = new Date()
      wb.creator = 'APP RELATORIO'
      wb.created = now
      const wsVistoria = creatWorksheet(wb, 'VISTORIA', 'landscape')
      const wsOutdoor = creatWorksheet(wb, 'OUTDOOR', 'landscape')
      const wsQTM = creatWorksheet(wb, 'QTM', 'landscape')

      wsVistoria.properties.defaultColWidth = 4
      //wsVistoria.properties.defaultRowHeight = 13
      creatHeardVistoria(wb, wsVistoria)
      addItemVistoria(wb, wsVistoria)

      addItemDefault(wb, wsOutdoor, 'outdoor')
      addItemDefault(wb, wsQTM, 'qtm')

      saveWorkbook(wb, route.params.title).then(() => setProgress(false))
    }, 1 * 1000)
  }


  const downloadFile = async () => {
    const uri = await FileSystem.getContentUriAsync(excel)
    // Do this to use base64 encoding
    const nodeBuffer = NodeBuffer.from(b64Excel)
    console.log(uri)
    console.log(excel)
    const bufferStr = nodeBuffer.toString('base64')
    const downloadUri = `data:application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;base64,${bufferStr}`
    await Linking.openURL(uri)


  }


  const handleGeraRelatorio = () => {
    //route.params.inventario ? gerarInventario : generateExcel

    if (route.params.inventario) {
      gerarInventario()
      return
    }
    if (route.params.type === "Vistória") {
      gerarVistoria()
      return
    }

    generateExcel()


  }

  return (
    <View style={styles.container}>
      <View style={styles.barra}>
        <IconButton
          icon='arrow-left'
          size={26}
          onPress={() => navigation.goBack()} />
        <Text>{route.params.title}</Text>
        <View style={{ flexDirection: 'row' }}>

        </View>

      </View>
      <Text style={{ fontSize: 22, fontWeight: 'bold' }}>{name ? name.toUpperCase() + '.xlsx' : ''}</Text>
      {progress ?
        <View style={styles.containerImage}>
          <Lottie source={loadding} />
        </View>
        :
        <MaterialCommunityIcons
          //style= {{justifyContent:'flex-end'}} 
          name="microsoft-excel"
          size={200}
        >
          <View style={{ backgroundColor: "red" }}>

          </View>
        </MaterialCommunityIcons>
      }

      <Button
        style={styles.button}
        onPress={handleGeraRelatorio}
        mode='contained'
        color="#2196f3"
      >
        Gerar Relatorio
      </Button>

      <Button
        disabled={!excel}
        style={[styles.button]}
        onPress={shareExcel}
        mode='contained'
        color="#2196f3"
      >
        enviar Excel e fotos
      </Button>

      <Button
        disabled={!excel}
        style={[styles.button]}
        onPress={shareExcelOnly}
        mode='contained'
        color="#2196f3"
      >
        Enviar Excel
      </Button>
      {/* <Button
        disabled={!excel}
        style={[styles.button]}
        onPress={shareExcelOnly}
        mode='contained'
        color="#2196f3"
      >
        Fotos
      </Button> */}

      {route.params.dePara &&
        <Button
          disabled={!excel}
          style={[styles.button]}
          onPress={shareDePara}
          mode='contained'
          color="#2196f3"
        >
          Enviar DE PARA
        </Button>}

      <Button
        style={styles.button}
        onPress={finalize}
        mode='contained'
        color="#2196f3"
      >
        FINALIZAR
      </Button>

    </View>
  )

}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    //justifyContent: 'center',
    //backgroundColor: '#696969',



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

  containerButton: {
    width: '100%',
    justifyContent: 'space-between',
    //flexDirection:'colum'
  },
  button: {
    width: '90%',
    padding: 4,
    marginTop: 16,
    //marginHorizontal:8
  },
  containerImage: {
    height: 200,
    width: 200,
    alignItems: 'center',
    marginTop: 15
  },

})
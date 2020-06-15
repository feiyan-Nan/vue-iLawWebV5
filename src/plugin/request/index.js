import Axios from 'axios'
// import config from './config'
import postMessage from '@/utils/postMessage'
import db from '../db'
const ls = db.ls

// const params2Query = params/* :Object */ => {
//   return Object.entries(params).map(keyValue => keyValue.join('=')).join('&')
// }

const axios = Axios.create()

// const get = async (uri, params) => {
//   uri = uri + (params ? '?' + params2Query(params) : '')
//   return axios._get(axios, uri)
// }
const request = {}

const methods = [
  {
    mKey: 'get',
    pKey: 'params'
  },
  {
    mKey: 'post',
    pKey: 'data'
  },
  {
    mKey: 'put',
    pKey: 'data'
  },
  {
    mKey: 'delete',
    pKey: 'data'
  }
]

methods.forEach(method => {
  request[method.mKey] = (url, params) => {
    // if (method === 'get') {
    //   uri = uri + (params ? '?' + params2Query(params) : '')
    //   response = await axios.get(uri)
    // } else {
    //   response = await axios[method](uri, params)
    // }
    // let response = await axios({ method: method.mKey, url, [method.pKey]: params })
    return axios({ method: method.mKey, url, [method.pKey]: params })
  }
})

// request 拦截器
axios.interceptors.request.use(
  (config) => {
    Object.assign(config.headers, {
      'Authorization': `Token ${ls.get('iFileToken')}`,
      'token': ls.get('token'),
      'deviceType': 'web'
    })

    return config
  }
)

// response 拦截器
axios.interceptors.response.use(
  (response) => {
    if (response.data.isSuccess || response.data.succeed || response.data.resultCode === '1') {
      return response.data
    } else {
      postMessage.toast({msg: response.data.resultMsg || response.data.message})
      return Promise.reject(Error('error'))
    }
  },
  (error) => {
    if (error.response) {
      switch (error.response.status) {
        case 401:
          return postMessage.stateGo('login.wechat')
        case 404:
          error.response.data.resultMsg = '接口404'
          break
      }
      postMessage.toast({msg: error.response.data.resultMsg || error.response.data.message})
      return error.response
    }
  }
)
export default request
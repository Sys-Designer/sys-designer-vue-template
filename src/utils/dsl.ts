import { isObject } from './is'
export function buildDsl(method: string, args: Array<string | object>, fields: Array<string | object>): string {
  return `${method}${buildDslArgs(args)}${buildDslFields(fields)}`
}

export function buildDslForList(argsList: Array<any>, cb: Function, key?: string) {
  const querys = {} as any
  argsList.forEach((it, index) => {
    querys['_' + (key ? key + '_' : '') + index] = cb(it)
  })

  return querys
}

export function resolveQueryResult(data: any, cb?: Function) {
  if (!data || Array.isArray(data)) {
    return data
  }
  const result = {} as any
  Object.keys(data).map(key => {
    if (key.startsWith('_')) {
      const strs = key.split('_')
      const field = strs.length == 2 ? 'data' : strs[1]
      if (!result[field]) {
        result[field] = []
      }
      result[field] = result[field].concat(data[key])
    } else {
      if (result[key]) {
        result[key] = result[key].concat(data[key])
      } else {
        result[key] = data[key]
      }
    }
  })
  return cb ? cb(result) : result
}


function buildDslArgs(args: Array<any>): string {
  const strs = [] as Array<string>
  if (args && args.length > 0) {
    args.forEach(e => {
      const key = e.key
      const value = e.value
       if (isObject(value)) {
        let str = key + ':{'
        const keys = Object.keys(value)
        keys.forEach((vk, k) => {
          let v = value[vk]
          if(Array.isArray(v)){
            v = '['+v.join(',')+']';
            str = str+vk+':'+v+',';
          }else if (v || v === 0 || v === false) {
            str = str + vk + ':' + (typeof v === 'string' ? `"${v}"` : v)
            str = str + ','
          }
        })
        if (str.endsWith(',')) {
          str = str.substring(0, str.length - 1)
        }
        strs.push(str + '}')
      } else {
        let val = typeof value === 'string' ? `"${value}"` : value
        if(Array.isArray(value)){
          val = '['+value.join(',')+']';
        }
        if(val===undefined || val===null){
          return;
        }
        strs.push(`${key}:${val}`)
      }
    })
  }
  if (strs.length > 0) {
    return `(${strs.join(',')})`
  }
  return ''
}

function buildDslFields(fields: Array<string | object>): string {
  const list = [] as any
  buildDslField(list, fields)
  return `{${list.join(',')}}`
}

function buildDslField(list: Array<any>, fields: Array<string | object>) {
  if (fields && fields.length > 0) {
    fields.forEach(e => {
      if (typeof e === 'string') {
        list.push(e)
      } else {
        Object.keys(e).forEach(field => {
          const tempList: string[] = []
          buildDslField(tempList, (e as any)[field])
          list.push(`${field}{${tempList.join(',')}}`)
        })
      }
    })
  }
}
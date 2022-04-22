let handler = (text) => text

export default function emphasize(text){
    return handler(text)
}

export function use(cb){
    handler = cb
}
export const Example = (context) => {
  console.log('CTX: ', context._waterline.collections)
  context.body = 'Hello from the Koa API 🙂'
}

export default Example

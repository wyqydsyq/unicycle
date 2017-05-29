// const getUser = (context, query = {}) => new Promise((res, rej) => {
//   context._waterline
//     .collections
//     .users
//     .find(query)
//     .exec((error, result) => {
//       if (error) {
//         rej(error)
//       } else {
//         res(result)
//       }
//     })
// })

export const Users = async userId => context => {
  console.log(userId, context)
  // switch (context.method) {
  //   case 'GET':
  //   default:
  //     console.log(context.params)
  //     break
  // }
  // // const users = await getUser(context)
  // // console.log('CTX: ', users)
  // context.body = 'Hello from the Koa API 🙂'
}

export default Users

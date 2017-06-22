import * as R from 'ramda'

const update = (context, query = {}, data = {}) => new Promise((res, rej) => {
  context._waterline
    .collections
    .users
    .update(query, data)
    .exec((error, result) => {
      if (error) {
        return rej(error)
      } else {
        return res(result)
      }
    })
})

const create = (context, data = {}) => new Promise((res, rej) => {
  context._waterline
    .collections
    .users
    .create(data)
    .exec((error, result) => {
      if (error) {
        return rej(error)
      } else {
        return res(result)
      }
    })
})

const get = (context, query = {}) => new Promise((res, rej) => {
  context._waterline
    .collections
    .users
    .find(query)
    .exec((error, result) => {
      if (error) {
        return rej(error)
      } else {
        return res(result)
      }
    })
})

const set = (context, query = {}, data = {}) => new Promise((res, rej) => {
  // try to find the user
  get(context, query).then(users => {
    const user = R.head(users)

    // if the user exists, update them
    if (user) {
      return res(update(context, query, data))
    }

    // otherwise create them
    return res(create(context, data))
  })
})

export const Users = (userId?) => async context => {
  let result
  switch (context.method) {
    default:
    case 'GET':
      result = await get(context, userId).catch(e => [])
      break
    case 'POST':
      result = await set(context, { id: userId }, context.request.body)
      break
  }

  context.body = result
}

export default Users

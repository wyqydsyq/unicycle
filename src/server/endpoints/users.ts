import * as R from 'ramda'

export const Users = (userId?) => async context => {
  let result
  switch (context.method) {
    default:
    case 'GET':
      result = await get(context, userId).catch(e => [])
      break
    case 'POST':
      result = await set(context, { id: userId }, context.body)
      break
  }

  context.body = result
}

const get = (context, query = {}) => new Promise((res, rej) => {
  context._waterline
    .collections
    .users
    .find(query)
    .exec((error, result) => {
      if (error) {
        rej(error)
      } else {
        res(result)
      }
    })
})

const set = (context, query = {}, data = {}) => new Promise((res, rej) => {
  // try to find the user
  get(context, query).then(users => {
    const user = R.head(users)

    // if the user exists, update them
    if (user) {
      res(update(context, query, data))
    }

    // otherwise create them
    res(create(context, data))
  })
})

const update = (context, query = {}, data = {}) => new Promise((res, rej) => {
  context._waterline
    .collections
    .users
    .update(query, data)
    .exec((error, result) => {
      if (error) {
        rej(error)
      } else {
        res(result)
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
        rej(error)
      } else {
        res(result)
      }
    })
})

export default Users

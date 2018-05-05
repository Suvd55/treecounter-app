import axios from 'axios'
import {normalize} from 'normalizr'

import {getApiRoute} from '../actions/apiRouting'
import {mergeEntities} from '../reducers/entitiesReducer'
import {treecounterSchema} from '../schemas/index'

export function followSubscribeAction(treecounterId) {
  console.log('subscribing: ', treecounterId)
  console.log('route: ', getApiRoute('followUnSubscribe_post'))
  return (dispatch) => {
    axios.post(
      getApiRoute('followSubscribe_post'),
      {'_format': 'json', 'follow': {'followee': treecounterId}},
      {headers: {'Authorization': `Bearer ${localStorage.getItem('jwt')}`}}
    )
      .then(result => {
        console.log('followee subscribe: ', result.data)

        dispatch(mergeEntities(normalize(result.data, treecounterSchema)))
      })
      .catch(error => {
        console.log(error)
      })
  }
}

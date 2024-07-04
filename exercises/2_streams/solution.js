import { pipe } from 'it-pipe'
import map from 'it-map'
import filter from 'it-filter'

export default async function streams (stream) {
  await pipe(
    stream,
    source => filter(source, val => !isNaN(val) && val < 5),
    source => map(source, val => val * 2),
    stream
  )
}

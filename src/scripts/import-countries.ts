import 'utils/globals'
import serviceLocator from 'utils/serviceLocator'
import csvToJson from 'csvtojson'
import path from 'path'

const logger = serviceLocator.get('logger')

export default async function importCountries() {
  const dir = path.join(__dirname, '../data/countries.csv')
  const DB = serviceLocator.get('DB')
  const knex = serviceLocator.get('knex')
  logger.info('Importing Population Data as of 2018')
  function transform(country: any) {
    return {
      country: country['Country Name'],
      country_code: country['Country Code'],
      population: Number(country['2018']),
    }
  }
  await knex('country').delete()
  const countries = await csvToJson()
    .fromFile(dir)
    .then(response => response.map(transform))
  await DB.insert('country', countries)
  process.exit(0)
}

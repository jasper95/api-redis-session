import { Table } from 'types'
import { ADMIN_ROLES } from 'utils/decorators/RouteAccessRoles'

const COUNTRY_TABLE: Table = {
  table_name: 'country',
  list_roles: ADMIN_ROLES,
  columns: [
    {
      column_name: 'country',
      type: 'string',
      required: true,
      unique: true,
    },
    {
      column_name: 'country_code',
      type: 'string',
      required: true,
    },
    {
      column_name: 'population',
      type: 'integer',
      required: true,
    }
  ],
}

export default COUNTRY_TABLE

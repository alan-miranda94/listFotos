import { appSchema, tableSchema } from '@nozbe/watermelondb'
import { invetarioSchema } from './inventarioSchema'

export const schemas = appSchema({
    version:1,
    tables:[
        invetarioSchema,
    ]
})
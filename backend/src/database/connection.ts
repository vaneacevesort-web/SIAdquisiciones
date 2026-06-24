import { Sequelize } from "sequelize"

const sequelize = new Sequelize(
    process.env.DB_NAME || 'adquisiciones',
    process.env.DB_USERNAME || 'homestead',
    process.env.DB_PASSWORD || 'secret',
    {
        host: process.env.DB_HOST || '192.168.56.56',
        port: Number(process.env.DB_PORT) || 3306,
        dialect: 'mysql',
        define: {
            freezeTableName: true // evita que Sequelize pluralice
        }
    }
)

export default sequelize 
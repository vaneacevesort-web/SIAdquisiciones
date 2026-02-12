import { Sequelize } from "sequelize"

const sequelize = new Sequelize('adquisiciones', 'homestead', 'secret', {
    host: '192.168.56.56',
    dialect: 'mysql',
    define: {
        freezeTableName: true // evita que Sequelize pluralice
    }
})
// const sequelize = new Sequelize('adminplem_derechos', 'usr_derechos', 'J7Zi5TD4qBctM9', {
//     host: '192.168.56.56',
//     dialect: 'mysql',
//     define: {
//         freezeTableName: true // evita que Sequelize pluralice
//     }
// })
export default sequelize 
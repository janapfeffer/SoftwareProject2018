const sequelizedConnection = require ("./model_sequelizer");
const Sequelize = require("sequelize");
var Event = sequelizedConnection.define("events", {
    idevents : {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    name :{
        type: Sequelize.STRING,
        allowNull: false
    },
    description : {
        type: Sequelize.STRING,
        allowNull: false
    },
    city : {
        type: Sequelize.STRING,
        allowNull: false
    },
    zip : {
        type: Sequelize.INT,

    },
    street : {
        type: Sequelize.STRING,
        allowNull: false
    },
    house_number : {
        type: Sequelize.INTEGER,
        allowNull: false
    },
    address_additional : {
        type: Sequelize.STRING,
        allowNull: true
    },
    instagram_hashtag : {
        type: Sequelize.STRING,
        allowNull: true
    },
    verification_status : {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false 
    },
    start_date : {
        type: Sequelize.DATE,
        allowNull: false
    },
    end_date : {
        type: Sequelize.DATE,
        allowNull: true
    },
    event_link : {
        type: Sequelize.STRING,
        allowNull: true
    },
    ticket_link : {
        type: Sequelize.STRING,
        allowNull: true
    },
})
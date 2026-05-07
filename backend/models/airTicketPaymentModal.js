import { DataTypes } from "sequelize"
import sequelize from '../config/db'
// payment amount, received date, remark, 
const AirTicketPaymentModal = sequelize.define(
    "AirTicketPaymentModal",
    {
        id : {
            id: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
        },
        
    }
)
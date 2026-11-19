import { DataTypes } from "sequelize";
import sequelize from "../../../config/db.js";
import { v4 as uuidv4 } from "uuid";

const Donor = sequelize.define(
    "Donor",
    {
        id: {
            type: DataTypes.UUID,
            defaultValue: () => uuidv4(),
            primaryKey: true,
            allowNull: false,
        },
        donorIdentityNumber: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
        },
        firstName: { type: DataTypes.STRING, allowNull: false },
        lastName: { type: DataTypes.STRING, allowNull: false },
        email: { type: DataTypes.STRING, allowNull: false },
        phone: { type: DataTypes.STRING },
        address: { type: DataTypes.STRING },
        city: { type: DataTypes.STRING },
        state: { type: DataTypes.STRING },
        zipCode: { type: DataTypes.STRING },
        country: { type: DataTypes.STRING, defaultValue: "United States" },
    },
    {
        tableName: "donors",
    }
);

export default Donor;

import { DataTypes } from "sequelize";
import sequelize from "../../../config/db.js";
import { v4 as uuidv4 } from "uuid";

const Stats = sequelize.define(
    "Stats",
    {
        id: {
            type: DataTypes.UUID,
            defaultValue: () => uuidv4(),
            primaryKey: true,
            allowNull: false,
        },
        familiesSupported: {
            type: DataTypes.INTEGER,
            defaultValue: 0,
            allowNull: false,
        },
        fundsRaised: {
            type: DataTypes.FLOAT,
            defaultValue: 0,
            allowNull: false,
        },
        goatsDistributed: {
            type: DataTypes.INTEGER,
            defaultValue: 0,
            allowNull: false,
        },
    },
    {
        tableName: "stats",
        timestamps: true,
    }
);

export default Stats;

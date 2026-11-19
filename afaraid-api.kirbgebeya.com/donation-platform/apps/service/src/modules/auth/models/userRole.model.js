import { DataTypes } from "sequelize";
import sequelize from "../../../config/db.js";
import { v4 as uuidv4 } from "uuid";

const UserRole = sequelize.define(
    "UserRole",
    {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
        },
        userId: {
            type: DataTypes.UUID,
            allowNull: false,
        },
        roleId: {
            type: DataTypes.UUID,
            allowNull: false,
        },
    },
    {
        tableName: "user_roles",
        timestamps: true,
    }
);

UserRole.associate = (models) => {
    UserRole.belongsTo(models.User, { foreignKey: "userId", as: "user" });
    UserRole.belongsTo(models.Role, { foreignKey: "roleId", as: "role" });
};

export default UserRole;

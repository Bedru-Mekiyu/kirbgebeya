import { DataTypes } from "sequelize";
import sequelize from "../../../config/db.js";
import { v4 as uuidv4 } from "uuid";

const CampaignDetail = sequelize.define(
  "CampaignDetail",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: () => uuidv4(),
      primaryKey: true,
      allowNull: false,
    },
    campaignId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: "campaigns",
        key: "id",
      },
      onDelete: "CASCADE",
      onUpdate: "CASCADE",
    },
    image: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    location: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    beneficiaries: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    raisedAmount: {
      type: DataTypes.FLOAT,
      defaultValue: 0,
    },
    goalAmount: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    currency: {
      type: DataTypes.STRING(3),
      allowNull: false,
      defaultValue: "USD",
      validate: {
        isIn: {
          args: [[
            // 🌍 Global Currencies
            "USD", "EUR", "GBP", "CAD", "AUD", "ETB", "KES",
            // 🇸🇦 Arab Region Currencies
            "AED",
            "SAR",
            "QAR",
            "KWD",
            "BHD",
            "OMR",
            "EGP",
            "LYD",
            "DZD",
            "TND",
            "MAD",
            "SDG",
            "YER",
            "IQD",
            "SYP",
            "JOD",
            "LBP",
            "SOS"
          ]],
          msg: "Currency must be a valid ISO code (e.g., USD, ETB, AED, SAR, EGP)",
        },
      },
    },
    donors: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    longDescription: {
      type: DataTypes.TEXT("long"),
      allowNull: true,
    },
    startDate: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    endDate: {
      type: DataTypes.DATE,
      allowNull: false,
    },
  },
  {
    timestamps: true,
    tableName: "campaign_details",
  }
);

export default CampaignDetail;

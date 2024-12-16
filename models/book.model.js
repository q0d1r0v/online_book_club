const { DataTypes, Model } = require("sequelize");

module.exports = (sequelize) => {
  class Book extends Model {}

  Book.init(
    {
      id: {
        type: DataTypes.UUID,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4,
      },
      title: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      author: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      club_id: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
          model: "clubs",
          key: "id",
        },
      },
      created_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
        allowNull: false,
      },
      updated_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: "Book",
      tableName: "books",
      timestamps: true,
      underscored: true,
    }
  );
  return Book;
};

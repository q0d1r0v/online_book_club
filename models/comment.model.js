const { DataTypes, Model } = require("sequelize");

module.exports = (sequelize) => {
  class Comment extends Model {}

  Comment.init(
    {
      id: {
        type: DataTypes.UUID,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4,
      },
      content: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      review_id: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
          model: "reviews",
          key: "id",
        },
      },
      user_id: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
          model: "users",
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
      modelName: "Comment",
      tableName: "comments",
      timestamps: true,
      underscored: true,
    }
  );
  return Comment;
};

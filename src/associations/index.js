const setupAssociations = (db) => {
  if (db.Review && db.Comment && db.Book) {
    db.Review.hasMany(db.Comment, { foreignKey: "review_id", as: "comments" });
    db.Comment.belongsTo(db.Review, { foreignKey: "review_id", as: "review" });

    db.Book.hasMany(db.Review, { foreignKey: "book_id", as: "reviews" });
    db.Review.belongsTo(db.Book, { foreignKey: "book_id", as: "book" });
  } else {
    console.error("User or Profile model is undefined");
  }
};

module.exports = { setupAssociations };

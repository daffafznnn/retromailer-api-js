// Utility function to remove sensitive fields based on ORM/database used
const removeSensitiveFields = (user) => {
  if (user.toObject) {
    // For Mongoose
    const { password, ...userWithoutPassword } = user.toObject();
    return userWithoutPassword;
  } else if (user.get) {
    // For Sequelize
    const { password, ...userWithoutPassword } = user.get({
      plain: true,
    });
    return userWithoutPassword;
  } else {
    throw new Error("Unsupported ORM or user object type");
  }
};

export default removeSensitiveFields;
const { query } = require("../database/db");
const bcrypt = require('bcrypt');

/**
 * Registers a new user in the database.
 * @param {string} username - The username of the new user.
 * @param {string} email - The email address of the new user.
 * @param {string} password - The password of the new user.
 * @param {string} profilepic - The profile picture URL of the new user.
 * @returns {object} - The newly registered user object.
 */
const registerUser = async (username, email, password, profilepic) => {
  try {
    const registerSql = `
      INSERT INTO public.users (username, email, password, profilepic)
      VALUES ($1, $2, $3, $4)
      RETURNING *`;

    const result = await query(registerSql, [username, email, password, profilepic]);

    return result[0];
  } catch (error) {
    console.error("Database error:", error);
    throw new Error("Failed to register user. Please try again.");
  }
};

/**
 * Logs in a user by checking if the user exists.
 * @param {string} username - The username of the user attempting to log in.
 * @param {string} password - The password of the user attempting to log in.
 * @returns {object} - Returns an object indicating the success of the login attempt and the user object if successful.
 */
const loginUser = async (username, password) => {
  try {
    const user = await getUserByUsername(username);

    if (!user) {
      return { status: 401, success: false, message: 'User not found' };
    }

    // Trim both the input password and the stored password
    const inputPasswordTrimmed = password.trim();
    const storedPasswordTrimmed = user.password.trim();

    if (inputPasswordTrimmed === storedPasswordTrimmed) {

      const profilepicResult = await query('SELECT profilepic FROM public.users WHERE username = $1', [username]);

      let profilepic = profilepicResult.rows && profilepicResult.rows.length > 0 ? profilepicResult.rows[0].profilepic : null;

      return { status: 200, success: true, user, profilepic };
    } else {
      return { status: 401, success: false, message: 'Incorrect password' };
    }
  } catch (error) {
    console.error("Login Error:", error);
    return { status: 500, success: false, message: 'Internal server error' };
  }
};


/**
 * Retrieves a user record from the database based on the username.
 * @param {string} username - The username of the user to retrieve.
 * @returns {object|null} - The user record if found, or null if not found.
 */
const getUserByUsername = async (username) => {
  try {
    // Construct SQL query to retrieve user by username
    const sql = `SELECT * FROM public.users WHERE username = $1`;

    // Execute the query with the provided username
    const result = await query(sql, [username]);
    return result[0];
  } catch (error) {
    throw new Error(error);
  }
};

/**
 * Checks if a user exists in the database by their email address.
 * @param {string} email - The email address of the user to check.
 * @returns {boolean} - Returns true if the user exists, otherwise false.
 */
const checkIfUserExistsByEmail = async (email) => {
  try {
    // Query the database to count the number of users with the given email address
    const result = await query("SELECT COUNT(*) AS count FROM public.users WHERE email = $1", [email]);
    // Return true if count is greater than 0, indicating the user exists
    return parseInt(result[0].count) > 0;
  } catch (error) {
    // Return false if there's an error or if the user does not exist
    return false;
  }
};

/**
 * Checks if a user exists in the database by their id address.
 * @param {string} user_id - The Id address of the user to check.
 * @returns {boolean} - Returns true if the user exists, otherwise false.
 */
const checkIfUserExistsById = async (user_id) => {
  try {
    const result = await query('SELECT COUNT(*) AS count FROM public.users WHERE user_id = $1', [user_id]);
    return parseInt(result[0].count) > 0;
  } catch (error) {
    return false;
  }
};

/**
 * Checks if a user exists in the database by their id address.
 * @param {string} user_id - The Id address of the user to check.
 * @returns {boolean} - Returns true if the user exists, otherwise false.
 */
const getuseridfromusername = async (username) => {
  try {
    const result = await query('SELECT user_id FROM public.users WHERE username = $1', [username]);
    return result[0]?.user_id || null;
  } catch (error) {
    return false;
  }
};

/**
 * Checks if a user exists in the database by their username.
 * @param {string} username- The username of the user to check.
 * @returns {boolean} - Returns true if the user exists, otherwise false.
 */
const checkIfUserExistsByUsername = async (username) => {
  try {
    const user = await query('SELECT COUNT(*) AS count FROM public.users WHERE username = $1', [username]);
    return parseInt(user[0].count) > 0;
  } catch (error) {
    return false;
  }
};

/**
 * Updates the profile information of a user.
 * @param {number} user_id - The ID of the user whose profile is to be updated.
 * @param {object} userData - An object containing the updated user profile information.
 * @returns {boolean} - Returns true if the user profile is successfully updated, otherwise returns false.
 */
const updateUserProfile = async (user_id, userData) => {
  try {
    const userExists = await checkIfUserExistsById(user_id);
    if (!userExists) return false;

    const { username, email, password, profilepic } = userData;
    const updateSql = 'UPDATE public.users SET username = $1, email = $2, password = $3, profilepic = $4 WHERE user_id = $5';
    const updatedProfile = await query(updateSql, [username, email, password, profilepic, user_id]);

    return updatedProfile.rowCount > 0;
  } catch (error) {
    throw new Error(error);
  }
};

/**
 * Updates the username for a user.
 * @param {string} newUsername - The new username.
 * @param {string} username - The current username.
 * @returns {Promise<boolean>} - A promise that resolves to true if the username is successfully updated, otherwise false.
 * @throws {Error} - If the user is not found or there's an issue with the database query.
 */
const updateUsername = async (username, user_id) => {
  try {
    const updateSql = 'UPDATE public.users SET username = $1 WHERE user_id = $2';
    const updatedUsername = await query(updateSql, [username, user_id]);
    return updatedUsername;
  } catch (error) {
    throw new Error('Internal server error');
  }
};

/**
 * Updates the email for a user.
 * @param {string} newEmail - The new email.
 * @param {string} username - The username of the user.
 * @returns {Promise<boolean>} - A promise that resolves to true if the email is successfully updated, otherwise false.
 * @throws {Error} - If the user is not found or there's an issue with the database query.
 */
const updateEmail = async (email, user_id) => {
  try {
    const updateSql = 'UPDATE public.users SET email = $1 WHERE user_id = $2';
    const updatedEmail = await query(updateSql, [email, user_id]);
    return updatedEmail;
  } catch (error) {
    throw new Error('Internal server error');
  }
};

/**
 * Updates the profile picture for a user.
 * @param {string} newProfilePic - The filename of the new profile picture.
 * @param {string} username - The username of the user.
 * @returns {Promise<boolean>} - A promise that resolves to true if the profile picture is successfully updated, otherwise false.
 * @throws {Error} - If the user is not found or there's an issue with the database query.
 */
const updateProfilePic = async (newProfilePic, username) => {
  try {
    const userRows = await query('SELECT user_id FROM public.users WHERE username = $1', [username]);
    if (!userRows.length) throw new Error('User not found');

    const user_id = userRows[0].user_id;
    const updateSql = 'UPDATE public.users SET profilepic = $1 WHERE user_id = $2';
    const updatedProfilePic = await query(updateSql, [newProfilePic, user_id]);

    return updatedProfilePic.rowCount > 0;
  } catch (error) {
    throw new Error('Internal server error');
  }
};

/**
 * Updates the password for a user.
 * @param {string} username - The username of the user.
 * @param {string} newPassword - The new password.
 * @returns {Promise<boolean>} - A promise that resolves to true if the password is successfully updated, otherwise false.
 * @throws {Error} - If the user is not found or there's an issue with the database query.
 */
const updatePassword = async (password,user_id) => {
  try {
    const updateSql = 'UPDATE public.users SET password = $1 WHERE user_id = $2';
    const updatedPassword = await query(updateSql, [password, user_id]);
    return updatedPassword;
  } catch (error) {
    throw new Error('Internal server error');
  }
};

/**
 * Deletes a user from the system by their ID.
 * @param {number} user_id - The ID of the user to be deleted.
 * @returns {object} - Returns an object with a message indicating the success of the deletion process.
 */
const deleteUserById = async (user_id) => {
  try {
    const userExists = await checkIfUserExistsById(user_id);
    if (!userExists) return { message: `User with ID ${user_id} not found` };

    await query('DELETE FROM public.users WHERE user_id = $1', [user_id]);
    return { message: 'User deleted successfully' };
  } catch (error) {
    throw new Error(error);
  }
};

/**
 * Retrieves the profile picture filename for a user by their username.
 * @param {string} username - The username of the user.
 * @returns {Promise<string>} - A promise that resolves to the filename of the user's profile picture.
 * @throws {Error} - If there's an issue with the database query or the user is not found.
 */
const getUserImageByUsername = async (username) => {
  try {
    const profilepicResult = await query('SELECT profilepic FROM public.users WHERE username = $1', [username]);
    return profilepicResult[0]?.profilepic || null;
  } catch (error) {
    throw new Error('Internal server error');
  }
}

module.exports = {
  registerUser,
  loginUser,
  updateUserProfile,
  updateUsername,
  deleteUserById,
  checkIfUserExistsByUsername,
  getUserImageByUsername,
  updateEmail,
  updatePassword,
  updateProfilePic,
  checkIfUserExistsByEmail,
  getuseridfromusername
};

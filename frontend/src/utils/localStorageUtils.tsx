
interface User {
  token: string;
  user_id: number;
  username: string;
  password: string;
  profilepic: string;
  email: string;

}

const getLocalStorageUser = (): User | null => {
  const userItem = localStorage.getItem("user");
  if (userItem) {
    return JSON.parse(userItem) as User;
  }
  return null;
}

const setLocalStorageUser = (user: User): void => {
  localStorage.setItem("user", JSON.stringify(user));
}

const getToken = (): string | null => {
  const parsedUser = getLocalStorageUser();
  return parsedUser ? parsedUser.token : null;
};

const clearLocalStorageUser = (): void => {
  localStorage.removeItem("user");
};

export {
  clearLocalStorageUser,
  getLocalStorageUser,
  setLocalStorageUser,
  getToken,
};


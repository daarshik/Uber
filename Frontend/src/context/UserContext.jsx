import React, { createContext } from "react";

const UserDataContext = createContext();

const UserContext = ({ children }) => {
  return (
    <div>
      <UserDataContext.Provider>{children}</UserDataContext.Provider>
    </div>
  );
};

export default UserContext;

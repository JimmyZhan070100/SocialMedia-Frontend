import { createContext, useContext, useEffect, useState } from "react";

const ArticleContext = createContext();

export const useArticle = () => {
  const context = useContext(ArticleContext);
  if (!context) {
    throw new Error("useArticle must be used with a ArticleContext");
  }
  return context;
};

export const ArticleProvider = ({ children }) => {
  const [articles, setArticles] = useState([]);
  const [userIds, setUserIds] = useState([]);

  return (
    <ArticleContext.Provider
      value={{ articles, setArticles, userIds, setUserIds }}
    >
      {children}
    </ArticleContext.Provider>
  );
};

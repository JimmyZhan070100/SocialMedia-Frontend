import { createContext, useContext, useEffect, useState } from "react";

const ArticleContext = createContext();

const getRandomTimestamp = (start, end) => {
  const randomDate = new Date(
    start.getTime() + Math.random() * (end.getTime() - start.getTime())
  );
  return randomDate.toISOString();
};

const placeholderImageUrls = [
  "https://plus.unsplash.com/premium_photo-1696879454010-6aed21c32fc5?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxlZGl0b3JpYWwtZmVlZHwyfHx8ZW58MHx8fHx8&auto=format&fit=crop&w=250&q=60",
  "https://plus.unsplash.com/premium_photo-1695331858356-fd4f3d8fd3d1?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxlZGl0b3JpYWwtZmVlZHwxM3x8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=250&q=60",
  "https://images.unsplash.com/photo-1696928634052-41aa345ef686?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxlZGl0b3JpYWwtZmVlZHw0fHx8ZW58MHx8fHx8&auto=format&fit=crop&w=250&q=60",
  "https://images.unsplash.com/photo-1696945157988-5dbff7a97d02?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxlZGl0b3JpYWwtZmVlZHwzfHx8ZW58MHx8fHx8&auto=format&fit=crop&w=250&q=60",
];

const getRandomImageUrl = () => {
  const randomIndex = Math.floor(Math.random() * placeholderImageUrls.length);
  return placeholderImageUrls[randomIndex];
};

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

  //   useEffect(() => {
  //     console.log(userIds);
  //   }, [userIds]);

  useEffect(() => {
    fetch("https://jsonplaceholder.typicode.com/posts")
      .then((response) => response.json())
      .then((articleData) => {
        const ids = userIds.map((users) => users.id);
        console.log(ids);
        const articlesWithAuthors = articleData
          .filter((article) => ids.includes(article.userId))
          .map((article) => {
            const author = userIds.find((user) => user.id === article.userId);
            return {
              ...article,
              author: author.username,
              imageUrl: getRandomImageUrl(),
              timestamp: getRandomTimestamp(new Date(2023, 0, 1), new Date()),
            };
          });
        setArticles(articlesWithAuthors);
      });
  }, [userIds]);
  return (
    <ArticleContext.Provider
      value={{ articles, setArticles, userIds, setUserIds }}
    >
      {children}
    </ArticleContext.Provider>
  );
};

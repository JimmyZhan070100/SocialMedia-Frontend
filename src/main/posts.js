import React, { useState, useEffect } from "react";
import { useArticle } from "./postProvider";

const Posts = () => {
  const { userIds, setUserIds, articles, setArticles } = useArticle();

  const [newArticle, setNewArticle] = useState("");
  // const [articles, setArticles] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [users, setUsers] = useState([]);
  const [commentedArticleId, setCommentedArticleId] = useState(null);

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

  const getRandomTimestamp = (start, end) => {
    const randomDate = new Date(
      start.getTime() + Math.random() * (end.getTime() - start.getTime())
    );
    return randomDate.toISOString();
  };

  let userData = localStorage.getItem("user");
  if (!userData) {
    // 'user' key doesn't exist in localStorage, get 'formData' instead
    userData = localStorage.getItem("formData");
    if (userData) {
      userData = JSON.parse(userData);
      userData.username = userData.userName;
      userData.id = -1;
      localStorage.setItem("formData", JSON.stringify(userData));
    }
  } else {
    userData = JSON.parse(userData);
  }

  const handlePostArticle = () => {
    const newArticleObject = {
      id: Date.now(),
      userId: 0,
      title: newArticle,
      body: newArticle,
      author: userData.username,
      // imageUrl: getRandomImageUrl(),
      timestamp: new Date().toISOString(),
    };

    setArticles([newArticleObject, ...articles]);
    setNewArticle("");
  };

  const handleCancelArticle = () => {
    setNewArticle("");
  };

  const handleImageUpload = (e) => {
    const selectedImage = e.target.files[0];
    // You can process the selected image here (e.g., upload it to a server)
    // For simplicity, this example doesn't include actual image processing.
  };

  const handleDeleteArticle = (articleId) => {
    const updatedArticles = articles.filter(
      (article) => article.id !== articleId
    );
    setArticles(updatedArticles);
  };

  const filteredArticles = articles.filter((article) => {
    // Check if the article's title, body, or author includes the search text
    return (
      (article.title && article.title.includes(searchText)) ||
      (article.body && article.body.includes(searchText)) ||
      (article.author && article.author.includes(searchText))
    );
  });

  const handleCommentClick = (articleId) => {
    if (commentedArticleId === articleId) {
      // If comments are already displayed, hide them
      setCommentedArticleId(null);
    } else {
      // Show comments for the selected article
      setCommentedArticleId(articleId);
    }
  };

  const generateFakeComments = () => {
    return [
      { id: 1, text: "Lorem ipsum dolor sit amet.", user: "Ben" },
      { id: 2, text: "Lorem ipsum dolor sit amet consectetur.", user: "Linda" },
    ];
  };

  const sortedArticles = filteredArticles.slice().sort((a, b) => {
    // Convert the timestamps to Date objects for comparison
    const timestampA = new Date(a.timestamp);
    const timestampB = new Date(b.timestamp);

    // Compare the timestamps in descending order
    return timestampB - timestampA;
  });

  return (
    <div className="container">
      <div className="row col-10 mx-auto">
        <textarea
          value={newArticle}
          onChange={(e) => setNewArticle(e.target.value)}
          placeholder="Write a new article..."
        />
        <div className="row justify-content-evenly">
          <button className="col-md-3" onClick={handlePostArticle}>
            Post
          </button>
          <button className="col-md-3" onClick={handleCancelArticle}>
            Cancel
          </button>
          <input
            className="col-md-3"
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
          />
        </div>
      </div>
      <br />
      <div className="container text-center">
        <div className="row justify-content-center">
          <div className="col-md-6">
            <input
              type="text"
              className="form-control"
              placeholder="Search by text"
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
            />
            <br />
          </div>
        </div>
      </div>
      <div className="row col-10 mx-auto">
        {sortedArticles.map((article) => (
          <div className="border p-3 mb-3" key={article.id}>
            <h3>{article.title}</h3>
            <p>{article.body}</p>
            <p>Author: {article.author}</p>
            <p>Timestamp: {new Date(article.timestamp).toLocaleString()}</p>
            <img src={article.imageUrl} alt="Article" />
            <br />
            <br />
            <button className="btn btn-info mx-2">Edit</button>
            <button
              className="btn btn-success mx-2"
              onClick={() => handleCommentClick(article.id)}
            >
              Comment
            </button>
            <button
              className="btn btn-danger"
              onClick={() => handleDeleteArticle(article.id)}
            >
              Delete
            </button>
            {commentedArticleId === article.id && (
              <div className="comments">
                <br />
                {generateFakeComments().map((comment) => (
                  <div key={comment.id} className="comment">
                    <p>
                      {comment.user}: {comment.text}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Posts;

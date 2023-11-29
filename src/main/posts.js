import React, { useState } from "react";

const Posts = () => {
  const [articles, setArticles] = useState([]);
  const [newArticle, setNewArticle] = useState("");
  const [newArticleImage, setNewArticleImage] = useState(null);
  const [fileInputKey, setFileInputKey] = useState(Date.now());
  const [searchText, setSearchText] = useState("");
  const [commentedArticleId, setCommentedArticleId] = useState(null);

  // Retrieve user data from localStorage
  let userData = localStorage.getItem("user");
  if (!userData) {
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

  // Function to handle the posting of a new article
  const handlePostArticle = () => {
    const newArticleObject = {
      id: Date.now(),
      userId: userData.id,
      title: newArticle,
      body: newArticle,
      author: userData.username,
      imageUrl: newArticleImage ? URL.createObjectURL(newArticleImage) : null,
      timestamp: new Date().toISOString(),
    };

    setArticles([newArticleObject, ...articles]);
    setNewArticle("");
    setNewArticleImage(null);
    setFileInputKey(Date.now()); // Reset the file input
  };

  // Function to handle image uploads
  const handleImageUpload = (e) => {
    const selectedImage = e.target.files[0];
    setNewArticleImage(selectedImage);
  };

  // Function to cancel the current article creation
  const handleCancelArticle = () => {
    setNewArticle("");
    setNewArticleImage(null);
    setFileInputKey(Date.now());
  };

  // Function to delete an article
  const handleDeleteArticle = (articleId) => {
    setArticles(articles.filter((article) => article.id !== articleId));
  };

  // Function to toggle the display of comments
  const handleCommentClick = (articleId) => {
    setCommentedArticleId(commentedArticleId === articleId ? null : articleId);
  };

  // Generate fake comments
  const generateFakeComments = () => {
    return [
      { id: 1, text: "Great post!", user: "Alice" },
      { id: 2, text: "Interesting perspective.", user: "Bob" },
    ];
  };

  // Filter and sort articles
  const sortedArticles = articles
    .filter(
      (article) =>
        article.title.includes(searchText) ||
        article.body.includes(searchText) ||
        article.author.includes(searchText)
    )
    .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

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
            key={fileInputKey}
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
            {article.imageUrl && (
              <img
                src={article.imageUrl}
                alt="Article"
                className="article-image"
              />
            )}
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

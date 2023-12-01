import React, { useState, useEffect } from "react";

const Posts = ({ fetchTrigger }) => {
  const [articles, setArticles] = useState([]);
  const [newArticle, setNewArticle] = useState("");
  const [newArticleImage, setNewArticleImage] = useState(null);
  const [editingArticleId, setEditingArticleId] = useState(null);
  const [editedContent, setEditedContent] = useState("");
  const [fileInputKey, setFileInputKey] = useState(Date.now());
  const [searchText, setSearchText] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [articlesPerPage] = useState(10);
  const [commentedArticleId, setCommentedArticleId] = useState(null);

  // Retrieve user data from localStorage and parse it
  const getUserData = () => {
    const userDataString = localStorage.getItem("user");
    return userDataString ? JSON.parse(userDataString) : null;
  };

  const currentUser = getUserData();

  // Function to fetch articles
  const fetchArticles = (username) => {
    fetch(`${process.env.REACT_APP_BACKEND_URL}/articles/${username}`, {
      credentials: "include", // if your backend requires cookies or session
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to fetch articles");
        }
        return response.json();
      })
      .then((data) => {
        const fetchedArticles = data.articles.map((article) => ({
          id: article.pid,
          body: article.text,
          author: article.author,
          imageUrl: article.image ? article.image.url : "",
          timestamp: article.date,
        }));
        setArticles(fetchedArticles);
      })
      .catch((error) => {
        console.error("Error fetching articles:", error);
      });
  };

  // Fetch articles when component mounts or when username changes
  useEffect(() => {
    const userData = getUserData();
    if (userData && userData.username) {
      fetchArticles(userData.username);
    }
  }, [fetchTrigger]);

  // Function to handle the posting of a new article
  const handlePostArticle = () => {
    // Create a temporary new article object
    const tempNewArticle = {
      id: Date.now(), // Temporary unique ID
      body: newArticle,
      author: currentUser.username, // Use username from currentUser
      imageUrl: newArticleImage ? URL.createObjectURL(newArticleImage) : "",
      timestamp: new Date().toISOString(),
    };

    // Optimistically update the UI with the new article
    setArticles([tempNewArticle, ...articles]);

    // Reset the form fields
    setNewArticle("");
    setNewArticleImage(null);
    setFileInputKey(Date.now());

    // Now proceed to upload the new article to the backend
    const formData = new FormData();
    formData.append("text", newArticle);
    if (newArticleImage) {
      formData.append("image", newArticleImage);
    }

    fetch(`${process.env.REACT_APP_BACKEND_URL}/article`, {
      method: "POST",
      body: formData,
      credentials: "include",
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to post article");
        }
        return response.json();
      })
      .then((data) => {
        // Replace the temporary article with the one from the backend
        setArticles((prevArticles) => {
          return prevArticles.map((article) =>
            article.id === tempNewArticle.id
              ? { ...article, id: data.pid } // Replace temp ID with actual ID from backend
              : article
          );
        });
      })
      .catch((error) => {
        console.error("Error posting article:", error);
        // Optionally, remove the temporary article if the post fails
        setArticles((prevArticles) =>
          prevArticles.filter((article) => article.id !== tempNewArticle.id)
        );
      });
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

  const handleEditArticle = (articleId) => {
    const articleToEdit = articles.find((article) => article.id === articleId);
    setEditingArticleId(articleId);
    setEditedContent(articleToEdit.body);
  };

  // Function to update an article in the backend
  const updateArticleBackend = (articleId, updatedText) => {
    fetch(`${process.env.REACT_APP_BACKEND_URL}/articles/${articleId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({ text: updatedText }),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to update article");
        }
        return response.json();
      })
      .then((data) => {
        // Update articles state with the updated article
        setArticles(
          articles.map((article) => {
            if (article.id === articleId) {
              return { ...article, body: updatedText };
            }
            return article;
          })
        );
      })
      .catch((error) => {
        console.error("Error updating article:", error);
      });
  };

  // Function to handle updating the article
  const handleUpdateArticle = () => {
    updateArticleBackend(editingArticleId, editedContent);
    setEditingArticleId(null);
    setEditedContent("");
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

  // Filter articles based on search text
  const filteredArticles = articles.filter((article) => {
    return (
      article.body.toLowerCase().includes(searchText.toLowerCase()) ||
      article.author.toLowerCase().includes(searchText.toLowerCase())
    );
  });

  // Get current articles for pagination
  const indexOfLastArticle = currentPage * articlesPerPage;
  const indexOfFirstArticle = indexOfLastArticle - articlesPerPage;
  const currentArticles = filteredArticles.slice(
    indexOfFirstArticle,
    indexOfLastArticle
  );

  // Change page
  const paginate = (pageNumber) => setCurrentPage(pageNumber);
  const totalPages = Math.ceil(filteredArticles.length / articlesPerPage);

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
      {/* Display articles */}
      <div className="row col-10 mx-auto">
        {currentArticles.map((article) => (
          <div className="border p-3 mb-3" key={article.id}>
            {/* Editing logic */}
            {editingArticleId === article.id ? (
              <textarea
                value={editedContent}
                onChange={(e) => setEditedContent(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    handleUpdateArticle();
                  }
                }}
              />
            ) : (
              <p>{article.body}</p>
            )}
            {/* Article details */}
            <p>Author: {article.author}</p>
            <p>Timestamp: {new Date(article.timestamp).toLocaleString()}</p>
            {/* Image display logic */}
            {article.imageUrl && (
              <img
                src={article.imageUrl}
                alt="Article"
                className="article-image"
              />
            )}
            <br />
            <br />
            {/* Conditionally render Edit and Delete buttons for user's own articles */}
            {currentUser && article.author === currentUser.username && (
              <div>
                {editingArticleId === article.id ? (
                  <button
                    className="btn btn-success mx-2"
                    onClick={handleUpdateArticle}
                  >
                    Update
                  </button>
                ) : (
                  <>
                    <button
                      className="btn btn-info mx-2"
                      onClick={() => handleEditArticle(article.id)}
                    >
                      Edit
                    </button>
                    <button
                      className="btn btn-danger mx-2"
                      onClick={() => handleDeleteArticle(article.id)}
                    >
                      Delete
                    </button>
                  </>
                )}
              </div>
            )}

            {/* Always render Comment button */}
            <br />
            <button
              className="btn btn-success mx-2"
              onClick={() => handleCommentClick(article.id)}
            >
              Comment
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
      {/* Pagination Controls */}
      <nav>
        <ul className="pagination d-flex justify-content-center">
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((number) => (
            <li key={number} className="page-item">
              <a
                onClick={(e) => {
                  e.preventDefault();
                  paginate(number);
                }}
                href="!#"
                className="page-link"
              >
                {number}
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
};

export default Posts;

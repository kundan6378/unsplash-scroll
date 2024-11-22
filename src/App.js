import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [photos, setPhotos] = useState([]); // State to store the list of photos fetched from Unsplash
  const [loading, setLoading] = useState(false); // State to track if new photos are being loaded
  const [page, setPage] = useState(1); // State to track the current page of photos
  const [error, setError] = useState(null); // State to store any error message from the API

  const observer = useRef(); // This will hold a reference to the IntersectionObserver instance

  // Function to fetch more photos from the Unsplash API
  const loadMorePhotos = () => {
    setLoading(true); // Set loading to true to show the loading message
    axios
      .get(`https://api.unsplash.com/photos?page=${page}&client_id=vPiTYe1heLAmufKHCO2ddTsXVQ2r_QrzFMOERAYWCCA`) // API call to fetch photos
      .then(response => {
        setPhotos(prevPhotos => [...prevPhotos, ...response.data]); // Add new photos to the existing list
        setPage(prevPage => prevPage + 1); // Increase the page number for next request
        setLoading(false); // Set loading to false once photos are fetched
      })
      .catch(err => {
        setError('Failed to load images'); // Set error if the API request fails
        setLoading(false); // Stop loading even if there's an error
      });
  };

  // This effect runs once when the component is mounted (empty dependency array means it runs only once)
  useEffect(() => {
    loadMorePhotos(); // Load photos when the component is mounted
  }, []);

  // Function to handle the IntersectionObserver logic
  const lastPhotoElementRef = (node) => {
    // If photos are currently being loaded, don't do anything.
    if (loading) return;

    // If there is already an observer, disconnect it to avoid multiple observers.
    if (observer.current) observer.current.disconnect();

    // Create a new IntersectionObserver to watch the "last photo" when it comes into view
    observer.current = new IntersectionObserver((entries) => {
      // If the observed element (last photo) is visible, load more photos
      if (entries[0].isIntersecting) {
        loadMorePhotos();
      }
    });

    // Start observing the "last photo" if the node exists
    if (node) observer.current.observe(node);
  };

  return (
    <div className="App">
      {error && <p>{error}</p>} {/* Show error message if there was an issue fetching images */}
      <div className="gallery">
        {/* Loop through all photos and render each one */}
        {photos.map((photo, index) => (
          <div
            key={photo.id} // Each photo gets a unique key for React to efficiently re-render
            ref={index === photos.length - 1 ? lastPhotoElementRef : null} // Add the observer to the last photo only
            className="photo-card"
          >
            <img src={photo.urls.small} alt={photo.alt_description} /> {/* Display the photo */}
            <p>{photo.user.name}</p> {/* Display the photographer's name */}
          </div>
        ))}
      </div>
      {loading && <p>Loading...</p>} {/* Show "Loading..." message while fetching new photos */}
    </div>
  );
}

export default App;

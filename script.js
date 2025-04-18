document.addEventListener('DOMContentLoaded', function () {

    // Simple logout functionality
    document.getElementById('logout-btn').addEventListener('click', () => {
        localStorage.removeItem('userEmail');
        localStorage.removeItem('username');
        window.location.href = "start.html";
    });

    // DOM Elements - Get all the important elements we'll need to manipulate
    const createPostBtn = document.getElementById('createPostBtn');
    const createPostModal = document.getElementById('createPostModal');
    const closeModal = document.getElementById('closeModal');
    const postForm = document.getElementById('postForm');
    const postContainer = document.querySelector('.post-container');
    const postDetailModal = document.getElementById('postDetailModal');
    const closeDetailModal = document.getElementById('closeDetailModal');
    const detailTitle = document.getElementById('detailTitle');
    const detailDate = document.getElementById('detailDate');
    const detailDescription = document.getElementById('detailDescription');
    const detailAuthor = document.getElementById('detailAuthor');
    const postCreatedMessage = document.getElementById('postCreatedMessage');
    
    // DOM Elements for sharing
function addSharingFeature() {
    // Create sharing buttons for each post
    document.querySelectorAll('.post-box').forEach(post => {
        // Check if sharing buttons already exist
        if (!post.querySelector('.share-buttons')) {
            // Create sharing container
            const shareContainer = document.createElement('div');
            shareContainer.className = 'share-buttons';
            
            // Get post data from the read more button
            const readMoreBtn = post.querySelector('.load-more');
            const postTitle = readMoreBtn.getAttribute('data-title');
            const postAuthor = readMoreBtn.getAttribute('data-author');
            
            // Share via methods
            const shareText = `Check out this post: "${postTitle}" by ${postAuthor} on VibeHive!`;
            const encodedText = encodeURIComponent(shareText);
            
            // Set sharing HTML
            shareContainer.innerHTML = `
                <div class="share-heading">Share this post:</div>
                <button class="share-btn twitter-share" title="Share on Twitter">
                    <i class="fab fa-twitter"></i>
                </button>
                <button class="share-btn facebook-share" title="Share on Facebook">
                    <i class="fab fa-facebook-f"></i>
                </button>
                <button class="share-btn linkedin-share" title="Share on LinkedIn">
                    <i class="fab fa-linkedin-in"></i>
                </button>
                <button class="share-btn email-share" title="Share via Email">
                    <i class="fas fa-envelope"></i>
                </button>
                <button class="share-btn copy-link" title="Copy link">
                    <i class="fas fa-link"></i>
                </button>
            `;
            
            // Insert before delete button
            const deleteBtn = post.querySelector('.delete-post');
            if (deleteBtn) {
                deleteBtn.parentNode.insertBefore(shareContainer, deleteBtn);
            } else {
                post.appendChild(shareContainer);
            }
            
            // Add event listeners to share buttons
            const twitterShare = shareContainer.querySelector('.twitter-share');
            const facebookShare = shareContainer.querySelector('.facebook-share');
            const linkedinShare = shareContainer.querySelector('.linkedin-share');
            const emailShare = shareContainer.querySelector('.email-share');
            const copyLink = shareContainer.querySelector('.copy-link');
            
            // Generate a unique ID for the post for URL sharing
            const postId = btoa(postTitle + '-' + postAuthor).replace(/=/g, '');
            const shareUrl = `${window.location.origin}${window.location.pathname}?post=${postId}`;
            
            // Store post data for URL sharing
            storePostData(postId, postTitle, readMoreBtn.getAttribute('data-date'), 
                          postAuthor, readMoreBtn.getAttribute('data-description'));
            
            // Twitter share
            twitterShare.addEventListener('click', () => {
                window.open(`https://twitter.com/intent/tweet?text=${encodedText}&url=${encodeURIComponent(shareUrl)}`, 
                           '_blank');
            });
            
            // Facebook share
            facebookShare.addEventListener('click', () => {
                window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`, 
                           '_blank');
            });
            
            // LinkedIn share
            linkedinShare.addEventListener('click', () => {
                window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`, 
                           '_blank');
            });
            
            // Email share
            emailShare.addEventListener('click', () => {
                window.location.href = `mailto:?subject=${encodeURIComponent('Check out this post on VibeHive!')}&body=${encodedText}%0A%0A${encodeURIComponent(shareUrl)}`;
            });
            
            // Copy link to clipboard
            copyLink.addEventListener('click', () => {
                navigator.clipboard.writeText(shareUrl).then(() => {
                    // Show copied message
                    const copyMsg = document.createElement('span');
                    copyMsg.className = 'copy-message';
                    copyMsg.textContent = 'Link copied!';
                    copyLink.appendChild(copyMsg);
                    
                    // Remove message after 2 seconds
                    setTimeout(() => {
                        copyMsg.remove();
                    }, 2000);
                });
            });
        }
    });
}

// Function to store post data in localStorage for URL sharing
function storePostData(postId, title, date, author, description) {
    // Get existing shared posts or initialize empty object
    let sharedPosts = JSON.parse(localStorage.getItem('vibehiveSharedPosts')) || {};
    
    // Add/update post data
    sharedPosts[postId] = {
        title: title,
        date: date,
        author: author,
        description: description
    };
    
    // Save back to localStorage
    localStorage.setItem('vibehiveSharedPosts', JSON.stringify(sharedPosts));
}

// Function to check URL parameters for shared posts
function checkForSharedPost() {
    const urlParams = new URLSearchParams(window.location.search);
    const postId = urlParams.get('post');
    
    if (postId) {
        // Get shared posts from localStorage
        const sharedPosts = JSON.parse(localStorage.getItem('vibehiveSharedPosts')) || {};
        const postData = sharedPosts[postId];
        
        if (postData) {
            // Open the post detail modal
            openPostDetail(postData.title, postData.date, postData.description, postData.author);
        }
    }
}

// Add sharing buttons to new posts
const addPostEventListenersOriginal = addPostEventListeners;
addPostEventListeners = function(postElement) {
    // Call the original function first
    addPostEventListenersOriginal(postElement);
    
    // Add sharing buttons
    addSharingFeature();
};

// Initialize sharing buttons on page load
addSharingFeature();

// Check for shared posts when page loads
checkForSharedPost();

    // Check if user is logged in
    const userEmail = localStorage.getItem('userEmail');
    if (!userEmail) {
        // Redirect to login if no user email found
        //alert("Please log in to access this page.");
        //window.location.href = "login.html";
        console.log("No user logged in, some features may be limited");
    }
    
    //CREATE POST FUNCTIONALITY
    
    // Open Create Post Modal when the "Create Post" button is clicked
    createPostBtn.addEventListener('click', function () {
        createPostModal.style.display = 'flex';
    });
    
    // Close Create Post Modal with animation when X is clicked
    closeModal.addEventListener('click', function () {
        createPostModal.classList.add('fadeOut');
        setTimeout(() => {
            createPostModal.style.display = 'none';
            createPostModal.classList.remove('fadeOut');
        }, 300); // Wait time for animation to complete (300ms)
    });
    
    // Close modal when clicking outside the modal content
    window.addEventListener('click', function(event) {
        if (event.target === createPostModal) {
            createPostModal.classList.add('fadeOut');
            setTimeout(() => {
                createPostModal.style.display = 'none';
                createPostModal.classList.remove('fadeOut');
            }, 300);
        }
        if (event.target === postDetailModal) {
            postDetailModal.classList.add('fadeOut');
            setTimeout(() => {
                postDetailModal.style.display = 'none';
                postDetailModal.classList.remove('fadeOut');
            }, 300);
        }
    });
    
    // Submit Post Form - Create a new blog post
    postForm.addEventListener('submit', function (event) {
        event.preventDefault(); // Prevent the default form submission behavior
        
        // Form Validation - Get values from form fields
        const postCategory = document.getElementById('postCategory').value;
        const postTitle = document.getElementById('postTitle').value;
        const postDescription = document.getElementById('postDescription').value;
        
        // Simple validation to ensure fields aren't empty
        if (postCategory.trim() === '' || postTitle.trim() === '' || postDescription.trim() === '') {
            alert('Please fill out all fields.');
            return;
        }
        
        // Current Date Formatting for display
        const currentDate = new Date();
        const day = currentDate.getDate();
        const month = currentDate.toLocaleString('default', { month: 'short' });
        const year = currentDate.getFullYear();
        const formattedDate = `${day} ${month} ${year}`;
        
        // Get author email from localStorage
        const authorEmail = localStorage.getItem('userEmail') || 'Anonymous';
        
        // Create New Post Element
        const newPost = document.createElement('div');
        newPost.className = 'post-box';
        
        // Prepare shortened description (show first 150 chars)
        const shortDescription = postDescription.length > 150
            ? postDescription.substring(0, 150) + '...'
            : postDescription;
        
        // Populate HTML Content for the new post
        newPost.innerHTML = `
            <h1 class="post-title">${postTitle}</h1><br>
            <h2 class="category">${postCategory}</h2><br>
            <span class="post-date">${formattedDate}</span>
            <span class="post-author">By: ${authorEmail}</span>
            <p class="post-description">${shortDescription}</p>
            <span class="load-more" data-title="${postTitle}" data-date="${formattedDate}" data-author="${authorEmail}" data-description="${postDescription.replace(/"/g, '&quot;')}">Read more</span>
            <div>
                <button class="delete-post">Delete</button>
            </div>
        `;
        
        // Add the new post to the beginning of the container
        postContainer.insertBefore(newPost, postContainer.firstChild);
        
        // Save post to localStorage (persistent storage)
        savePostToLocalStorage(postTitle, postCategory, postDescription, formattedDate, authorEmail);
        
        // Reset form fields
        postForm.reset();
        
        // Close the modal with animation
        createPostModal.classList.add('fadeOut');
        setTimeout(() => {
            createPostModal.style.display = 'none';
            createPostModal.classList.remove('fadeOut');
        }, 300);
        
        // Show success message
        postCreatedMessage.style.display = 'block';
        
        // Hide success message after 3 seconds
        setTimeout(() => {
            postCreatedMessage.style.display = 'none';
        }, 3000);
        
        // Add event listeners to the new post elements
        addPostEventListeners(newPost);
    });
    
    // ====== POST DETAIL VIEW FUNCTIONALITY ======
    
    // Close Post Detail Modal when X is clicked
    closeDetailModal.addEventListener('click', function () {
        postDetailModal.classList.add('fadeOut');
        setTimeout(() => {
            postDetailModal.style.display = 'none';
            postDetailModal.classList.remove('fadeOut');
        }, 300);
    });
    
    // Function to open post detail modal
    function openPostDetail(title, date, description, author) {
        // Populate the modal with post details
        detailTitle.textContent = title;
        detailDate.textContent = date;
        detailDescription.textContent = description;
        detailAuthor.textContent = `By: ${author || 'Anonymous'}`;
        
        // Display the modal
        postDetailModal.style.display = 'flex';
    }
    
    // ====== LOCAL STORAGE FUNCTIONALITY ======
    
    // Save post to localStorage for data persistence
    function savePostToLocalStorage(title, category, description, date, author) {
        // Get existing posts or initialize empty array
        let posts = JSON.parse(localStorage.getItem('vibehivePosts')) || [];
        
        // Add new post to array
        posts.unshift({
            title: title,
            category: category,
            description: description,
            date: date,
            author: author
        });
        
        // Save updated array back to localStorage
        localStorage.setItem('vibehivePosts', JSON.stringify(posts));
    }
    
    // Load posts from localStorage on page load
    function loadPostsFromLocalStorage() {
        // Get posts from localStorage
        const posts = JSON.parse(localStorage.getItem('vibehivePosts')) || [];
        
        // Create HTML elements for each saved post
        posts.forEach(post => {
            const newPost = document.createElement('div');
            newPost.className = 'post-box';
            
            // Prepare shortened description
            const shortDescription = post.description.length > 150
                ? post.description.substring(0, 150) + '...'
                : post.description;
            
            // Create post HTML
            newPost.innerHTML = `
                <h1 class="post-title">${post.title}</h1><br>
                <h2 class="category">${post.category}</h2><br>
                <span class="post-date">${post.date}</span>
                <span class="post-author">By: ${post.author || 'Anonymous'}</span>
                <p class="post-description">${shortDescription}</p>
                <span class="load-more" data-title="${post.title}" data-date="${post.date}" data-author="${post.author || 'Anonymous'}" data-description="${post.description.replace(/"/g, '&quot;')}">Read more</span>
                <div>
                    <button class="delete-post">Delete</button>
                </div>
            `;
            
            // Add post to container
            postContainer.appendChild(newPost);
            
            // Add event listeners to the post
            addPostEventListeners(newPost);
        });
    }
    
    // Function to remove post from localStorage
    function removePostFromLocalStorage(title, date) {
        // Get existing posts
        let posts = JSON.parse(localStorage.getItem('vibehivePosts')) || [];
        
        // Filter out the post to be removed
        posts = posts.filter(post => !(post.title === title && post.date === date));
        
        // Save updated array back to localStorage
        localStorage.setItem('vibehivePosts', JSON.stringify(posts));
    }
    
    // ====== EVENT LISTENERS FOR POSTS ======
    
    // Add event listeners to sample post
    const samplePost = document.querySelector('.post-box');
    if (samplePost) {
        addPostEventListeners(samplePost);
    }
    
    // Function to add event listeners to post elements
    function addPostEventListeners(postElement) {
        // "Read more" functionality
        const readMoreBtn = postElement.querySelector('.load-more');
        if (readMoreBtn) {
            readMoreBtn.addEventListener('click', function() {
                const title = this.getAttribute('data-title');
                const date = this.getAttribute('data-date');
                const description = this.getAttribute('data-description');
                const author = this.getAttribute('data-author');
                openPostDetail(title, date, description, author);
            });
        }
        
        // Post title click to view detail
        const postTitle = postElement.querySelector('.post-title');
        if (postTitle) {
            postTitle.addEventListener('click', function() {
                // If title has data attributes, use them
                if (this.hasAttribute('data-title')) {
                    const title = this.getAttribute('data-title');
                    const date = this.getAttribute('data-date');
                    const description = this.getAttribute('data-description');
                    const author = this.getAttribute('data-author');
                    openPostDetail(title, date, description, author);
                } else {
                    // Otherwise use the closest read more button's data
                    const readMore = this.closest('.post-box').querySelector('.load-more');
                    if (readMore) {
                        const title = readMore.getAttribute('data-title');
                        const date = readMore.getAttribute('data-date');
                        const description = readMore.getAttribute('data-description');
                        const author = readMore.getAttribute('data-author');
                        openPostDetail(title, date, description, author);
                    }
                }
            });
            
            // Add cursor pointer style
            postTitle.style.cursor = 'pointer';
        }
        
        // Delete post functionality
        const deleteBtn = postElement.querySelector('.delete-post');
        if (deleteBtn) {
            deleteBtn.addEventListener('click', function() {
                // Get post details for removal from localStorage
                const readMore = this.closest('.post-box').querySelector('.load-more');
                if (readMore) {
                    const title = readMore.getAttribute('data-title');
                    const date = readMore.getAttribute('data-date');
                    const author = readMore.getAttribute('data-author');
                    const currentUser = localStorage.getItem('userEmail');
                    
                    // Check if current user is the author of the post
                    if (author !== currentUser && author !== 'Anonymous') {
                        alert("You can only delete your own posts!");
                        return;
                    }
                    
                    // Confirm deletion
                    if (confirm(`Are you sure you want to delete "${title}"?`)) {
                        // Remove post from DOM
                        this.closest('.post-box').remove();
                        
                        // Remove from localStorage
                        removePostFromLocalStorage(title, date);
                        
                        // Show confirmation message
                        postCreatedMessage.textContent = 'Post deleted successfully!';
                        postCreatedMessage.style.display = 'block';
                        
                        // Hide message after 3 seconds
                        setTimeout(() => {
                            postCreatedMessage.style.display = 'none';
                            postCreatedMessage.textContent = 'Post published successfully!';
                        }, 3000);
                    }
                }
            });
        }
    }
    
    // ====== INITIALIZE APPLICATION ======
    
    // Load posts from localStorage when page loads
    loadPostsFromLocalStorage();
    
});
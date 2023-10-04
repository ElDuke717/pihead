const posts = [
    {
        title: "Blog Post Title #1",
        date: "October 4, 2023",
        author: "Nick",
        content: "This is the content of the first blog post. ..."
    },
    {
        title: "Blog Post Title #2",
        date: "October 3, 2023",
        author: "Nick",
        content: "This is the content of the second blog post. ..."
    },
    // ... add more posts as objects
];


const mainSection = document.querySelector("main");

posts.map(post => {
    const article = document.createElement("article");

    article.innerHTML = `
        <h2>${post.title}</h2>
        <p>Posted on ${post.date} by ${post.author}</p>
        <p>${post.content}</p>
    `;

    mainSection.appendChild(article);

    const hr = document.createElement("hr");
    mainSection.appendChild(hr);
});

console.log('Welcome to Central Virginia Raspberry Pi!');

// blog posts - add an object to add a post
let posts = [
    {
        title: "The first site ever hosted on a Raspberry Pi",
        date: "October 4, 2023",
        author: "Nick",
        content: "I have never put together a self-hosted site before, so I decided to test out whether or not my unused Raspberry Pi 3B could do it.  Turns out it can!"
    },
    {
        title: "Simple JavaScript Posts - need to build a backend",
        date: "October 4, 2023",
        author: "Nick",
        content: "Hosting all these posts will probably be way to difficult to manage with simple javascript, so we need to come up with a different solution!"
    },
    {
        title: "The second day blogging",
        date: "October 5, 2023",
        author: "Nick",
        content: "This is the second day blogging on the raspberry pi! It's definitely fall here, the leavees are just starting to turn and it was cool and foggy this morning in Chesterfield."
    },
// ... add more posts as objects
];


const mainSection = document.querySelector("main");

//sort posts based on the most recent
posts = posts.sort((a, b) => new Date(b.date) - new Date(a.date));


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

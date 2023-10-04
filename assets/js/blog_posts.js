const posts = [
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

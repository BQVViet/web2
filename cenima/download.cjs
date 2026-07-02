const https = require('https');
const fs = require('fs');

const file = fs.createWriteStream("d:/web2/cenima/public/images/mai.jpg");
const options = {
  headers: {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'
  }
};

https.get("https://bhdstar.vn/wp-content/uploads/2024/02/Mai-Poster.jpg", options, function(response) {
  response.pipe(file);
  file.on("finish", () => {
    file.close();
    console.log("Download Completed");
  });
}).on("error", (err) => {
  console.log("Error: ", err.message);
});

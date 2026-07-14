const https = require('https');
const fs = require('fs');
const path = require('path');

const targetDir = "d:/web2/cenima/public/images";

const imagesToDownload = [
  {
    name: 'mai.jpg',
    url: 'https://upload.wikimedia.org/wikipedia/vi/a/a8/Mai_2024_poster.jpg'
  },
  {
    name: 'godzilla_x_kong.jpg',
    url: 'https://upload.wikimedia.org/wikipedia/vi/9/9f/Qu%C3%A1i_v%E1%BA%ADt_ch%C3%BAa_Godzilla_x_Kong_-_%C4%90%E1%BA%BF_ch%E1%BA%BF_m%E1%BB%9Bi_Poster.jpg'
  },
  {
    name: 'dune_2.jpg',
    url: 'https://upload.wikimedia.org/wikipedia/vi/8/8e/Dune_Part_Two_poster.jpeg'
  },
  {
    name: 'kung_fu_panda_4.jpg',
    url: 'https://upload.wikimedia.org/wikipedia/vi/7/7f/Kung_Fu_Panda_4_poster.jpg'
  },
  {
    name: 'exhuma.jpg',
    url: 'https://upload.wikimedia.org/wikipedia/vi/5/5e/Exhuma_poster.jpg'
  },
  {
    name: 'popcorn.jpg',
    url: 'https://images.unsplash.com/photo-1578849278619-e73505e9610f?w=600'
  },
  {
    name: 'pepsi.jpg',
    url: 'https://images.unsplash.com/photo-1622483767028-3f66f32aef97?w=600'
  },
  {
    name: 'combo.jpg',
    url: 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?w=600'
  }
];

const options = {
  headers: {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
  }
};

function download(item) {
  return new Promise((resolve, reject) => {
    const dest = path.join(targetDir, item.name);
    const file = fs.createWriteStream(dest);
    
    https.get(item.url, options, function(response) {
      if (response.statusCode === 302 || response.statusCode === 301) {
        // Handle redirect
        https.get(response.headers.location, options, function(redirectResponse) {
          redirectResponse.pipe(file);
          file.on('finish', () => {
            file.close();
            console.log(`Downloaded: ${item.name}`);
            resolve();
          });
        });
      } else {
        response.pipe(file);
        file.on('finish', () => {
          file.close();
          console.log(`Downloaded: ${item.name}`);
          resolve();
        });
      }
    }).on('error', (err) => {
      fs.unlink(dest, () => {});
      console.error(`Error downloading ${item.name}: ${err.message}`);
      reject(err);
    });
  });
}

async function run() {
  console.log("Starting image downloads...");
  for (const item of imagesToDownload) {
    try {
      await download(item);
    } catch (e) {
      console.log(`Failed to download ${item.name}`);
    }
  }
  console.log("Finished all downloads.");
}

run();

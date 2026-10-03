const fs = require('fs');
const path = require('path');
const cheerio = require('cheerio');

// Các thư mục cần đọc
const directories = ['detail', 'more-game'];
const baseDir = __dirname;
const outputDir = path.join(__dirname, 'output_json');

// Tạo thư mục output nếu chưa có
if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
}

const slugToImageMap = {};
const allGamesData = [];

// Giai đoạn 1: Đọc và parse tất cả các file HTML, lưu trữ tạm thời các URL ảnh đúng
directories.forEach(dir => {
    const dirPath = path.join(baseDir, dir);
    if (!fs.existsSync(dirPath)) return;

    const files = fs.readdirSync(dirPath).filter(file => file.endsWith('.html'));

    files.forEach(file => {
        const filePath = path.join(dirPath, file);
        const html = fs.readFileSync(filePath, 'utf8');
        const $ = cheerio.load(html);

        // 1. Trích xuất SEO
        const seoTitle = $('title').text().trim();
        
        // 2. Trích xuất Game Title
        let gameTitle = $('article h1').text().trim() || $('article h2').text().trim();
        if (!gameTitle) gameTitle = $('h2.kiEtEc').text().trim() || seoTitle;

        // 3. Trích xuất Description
        let descText = '';
        const paragraphs = [];
        $('article div').each((i, el) => {
            const text = $(el).text().trim();
            if (text) {
                paragraphs.push(text);
                if (!descText) descText = text;
            }
        });

        // 4. Trích xuất Thumbnail/Image gốc
        let thumbnail = '';
        const fallbackImg = $('.sc-1thi3bz-7 img').attr('src') || $('.talpa-splash-top div div').css('--thumb');
        if (fallbackImg) {
            thumbnail = fallbackImg.replace('url(', '').replace(')', '').replace(/"/g, '').replace(/'/g, '');
        }

        // 5. Trích xuất iframe URL
        const iframeUrl = $('#game-arena').attr('data-url') || '';

        // Xử lý logic: Nếu thumbnail không chứa eggycaronline.io thì dùng iframeUrl + logo.png
        let correctThumbnail = thumbnail;
        if (correctThumbnail && !correctThumbnail.includes('eggycaronline.io')) {
            if (iframeUrl) {
                correctThumbnail = iframeUrl.endsWith('/') ? iframeUrl + 'logo.png' : iframeUrl + '/logo.png';
            }
        }

        // 6. Trích xuất Tags/Category
        const cat = $('#cat').val() || 'Action';
        const tags = [cat];

        // 7. Trích xuất Similar Games
        const similarGames = [];
        $('a').has('.global-cq-title').each((i, el) => {
            const href = $(el).attr('href');
            const simSlug = href ? href.split('/').pop().replace('.html', '') : '';
            const img = $(el).find('img').attr('src');
            const title = $(el).find('.global-cq-title').text().trim();
            
            similarGames.push({
                title: title,
                slug: simSlug,
                category: "Unknown", 
                imageUrl: img,
                imageAltText: title,
                badge: null
            });
        });

        const slug = file.replace('.html', '');
        
        // Lưu correctThumbnail vào bảng tra cứu bằng slug
        slugToImageMap[slug] = correctThumbnail;

        // Nếu iframeUrl không chứa chữ "flash" thì không đưa vào danh sách xuất file
        if (!iframeUrl.includes('flash')) {
            return;
        }

        // Xây dựng khung JSON cơ bản (chưa replace similar games)
        const jsonStructure = {
            "seo": {
                "title": seoTitle,
                "description": descText,
                "canonicalUrl": `/${dir}/${file}`,
                "ogImage": correctThumbnail,
                "ogType": "article"
            },
            "game": {
                "title": gameTitle,
                "version": "1.0.0",
                "tags": tags,
                "iframeUrl": iframeUrl,
                "thumbnailUrl": correctThumbnail,
                "thumbnailAlt": gameTitle,
                "playButtonLabel": "Play",
                "hud": {
                    "fps": "",
                    "ping": "",
                    "server": ""
                }
            },
            "gameSchema": {
                "@context": "https://schema.org",
                "@type": "VideoGame",
                "name": gameTitle,
                "description": descText,
                "genre": tags,
                "applicationCategory": "Game",
                "operatingSystem": "Web Browser",
                "offers": {
                    "@type": "Offer",
                    "price": "0",
                    "priceCurrency": "USD",
                    "availability": "https://schema.org/InStock"
                },
                "aggregateRating": {
                    "@type": "AggregateRating",
                    "ratingValue": "4.8",
                    "ratingCount": "1000",
                    "bestRating": "5"
                },
                "publisher": {
                    "@type": "Organization",
                    "name": "Eggy Car Online"
                },
                "datePublished": "2023-08-15",
                "url": `https://eggycaronline.io/${dir}/${file}`
            },
            "description": {
                "sectionTitle": "Description",
                "paragraphs": paragraphs
            },
            "stats": [
                { "label": "DEVELOPER", "value": "Unknown" },
                { "label": "RELEASED", "value": "Unknown" },
                { "label": "RATING", "value": "4.8/5", "icon": "star" },
                { "label": "Last Updated", "value": "Unknown" }
            ],
            "comments": [],
            "similarGames": similarGames
        };

        allGamesData.push({
            dir: dir,
            file: file,
            json: jsonStructure
        });
    });
});

// Giai đoạn 2: Cập nhật imageUrl của similarGames và xuất file JSON
allGamesData.forEach(gameData => {
    gameData.json.similarGames.forEach(simGame => {
        // Nếu imageUrl trong similar games không thuộc domain mong muốn
        if (simGame.imageUrl && !simGame.imageUrl.includes('eggycaronline.io')) {
            // Tra cứu image chuẩn theo slug từ bảng map
            if (slugToImageMap[simGame.slug]) {
                simGame.imageUrl = slugToImageMap[simGame.slug];
            }
        }
    });

    const outDirPath = path.join(outputDir, gameData.dir);
    if (!fs.existsSync(outDirPath)) {
        fs.mkdirSync(outDirPath, { recursive: true });
    }
    
    const outPath = path.join(outDirPath, gameData.file.replace('.html', '.json'));
    fs.writeFileSync(outPath, JSON.stringify(gameData.json, null, 4), 'utf8');
    console.log(`[Thành công] Đã xử lý và lưu: ${gameData.dir}/${gameData.file}`);
});

console.log('Hoàn tất toàn bộ việc cập nhật và xuất JSON!');

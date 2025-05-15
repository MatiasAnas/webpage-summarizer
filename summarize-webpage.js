require('dotenv').config();
const axios = require('axios');
const cheerio = require('cheerio');

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
const OPENAI_MODEL = process.env.OPENAI_MODEL;
const OPENAI_API_URL = 'https://api.openai.com/v1/chat/completions';
const MAX_WEB_PAGE_LENGTH = 6000;

const OUTPUT_TEMPLATE = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Web Summary</title>
  <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;600&display=swap" rel="stylesheet" />
  <style>
    body {
      margin: 0;
      font-family: 'Poppins', sans-serif;
      background-color: white;
      color: #333;
    }

    header {
      background-color: #000;
      color: #fff;
      padding: 1rem 2rem;
      font-size: 1.5rem;
    }

    main {
      padding: 2rem;
    }

    .url-label {
      font-size: 1rem;
      margin-bottom: 0.5rem;
      color: #666;
    }

    .url-label a {
      color: #007BFF;
      text-decoration: none;
    }

    .url-label a:hover {
      text-decoration: underline;
    }

    h2 {
      font-weight: 600;
      font-size: 1.8rem;
      margin-bottom: 1rem;
    }

    {{TODO-ADD-NECESARY-STYLES}}
  </style>
</head>
<body>
  <header>
    Webpage Summarizer
  </header>
  <main>
    <div class="url-label">
      <strong>URL:</strong> <a href="{{TODO-ADD-SITE-URL}}" target="_blank">{{TODO-ADD-SITE-URL}}</a>
    </div>
    <h2>{{TODO-ADD-WEBPAGE-TITLE}}</h2>
    <div class="content-area">
      {{TODO-ADD-SUMMARY-CONTENT}}
    </div>
  </main>
</body>
</html>
`;

if (!OPENAI_API_KEY || !OPENAI_MODEL) {
  console.error(
    '[ERROR] Missing required environment variables: OPENAI_API_KEY and/or OPENAI_MODEL'
  );
  process.exit(1);
}

async function extractCleanContent(url) {
  try {
    const { data: html } = await axios.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
        Accept: 'text/html,application/xhtml+xml',
      },
    });
    const $ = cheerio.load(html);
    $(
      'script, style, img, iframe, noscript, svg, canvas, video, audio, picture, object'
    ).remove();
    const title = $('title').text().trim();
    const bodyText = $('body').text().replace(/\s+/g, ' ').trim();
    return { title, bodyText, url };
  } catch (err) {
    console.error(`[ERROR] Failed to fetch or parse page: ${err.message}`);
    process.exit(1);
  }
}

async function generateHTMLSummary({ title, bodyText, url }) {
  const systemPrompt = `
    You are a helpful assistant that summarizes websites.
    In the response talk as if you were a third party person describing what you see in the site, not the author of the webiste.
    Format your response in **valid HTML**.
    Use the website language as the target language for the HTML file. If the site is in spanish, the summary should be in spanish.
    If it is in english, it should be in english.
    You have to strictly follow the following HTML template:
    BEGINNING OF TEMPLATE
    ${OUTPUT_TEMPLATE}
    END OF TEMPLATE
    You have to replace the {{TODO-ADD-WEBPAGE-TITLE}} label with the webpage title,
    the {{TODO-ADD-SUMMARY-CONTENT}} with the summary content including titles, subtitles, paragraphs, bullets and what you consider,
    (but avoid forms, links, buttons and user inputs) and replace the {{TODO-ADD-NECESARY-STYLES}} label with the necesary styles for the {{TODO-ADD-SUMMARY-CONTENT}} section.
    You do not have to change the rest of the template.
    Also replace the {{TODO-ADD-SITE-URL}} with the site url.
    Generate just the HTML without \`\`\`html ... \`\`\`.
    `;

  const userPrompt = `Summarize the following web page in HTML format.\n\nSite URL: ${url}\n\nTitle: "${title}"\n\nContent:\n\n${bodyText.slice(
    0,
    MAX_WEB_PAGE_LENGTH
  )}`;

  try {
    const response = await axios.post(
      OPENAI_API_URL,
      {
        model: OPENAI_MODEL,
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt },
        ],
        temperature: 0.7,
      },
      {
        headers: {
          Authorization: `Bearer ${OPENAI_API_KEY}`,
          'Content-Type': 'application/json',
        },
        timeout: 60000,
      }
    );

    if (!response.data?.choices?.[0]?.message?.content) {
      throw new Error('Invalid response structure from OpenAI');
    }

    return response.data.choices[0].message.content.trim();
  } catch (err) {
    if (err.response?.data?.error?.message) {
      console.error(`[OPENAI ERROR] ${err.response.data.error.message}`);
    } else {
      console.error(`[ERROR] Failed to generate summary: ${err.message}`);
    }
    process.exit(1);
  }
}

async function main() {
  const url = process.argv[2];
  if (!url) {
    console.error('Usage: node summarize-webpage.js <URL>');
    process.exit(1);
  }

  const content = await extractCleanContent(url);
  const htmlSummary = await generateHTMLSummary(content);

  console.log(htmlSummary);
}

main();

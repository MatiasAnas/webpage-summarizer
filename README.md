# Webpage Summarizer with OpenAI

A simple tool that summarizes the content of a webpage using OpenAI's API. This project fetches a webpage, extracts its content, and generates an HTML summary using OpenAI's language model.

## Features

- Fetch and parse webpage content using `axios` and `cheerio`.
- Summarize webpage content into a clean and readable HTML format.
- Automatically adjusts the summary's language to match the original webpage's language (e.g., English or Spanish).
- Outputs summaries in a predefined HTML template with a simple and elegant design.

## Table of Contents

- [Features](#features)
- [Installation](#installation)
- [Usage](#usage)
- [Environment Variables](#environment-variables)
- [Project Structure](#project-structure)
- [Dependencies](#dependencies)
- [License](#license)

---

## Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/MatiasAnas/webpage-summarizer.git
   cd webpage-summarizer
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Create a `.env` file in the root directory and add the required environment variables (see [Environment Variables](#environment-variables)).

---

## Usage

1. Run the script with the URL of the webpage you want to summarize:

   ```bash
   node summarize-webpage.js <URL>
   ```

   Example:

   ```bash
   node summarize-webpage.js https://example.com
   ```

2. The script will output an HTML summary of the webpage in the terminal.

---

## Environment Variables

Make sure to set the following environment variables in a `.env` file:

- `OPENAI_API_KEY`: Your OpenAI API key.
- `OPENAI_MODEL`: The OpenAI model to use (e.g., `gpt-4`, `gpt-3.5-turbo`).

Example `.env` file:

```env
OPENAI_API_KEY=your_openai_api_key
OPENAI_MODEL=gpt-4
```

---

## Project Structure

- `summarize-webpage.js`: Main script for summarizing webpages.
- `.env`: Environment file for API keys and configurations.
- `package.json`: Project metadata and dependencies.

---

## Dependencies

- `dotenv`: For loading environment variables from a `.env` file.
- `axios`: For making HTTP requests to fetch webpage content and send API requests.
- `cheerio`: For parsing and manipulating the DOM of fetched webpages.

Install all dependencies by running:

```bash
npm install
```

---

## Error Handling

### Common Errors:

- **Missing Environment Variables**: Ensure you have added the `OPENAI_API_KEY` and `OPENAI_MODEL` in your `.env` file.
- **Invalid URL**: Verify the URL you are trying to summarize.
- **Timeout Errors**: Increase the `timeout` property in the `axios.post` request if necessary.

---

## Contribution

Contributions are welcome! If you have suggestions or improvements, feel free to open an issue or submit a pull request.

---

## Acknowledgements

This project uses the following technologies:

- [OpenAI API](https://platform.openai.com/)
- [Cheerio](https://cheerio.js.org/)
- [Axios](https://axios-http.com/)

Thank you for using the `Webpage Summarizer`! If you encounter any issues, please feel free to reach out.

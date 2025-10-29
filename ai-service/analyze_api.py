import os
import sys
import json
import time
import requests
import trafilatura
from newspaper import Article
from playwright.sync_api import sync_playwright
from google import genai
from google.genai import types
from flask import Flask, request, jsonify
import re

from dotenv import load_dotenv

load_dotenv()


# --- CONFIGURATION & SETUP (REVISED FOR LOCAL ENVIRONMENT) ---

def initialize_gemini_client():
    """Initializes Gemini client and configuration."""
    try:
        # Reads GEMINI_API_KEY from environment variables automatically
        client = genai.Client()
        grounding_tool = types.Tool(
          google_search=types.GoogleSearch()
        )
        GEMINI_CONFIG = types.GenerateContentConfig(
            tools=[grounding_tool]
        )
        MODEL_NAME = "gemini-2.5-flash"
        return client, GEMINI_CONFIG, MODEL_NAME
    except Exception as e:
        # Log error to stderr so Node.js can capture it without corrupting JSON output
        print(f"❌ ERROR: Failed to initialize Gemini Client: {e}", file=sys.stderr)
        return None, None, None

# Run initialization once
CLIENT, GEMINI_CONFIG, MODEL_NAME = initialize_gemini_client()

# --- CONSTANTS (from Colab) ---
MOCK_NEWS = "The Senator announced today that he will vote 'No' on the bill (verifiable fact). His chief critic, Jane Doe, blasted the vote as 'a cowardly betrayal of the middle class.' (Opinion) A blogger later claimed the Senator took a bribe, but the claim was debunked by an official ethics report. (Hoax)"
MOCK_JSON = """{
  "analysis": {
    "Facts": {"percentage": 50.0, "reason": "Reports on the Senator's voting decision and the outcome of the official ethics report.", "supporting_factors": ["Senator will vote 'No'", "Ethics report debunked the bribe claim"]},
    "Opinion": {"percentage": 30.0, "reason": "Includes a subjective judgment by a political rival regarding the motivation and nature of the vote.", "supporting_factors": ["Jane Doe's statement: 'a cowardly betrayal of the middle class.'"]},
    "Hoax": {"percentage": 20.0, "reason": "The presence of the false bribe accusation requires a Hoax category, despite being debunked.", "supporting_factors": ["False claim: Senator took a bribe (debunked)"]}
  },
  "summary_statement": "The article is a combination of fact, clear opinion, and a debunked hoax, demonstrating the need to separate subjective judgment from fabricated claims."
}"""
FAKE_USER_AGENT = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"

SYSTEM_MESSAGE_CONTENT = """
You are a meticulous and impartial News Content Analyzer with access to Google Search for real-time fact-checking.

Your task is to analyze the provided news text and classify its content into:
- Facts (verifiable claims that are true)
- Opinions (subjective judgments or beliefs)
- Hoaxes (false or misleading claims contradicted by reliable sources)

Rules:
1. If you are unsure about a factual claim, use **Google Search** to verify it before classifying.
2. Return ONLY a single valid JSON object, with the following structure:
{
  "analysis": {
    "Facts": {"percentage": float, "reason": string, "supporting_factors": [string]},
    "Opinion": {"percentage": float, "reason": string, "supporting_factors": [string]},
    "Hoax": {"percentage": float, "reason": string, "supporting_factors": [string]}
  },
  "summary_statement": string
}
3. Each "supporting_factors" list must contain short quotes or search-based evidence.
4. If no external verification is needed, reason internally.
5. Be concise, neutral, and evidence-driven.
"""

few_shot_input = f"""
{SYSTEM_MESSAGE_CONTENT}
ANALYZE the following news text and fill in the required JSON structure:
---
{MOCK_NEWS}
---
"""


# --- UTILITY FUNCTIONS (same as before) ---
def fix_json_string(bad_json: str) -> str:
    fixed = bad_json
    fixed = re.sub(r'\"(?=\s*\"(?!:))', '\", ', fixed)
    fixed = re.sub(r',(\s*[\]\}])', r'\1', fixed)
    fixed = re.sub(r',\s*,', ',', fixed)
    return fixed

def parse_with_fix(generated_text: str):
    json_match = re.search(r'\{.*\}', generated_text, re.DOTALL)
    if not json_match:
        print("❌ Did not find JSON in output", file=sys.stderr)
        return None

    json_string = json_match.group(0).strip()

    for attempt in range(3):
        try:
            return json.loads(json_string)
        except json.JSONDecodeError as e:
            print(f"⚠️ JSONDecodeError (attempt {attempt+1}), trying auto-fix...", file=sys.stderr)
            json_string = fix_json_string(json_string)

    print("❌ Failed to parse JSON after 3 attempts.", file=sys.stderr)
    return None

# --- TEXT EXTRACTION (same as before, now synchronous) ---
def extract_text_from_url(url):
    """Tries extraction from FASTEST to SLOWEST."""
    headers = {'User-Agent': FAKE_USER_AGENT}
    
    # PHASE 1: Newspaper3k
    try:
        article = Article(url, headers=headers, request_timeout=15)
        article.download()
        article.parse()
        if article.text and len(article.text) >= 200:
            return f"TITLE: {article.title}\nAUTHORS: {', '.join(article.authors)}\n\n{article.text}"
    except Exception:
        pass 

    # PHASE 2: Requests + Trafilatura
    try:
        response = requests.get(url, headers=headers, timeout=15)
        if response.status_code == 200:
            extracted_data = trafilatura.extract(response.text, url=url, output_format='json')
            if extracted_data:
                parsed_data = json.loads(extracted_data)
                article_text = parsed_data.get('text', '').strip()
                if len(article_text) >= 200:
                    title_str = parsed_data.get('title', 'TITLE NOT FOUND')
                    author_str = parsed_data.get('author', 'AUTHOR NOT FOUND')
                    return f"TITLE: {title_str}\nAUTHORS: {author_str}\n\n{article_text}"
    except Exception:
         pass

    # PHASE 3: Sync Playwright + Trafilatura
    try:
        with sync_playwright() as p:
            browser = p.chromium.launch(headless=True)
            context = browser.new_context(user_agent=FAKE_USER_AGENT)
            page = context.new_page()

            page.goto(url, timeout=30000, wait_until="load")
            page.wait_for_timeout(3000)
            
            raw_html = page.content()
            browser.close()

            extracted_data = trafilatura.extract(raw_html, url=url, output_format='json')

            if extracted_data:
                parsed_data = json.loads(extracted_data)
                article_text = parsed_data.get('text', '').strip()
                if len(article_text) >= 200:
                    title_str = parsed_data.get('title', 'TITLE NOT FOUND')
                    author_str = parsed_data.get('author', 'AUTHOR NOT FOUND')
                    return f"TITLE: {title_str}\nAUTHORS: {author_str}\n\n{article_text}"

    except Exception as e:
        print(f"-> ❌ ERROR (Sync Playwright): {e}.", file=sys.stderr)
        pass
    
    return "Error: All extraction methods failed."


# --- CORE ANALYSIS FUNCTION (Modified to return clean data) ---

def analyze_news(input_text_or_url: str):
    """
    Core function to extract text and analyze it using the Gemini API.
    Returns a dictionary suitable for the final JSON output.
    """
    if not CLIENT or not GEMINI_CONFIG:
        return {
            "error": "Gemini Client Setup Failed",
            "details": "Check GEMINI_API_KEY and Python dependencies."
        }

    # Step 1: Extract Text
    if input_text_or_url.startswith("http"):
        extracted_text = extract_text_from_url(input_text_or_url)
    else:
        extracted_text = input_text_or_url

    if extracted_text.startswith("Error:"):
        return {
            "error": "Text Extraction Failed",
            "details": extracted_text
        }

    # Step 2: Build the prompt
    messages = [
        # First message: Instructions + Few-Shot Input
        {"role": "user", "content": few_shot_input}, 
        
        # Second message: Few-Shot Output
        {"role": "model", "content": MOCK_JSON}, # Use 'model' instead of 'assistant' for consistency
        
        # Final Query: The real data to analyze
        {"role": "user", "content": f"ANALYZE the following news text and fill in the required JSON structure:\n---\n{extracted_text.strip()}\n---"},
    ]
    
    contents = [
        types.Content(
            role=msg['role'],
            parts=[types.Part.from_text(text=msg['content'])]) 
        for msg in messages
    ]

    # Step 3: Generate with Gemini
    try:
        response = CLIENT.models.generate_content(
            model=MODEL_NAME,
            contents=contents,
            config=GEMINI_CONFIG,
            # Set a high timeout for the API call in case of complex analysis
            # request_options={"timeout": 60} 
        )
        generated_text = response.text
    except Exception as e:
        return {
            "error": "Gemini API Call Failed",
            "details": str(e)
        }

    # Step 4: Parse JSON output
    parsed_json = parse_with_fix(generated_text)
    if not parsed_json:
        return {
            "error": "JSON Parsing Failed",
            "details": generated_text
        }

    # Step 5: Map Gemini JSON to required Prisma/Gradio format fields
    analysis = parsed_json.get("analysis", {})
    summary_statement = parsed_json.get("summary_statement", "Summary not generated.")

    # Convert a potential float/string percentage to a standardized float
    def get_percentage(category_name):
        try:
            return float(analysis.get(category_name, {}).get('percentage', 0))
        except (ValueError, TypeError):
            return 0.0

    return {
        # Note: 'main_theme' and 'sentiment' were not explicitly generated by the Gemini prompt. 
        # We will set placeholders or infer based on the analysis summary.
        # You may need to update the prompt if you need these fields from Gemini.
        "main_theme": "News Analysis", # Placeholder
        "summary": summary_statement,
        "fact_percentage": get_percentage("Facts"),
        "opinion_percentage": get_percentage("Opinion"),
        "hoax_percentage": get_percentage("Hoax"),
        "sentiment": "Neutral", # Placeholder
        "raw_analysis_json": parsed_json # Include the full structure for details page
    }


app = Flask(__name__)

@app.route('/analyze', methods=['POST'])
def analyze_endpoint():
    # 1. Check for valid JSON input
    if not request.is_json:
        return jsonify({"error": "Missing JSON in request"}), 400
    
    data = request.get_json()
    url = data.get('url')
    
    if not url:
        return jsonify({"error": "Missing 'url' field"}), 400

    print(f"-> Received request to analyze: {url}")
    
    # 2. Run the core analysis logic
    final_result = analyze_news(url)
    
    # 3. Handle errors returned by analyze_news
    if "error" in final_result:
        status_code = 500
        # If the error is specific (e.g., key missing), we might return 400 or 503
        if "Gemini Client Setup Failed" in final_result.get("error", ""):
            status_code = 503
            
        print(f"❌ Analysis failed: {final_result.get('error')}")
        return jsonify(final_result), status_code
    
    # 4. Return the successful JSON result
    print(f"✅ Analysis successful for: {url}")
    return jsonify({"success": True, "data": final_result}), 200

if __name__ == '__main__':
    # You must run this command once to install Playwright browser dependencies:
    # `python -m playwright install chromium`
    
    # IMPORTANT: Ensure your GEMINI_API_KEY is set in the environment before running!
    if not CLIENT:
        print("❌ CRITICAL ERROR: Gemini client failed to initialize. Cannot run service.", file=sys.stderr)
        sys.exit(1)
        
    print("✨ Starting Analysis API Service on http://127.0.0.1:5000/analyze")
    # Note: Use threaded=False in production for better stability or switch to Gunicorn/Waitress
    app.run(host='0.0.0.0', port=5000, debug=True)
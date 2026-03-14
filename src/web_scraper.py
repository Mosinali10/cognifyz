"""
Web Scraper
Fetches a URL and extracts all paragraph text, presenting it in a clean numbered list.
"""

import requests
from bs4 import BeautifulSoup


def fetch_html(url):
    """Fetch raw HTML from a URL. Returns None on failure."""
    try:
        response = requests.get(url, timeout=10)
        response.raise_for_status()
        return response.text
    except requests.exceptions.RequestException as e:
        print(f"❌ Error fetching URL: {e}")
        return None


def extract_paragraphs(html):
    """Parse HTML and return a list of non-empty paragraph strings."""
    soup = BeautifulSoup(html, "html.parser")
    return [p.get_text(strip=True) for p in soup.find_all("p") if p.get_text(strip=True)]


def display_results(paragraphs):
    if not paragraphs:
        print("ℹ️  No paragraph content found on this page.")
        return
    print(f"\n📄 Extracted {len(paragraphs)} paragraph(s):\n")
    print("-" * 50)
    for i, text in enumerate(paragraphs, start=1):
        print(f"[{i}] {text}\n")


def run():
    print("\n" + "=" * 50)
    print("          🌐 INTERACTIVE WEB SCRAPER")
    print("=" * 50)
    while True:
        url = input("\nEnter URL to scrape (or 'exit' to quit): ").strip()
        if url.lower() == "exit":
            print("👋 Goodbye!")
            break
        if not url.startswith("http"):
            print("⚠️  Please enter a full URL starting with http:// or https://")
            continue

        html = fetch_html(url)
        if html:
            paragraphs = extract_paragraphs(html)
            display_results(paragraphs)


if __name__ == "__main__":
    run()

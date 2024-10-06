        # Fetching data from a website and  present it in a user-friendly way using a web scraping,
        #  simple web scraping library uses URL of any website and gives its information
                                                                            #by-Mosin ali


import requests
from bs4 import BeautifulSoup

def fetch_data(url):
    try:
        response=requests.get(url)
        response.raise_for_status() 
        return response.text
    except requests.exceptions.RequestException as e:
        print(f"Error fetching data: {e}")
        return None

def parse_data(html):
    soup=BeautifulSoup(html, 'html.parser')
    paragraphs=soup.find_all('p')
    return[para.get_text() for para in paragraphs]

def display_data(data):
    if not data:
        print("No data to display.")
        return
    print("\nExtracted Data:")
    for i, item in enumerate(data,start=1):
        print(f"{i}:{item}")

def interactive_web_scraping():
    print("Welcome to the Interactive Web Scraper")
    url=input("Enter the URL of the website to scrape: ").strip()
    html=fetch_data(url)
    if html:
        data=parse_data(html)
        display_data(data)

if __name__=="__main__":
    interactive_web_scraping()

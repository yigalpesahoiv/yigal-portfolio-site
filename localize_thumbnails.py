import os
import re
import urllib.request
import ssl

# Configuration
FILES = [
    'weddings.html',
    'music-videos.html',
    'commercials.html',
    'love-stories.html',
    'corporate.html'
]
IMAGE_DIR = 'images/thumbnails'

# Ensure directory exists
os.makedirs(IMAGE_DIR, exist_ok=True)

# Create a context that ignores SSL verification errors (just in case)
ssl_context = ssl._create_unverified_context()

def download_image(url, filename):
    try:
        filepath = os.path.join(IMAGE_DIR, filename)
        # Use a user-agent to avoid 403s
        req = urllib.request.Request(
            url, 
            data=None, 
            headers={
                'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.114 Safari/537.36'
            }
        )
        with urllib.request.urlopen(req, context=ssl_context) as response, open(filepath, 'wb') as out_file:
            out_file.write(response.read())
        return filepath
    except Exception as e:
        print(f"Error downloading {url}: {e}")
        return None

def process_file(filename):
    print(f"Processing {filename}...")
    try:
        with open(filename, 'r') as f:
            content = f.read()
    except FileNotFoundError:
        print(f"File {filename} not found.")
        return

    # Regex to find image sources
    # Matches src="https://..." inside img tags
    # We look for youtube and vimeo specifically
    
    # Pattern captures the URL
    pattern = r'src="(https://(?:i\.ytimg\.com|i\.vimeocdn\.com)[^"]+)"'
    
    new_content = content
    
    # Let's collect unique URLs first
    urls = set(re.findall(pattern, content))
    
    category_name = filename.replace('.html', '')
    
    for i, url in enumerate(urls):
        ext = 'jpg' # Default to jpg
        if 'vimeocdn' in url:
            # Vimeo URLs often don't have extension at the end, but are jpg/png
            pass
            
        local_filename = f"{category_name}-{i+1}.{ext}"
        print(f"  Downloading {url} -> {local_filename}")
        
        if download_image(url, local_filename):
            local_path = f"{IMAGE_DIR}/{local_filename}"
            new_content = new_content.replace(url, local_path)
            
    with open(filename, 'w') as f:
        f.write(new_content)
    print(f"Updated {filename}")

def main():
    for file in FILES:
        process_file(file)

if __name__ == "__main__":
    main()

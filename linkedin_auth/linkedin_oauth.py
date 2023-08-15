import requests
from django.conf import settings

LINKEDIN_CLIENT_ID = settings.LINKEDIN_CLIENT_ID
LINKEDIN_CLIENT_SECRET = settings.LINKEDIN_CLIENT_SECRET
LINKEDIN_REDIRECT_URI = settings.LINKEDIN_REDIRECT_URI

def get_linkedin_oauth_url():
    # Build the LinkedIn OAuth URL for authorization
    oauth_url = f"https://www.linkedin.com/oauth/v2/authorization?client_id={LINKEDIN_CLIENT_ID}&redirect_uri={LINKEDIN_REDIRECT_URI}&response_type=code&scope=r_liteprofile%20r_emailaddress"
    return oauth_url

def exchange_linkedin_code_for_token(code):
    # Exchange the received authorization code for an access token
    token_url = "https://www.linkedin.com/oauth/v2/accessToken"
    payload = {
        "client_id": LINKEDIN_CLIENT_ID,
        "client_secret": LINKEDIN_CLIENT_SECRET,
        "code": code,
        "redirect_uri": LINKEDIN_REDIRECT_URI,
        "grant_type": "authorization_code",
    }
    response = requests.post(token_url, data=payload)
    
    if response.status_code == 200:
        data = response.json()
        access_token = data.get("access_token")
        linkedin_id = data.get("linkedin_id")  # This part might vary depending on LinkedIn's response structure
        return access_token, linkedin_id
    else:
        return None, None

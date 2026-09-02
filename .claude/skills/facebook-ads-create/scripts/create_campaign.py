"""
Jarvis AI Agent - Sales Campaign
Creates: Campaign → Ad Set → Ad Creative → Ad (all PAUSED)
"""

import requests
import json
import sys
from datetime import datetime, timedelta

from config import ACCESS_TOKEN, AD_ACCOUNT_ID, PAGE_ID

BASE_URL = "https://graph.facebook.com/v21.0"

# Campaign settings
CAMPAIGN_NAME = "Jarvis AI Agent - Sales"
OBJECTIVE = "OUTCOME_SALES"
DAILY_BUDGET = "100000"  # 100,000 VND (smallest currency unit = 1 VND)
OPTIMIZATION_GOAL = "LINK_CLICKS"
CTA_TYPE = "SIGN_UP"
LINK_URL = "http://jarvis.com.ai/helpdeskai"
AD_MESSAGE = (
    "500+ doanh nghiệp Việt Nam đã dùng Jarvis AI Agent để chốt đơn nhanh hơn. "
    "Đừng để đối thủ đi trước — tạo AI Agent riêng cho doanh nghiệp bạn trong 5 phút. "
    "Hoàn toàn miễn phí để bắt đầu."
)

# Targeting
TARGETING = {
    "age_min": 25,
    "age_max": 55,
    "geo_locations": {"countries": ["VN"]},
    "flexible_spec": [
        {
            "interests": [
                {"id": "6002884511422", "name": "Small business"},
                {"id": "6003371567474", "name": "Entrepreneurship"},
                {"id": "6003388372512", "name": "Business software"},
            ]
        }
    ],
    "locales": [24],  # Vietnamese language
    "targeting_automation": {"advantage_audience": 0},
}

START_TIME = (datetime.utcnow() + timedelta(days=1)).strftime("%Y-%m-%dT00:00:00+0700")


def api_call(endpoint, params):
    """Make a POST request to Meta Graph API and return the response."""
    params["access_token"] = ACCESS_TOKEN
    resp = requests.post(f"{BASE_URL}/{endpoint}", params=params)
    data = resp.json()
    if "error" in data:
        print(f"API Error at {endpoint}:")
        print(json.dumps(data["error"], indent=2, ensure_ascii=False))
        sys.exit(1)
    return data


def main():
    print("=" * 50)
    print("Creating Facebook Ad Campaign")
    print("=" * 50)

    # Step 1 & 2: Use existing campaign and ad set
    campaign_id = "6890852367481"
    ad_set_id = "6890852710881"
    print(f"\n[1/4] Using existing campaign: {campaign_id}")
    print(f"\n[2/4] Using existing ad set: {ad_set_id}")

    # Step 3a: Upload image
    print("\n[3/4] Uploading ad image...")
    image_path = r"C:\Users\THUC\Downloads\Nhân viên AI (2)\2.png"
    with open(image_path, "rb") as f:
        resp = requests.post(
            f"{BASE_URL}/{AD_ACCOUNT_ID}/adimages",
            params={"access_token": ACCESS_TOKEN},
            files={"filename": ("ad_image.png", f, "image/png")},
        )
    img_data = resp.json()
    if "error" in img_data:
        print(f"Image upload error: {json.dumps(img_data['error'], indent=2, ensure_ascii=False)}")
        sys.exit(1)
    images = img_data.get("images", {})
    image_hash = list(images.values())[0]["hash"]
    print(f"  Image hash: {image_hash}")

    # Step 3b: Create Ad Creative
    print("  Creating ad creative...")
    object_story_spec = json.dumps({
        "page_id": PAGE_ID,
        "link_data": {
            "message": AD_MESSAGE,
            "link": LINK_URL,
            "image_hash": image_hash,
            "name": "Jarvis AI Agent - Tạo AI Agent cho doanh nghiệp",
            "description": "Tự động trả lời khách hàng 24/7. Miễn phí để bắt đầu.",
            "call_to_action": {
                "type": CTA_TYPE,
                "value": {"link": LINK_URL},
            },
        },
    })
    creative = api_call(f"{AD_ACCOUNT_ID}/adcreatives", {
        "name": f"{CAMPAIGN_NAME} - Creative",
        "object_story_spec": object_story_spec,
    })
    creative_id = creative["id"]
    print(f"  Creative ID: {creative_id}")

    # Step 4: Create Ad
    print("\n[4/4] Creating ad...")
    ad = api_call(f"{AD_ACCOUNT_ID}/ads", {
        "name": f"{CAMPAIGN_NAME} - Ad",
        "adset_id": ad_set_id,
        "creative": json.dumps({"creative_id": creative_id}),
        "status": "PAUSED",
    })
    ad_id = ad["id"]
    print(f"  Ad ID: {ad_id}")

    # Summary
    print("\n" + "=" * 50)
    print("Campaign created successfully! (PAUSED)")
    print("=" * 50)
    print(f"  Campaign:  {campaign_id} — {CAMPAIGN_NAME}")
    print(f"  Ad Set:    {ad_set_id} — VN, age 25-55, business interests")
    print(f"  Creative:  {creative_id}")
    print(f"  Ad:        {ad_id}")
    print(f"  Budget:    100,000 VND/day")
    print(f"  CTA:       SIGN_UP")
    print(f"  Status:    PAUSED")
    print(f"\nActivate in Meta Ads Manager when ready.")


if __name__ == "__main__":
    main()

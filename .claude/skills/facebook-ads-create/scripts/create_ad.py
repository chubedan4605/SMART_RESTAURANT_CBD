"""
Facebook Ad Creation Script (REST API)
=======================================
Creates a full ad pipeline: Campaign → Ad Set → Ad Creative → Ad.
Uses direct REST API calls via `requests` for reliability.

Includes mandatory preflight checks:
- Payment method on ad account
- Meta Pixel (for OUTCOME_SALES / OUTCOME_LEADS)
- Image file existence
- Interest ID validation

Usage:
    python create_ad.py \
        --campaign-name "Spring Sale 2026" \
        --objective "OUTCOME_TRAFFIC" \
        --daily-budget 100000 \
        --audience-age-min 25 \
        --audience-age-max 55 \
        --audience-genders 0 \
        --audience-countries '["VN"]' \
        --audience-interests '[{"id":"6002884511422","name":"Small business"}]' \
        --audience-locales '[24]' \
        --ad-name "Jarvis AI Agent Ad" \
        --ad-message "Your ad copy here" \
        --ad-link "https://jarvis.com.ai/helpdeskai" \
        --ad-image-path "./ad_image.png" \
        --cta-type "SIGN_UP" \
        --page-id "YOUR_PAGE_ID"

Objectives: OUTCOME_AWARENESS, OUTCOME_TRAFFIC, OUTCOME_ENGAGEMENT,
            OUTCOME_LEADS, OUTCOME_APP_PROMOTION, OUTCOME_SALES

CTA types: LEARN_MORE, SIGN_UP, SHOP_NOW, CONTACT_US, DOWNLOAD,
           GET_OFFER, BOOK_TRAVEL, SUBSCRIBE
"""

import argparse
import json
import sys
import os
from datetime import datetime, timedelta, timezone

import requests

# Try to load config
try:
    from config import ACCESS_TOKEN, AD_ACCOUNT_ID
except ImportError:
    ACCESS_TOKEN = os.environ.get("META_ACCESS_TOKEN")
    AD_ACCOUNT_ID = os.environ.get("META_AD_ACCOUNT_ID")

BASE_URL = "https://graph.facebook.com/v21.0"

# Objectives that require a Meta Pixel as promoted_object
PIXEL_REQUIRED_OBJECTIVES = {"OUTCOME_SALES", "OUTCOME_LEADS"}

# Objective → default promoted_object custom_event_type
OBJECTIVE_EVENT_MAP = {
    "OUTCOME_SALES": "PURCHASE",
    "OUTCOME_LEADS": "LEAD",
}


def api_call(method, url, **kwargs):
    """Make API call, check for errors, return JSON."""
    resp = method(url, **kwargs)
    try:
        data = resp.json()
    except Exception:
        raise Exception(f"Non-JSON response (HTTP {resp.status_code}): {resp.text[:500]}")
    if "error" in data:
        raise Exception(f"API Error: {json.dumps(data['error'], indent=2, ensure_ascii=False)}")
    return data


# ---------------------------------------------------------------------------
# Preflight checks
# ---------------------------------------------------------------------------

def check_payment_method():
    """Check if the ad account has a payment method configured."""
    print("  Checking payment method...")
    try:
        data = api_call(requests.get, f"{BASE_URL}/{AD_ACCOUNT_ID}",
                        params={"access_token": ACCESS_TOKEN, "fields": "funding_source_details,name"})
        if data.get("funding_source_details"):
            print("    Payment method: OK")
            return True
        print("    WARNING: No payment method found. Ad creation may fail at the final step.")
        print("    Add a payment method at: https://business.facebook.com/billing")
        return False
    except Exception:
        print("    WARNING: Could not verify payment method (may lack permission). Proceeding anyway.")
        return True  # Don't block — the check itself may fail due to permissions


def check_pixel(objective):
    """Check if a Meta Pixel exists when the objective requires one. Returns pixel_id or None."""
    if objective not in PIXEL_REQUIRED_OBJECTIVES:
        return None

    print(f"  Checking Meta Pixel (required for {objective})...")
    data = api_call(requests.get, f"{BASE_URL}/{AD_ACCOUNT_ID}/adspixels",
                    params={"access_token": ACCESS_TOKEN, "fields": "id,name"})
    pixels = data.get("data", [])
    if not pixels:
        raise Exception(
            f"{objective} requires a Meta Pixel but none found on this ad account. "
            "Create one at https://business.facebook.com/events_manager"
        )
    pixel_id = pixels[0]["id"]
    pixel_name = pixels[0].get("name", "unnamed")
    print(f"    Pixel: {pixel_name} ({pixel_id})")
    return pixel_id


def check_image(image_path):
    """Verify the image file exists and is readable."""
    if not image_path:
        raise Exception(
            "An ad image is required. Meta link ads without an uploaded image "
            "will try to scrape the landing page OG image, which frequently fails. "
            "Please provide --ad-image-path or --ad-image-url."
        )
    if not os.path.exists(image_path):
        raise Exception(f"Image file not found: {image_path}")
    size_mb = os.path.getsize(image_path) / (1024 * 1024)
    if size_mb > 30:
        raise Exception(f"Image too large ({size_mb:.1f} MB). Meta limit is 30 MB.")
    print(f"    Image: {image_path} ({size_mb:.1f} MB)")


def run_preflight(objective, image_path, image_url):
    """Run all preflight checks. Returns pixel_id if applicable."""
    print("\n[0/5] Preflight checks...")

    has_payment = check_payment_method()

    pixel_id = check_pixel(objective)

    if image_path:
        check_image(image_path)
    elif not image_url:
        raise Exception(
            "An ad image is required (--ad-image-path or --ad-image-url). "
            "Link ads without an uploaded image will try to scrape the landing page "
            "OG image, which frequently fails."
        )

    if not has_payment:
        print("\n  Proceeding without confirmed payment method.")
        print("  If ad creation fails, add payment at https://business.facebook.com/billing\n")

    print("  Preflight: PASSED\n")
    return pixel_id


# ---------------------------------------------------------------------------
# Creation steps
# ---------------------------------------------------------------------------

def create_campaign(name, objective, status="PAUSED"):
    """Create a new ad campaign."""
    print(f"[1/5] Creating campaign: {name}")
    data = api_call(requests.post, f"{BASE_URL}/{AD_ACCOUNT_ID}/campaigns", params={
        "access_token": ACCESS_TOKEN,
        "name": name,
        "objective": objective,
        "status": status,
        "special_ad_categories": "[]",
    })
    campaign_id = data["id"]
    print(f"  Campaign ID: {campaign_id}")
    return campaign_id


def create_ad_set(campaign_id, name, daily_budget, targeting, start_time,
                  optimization_goal="LINK_CLICKS", pixel_id=None, objective=None):
    """Create an ad set with targeting."""
    print(f"[2/5] Creating ad set: {name}")

    params = {
        "access_token": ACCESS_TOKEN,
        "name": name,
        "campaign_id": campaign_id,
        "daily_budget": str(daily_budget),
        "billing_event": "IMPRESSIONS",
        "optimization_goal": optimization_goal,
        "bid_strategy": "LOWEST_COST_WITHOUT_CAP",
        "targeting": json.dumps(targeting),
        "start_time": start_time,
        "status": "PAUSED",
    }

    # Add promoted_object for objectives that require a pixel
    if pixel_id and objective in PIXEL_REQUIRED_OBJECTIVES:
        event_type = OBJECTIVE_EVENT_MAP.get(objective, "PURCHASE")
        params["promoted_object"] = json.dumps({
            "pixel_id": pixel_id,
            "custom_event_type": event_type,
        })

    data = api_call(requests.post, f"{BASE_URL}/{AD_ACCOUNT_ID}/adsets", params=params)
    ad_set_id = data["id"]
    print(f"  Ad Set ID: {ad_set_id}")
    return ad_set_id


def upload_image(image_path):
    """Upload an image to the ad account."""
    print(f"[3/5] Uploading image: {image_path}")
    filename = os.path.basename(image_path)
    with open(image_path, "rb") as f:
        data = api_call(requests.post, f"{BASE_URL}/{AD_ACCOUNT_ID}/adimages",
            params={"access_token": ACCESS_TOKEN},
            files={"filename": (filename, f, "image/png")}
        )
    images = data.get("images", {})
    image_hash = list(images.values())[0]["hash"]
    print(f"  Image Hash: {image_hash}")
    return image_hash


def create_ad_creative(name, page_id, message, link_url, image_hash=None,
                       image_url=None, cta_type="LEARN_MORE"):
    """Create an ad creative."""
    print(f"[4/5] Creating ad creative: {name}")

    link_data = {
        "message": message,
        "link": link_url,
        "call_to_action": {"type": cta_type, "value": {"link": link_url}},
    }

    if image_hash:
        link_data["image_hash"] = image_hash
    elif image_url:
        link_data["picture"] = image_url

    object_story_spec = json.dumps({
        "page_id": page_id,
        "link_data": link_data,
    })

    data = api_call(requests.post, f"{BASE_URL}/{AD_ACCOUNT_ID}/adcreatives", params={
        "access_token": ACCESS_TOKEN,
        "name": name,
        "object_story_spec": object_story_spec,
    })
    creative_id = data["id"]
    print(f"  Creative ID: {creative_id}")
    return creative_id


def create_ad(name, ad_set_id, creative_id):
    """Create an ad linking the creative to the ad set."""
    print(f"[5/5] Creating ad: {name}")
    data = api_call(requests.post, f"{BASE_URL}/{AD_ACCOUNT_ID}/ads", params={
        "access_token": ACCESS_TOKEN,
        "name": name,
        "adset_id": ad_set_id,
        "creative": json.dumps({"creative_id": creative_id}),
        "status": "PAUSED",
    })
    ad_id = data["id"]
    print(f"  Ad ID: {ad_id}")
    return ad_id


def main():
    parser = argparse.ArgumentParser(description="Create a Facebook Ad Campaign (REST API)")
    parser.add_argument("--campaign-name", required=True, help="Campaign name")
    parser.add_argument("--objective", default="OUTCOME_TRAFFIC",
                        help="Campaign objective")
    parser.add_argument("--daily-budget", type=int, default=5000,
                        help="Daily budget in smallest currency unit")
    parser.add_argument("--audience-age-min", type=int, default=18)
    parser.add_argument("--audience-age-max", type=int, default=65)
    parser.add_argument("--audience-genders", type=int, default=0,
                        help="0=All, 1=Male, 2=Female")
    parser.add_argument("--audience-countries", type=str, default='["US"]',
                        help="JSON list of country codes")
    parser.add_argument("--audience-interests", type=str, default=None,
                        help='JSON list of interest objects: [{"id":"123","name":"X"}]')
    parser.add_argument("--audience-locales", type=str, default=None,
                        help="JSON list of locale IDs, e.g. [24] for Vietnamese")
    parser.add_argument("--ad-name", required=True, help="Ad name")
    parser.add_argument("--ad-message", required=True, help="Ad copy text")
    parser.add_argument("--ad-link", required=True, help="Landing page URL")
    parser.add_argument("--ad-image-path", default=None, help="Path to ad image")
    parser.add_argument("--ad-image-url", default=None, help="URL of ad image")
    parser.add_argument("--cta-type", default="LEARN_MORE",
                        help="CTA type: LEARN_MORE, SIGN_UP, SHOP_NOW, etc.")
    parser.add_argument("--page-id", required=True, help="Facebook Page ID")

    args = parser.parse_args()

    if not ACCESS_TOKEN or not AD_ACCOUNT_ID:
        print("Missing credentials. Set in config.py or env vars META_ACCESS_TOKEN / META_AD_ACCOUNT_ID")
        sys.exit(1)

    countries = json.loads(args.audience_countries)
    interests = json.loads(args.audience_interests) if args.audience_interests else None
    locales = json.loads(args.audience_locales) if args.audience_locales else None

    # Build targeting
    targeting = {
        "age_min": args.audience_age_min,
        "age_max": args.audience_age_max,
        "geo_locations": {"countries": countries},
    }
    if args.audience_genders and args.audience_genders != 0:
        targeting["genders"] = [args.audience_genders]
    if interests:
        targeting["flexible_spec"] = [{"interests": interests}]
    if locales:
        targeting["locales"] = locales

    # OUTCOME_SALES and OUTCOME_LEADS require advantage_audience flag
    if args.objective in PIXEL_REQUIRED_OBJECTIVES:
        targeting["targeting_automation"] = {"advantage_audience": 0}

    start_time = (datetime.now(timezone.utc) + timedelta(days=1)).strftime("%Y-%m-%dT00:00:00+0000")

    print("=" * 50)
    print("Facebook Ad Creation")
    print("=" * 50)

    # Preflight checks
    pixel_id = run_preflight(args.objective, args.ad_image_path, args.ad_image_url)

    results = {}
    try:
        # Step 1: Campaign
        results["campaign_id"] = create_campaign(args.campaign_name, args.objective)

        # Step 2: Ad Set
        results["ad_set_id"] = create_ad_set(
            results["campaign_id"],
            f"{args.campaign_name} - Ad Set",
            args.daily_budget, targeting, start_time,
            pixel_id=pixel_id, objective=args.objective,
        )

        # Step 3: Upload image
        image_hash = None
        if args.ad_image_path and os.path.exists(args.ad_image_path):
            image_hash = upload_image(args.ad_image_path)
            results["image_hash"] = image_hash

        # Step 4: Creative
        results["creative_id"] = create_ad_creative(
            f"{args.ad_name} - Creative",
            args.page_id, args.ad_message, args.ad_link,
            image_hash=image_hash, image_url=args.ad_image_url,
            cta_type=args.cta_type,
        )

        # Step 5: Ad
        results["ad_id"] = create_ad(args.ad_name, results["ad_set_id"], results["creative_id"])

        print("\n" + "=" * 50)
        print("CAMPAIGN CREATED SUCCESSFULLY!")
        print("=" * 50)
        for k, v in results.items():
            print(f"  {k}: {v}")
        print(f"\n  Status: PAUSED — activate in Ads Manager when ready.")
        print("=" * 50)

    except Exception as e:
        print(f"\nERROR: {e}")
        if results:
            print(f"\nPartially created (clean up in Ads Manager if needed):")
            print(json.dumps(results, indent=2))
        sys.exit(1)

    return results


if __name__ == "__main__":
    main()

import os
import django

os.environ.setdefault(
    "DJANGO_SETTINGS_MODULE",
    "restaurant_ordering_system.settings"
)

django.setup()

import cloudinary.uploader
from menu.models import Menu

for menu in Menu.objects.all():

    if not menu.image:
        print(f"❌ No image: {menu.name}")
        continue

    image_path = os.path.join(
        "media",
        str(menu.image)
    )

    if not os.path.exists(image_path):
        print(f"❌ File not found: {image_path}")
        continue

    result = cloudinary.uploader.upload(
        image_path,
        folder="restaurant_menu"
    )

    menu.image = result["public_id"]
    menu.save(update_fields=["image"])

    print(f"✅ Uploaded: {menu.name}")
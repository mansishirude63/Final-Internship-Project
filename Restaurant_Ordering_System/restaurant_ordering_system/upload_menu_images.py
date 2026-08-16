import os
import re
import django
import cloudinary.uploader

os.environ.setdefault(
    "DJANGO_SETTINGS_MODULE",
    "restaurant_ordering_system.settings"
)

django.setup()

from menu.models import Menu

IMAGE_DIR = os.path.join("media", "menu_images")

files = os.listdir(IMAGE_DIR)


def normalize(text):
    return re.sub(r'[^a-z0-9]', '', text.lower())


file_map = {}

for filename in files:
    name, ext = os.path.splitext(filename)

    if ext.lower() in [".jpg", ".jpeg", ".png", ".webp", ".avif"]:
        file_map[normalize(name)] = filename


# Manual mappings
file_map[normalize("French Fries")] = "fries.jpg"
file_map[normalize("Hara Bhara Kabab")] = "Hara-Bhara-Kebab.jpg"
file_map[normalize("Paneer Chilli")] = "chilli_paneer.avif"
file_map[normalize("Peri Peri Potato")] = "periPotato.jpg"
file_map[normalize("Schezwan Fried Rice")] = "Schezwan4FriedRice.jpg"
file_map[normalize("Dal Makhani")] = "dakMakhani.jpg"
file_map[normalize("Mix Veg Curry")] = "mixed-vegetable-curry.jpg"
file_map[normalize("Choco Lava Cake")] = "ChocolateLavaCake.jpg"
file_map[normalize("Cheese Cake")] = "classic-cheesecake.webp"
file_map[normalize("Masala Tea")] = "Chai-Tea-Recipe.jpg"
file_map[normalize("Cold Coffee")] = "coldCoffeeCrush.jpg"
file_map[normalize("Cold Coffee with Cursh")] = "coldCoffeeCrush.jpg"
file_map[normalize("Mango Shake")] = "mango-milkshake2.webp"
file_map[normalize("Strawberry Shake")] = "strawberryMilkshake.jpg"
file_map[normalize("Sweet Lassi")] = "Lassi.webp"
file_map[normalize("Masala Buttermilk")] = "buttermilk.jpg"
file_map[normalize("Peri Peri Fries")] = "periFries.png"


for menu in Menu.objects.all():

    filename = file_map.get(normalize(menu.name))

    if not filename:
        print(f"⚠️ No matching image found for: {menu.name}")
        continue

    image_path = os.path.join(IMAGE_DIR, filename)

    try:
        result = cloudinary.uploader.upload(
            image_path,
            folder="restaurant_menu"
        )

        menu.image = result["public_id"]
        menu.save(update_fields=["image"])

        print(f"✅ {menu.name} → {filename}")
        print(f"   URL: {result['secure_url']}")

    except Exception as e:
        print(f"❌ Failed: {menu.name}")
        print(f"   {e}")
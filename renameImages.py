# Script that renames every jpg to a number
import os

IMAGE_DIR = "img/"

def getAllJPGInDir(dir):
    return [f for f in os.listdir(dir) if f.endswith('.jpg')]

def renameImages(images):
    i = 0
    for img in images:
        imgName = img.replace(".jpg", "")
        if imgName.isdigit():
            print("Image " + img + " already has a number")
            continue

        while os.path.isfile(IMAGE_DIR + str(i) + ".jpg"):
            i += 1
        
        os.rename(IMAGE_DIR + img, IMAGE_DIR + str(i) + ".jpg")
        print("Renamed " + img + " to " + str(i) + ".jpg")

images = getAllJPGInDir(IMAGE_DIR)
renameImages(images)

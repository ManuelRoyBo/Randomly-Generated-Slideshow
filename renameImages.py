# Script that renames every jpg to a number
#Might need to be ran twice. Make sure images start at 0.jpg
import os

def renameImages():
    i = 0
    path = "img/"
    if not os.path.exists(path):
        print(f"Error: {path} directory does not exist")
        return
    try:
        for filename in os.listdir(path):
            if filename.endswith(".jpg"):
                new_name = str(i) + ".jpg"
                while os.path.exists(os.path.join(path, new_name)):
                    i += 1
                    new_name = str(i) + ".jpg"
                os.rename(os.path.join(path, filename), os.path.join(path, new_name))
                i += 1
            else:
                continue
    except Exception as e:
        print(f"Error: {e}")

renameImages()

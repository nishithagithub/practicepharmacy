import easyocr
import cv2
import sqlite3
import matplotlib.pyplot as plt

# Initialize the EasyOCR reader
reader = easyocr.Reader(['en'])

# Capture an image from the camera
cap = cv2.VideoCapture(0)
if not cap.isOpened():
    print("Error: Could not open camera.")
    exit()

ret, frame = cap.read()
if not ret:
    print("Error: Could not read frame from camera.")
    cap.release()
    exit()

# Release the camera
cap.release()

# Perform text detection using EasyOCR
results = reader.readtext(frame)

# Connect to SQLite database (or create it if it doesn't exist)
conn = sqlite3.connect('extracted_texts.db')
cursor = conn.cursor()

# Create a table to store the extracted text
cursor.execute('''
CREATE TABLE IF NOT EXISTS texts (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    text TEXT,
    bbox TEXT,
    probability REAL
)
''')

# Heuristic to identify bold text
def is_bold(bbox):
    pt1, pt2 = bbox[0], bbox[2]
    width = abs(pt2[0] - pt1[0])
    height = abs(pt2[1] - pt1[1])
    return height / width > 0.5  # Adjust this ratio based on your needs

# Insert extracted bold text into the database
for (bbox, text, prob) in results:
    if is_bold(bbox):
        cursor.execute('''
        INSERT INTO texts (text, bbox, probability)
        VALUES (?, ?, ?)
        ''', (text, str(bbox), prob))

# Commit the transaction and close the connection
conn.commit()
conn.close()

# Optionally, visualize the detected text
for (bbox, text, prob) in results:
    if is_bold(bbox):
        # Ensure bbox points are properly formatted
        pt1 = tuple(map(int, bbox[0]))
        pt2 = tuple(map(int, bbox[2]))
        # Draw the bounding box
        cv2.rectangle(frame, pt1, pt2, (0, 255, 0), 2)
        # Put the detected text near the bounding box
        cv2.putText(frame, text, pt1, cv2.FONT_HERSHEY_SIMPLEX, 0.8, (255, 0, 0), 2, cv2.LINE_AA)

# Display the image with bounding boxes
plt.imshow(cv2.cvtColor(frame, cv2.COLOR_BGR2RGB))
plt.axis('off')
plt.show()

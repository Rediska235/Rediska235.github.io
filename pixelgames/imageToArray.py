from PIL import Image
import numpy as np
import sys

# Load image
img = Image.open("preview.png").convert('L')
width, height = img.size

# Check dimensions
if width != 128 or height != 32:
    print(f"Error: Image must be 128x32 pixels, got {width}x{height}")
    sys.exit(1)

# Convert to array and threshold
pixels = np.array(img)
binary = (pixels < 128).astype(int)

# Generate hex values
hex_array = []
for col in range(128):
    value = 0
    for row in range(32):
        if binary[31 - row, col]:
            value |= (1 << row)
    hex_array.append(f"0x{value:08X}")

# Print without quotes
print("[", end="")
for i in range(128):
    if i > 0:
        print(", ", end="")
        if i % 8 == 0:  # New line every 8 values
            print("\n ", end="")
    print(hex_array[i], end="")
print("]")
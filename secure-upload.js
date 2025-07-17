import CryptoJS from 'crypto-js';
import { sha256 } from 'crypto-hash';
import { uploadEncryptedImage } from 'backend/uploadHandler';

const ENCRYPTION_KEY = "secure-shared-key-2024"; // Replace with secure secret or move to Secrets Manager

$w.onReady(() => {
  // Initialize status text
  $w("#statusText").text = "Ready to upload. Please select an image file.";
  
  // Handle file selection
  $w("#uploadButton1").onChange(() => {
    const files = $w("#uploadButton1").value;
    if (files && files.length > 0) {
      const file = files[0];
      $w("#statusText").text = `Selected: ${file.name} (${(file.size / 1024 / 1024).toFixed(2)} MB)`;
    }
  });

  // Handle upload submission
  $w("#submitButton").onClick(async () => {
    const files = $w("#uploadButton1").value;

    if (!files || files.length === 0) {
      $w("#statusText").text = "❌ Please select an image file first.";
      return;
    }

    const file = files[0];
    
    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg', 'image/gif', 'image/bmp', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      $w("#statusText").text = "❌ Please select a valid image file (JPEG, PNG, GIF, BMP, WebP).";
      return;
    }

    // Check file size (max 50MB)
    if (file.size > 50 * 1024 * 1024) {
      $w("#statusText").text = "❌ File size too large. Maximum 50MB allowed.";
      return;
    }

    try {
      $w("#statusText").text = "🔄 Processing and encrypting image...";
      $w("#submitButton").disable();

      const reader = new FileReader();
      reader.onload = async () => {
        try {
          const base64 = reader.result.split(',')[1];

          // 🔐 Encrypt image data
          $w("#statusText").text = "🔐 Encrypting image data...";
          const encrypted = CryptoJS.AES.encrypt(base64, ENCRYPTION_KEY).toString();

          // 📦 Create encrypted blob
          const encryptedBlob = new Blob([encrypted], { type: "text/plain" });

          // 🧮 Generate SHA-256 hash for integrity verification
          $w("#statusText").text = "🧮 Generating security hash...";
          const hash = await sha256(base64);

          // Get user email if provided
          const userEmail = $w("#userEmail").value || "anonymous";

          // 🛫 Upload to backend
          $w("#statusText").text = "🛫 Uploading encrypted data...";
          const response = await uploadEncryptedImage(
            encryptedBlob, 
            file.name, 
            hash, 
            userEmail,
            file.size,
            file.type
          );

          $w("#statusText").text = `✅ Upload successful! File ID: ${response.fileId}`;
          
          // Clear the file input
          $w("#uploadButton1").value = [];
          
        } catch (uploadError) {
          console.error("Upload error:", uploadError);
          $w("#statusText").text = "❌ Upload failed. Please try again.";
        } finally {
          $w("#submitButton").enable();
        }
      };

      reader.onerror = () => {
        $w("#statusText").text = "❌ Error reading file. Please try again.";
        $w("#submitButton").enable();
      };

      reader.readAsDataURL(file);

    } catch (err) {
      console.error("Processing error:", err);
      $w("#statusText").text = "❌ Error processing file. Please try again.";
      $w("#submitButton").enable();
    }
  });
});
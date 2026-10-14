/**
 * XRayAI API Service
 * Handles communication with the FastAPI backend.
 */

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

/**
 * Submits a chest X-ray image for AI classification.
 *
 * @param {File} file - The image file to analyze (JPG/JPEG/PNG)
 * @returns {Promise<{prediction: string, confidence: number}>}
 * @throws {Error} with user-friendly message on failure
 */
export async function analyzeXRay(file) {
  if (!file) {
    throw new Error("No image file provided. Please select a chest X-ray image.");
  }

  const allowedTypes = ["image/jpeg", "image/jpg", "image/png"];
  if (!allowedTypes.includes(file.type)) {
    throw new Error(
      "Invalid file type. Please upload a JPG, JPEG, or PNG image."
    );
  }

  const maxSizeMB = 10;
  if (file.size > maxSizeMB * 1024 * 1024) {
    throw new Error(
      `File is too large. Maximum allowed size is ${maxSizeMB}MB.`
    );
  }

  const formData = new FormData();
  formData.append("file", file);

  let response;
  try {
    response = await fetch(`${API_URL}/predict`, {
      method: "POST",
      body: formData,
    });
  } catch (networkError) {
    throw new Error(
      "Unable to connect to the analysis server. Please ensure the backend is running and try again."
    );
  }

  if (!response.ok) {
    let errorMessage = `Server error (${response.status}).`;
    try {
      const errorData = await response.json();
      if (errorData?.detail) {
        errorMessage = "The server could not process this image. Please try a different image.";
      }
    } catch {
      // Ignore JSON parse errors for error responses
    }
    throw new Error(errorMessage);
  }

  let data;
  try {
    data = await response.json();
  } catch {
    throw new Error(
      "Received an invalid response from the server. Please try again."
    );
  }

  if (
    typeof data.prediction !== "string" ||
    typeof data.confidence !== "number"
  ) {
    throw new Error(
      "Received an unexpected response format from the server."
    );
  }

  return {
    prediction: data.prediction,
    confidence: data.confidence,
  };
}

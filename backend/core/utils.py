import os
import cloudinary.uploader
from django.conf import settings

def upload_to_cloudinary_if_configured(file_obj, folder='careerconnect'):
    """
    Uploads a file to Cloudinary if credentials are configured in settings.
    Returns the secure URL on success, otherwise None.
    """
    cloud_name = getattr(settings, 'CLOUDINARY_CLOUD_NAME', None)
    api_key = getattr(settings, 'CLOUDINARY_API_KEY', None)
    api_secret = getattr(settings, 'CLOUDINARY_API_SECRET', None)
    
    if cloud_name and api_key and api_secret:
        try:
            # Re-read or ensure configuration
            import cloudinary
            cloudinary.config(
                cloud_name=cloud_name,
                api_key=api_key,
                api_secret=api_secret,
                secure=True
            )
            # auto resource_type handles PDF, docx, image, etc.
            upload_result = cloudinary.uploader.upload(
                file_obj, 
                folder=folder, 
                resource_type="auto"
            )
            return upload_result.get('secure_url')
        except Exception as e:
            print(f"Cloudinary upload failed: {e}")
            return None
    return None

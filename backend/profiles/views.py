from rest_framework import views, status, permissions
from rest_framework.response import Response
from .models import EmployerProfile, JobSeekerProfile
from .serializers import EmployerProfileSerializer, JobSeekerProfileSerializer
from core.utils import upload_to_cloudinary_if_configured

class ProfileView(views.APIView):
    permission_classes = (permissions.IsAuthenticated,)

    def get_object(self):
        user = self.request.user
        if user.role == 'EMPLOYER':
            # Handle case where profile doesn't exist yet (fallback)
            profile, _ = EmployerProfile.objects.get_or_create(user=user)
            return profile
        elif user.role == 'JOBSEEKER':
            profile, _ = JobSeekerProfile.objects.get_or_create(user=user)
            return profile
        return None

    def get(self, request):
        obj = self.get_object()
        if not obj:
            return Response({"error": "Profile not found"}, status=status.HTTP_404_NOT_FOUND)
        
        if request.user.role == 'EMPLOYER':
            serializer = EmployerProfileSerializer(obj)
        else:
            serializer = JobSeekerProfileSerializer(obj)
        return Response(serializer.data)

    def put(self, request):
        obj = self.get_object()
        if not obj:
            return Response({"error": "Profile not found"}, status=status.HTTP_404_NOT_FOUND)

        # Handle updating user-specific fields (profile_image, email)
        user = request.user
        user_updated = False
        
        # Check if email is updated
        email = request.data.get('email')
        if email and email != user.email:
            user.email = email
            user_updated = True

        # Check if profile_image is updated
        profile_image = request.data.get('profile_image')
        if profile_image and not isinstance(profile_image, str): # Verify it's a file
            cloudinary_url = upload_to_cloudinary_if_configured(profile_image, folder='profiles')
            user.profile_image = profile_image
            user_updated = True

        if user_updated:
            user.save()

        # Update profile-specific fields
        if request.user.role == 'EMPLOYER':
            serializer = EmployerProfileSerializer(obj, data=request.data, partial=True)
        else:
            serializer = JobSeekerProfileSerializer(obj, data=request.data, partial=True)
            
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data)

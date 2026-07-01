from rest_framework import serializers
from .models import EmployerProfile, JobSeekerProfile
from core.utils import upload_to_cloudinary_if_configured

class EmployerProfileSerializer(serializers.ModelSerializer):
    username = serializers.CharField(source='user.username', read_only=True)
    email = serializers.CharField(source='user.email', read_only=True)
    role = serializers.CharField(source='user.role', read_only=True)
    profile_image = serializers.ImageField(source='user.profile_image', read_only=True)

    class Meta:
        model = EmployerProfile
        fields = ('id', 'username', 'email', 'role', 'profile_image', 'company_name', 'website', 'industry', 'location', 'description')
        read_only_fields = ('id',)

class JobSeekerProfileSerializer(serializers.ModelSerializer):
    username = serializers.CharField(source='user.username', read_only=True)
    email = serializers.CharField(source='user.email', read_only=True)
    role = serializers.CharField(source='user.role', read_only=True)
    profile_image = serializers.ImageField(source='user.profile_image', read_only=True)

    class Meta:
        model = JobSeekerProfile
        fields = ('id', 'username', 'email', 'role', 'profile_image', 'phone', 'skills', 'education', 'experience', 'resume', 'github', 'linkedin')
        read_only_fields = ('id',)

    def update(self, instance, validated_data):
        # Handle manual resume upload to Cloudinary if it is passed in the update data
        resume_file = validated_data.get('resume')
        if resume_file:
            cloudinary_url = upload_to_cloudinary_if_configured(resume_file, folder='resumes')
            if cloudinary_url:
                # Store URL directly. If using standard FileField, assigning the URL string is fine
                # but to make Django save it as a URL string without throwing format errors, we can write:
                instance.resume = cloudinary_url
                # Remove 'resume' from validated_data so standard Django FileField save isn't triggered
                validated_data.pop('resume')
                
        return super().update(instance, validated_data)

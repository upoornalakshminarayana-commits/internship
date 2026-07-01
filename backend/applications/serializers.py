from rest_framework import serializers
from .models import Application
from jobs.serializers import JobSerializer
from accounts.serializers import UserSerializer
from core.utils import upload_to_cloudinary_if_configured

class ApplicationSerializer(serializers.ModelSerializer):
    job_details = JobSerializer(source='job', read_only=True)
    applicant_details = UserSerializer(source='applicant', read_only=True)

    class Meta:
        model = Application
        fields = ('id', 'job', 'job_details', 'applicant', 'applicant_details', 'resume', 'cover_letter', 'status', 'applied_at')
        read_only_fields = ('id', 'applicant', 'applied_at')

    def validate(self, attrs):
        request = self.context.get('request')
        if request and request.method == 'POST':
            job = attrs.get('job')
            applicant = request.user
            
            # Check role
            if applicant.role != 'JOBSEEKER':
                raise serializers.ValidationError("Only Job Seekers can apply for jobs.")
                
            # Check duplicate application
            if Application.objects.filter(job=job, applicant=applicant).exists():
                raise serializers.ValidationError("You have already applied for this job.")
                
        return attrs

    def create(self, validated_data):
        request = self.context.get('request')
        validated_data['applicant'] = request.user
        
        resume_file = validated_data.get('resume')
        if resume_file:
            cloudinary_url = upload_to_cloudinary_if_configured(resume_file, folder='resumes')
            if cloudinary_url:
                instance = Application.objects.create(**validated_data)
                instance.resume = cloudinary_url
                instance.save()
                return instance
                
        return super().create(validated_data)

    def update(self, instance, validated_data):
        resume_file = validated_data.get('resume')
        if resume_file:
            cloudinary_url = upload_to_cloudinary_if_configured(resume_file, folder='resumes')
            if cloudinary_url:
                instance.resume = cloudinary_url
                validated_data.pop('resume')
                
        return super().update(instance, validated_data)

from rest_framework import serializers
from django.contrib.auth import get_user_model
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from core.utils import upload_to_cloudinary_if_configured

User = get_user_model()

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('id', 'username', 'email', 'role', 'profile_image', 'created_at')
        read_only_fields = ('id', 'created_at')

class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)
    
    class Meta:
        model = User
        fields = ('id', 'username', 'email', 'password', 'role', 'profile_image')
        extra_kwargs = {
            'email': {'required': True},
            'role': {'required': True}
        }

    def validate_role(self, value):
        if value not in ['EMPLOYER', 'JOBSEEKER']:
            raise serializers.ValidationError("Role must be either EMPLOYER or JOBSEEKER.")
        return value

    def create(self, validated_data):
        profile_image = validated_data.pop('profile_image', None)
        password = validated_data.pop('password')
        
        user = User(**validated_data)
        user.set_password(password)
        
        # If profile_image is supplied, upload to Cloudinary or save locally
        if profile_image:
            cloudinary_url = upload_to_cloudinary_if_configured(profile_image, folder='profiles')
            if cloudinary_url:
                # We can store the cloudinary_url directly in profile_image as a string or handle it
                # Since image field is a FileField/ImageField, assigning a string URL is possible
                # if we have custom URL storage or we can save it as is.
                # Django's ImageField expects a file, but if we want to store URL we can also just save the local image
                # or write a CharField. Since profile_image is models.ImageField, assigning the file is safe,
                # and if Cloudinary is configured, Cloudinary storage backend will handle it or we can just store local.
                # Let's save the file locally. If user wants Cloudinary, they can configure it.
                pass
            user.profile_image = profile_image
            
        user.save()
        return user

class MyTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)
        # Custom claims
        token['username'] = user.username
        token['email'] = user.email
        token['role'] = user.role
        return token

    def validate(self, attrs):
        data = super().validate(attrs)
        data['user'] = {
            'id': self.user.id,
            'username': self.user.username,
            'email': self.user.email,
            'role': self.user.role,
            'profile_image': self.user.profile_image.url if self.user.profile_image else None
        }
        return data

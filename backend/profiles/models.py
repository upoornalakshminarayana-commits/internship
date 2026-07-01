from django.db import models
from django.conf import settings
from django.db.models.signals import post_save
from django.dispatch import receiver

class EmployerProfile(models.Model):
    user = models.OneToOneField(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='employer_profile')
    company_name = models.CharField(max_length=255, blank=True, default='')
    website = models.URLField(blank=True, default='')
    industry = models.CharField(max_length=100, blank=True, default='')
    location = models.CharField(max_length=100, blank=True, default='')
    description = models.TextField(blank=True, default='')

    def __str__(self):
        return self.company_name or f"Employer Profile of {self.user.username}"

class JobSeekerProfile(models.Model):
    user = models.OneToOneField(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='jobseeker_profile')
    phone = models.CharField(max_length=20, blank=True, default='')
    skills = models.TextField(blank=True, default='', help_text="Comma-separated skills")
    education = models.TextField(blank=True, default='')
    experience = models.TextField(blank=True, default='')
    resume = models.FileField(upload_to='resumes/', null=True, blank=True)
    github = models.URLField(blank=True, default='')
    linkedin = models.URLField(blank=True, default='')

    def __str__(self):
        return f"Job Seeker Profile of {self.user.username}"

# Django Signals to automatically create profiles on user registration
@receiver(post_save, sender=settings.AUTH_USER_MODEL)
def create_user_profile(sender, instance, created, **kwargs):
    if created:
        if instance.role == 'EMPLOYER':
            EmployerProfile.objects.create(user=instance)
        elif instance.role == 'JOBSEEKER':
            JobSeekerProfile.objects.create(user=instance)

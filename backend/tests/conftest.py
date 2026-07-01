import pytest
from django.contrib.auth import get_user_model
from rest_framework.test import APIClient
from rest_framework_simplejwt.tokens import RefreshToken
from jobs.models import Job

User = get_user_model()

@pytest.fixture
def api_client():
    return APIClient()

@pytest.fixture
def db_user(db):
    """Create a generic user."""
    return User.objects.create_user(
        username='testuser',
        email='testuser@example.com',
        password='Password123!',
        role='JOBSEEKER'
    )

@pytest.fixture
def employer_user(db):
    """Create an employer user."""
    user = User.objects.create_user(
        username='employer_user',
        email='employer@company.com',
        password='EmployerPassword123!',
        role='EMPLOYER'
    )
    # Ensure profile company_name is set
    user.employer_profile.company_name = "Acme Corp"
    user.employer_profile.save()
    return user

@pytest.fixture
def candidate_user(db):
    """Create a job seeker user."""
    return User.objects.create_user(
        username='candidate_user',
        email='candidate@seeker.com',
        password='CandidatePassword123!',
        role='JOBSEEKER'
    )

@pytest.fixture
def employer_client(employer_user):
    """API Client authenticated as an employer."""
    client = APIClient()
    refresh = RefreshToken.for_user(employer_user)
    client.credentials(HTTP_AUTHORIZATION=f'Bearer {refresh.access_token}')
    return client

@pytest.fixture
def candidate_client(candidate_user):
    """API Client authenticated as a job seeker."""
    client = APIClient()
    refresh = RefreshToken.for_user(candidate_user)
    client.credentials(HTTP_AUTHORIZATION=f'Bearer {refresh.access_token}')
    return client

@pytest.fixture
def job_posting(employer_user):
    """Create a sample job posting."""
    return Job.objects.create(
        employer=employer_user,
        title="Software Engineer",
        company="Acme Corp",
        description="Write code.",
        requirements="Python, Django",
        salary=120000.00,
        location="Remote",
        job_type="Full-time",
        experience_level="Mid",
        category="Tech"
    )

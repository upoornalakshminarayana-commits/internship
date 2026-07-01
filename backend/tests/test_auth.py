import pytest
from django.urls import reverse
from django.contrib.auth import get_user_model

User = get_user_model()

@pytest.mark.django_db
def test_user_registration(api_client):
    url = reverse('auth_register')
    data = {
        "username": "newcandidate",
        "email": "newcandidate@gmail.com",
        "password": "SecurePassword123!",
        "role": "JOBSEEKER"
    }
    response = api_client.post(url, data)
    assert response.status_code == 201
    assert "user" in response.data
    assert response.data["user"]["username"] == "newcandidate"
    assert User.objects.filter(username="newcandidate").exists()

@pytest.mark.django_db
def test_user_registration_invalid_role(api_client):
    url = reverse('auth_register')
    data = {
        "username": "newcandidate",
        "email": "newcandidate@gmail.com",
        "password": "SecurePassword123!",
        "role": "ADMIN" # Invalid role
    }
    response = api_client.post(url, data)
    assert response.status_code == 400
    assert "role" in response.data

@pytest.mark.django_db
def test_jwt_login(api_client, db_user):
    url = reverse('token_obtain_pair')
    data = {
        "username": "testuser",
        "password": "Password123!"
    }
    response = api_client.post(url, data)
    assert response.status_code == 200
    assert "access" in response.data
    assert "refresh" in response.data
    assert "user" in response.data
    assert response.data["user"]["username"] == "testuser"

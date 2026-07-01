import pytest
from django.urls import reverse
from jobs.models import Job

@pytest.mark.django_db
def test_job_list_is_public(api_client, job_posting):
    url = reverse('jobs-list')
    response = api_client.get(url)
    assert response.status_code == 200
    assert len(response.data['results']) >= 1

@pytest.mark.django_db
def test_employer_can_create_job(employer_client):
    url = reverse('jobs-list')
    data = {
        "title": "React Developer",
        "company": "SaaS Startup",
        "description": "Build cool UIs.",
        "requirements": "React, Tailwind",
        "salary": 100000.00,
        "location": "New York",
        "job_type": "Full-time",
        "experience_level": "Mid",
        "category": "Tech"
    }
    response = employer_client.post(url, data)
    assert response.status_code == 201
    assert Job.objects.filter(title="React Developer").exists()

@pytest.mark.django_db
def test_candidate_cannot_create_job(candidate_client):
    url = reverse('jobs-list')
    data = {
        "title": "React Developer",
        "company": "SaaS Startup",
        "description": "Build cool UIs.",
        "requirements": "React, Tailwind"
    }
    response = candidate_client.post(url, data)
    assert response.status_code == 403

@pytest.mark.django_db
def test_only_owner_can_modify_job(employer_client, candidate_client, job_posting):
    url = reverse('jobs-detail', kwargs={'pk': job_posting.id})
    data = {"title": "Updated Title"}
    
    # Candidate try -> 403
    response = candidate_client.put(url, data)
    assert response.status_code == 403

    # Owner try -> 200
    response = employer_client.patch(url, data)
    assert response.status_code == 200
    job_posting.refresh_from_db()
    assert job_posting.title == "Updated Title"

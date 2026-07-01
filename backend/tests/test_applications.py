import pytest
from django.urls import reverse
from applications.models import Application

@pytest.mark.django_db
def test_candidate_can_apply_to_job(candidate_client, job_posting):
    url = reverse('applications-list')
    data = {
        "job": job_posting.id,
        "cover_letter": "I love Python and Django."
    }
    response = candidate_client.post(url, data)
    assert response.status_code == 201
    assert Application.objects.filter(job=job_posting).exists()

@pytest.mark.django_db
def test_cannot_apply_twice(candidate_client, job_posting):
    url = reverse('applications-list')
    data = {
        "job": job_posting.id,
        "cover_letter": "First application."
    }
    
    # Try 1
    response = candidate_client.post(url, data)
    assert response.status_code == 201
    
    # Try 2
    response2 = candidate_client.post(url, data)
    assert response2.status_code == 400
    assert "non_field_errors" in response2.data or "errors" in response2.data or any("applied" in str(err) for err in response2.data)

@pytest.mark.django_db
def test_role_based_application_status_update(employer_client, candidate_client, job_posting, candidate_user):
    # Setup application
    application = Application.objects.create(
        job=job_posting,
        applicant=candidate_user,
        cover_letter="Interested."
    )
    url = reverse('applications-detail', kwargs={'pk': application.id})
    data = {"status": "ACCEPTED"}

    # Candidate attempts to change status -> 403
    response = candidate_client.patch(url, data)
    assert response.status_code == 403

    # Employer attempts to change status -> 200
    response2 = employer_client.patch(url, data)
    assert response2.status_code == 200
    application.refresh_from_db()
    assert application.status == "ACCEPTED"

from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import JobViewSet, SavedJobViewSet

router = DefaultRouter()
# Note: 'saved' registered first so it routes correctly before empty-path JobViewSet fallback
router.register(r'saved', SavedJobViewSet, basename='saved-jobs')
router.register(r'', JobViewSet, basename='jobs')

urlpatterns = [
    path('', include(router.urls)),
]

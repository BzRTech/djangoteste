from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import TbStudentsViewSet, TbClassViewSet

# Router do DRF facilita a criação automática das URLs
router = DefaultRouter()
router.register(r'students', TbStudentsViewSet, basename='student')
router.register(r'classes', TbClassViewSet, basename='class')

urlpatterns = [
    path('', include(router.urls)),
]
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    TbStudentsViewSet, TbClassViewSet, TbCityViewSet,
    TbSchoolViewSet, TbTeacherViewSet, TbDistractorCatalogViewSet,
    TbStudentAnswersViewSet, TbStudentFactorAchievementsViewSet
)

# Router do DRF com trailing_slash=False para URLs mais limpas (opcional)
router = DefaultRouter()

# Registro de todas as rotas
router.register(r'cities', TbCityViewSet, basename='city')
router.register(r'schools', TbSchoolViewSet, basename='school')
router.register(r'teachers', TbTeacherViewSet, basename='teacher')
router.register(r'classes', TbClassViewSet, basename='class')
router.register(r'students', TbStudentsViewSet, basename='student')
router.register(r'distractors', TbDistractorCatalogViewSet, basename='distractor')
router.register(r'student-answers', TbStudentAnswersViewSet, basename='student-answer')
router.register(r'student-achievements', TbStudentFactorAchievementsViewSet, basename='student-achievement')

urlpatterns = [
    path('', include(router.urls)),
]
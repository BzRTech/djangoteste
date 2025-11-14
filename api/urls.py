from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import *

router = DefaultRouter()

# ============================================
# ROTAS DE LOCALIZAÇÃO E ESTRUTURA
# ============================================
router.register(r'cities', TbCityViewSet, basename='city')
router.register(r'schools', TbSchoolViewSet, basename='school')
router.register(r'teachers', TbTeacherViewSet, basename='teacher')
router.register(r'teacher-schools', TbTeacherSchoolViewSet, basename='teacher-school')
router.register(r'classes', TbClassViewSet, basename='class')
router.register(r'students', TbStudentsViewSet, basename='student')
router.register(r'subjects', TbSubjectViewSet, basename='subject')  

# ============================================
# ROTAS DE INDICADORES IDEB
# ============================================
router.register(r'school-ideb-indicators', TbSchoolIdebIndicatorsViewSet, basename='school-ideb')
router.register(r'class-ideb-indicators', TbClassIdebIndicatorsViewSet, basename='class-ideb')

# ============================================
# ROTAS DE COMPETÊNCIAS E DESCRITORES
# ============================================
router.register(r'competencies', TbCompetencyIdebViewSet, basename='competency')
# ✅ CORREÇÃO: Mudado de 'distractors' para 'descriptors'
router.register(r'descriptors', TbDescriptorsCatalogViewSet, basename='descriptor')

# ============================================
# ROTAS DE EXAMES E QUESTÕES
# ============================================
router.register(r'exams', TbExamsViewSet, basename='exam')
router.register(r'questions', TbQuestionsViewSet, basename='question')
router.register(r'alternatives', TbAlternativesViewSet, basename='alternative')
router.register(r'question-competencies', TbQuestionCompetencyViewSet, basename='question-competency')

# ============================================
# ROTAS DE APLICAÇÕES E RESULTADOS
# ============================================
router.register(r'exam-applications', TbExamApplicationsViewSet, basename='exam-application')
router.register(r'assessment-metadata', TbAssessmentMetadataViewSet, basename='assessment-metadata')
router.register(r'student-answers', TbStudentAnswersViewSet, basename='student-answer')
router.register(r'exam-results', TbExamResultsViewSet, basename='exam-result')

# ============================================
# ROTAS DE PROGRESSO E CONQUISTAS
# ============================================
router.register(r'student-achievements', TbStudentDescriptorAchievementsViewSet, basename='student-achievement')
router.register(r'learning-progress', TbStudentLearningProgressViewSet, basename='learning-progress')

urlpatterns = [
    path('', include(router.urls)),
]
from rest_framework import viewsets, filters
from rest_framework.decorators import action
from rest_framework.response import Response
from django_filters.rest_framework import DjangoFilterBackend

from students.models import *
from .serializers import *


# ============================================
# VIEWSETS DE LOCALIZAÇÃO E ESTRUTURA
# ============================================

class TbCityViewSet(viewsets.ModelViewSet):
    """Cidades"""
    queryset = TbCity.objects.all()
    serializer_class = TbCitySerializer
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['city', 'state']
    ordering_fields = ['city', 'state']


class TbSchoolViewSet(viewsets.ModelViewSet):
    """Escolas"""
    queryset = TbSchool.objects.all().select_related('id_city')
    serializer_class = TbSchoolSerializer
    filter_backends = [DjangoFilterBackend, filters.SearchFilter]
    filterset_fields = ['id_city', 'id_city__state']
    search_fields = ['school', 'director_name', 'address']


class TbTeacherViewSet(viewsets.ModelViewSet):
    """Professores"""
    queryset = TbTeacher.objects.all()
    serializer_class = TbTeacherSerializer
    filter_backends = [DjangoFilterBackend, filters.SearchFilter]
    filterset_fields = ['status']
    search_fields = ['teacher_name', 'teacher_serial']


class TbTeacherSchoolViewSet(viewsets.ModelViewSet):
    """Relação Professor-Escola"""
    queryset = TbTeacherSchool.objects.all().select_related('id_teacher', 'id_school')
    serializer_class = TbTeacherSchoolSerializer
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ['id_teacher', 'id_school', 'status']


class TbClassViewSet(viewsets.ModelViewSet):
    """Turmas"""
    queryset = TbClass.objects.all().select_related('id_teacher', 'id_school')
    serializer_class = TbClassSerializer
    filter_backends = [DjangoFilterBackend, filters.SearchFilter]
    filterset_fields = ['id_school', 'id_teacher', 'school_year', 'grade', 'shift']
    search_fields = ['class_name']


class TbStudentsViewSet(viewsets.ModelViewSet):
    """Alunos"""
    queryset = TbStudents.objects.all().select_related('id_class')
    serializer_class = TbStudentsSerializer
    lookup_field = 'id_student'
    filter_backends = [DjangoFilterBackend, filters.SearchFilter]
    filterset_fields = ['id_class', 'status']
    search_fields = ['student_name', 'student_serial']


# ============================================
# VIEWSETS DE INDICADORES IDEB
# ============================================

class TbSchoolIdebIndicatorsViewSet(viewsets.ModelViewSet):
    """Indicadores IDEB das Escolas"""
    queryset = TbSchoolIdebIndicators.objects.all().select_related('id_school')
    serializer_class = TbSchoolIdebIndicatorsSerializer
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ['id_school', 'fiscal_year']


class TbClassIdebIndicatorsViewSet(viewsets.ModelViewSet):
    """Indicadores IDEB das Turmas"""
    queryset = TbClassIdebIndicators.objects.all().select_related('id_class')
    serializer_class = TbClassIdebIndicatorsSerializer
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ['id_class', 'fiscal_year']


# ============================================
# VIEWSETS DE COMPETÊNCIAS E DESCRITORES
# ============================================

class TbCompetencyIdebViewSet(viewsets.ModelViewSet):
    """Competências IDEB"""
    queryset = TbCompetencyIdeb.objects.all()
    serializer_class = TbCompetencyIdebSerializer
    filter_backends = [DjangoFilterBackend, filters.SearchFilter]
    filterset_fields = ['subject', 'grade']
    search_fields = ['competency_code', 'competency_name']


# ✅ CORREÇÃO: Renomeado para DescriptorsCatalog
class TbDescriptorsCatalogViewSet(viewsets.ModelViewSet):
    """Catálogo de Descritores"""
    queryset = TbDescriptorsCatalog.objects.all()
    serializer_class = TbDescriptorsCatalogSerializer
    filter_backends = [DjangoFilterBackend, filters.SearchFilter]
    filterset_fields = ['subject', 'grade', 'learning_field']
    search_fields = ['descriptor_code', 'descriptor_name', 'descriptor_description']  # ✅ Corrigido


# ============================================
# VIEWSETS DE EXAMES E QUESTÕES
# ============================================

class TbExamsViewSet(viewsets.ModelViewSet):
    """Exames"""
    queryset = TbExams.objects.all()
    serializer_class = TbExamsSerializer
    filter_backends = [DjangoFilterBackend, filters.SearchFilter]
    filterset_fields = ['subject', 'school_year']
    search_fields = ['exam_code', 'exam_name']

    @action(detail=True, methods=['get'])
    def questions(self, request, pk=None):
        """Retorna todas as questões de um exame"""
        exam = self.get_object()
        questions = TbQuestions.objects.filter(id_exam=exam).select_related('id_descriptor')  # ✅ Corrigido
        serializer = TbQuestionsSerializer(questions, many=True)
        return Response(serializer.data)


class TbQuestionsViewSet(viewsets.ModelViewSet):
    """Questões"""
    queryset = TbQuestions.objects.all().select_related('id_exam', 'id_descriptor')  # ✅ Corrigido
    serializer_class = TbQuestionsSerializer
    filter_backends = [DjangoFilterBackend, filters.SearchFilter]
    filterset_fields = ['id_exam', 'difficulty_level', 'id_descriptor']  # ✅ Corrigido
    search_fields = ['question_text']


class TbAlternativesViewSet(viewsets.ModelViewSet):
    """Alternativas"""
    queryset = TbAlternatives.objects.all().select_related('id_question')
    serializer_class = TbAlternativesSerializer
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ['id_question', 'is_correct']


class TbQuestionCompetencyViewSet(viewsets.ModelViewSet):
    """Relação Questão-Competência"""
    queryset = TbQuestionCompetency.objects.all().select_related('id_question', 'id_competency')
    serializer_class = TbQuestionCompetencySerializer
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ['id_question', 'id_competency']


# ============================================
# VIEWSETS DE APLICAÇÕES E RESULTADOS
# ============================================

class TbExamApplicationsViewSet(viewsets.ModelViewSet):
    """Aplicações de Exames"""
    queryset = TbExamApplications.objects.all().select_related(
        'id_exam', 'id_class', 'id_teacher'
    )
    serializer_class = TbExamApplicationsSerializer
    filter_backends = [DjangoFilterBackend, filters.OrderingFilter]
    filterset_fields = [
        'id_exam', 'id_class', 'id_teacher', 'status', 
        'application_type', 'assessment_period', 'fiscal_year'
    ]
    ordering_fields = ['application_date', 'created_at']

    @action(detail=True, methods=['get'])
    def results(self, request, pk=None):
        """Retorna todos os resultados de uma aplicação"""
        application = self.get_object()
        results = TbExamResults.objects.filter(id_exam_application=application).select_related('id_student')
        serializer = TbExamResultsSerializer(results, many=True)
        return Response(serializer.data)


class TbAssessmentMetadataViewSet(viewsets.ModelViewSet):
    """Metadados de Avaliações"""
    queryset = TbAssessmentMetadata.objects.all().select_related('id_exam_application')
    serializer_class = TbAssessmentMetadataSerializer
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ['application_type', 'assessment_period', 'fiscal_year']


class TbStudentAnswersViewSet(viewsets.ModelViewSet):
    """Respostas dos Alunos"""
    queryset = TbStudentAnswers.objects.all().select_related(
        'id_student', 'id_question', 'id_selected_alternative'
    )
    serializer_class = TbStudentAnswersSerializer
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ['id_student', 'id_exam_application', 'id_question', 'is_correct']


class TbExamResultsViewSet(viewsets.ModelViewSet):
    """Resultados dos Exames"""
    queryset = TbExamResults.objects.all().select_related('id_student', 'id_exam_application')
    serializer_class = TbExamResultsSerializer
    filter_backends = [DjangoFilterBackend, filters.OrderingFilter]
    filterset_fields = ['id_student', 'id_exam_application']
    ordering_fields = ['total_score', 'created_at']


# ============================================
# VIEWSETS DE PROGRESSO E CONQUISTAS
# ============================================

# ✅ CORREÇÃO: Renomeado para DescriptorAchievements
class TbStudentDescriptorAchievementsViewSet(viewsets.ModelViewSet):
    """Conquistas de Descritores dos Alunos"""
    queryset = TbStudentDescriptorAchievements.objects.all().select_related(
        'id_student', 'id_descriptor'  # ✅ Corrigido
    )
    serializer_class = TbStudentDescriptorAchievementsSerializer
    filter_backends = [DjangoFilterBackend, filters.OrderingFilter]
    filterset_fields = ['id_student', 'id_descriptor', 'id_exam_application']  # ✅ Corrigido
    ordering_fields = ['achieved_at']


class TbStudentLearningProgressViewSet(viewsets.ModelViewSet):
    """Progresso de Aprendizagem dos Alunos"""
    queryset = TbStudentLearningProgress.objects.all().select_related(
        'id_student', 'id_competency', 'id_exam_application'
    )
    serializer_class = TbStudentLearningProgressSerializer
    filter_backends = [DjangoFilterBackend, filters.OrderingFilter]
    filterset_fields = ['id_student', 'id_competency', 'id_exam_application']
    ordering_fields = ['assessment_date', 'competency_mastery']

    @action(detail=False, methods=['get'])
    def by_student(self, request):
        """Retorna o progresso de um aluno específico"""
        student_id = request.query_params.get('student_id')
        if not student_id:
            return Response({'error': 'student_id is required'}, status=400)
        
        progress = self.queryset.filter(id_student=student_id).order_by('-assessment_date')
        serializer = self.get_serializer(progress, many=True)
        return Response(serializer.data)

    @action(detail=False, methods=['get'])
    def low_performance(self, request):
        """Retorna alunos com baixo desempenho (< 50%)"""
        threshold = request.query_params.get('threshold', 50)
        progress = self.queryset.filter(competency_mastery__lt=threshold)
        serializer = self.get_serializer(progress, many=True)
        return Response(serializer.data)
from rest_framework import viewsets, filters, status
from rest_framework.decorators import action
from rest_framework.response import Response
from django_filters.rest_framework import DjangoFilterBackend
from django.db import transaction
from django.db.models import Count, Avg, Max, Min

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
    """Professores com suporte a disciplinas"""
    queryset = TbTeacher.objects.all()
    serializer_class = TbTeacherSerializer
    filter_backends = [DjangoFilterBackend, filters.SearchFilter]
    filterset_fields = ['status']
    search_fields = ['teacher_name', 'teacher_serial']
    
    @action(detail=True, methods=['get'])
    def subjects(self, request, pk=None):
        """Lista todas as disciplinas de um professor"""
        teacher = self.get_object()
        teacher_subjects = TbTeacherSubject.objects.filter(id_teacher=teacher).select_related('id_subject')
        serializer = TbTeacherSubjectSerializer(teacher_subjects, many=True)
        return Response(serializer.data)
    
    @action(detail=True, methods=['post'])
    def add_subject(self, request, pk=None):
        """Adiciona uma disciplina ao professor"""
        teacher = self.get_object()
        subject_id = request.data.get('subject_id')
        
        if not subject_id:
            return Response({'error': 'subject_id é obrigatório'}, status=400)
        
        try:
            subject = TbSubject.objects.get(id=subject_id)
            TbTeacherSubject.objects.get_or_create(
                id_teacher=teacher,
                id_subject=subject
            )
            return Response({'message': 'Disciplina adicionada com sucesso'})
        except TbSubject.DoesNotExist:
            return Response({'error': 'Disciplina não encontrada'}, status=404)
    
    @action(detail=True, methods=['delete'])
    def remove_subject(self, request, pk=None):
        """Remove uma disciplina do professor"""
        teacher = self.get_object()
        subject_id = request.data.get('subject_id')
        
        if not subject_id:
            return Response({'error': 'subject_id é obrigatório'}, status=400)
        
        deleted = TbTeacherSubject.objects.filter(
            id_teacher=teacher,
            id_subject_id=subject_id
        ).delete()
        
        if deleted[0] > 0:
            return Response({'message': 'Disciplina removida com sucesso'})
        return Response({'error': 'Relacionamento não encontrado'}, status=404)


class TbTeacherSubjectViewSet(viewsets.ModelViewSet):
    """Relação Professor-Disciplina"""
    queryset = TbTeacherSubject.objects.all().select_related('id_teacher', 'id_subject')
    serializer_class = TbTeacherSubjectSerializer
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ['id_teacher', 'id_subject']


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
    queryset = TbStudents.objects.all().select_related(
        'id_class',
        'id_class__id_school',
        'id_class__id_teacher'
    )
    serializer_class = TbStudentsSerializer
    lookup_field = 'id_student'
    filter_backends = [DjangoFilterBackend, filters.SearchFilter]
    filterset_fields = ['id_class', 'status']
    search_fields = ['student_name', 'student_serial']


class TbSubjectViewSet(viewsets.ModelViewSet):
    """Disciplinas (Subjects)"""
    queryset = TbSubject.objects.all()
    serializer_class = TbSubjectSerializer
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['subject_name', 'description']
    ordering_fields = ['subject_name']

    
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


class TbDescriptorsCatalogViewSet(viewsets.ModelViewSet):
    """Catálogo de Descritores"""
    queryset = TbDescriptorsCatalog.objects.all()
    serializer_class = TbDescriptorsCatalogSerializer
    filter_backends = [DjangoFilterBackend, filters.SearchFilter]
    filterset_fields = ['subject', 'grade', 'learning_field']
    search_fields = ['descriptor_code', 'descriptor_name', 'descriptor_description']


# ============================================
# VIEWSETS DE EXAMES E QUESTÕES
# ============================================

class TbExamsViewSet(viewsets.ModelViewSet):
    """Exames com funcionalidades extras"""
    queryset = TbExams.objects.all()
    serializer_class = TbExamsSerializer
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['subject', 'school_year']
    search_fields = ['exam_code', 'exam_name']
    ordering_fields = ['created_at', 'exam_name']

    def get_serializer_class(self):
        if self.action == 'list' or self.action == 'retrieve':
            return TbExamsDetailSerializer
        return TbExamsSerializer

    @action(detail=True, methods=['get'])
    def questions(self, request, pk=None):
        """Lista todas as questões do exame com alternativas"""
        exam = self.get_object()
        questions = TbQuestions.objects.filter(id_exam=exam).select_related('id_descriptor')
        serializer = TbQuestionsSerializer(questions, many=True)
        return Response(serializer.data)

    @action(detail=True, methods=['get'])
    def statistics(self, request, pk=None):
        """Estatísticas do exame"""
        exam = self.get_object()
        
        applications = TbExamApplications.objects.filter(id_exam=exam)
        results = TbExamResults.objects.filter(id_exam_application__id_exam=exam)
        
        stats = {
            'total_applications': applications.count(),
            'total_students': results.count(),
            'average_score': results.aggregate(Avg('total_score'))['total_score__avg'] or 0,
            'highest_score': results.aggregate(Max('total_score'))['total_score__max'] or 0,
            'lowest_score': results.aggregate(Min('total_score'))['total_score__min'] or 0,
            'total_questions': TbQuestions.objects.filter(id_exam=exam).count(),
        }
        
        return Response(stats)


class TbQuestionsViewSet(viewsets.ModelViewSet):
    """Questões"""
    queryset = TbQuestions.objects.all().select_related('id_exam', 'id_descriptor')
    filter_backends = [DjangoFilterBackend, filters.SearchFilter]
    filterset_fields = ['id_exam', 'difficulty_level', 'id_descriptor']
    search_fields = ['question_text']
    
    def get_serializer_class(self):
        if self.action == 'create' or self.action == 'update':
            return TbQuestionsCreateSerializer
        return TbQuestionsSerializer


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
        'id_exam',
        'id_class',
        'id_class__id_school',
        'id_teacher'
    )
    serializer_class = TbExamApplicationsSerializer
    filter_backends = [DjangoFilterBackend, filters.OrderingFilter]
    filterset_fields = [
        'id_exam', 'id_class', 'id_teacher', 'status',
        'application_type', 'fiscal_year'
    ]
    ordering_fields = ['application_date', 'created_at']

    def get_serializer_class(self):
        # Detail endpoint usa serializer detalhado
        if self.action == 'retrieve' or self.action == 'list':
            return TbExamApplicationsDetailSerializer
        return TbExamApplicationsSerializer

    @action(detail=True, methods=['get'])
    def students(self, request, pk=None):
        """Lista alunos da turma que devem fazer a prova"""
        application = self.get_object()
        students = TbStudents.objects.filter(id_class=application.id_class)
        
        # Adiciona info se já tem resultado
        students_data = []
        for student in students:
            has_result = TbExamResults.objects.filter(
                id_student=student,
                id_exam_application=application
            ).exists()
            
            students_data.append({
                'id_student': student.id_student,
                'student_serial': student.student_serial,
                'student_name': student.student_name,
                'status': student.status,
                'has_result': has_result
            })
        
        return Response(students_data)

    @action(detail=True, methods=['get'])
    def results(self, request, pk=None):
        """Retorna todos os resultados de uma aplicação"""
        application = self.get_object()
        results = TbExamResults.objects.filter(
            id_exam_application=application
        ).select_related('id_student')
        serializer = TbExamResultsDetailSerializer(results, many=True)
        return Response(serializer.data)

    @action(detail=True, methods=['post'])
    def change_status(self, request, pk=None):
        """Altera o status da aplicação"""
        application = self.get_object()
        new_status = request.data.get('status')
        
        if new_status not in ['scheduled', 'in_progress', 'completed', 'cancelled']:
            return Response(
                {'error': 'Status inválido'}, 
                status=status.HTTP_400_BAD_REQUEST
            )
        
        application.status = new_status
        application.save()
        
        serializer = self.get_serializer(application)
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

    @action(detail=False, methods=['post'])
    def bulk_create(self, request):
        """Lançamento em lote de respostas"""
        serializer = BulkStudentAnswersSerializer(data=request.data)
        
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        
        validated_data = serializer.validated_data
        id_student = validated_data['id_student']
        id_exam_application = validated_data['id_exam_application']
        answers = validated_data['answers']
        
        created_answers = []
        
        with transaction.atomic():
            for answer in answers:
                # Verificar se a resposta está correta
                try:
                    question = TbQuestions.objects.get(id=answer['id_question'])
                    selected_alt_id = answer.get('id_selected_alternative')

                    # Verificar se a resposta está correta comparando IDs
                    is_correct = False
                    if selected_alt_id and question.correct_answer:
                        is_correct = int(selected_alt_id) == int(question.correct_answer)

                    student_answer = TbStudentAnswers.objects.create(
                        id_student_id=id_student,
                        id_exam_application_id=id_exam_application,
                        id_question_id=answer['id_question'],
                        id_selected_alternative_id=selected_alt_id,
                        answer_text=answer.get('answer_text', ''),
                        is_correct=is_correct
                    )
                    created_answers.append(student_answer)
                except TbQuestions.DoesNotExist:
                    continue
            
            # Calcular e criar resultado automático
            self._calculate_exam_result(id_student, id_exam_application)
        
        return Response({
            'message': 'Respostas registradas com sucesso',
            'total_answers': len(created_answers)
        }, status=status.HTTP_201_CREATED)
    
    def _calculate_exam_result(self, id_student, id_exam_application):
        """Calcula resultado automático baseado nas respostas"""
        answers = TbStudentAnswers.objects.filter(
            id_student_id=id_student,
            id_exam_application_id=id_exam_application
        ).select_related('id_question')
        
        total_score = sum([
            ans.id_question.points for ans in answers if ans.is_correct
        ])
        
        max_score = sum([ans.id_question.points for ans in answers])
        
        correct_answers = answers.filter(is_correct=True).count()
        wrong_answers = answers.filter(is_correct=False).count()
        blank_answers = 0
        
        # Criar ou atualizar resultado
        TbExamResults.objects.update_or_create(
            id_student_id=id_student,
            id_exam_application_id=id_exam_application,
            defaults={
                'total_score': total_score,
                'max_score': max_score,
                'correct_answers': correct_answers,
                'wrong_answers': wrong_answers,
                'blank_answers': blank_answers
            }
        )


class TbExamResultsViewSet(viewsets.ModelViewSet):
    """Resultados dos Exames"""
    queryset = TbExamResults.objects.all().select_related(
        'id_student',
        'id_student__id_class',
        'id_exam_application',
        'id_exam_application__id_exam'
    )
    filter_backends = [DjangoFilterBackend, filters.OrderingFilter]
    filterset_fields = ['id_student', 'id_exam_application']
    ordering_fields = ['total_score', 'created_at']

    def get_serializer_class(self):
        if self.action == 'list' or self.action == 'retrieve':
            return TbExamResultsDetailSerializer
        return TbExamResultsSerializer

    @action(detail=False, methods=['post'])
    def bulk_create(self, request):
        """Criação em lote de resultados"""
        results_data = request.data if isinstance(request.data, list) else [request.data]
        
        created_results = []
        errors = []
        
        with transaction.atomic():
            for data in results_data:
                try:
                    serializer = TbExamResultsSerializer(data=data)
                    if serializer.is_valid():
                        result = serializer.save()
                        created_results.append(result)
                    else:
                        errors.append({
                            'data': data,
                            'errors': serializer.errors
                        })
                except Exception as e:
                    errors.append({
                        'data': data,
                        'errors': str(e)
                    })
        
        return Response({
            'created': len(created_results),
            'errors': errors
        }, status=status.HTTP_201_CREATED if created_results else status.HTTP_400_BAD_REQUEST)


# ============================================
# VIEWSETS DE PROGRESSO E CONQUISTAS
# ============================================

class TbStudentDescriptorAchievementsViewSet(viewsets.ModelViewSet):
    """Conquistas de Descritores dos Alunos"""
    queryset = TbStudentDescriptorAchievements.objects.all().select_related(
        'id_student', 'id_descriptor'
    )
    serializer_class = TbStudentDescriptorAchievementsSerializer
    filter_backends = [DjangoFilterBackend, filters.OrderingFilter]
    filterset_fields = ['id_student', 'id_descriptor', 'id_exam_application']
    ordering_fields = ['achieved_at']


class TbStudentLearningProgressViewSet(viewsets.ModelViewSet):
    """Progresso de Aprendizagem dos Alunos"""
    queryset = TbStudentLearningProgress.objects.all().select_related(
        'id_student', 'id_descriptor', 'id_exam_application'
    )
    serializer_class = TbStudentLearningProgressSerializer
    filter_backends = [DjangoFilterBackend, filters.OrderingFilter]
    filterset_fields = ['id_student', 'id_descriptor', 'id_exam_application']
    ordering_fields = ['assessment_date', 'descriptor_mastery']

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
        progress = self.queryset.filter(descriptor_mastery__lt=threshold)
        serializer = self.get_serializer(progress, many=True)
        return Response(serializer.data)
    
class StudentProfileViewSet(viewsets.ReadOnlyModelViewSet):
    """Perfil completo do aluno com descritores conquistados"""
    queryset = TbStudents.objects.all().select_related(
        'id_class',
        'id_class__id_school',
        'id_class__id_teacher'
    )
    serializer_class = TbStudentsSerializer
    lookup_field = 'id_student'  # ✅ Importante: usar id_student como lookup
    
    @action(detail=True, methods=['get'])
    def profile(self, request, id_student=None):
        """Retorna perfil completo do aluno"""
        try:
            # ✅ Usar self.get_object() para buscar corretamente
            student = self.get_object()

            # Dados básicos do aluno com tratamento de None
            profile_data = {
                'id_student': student.id_student,
                'student_serial': student.student_serial,
                'student_name': student.student_name,
                'status': student.status,
                'enrollment_date': student.enrollment_date,
                'class_name': student.id_class.class_name if student.id_class else None,
                'school_name': (student.id_class.id_school.school
                               if student.id_class and student.id_class.id_school else None),
                'grade': student.id_class.grade if student.id_class else None,
            }
            
            # Descritores conquistados
            achievements = TbStudentDescriptorAchievements.objects.filter(
                id_student=student
            ).select_related('id_descriptor', 'id_exam_application')
            
            descriptors_achieved = []
            for achievement in achievements:
                exam_name = None
                if achievement.id_exam_application and achievement.id_exam_application.id_exam:
                    exam_name = achievement.id_exam_application.id_exam.exam_name

                descriptors_achieved.append({
                    'id': achievement.id_descriptor.id,
                    'descriptor_code': achievement.id_descriptor.descriptor_code,
                    'descriptor_name': achievement.id_descriptor.descriptor_name,
                    'subject': achievement.id_descriptor.subject,
                    'learning_field': achievement.id_descriptor.learning_field,
                    'icon': achievement.id_descriptor.icon,
                    'achieved_at': achievement.achieved_at,
                    'exam_name': exam_name,
                })
            
            # Todos os descritores do catálogo
            all_descriptors = TbDescriptorsCatalog.objects.all()
            total_descriptors = all_descriptors.count()
            achieved_count = len(descriptors_achieved)
            
            # Agrupa descritores por disciplina
            descriptors_by_subject = {}
            for desc in all_descriptors:
                subject = desc.subject or 'Outros'
                if subject not in descriptors_by_subject:
                    descriptors_by_subject[subject] = {
                        'total': 0,
                        'achieved': 0,
                        'descriptors': []
                    }
                descriptors_by_subject[subject]['total'] += 1
                descriptors_by_subject[subject]['descriptors'].append({
                    'id': desc.id,
                    'code': desc.descriptor_code,
                    'name': desc.descriptor_name,
                    'achieved': any(d['id'] == desc.id for d in descriptors_achieved)
                })
                
                # Conta conquistados
                if any(d['id'] == desc.id for d in descriptors_achieved):
                    descriptors_by_subject[subject]['achieved'] += 1
            
            # Estatísticas de progresso
            learning_progress = TbStudentLearningProgress.objects.filter(
                id_student=student
            ).select_related('id_descriptor').order_by('-assessment_date')[:5]

            recent_progress = []
            for progress in learning_progress:
                recent_progress.append({
                    'descriptor_name': progress.id_descriptor.descriptor_name,
                    'descriptor_code': progress.id_descriptor.descriptor_code,
                    'descriptor_mastery': float(progress.descriptor_mastery),
                    'assessment_date': progress.assessment_date,
                    'score': float(progress.score),
                    'max_score': float(progress.max_score),
                })
            
            # Últimos resultados de provas
            exam_results = TbExamResults.objects.filter(
                id_student=student
            ).select_related('id_exam_application__id_exam').order_by('-created_at')[:5]
            
            recent_exams = []
            for result in exam_results:
                recent_exams.append({
                    'exam_name': result.id_exam_application.id_exam.exam_name,
                    'total_score': float(result.total_score) if result.total_score else 0,
                    'max_score': float(result.max_score) if result.max_score else 0,
                    'percentage': round((float(result.total_score or 0) / float(result.max_score or 1)) * 100, 2),
                    'correct_answers': result.correct_answers,
                    'wrong_answers': result.wrong_answers,
                    'application_date': result.id_exam_application.application_date,
                })
            
            profile_data['descriptors'] = {
                'achieved': descriptors_achieved,
                'total_count': total_descriptors,
                'achieved_count': achieved_count,
                'percentage': round((achieved_count / total_descriptors * 100), 2) if total_descriptors > 0 else 0,
                'by_subject': descriptors_by_subject,
            }
            
            profile_data['recent_progress'] = recent_progress
            profile_data['recent_exams'] = recent_exams
            
            return Response(profile_data)
            
        except TbStudents.DoesNotExist:
            return Response({'error': 'Aluno não encontrado'}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

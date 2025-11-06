from rest_framework import viewsets, status
from rest_framework.response import Response
from rest_framework.decorators import action
from students.models import (
    TbStudents, TbClass, TbCity, TbSchool, 
    TbTeacher, TbDistractorCatalog, TbStudentAnswers,
    TbStudentFactorAchievements
)
from .serializers import (
    TbStudentsSerializer, TbClassSerializer, TbCitySerializer,
    TbSchoolSerializer, TbTeacherSerializer, TbDistractorCatalogSerializer,
    TbStudentAnswersSerializer, TbStudentFactorAchievementsSerializer
)


class TbCityViewSet(viewsets.ModelViewSet):
    """
    ViewSet completo (CRUD) para cidades.
    Endpoints: /api/cities/
    """
    queryset = TbCity.objects.all()
    serializer_class = TbCitySerializer


class TbSchoolViewSet(viewsets.ModelViewSet):
    """
    ViewSet completo (CRUD) para escolas.
    Endpoints: /api/schools/
    """
    queryset = TbSchool.objects.all().select_related('id_city')
    serializer_class = TbSchoolSerializer
    
    def get_queryset(self):
        """Permite filtrar escolas por cidade"""
        queryset = super().get_queryset()
        city_id = self.request.query_params.get('city_id', None)
        if city_id:
            queryset = queryset.filter(id_city=city_id)
        return queryset


class TbTeacherViewSet(viewsets.ModelViewSet):
    """
    ViewSet completo (CRUD) para professores.
    Endpoints: /api/teachers/
    """
    queryset = TbTeacher.objects.all()
    serializer_class = TbTeacherSerializer
    
    def get_queryset(self):
        """Permite filtrar professores por status"""
        queryset = super().get_queryset()
        teacher_status = self.request.query_params.get('status', None)
        if teacher_status:
            queryset = queryset.filter(status=teacher_status)
        return queryset


class TbClassViewSet(viewsets.ModelViewSet):
    """
    ViewSet completo (CRUD) para turmas.
    Endpoints: /api/classes/
    """
    queryset = TbClass.objects.all().select_related('id_teacher', 'id_school')
    serializer_class = TbClassSerializer
    
    def get_queryset(self):
        """Permite filtrar turmas por escola, professor, ano ou série"""
        queryset = super().get_queryset()
        school_id = self.request.query_params.get('school_id', None)
        teacher_id = self.request.query_params.get('teacher_id', None)
        school_year = self.request.query_params.get('school_year', None)
        grade = self.request.query_params.get('grade', None)
        
        if school_id:
            queryset = queryset.filter(id_school=school_id)
        if teacher_id:
            queryset = queryset.filter(id_teacher=teacher_id)
        if school_year:
            queryset = queryset.filter(school_year=school_year)
        if grade:
            queryset = queryset.filter(grade=grade)
        
        return queryset


class TbStudentsViewSet(viewsets.ModelViewSet):
    """
    ViewSet completo (CRUD) para alunos.
    Endpoints:
    - GET /api/students/ - Lista todos os alunos
    - POST /api/students/ - Cria novo aluno
    - GET /api/students/{id}/ - Detalhes de um aluno
    - PUT /api/students/{id}/ - Atualiza aluno completo
    - PATCH /api/students/{id}/ - Atualiza aluno parcial
    - DELETE /api/students/{id}/ - Deleta aluno
    """
    queryset = TbStudents.objects.all().select_related('id_class')
    serializer_class = TbStudentsSerializer
    lookup_field = 'id_student'
    
    def get_queryset(self):
        """Permite filtrar alunos por turma ou status"""
        queryset = super().get_queryset()
        class_id = self.request.query_params.get('class_id', None)
        student_status = self.request.query_params.get('status', None)
        
        if class_id:
            queryset = queryset.filter(id_class=class_id)
        if student_status:
            queryset = queryset.filter(status=student_status)
        
        return queryset
    
    @action(detail=False, methods=['get'])
    def by_class(self, request):
        """
        Endpoint customizado para buscar alunos por turma
        GET /api/students/by_class/?class_id=1
        """
        class_id = request.query_params.get('class_id')
        if not class_id:
            return Response(
                {'error': 'class_id é obrigatório'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        students = self.queryset.filter(id_class=class_id)
        serializer = self.get_serializer(students, many=True)
        return Response(serializer.data)


class TbDistractorCatalogViewSet(viewsets.ModelViewSet):
    """
    ViewSet completo (CRUD) para catálogo de distratores.
    Endpoints: /api/distractors/
    """
    queryset = TbDistractorCatalog.objects.all()
    serializer_class = TbDistractorCatalogSerializer
    
    def get_queryset(self):
        """Permite filtrar distratores por disciplina, série ou campo de aprendizagem"""
        queryset = super().get_queryset()
        subject = self.request.query_params.get('subject', None)
        grade = self.request.query_params.get('grade', None)
        learning_field = self.request.query_params.get('learning_field', None)
        
        if subject:
            queryset = queryset.filter(subject=subject)
        if grade:
            queryset = queryset.filter(grade=grade)
        if learning_field:
            queryset = queryset.filter(learning_field=learning_field)
        
        return queryset


class TbStudentAnswersViewSet(viewsets.ModelViewSet):
    """
    ViewSet completo (CRUD) para respostas dos alunos.
    Endpoints: /api/student-answers/
    """
    queryset = TbStudentAnswers.objects.all().select_related('id_student')
    serializer_class = TbStudentAnswersSerializer
    
    def get_queryset(self):
        """Permite filtrar respostas por aluno"""
        queryset = super().get_queryset()
        student_id = self.request.query_params.get('student_id', None)
        if student_id:
            queryset = queryset.filter(id_student=student_id)
        return queryset


class TbStudentFactorAchievementsViewSet(viewsets.ModelViewSet):
    """
    ViewSet completo (CRUD) para conquistas dos alunos.
    Endpoints: /api/student-achievements/
    """
    queryset = TbStudentFactorAchievements.objects.all().select_related('id_student')
    serializer_class = TbStudentFactorAchievementsSerializer
    
    def get_queryset(self):
        """Permite filtrar conquistas por aluno"""
        queryset = super().get_queryset()
        student_id = self.request.query_params.get('student_id', None)
        if student_id:
            queryset = queryset.filter(id_student=student_id)
        return queryset
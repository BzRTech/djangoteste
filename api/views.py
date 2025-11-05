from rest_framework import viewsets, status
from rest_framework.response import Response
from rest_framework.decorators import action
from students.models import TbStudents, TbClass
from .serializers import TbStudentsSerializer, TbClassSerializer


class TbClassViewSet(viewsets.ReadOnlyModelViewSet):
    """
    ViewSet apenas para leitura das turmas.
    Endpoint: /api/classes/
    """
    queryset = TbClass.objects.all()
    serializer_class = TbClassSerializer


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
    lookup_field = 'id_student'  # Usa id_student ao invés de pk na URL
    
    def get_queryset(self):
        """Permite filtrar alunos por turma"""
        queryset = super().get_queryset()
        class_id = self.request.query_params.get('class_id', None)
        if class_id:
            queryset = queryset.filter(id_class=class_id)
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
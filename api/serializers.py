from rest_framework import serializers
from students.models import *


# ============================================
# SERIALIZERS DE LOCALIZAÇÃO E ESTRUTURA
# ============================================

class TbCitySerializer(serializers.ModelSerializer):
    class Meta:
        model = TbCity
        fields = '__all__'

class TbSchoolSerializer(serializers.ModelSerializer):
    city_name = serializers.CharField(source='id_city.city', read_only=True)
    state = serializers.CharField(source='id_city.state', read_only=True)
    
    class Meta:
        model = TbSchool
        fields = ['id', 'school', 'director_name', 'id_city', 'city_name', 'state', 'address', 'created_at']


class TbTeacherSubjectSerializer(serializers.ModelSerializer):
    """Serializer para a tabela intermediária"""
    subject_name = serializers.CharField(source='id_subject.subject_name', read_only=True)
    
    class Meta:
        model = TbTeacherSubject
        fields = ['id', 'id_teacher', 'id_subject', 'subject_name', 'created_at']


class TbTeacherSerializer(serializers.ModelSerializer):
    """Serializer com suporte a subjects many-to-many"""
    subjects = serializers.PrimaryKeyRelatedField(
        many=True,
        queryset=TbSubject.objects.all(),
        write_only=True,
        required=False
    )
    subject_details = serializers.SerializerMethodField(read_only=True)
    
    class Meta:
        model = TbTeacher
        fields = ['id', 'teacher_serial', 'teacher_name', 'status', 'created_at', 'subjects', 'subject_details']
    
    def get_subject_details(self, obj):
        """Retorna lista de nomes das disciplinas"""
        teacher_subjects = TbTeacherSubject.objects.filter(id_teacher=obj).select_related('id_subject')
        return [ts.id_subject.subject_name for ts in teacher_subjects]
    
    def create(self, validated_data):
        """Cria professor e associa disciplinas"""
        subjects = validated_data.pop('subjects', [])
        teacher = TbTeacher.objects.create(**validated_data)
        
        # Cria os relacionamentos
        for subject in subjects:
            TbTeacherSubject.objects.create(
                id_teacher=teacher,
                id_subject=subject
            )
        
        return teacher
    
    def update(self, instance, validated_data):
        """Atualiza professor e suas disciplinas"""
        subjects = validated_data.pop('subjects', None)
        
        # Atualiza campos básicos
        instance.teacher_name = validated_data.get('teacher_name', instance.teacher_name)
        instance.teacher_serial = validated_data.get('teacher_serial', instance.teacher_serial)
        instance.status = validated_data.get('status', instance.status)
        instance.save()
        
        # Atualiza disciplinas se fornecidas
        if subjects is not None:
            # Remove relacionamentos antigos
            TbTeacherSubject.objects.filter(id_teacher=instance).delete()
            
            # Cria novos relacionamentos
            for subject in subjects:
                TbTeacherSubject.objects.create(
                    id_teacher=instance,
                    id_subject=subject
                )
        
        return instance


class TbTeacherSchoolSerializer(serializers.ModelSerializer):
    teacher_name = serializers.CharField(source='id_teacher.teacher_name', read_only=True)
    school_name = serializers.CharField(source='id_school.school', read_only=True)
    
    class Meta:
        model = TbTeacherSchool
        fields = [
            'id', 'id_teacher', 'teacher_name', 'id_school', 
            'school_name', 'assignment_date', 'status', 'created_at'
        ]


class TbClassSerializer(serializers.ModelSerializer):
    teacher_name = serializers.CharField(source='id_teacher.teacher_name', read_only=True)
    school_name = serializers.CharField(source='id_school.school', read_only=True)
    
    class Meta:
        model = TbClass
        fields = [
            'id', 'class_name', 'id_teacher', 'teacher_name', 
            'id_school', 'school_name', 'school_year', 'grade', 
            'shift', 'created_at'
        ]


class TbStudentsSerializer(serializers.ModelSerializer):
    class_name = serializers.CharField(source='id_class.class_name', read_only=True)
    
    class Meta:
        model = TbStudents
        fields = [
            'id_student', 'student_serial', 'student_name', 
            'id_class', 'class_name', 'enrollment_date', 
            'status', 'created_at'
        ]


# ============================================
# SERIALIZERS DE INDICADORES IDEB
# ============================================

class TbSchoolIdebIndicatorsSerializer(serializers.ModelSerializer):
    school_name = serializers.CharField(source='id_school.school', read_only=True)
    
    class Meta:
        model = TbSchoolIdebIndicators
        fields = [
            'id', 'id_school', 'school_name', 'fiscal_year',
            'ideb_target', 'regional_average', 'state_average',
            'critical_threshold', 'created_at'
        ]


class TbClassIdebIndicatorsSerializer(serializers.ModelSerializer):
    class_name = serializers.CharField(source='id_class.class_name', read_only=True)
    
    class Meta:
        model = TbClassIdebIndicators
        fields = [
            'id', 'id_class', 'class_name', 'fiscal_year',
            'class_ideb_target', 'expected_avg_score', 'created_at'
        ]


# ============================================
# SERIALIZERS DE COMPETÊNCIAS E DESCRITORES
# ============================================

class TbCompetencyIdebSerializer(serializers.ModelSerializer):
    class Meta:
        model = TbCompetencyIdeb
        fields = '__all__'


# ✅ CORREÇÃO: Renomeado para DescriptorsCatalog
class TbDescriptorsCatalogSerializer(serializers.ModelSerializer):
    class Meta:
        model = TbDescriptorsCatalog
        fields = '__all__'


# ============================================
# SERIALIZERS DE EXAMES E QUESTÕES
# ============================================

class TbExamsSerializer(serializers.ModelSerializer):
    class Meta:
        model = TbExams
        fields = '__all__'


class TbAlternativesSerializer(serializers.ModelSerializer):
    class Meta:
        model = TbAlternatives
        fields = '__all__'


class TbQuestionsSerializer(serializers.ModelSerializer):
    exam_name = serializers.CharField(source='id_exam.exam_name', read_only=True)
    descriptor_name = serializers.CharField(source='id_descriptor.descriptor_name', read_only=True)  # ✅ Corrigido
    alternatives = TbAlternativesSerializer(many=True, read_only=True, source='tbalternatives_set')
    
    class Meta:
        model = TbQuestions
        fields = [
            'id', 'id_exam', 'exam_name', 'question_number',
            'question_text', 'question_type', 'correct_answer',
            'skill_assessed', 'difficulty_level', 'points',
            'id_descriptor', 'descriptor_name', 'alternatives', 'created_at'  # ✅ Corrigido
        ]


class TbQuestionCompetencySerializer(serializers.ModelSerializer):
    question_text = serializers.CharField(source='id_question.question_text', read_only=True)
    competency_name = serializers.CharField(source='id_competency.competency_name', read_only=True)
    
    class Meta:
        model = TbQuestionCompetency
        fields = ['id_question', 'question_text', 'id_competency', 'competency_name']


# ============================================
# SERIALIZERS DE APLICAÇÕES E RESULTADOS
# ============================================

class TbExamApplicationsSerializer(serializers.ModelSerializer):
    exam_name = serializers.CharField(source='id_exam.exam_name', read_only=True)
    class_name = serializers.CharField(source='id_class.class_name', read_only=True)
    teacher_name = serializers.CharField(source='id_teacher.teacher_name', read_only=True)
    
    class Meta:
        model = TbExamApplications
        fields = [
            'id', 'id_exam', 'exam_name', 'id_class', 'class_name',
            'id_teacher', 'teacher_name', 'application_date',
            'start_time', 'end_time', 'status', 'observations',
            'application_type', 'assessment_period', 'fiscal_year', 'created_at'
        ]


class TbAssessmentMetadataSerializer(serializers.ModelSerializer):
    exam_name = serializers.CharField(source='id_exam_application.id_exam.exam_name', read_only=True)
    
    class Meta:
        model = TbAssessmentMetadata
        fields = [
            'id', 'id_exam_application', 'exam_name', 'application_type',
            'assessment_period', 'fiscal_year', 'notes', 'created_at'
        ]


class TbStudentAnswersSerializer(serializers.ModelSerializer):
    student_name = serializers.CharField(source='id_student.student_name', read_only=True)
    question_text = serializers.CharField(source='id_question.question_text', read_only=True)
    alternative_text = serializers.CharField(source='id_selected_alternative.alternative_text', read_only=True)
    
    class Meta:
        model = TbStudentAnswers
        fields = [
            'id', 'id_student', 'student_name', 'id_exam_application',
            'id_question', 'question_text', 'id_selected_alternative',
            'alternative_text', 'answer_text', 'is_correct',
            'response_time_seconds', 'answered_at'
        ]


class TbExamResultsSerializer(serializers.ModelSerializer):
    student_name = serializers.CharField(source='id_student.student_name', read_only=True)
    exam_name = serializers.CharField(source='id_exam_application.id_exam.exam_name', read_only=True)
    
    class Meta:
        model = TbExamResults
        fields = [
            'id', 'id_student', 'student_name', 'id_exam_application',
            'exam_name', 'total_score', 'max_score', 'correct_answers',
            'wrong_answers', 'blank_answers', 'completion_time_minutes',
            'started_at', 'finished_at', 'created_at'
        ]


# ============================================
# SERIALIZERS DE PROGRESSO E CONQUISTAS
# ============================================

# ✅ CORREÇÃO: Renomeado para DescriptorAchievements
class TbStudentDescriptorAchievementsSerializer(serializers.ModelSerializer):
    student_name = serializers.CharField(source='id_student.student_name', read_only=True)
    descriptor_name = serializers.CharField(source='id_descriptor.descriptor_name', read_only=True)  # ✅ Corrigido
    
    class Meta:
        model = TbStudentDescriptorAchievements
        fields = [
            'id', 'id_student', 'student_name', 'id_descriptor',  # ✅ Corrigido
            'descriptor_name', 'id_exam_application', 'achieved_at'  # ✅ Corrigido
        ]


class TbStudentLearningProgressSerializer(serializers.ModelSerializer):
    student_name = serializers.CharField(source='id_student.student_name', read_only=True)
    competency_name = serializers.CharField(source='id_competency.competency_name', read_only=True)
    
    class Meta:
        model = TbStudentLearningProgress
        fields = [
            'id', 'id_student', 'student_name', 'id_competency',
            'competency_name', 'id_exam_application', 'score',
            'max_score', 'competency_mastery', 'assessment_date', 'created_at'
        ]
        
# ============================================
# SERIALIZERS DETALHADOS PARA PROVAS
# ============================================

class TbExamsDetailSerializer(serializers.ModelSerializer):
    """Serializer detalhado com contagem de questões"""
    questions_count = serializers.SerializerMethodField()
    subject_name = serializers.CharField(source='subject', read_only=True)
    
    class Meta:
        model = TbExams
        fields = [
            'id', 'exam_code', 'exam_name', 'subject', 'subject_name',
            'school_year', 'total_questions', 'description', 
            'questions_count', 'created_at'
        ]
    
    def get_questions_count(self, obj):
        return TbQuestions.objects.filter(id_exam=obj).count()


class TbQuestionsCreateSerializer(serializers.ModelSerializer):
    """Serializer para criação de questões"""
    alternatives = TbAlternativesSerializer(many=True, required=False)
    
    class Meta:
        model = TbQuestions
        fields = [
            'id', 'id_exam', 'question_number', 'question_text',
            'question_type', 'correct_answer', 'skill_assessed',
            'difficulty_level', 'points', 'id_descriptor', 'alternatives'
        ]
    
    def create(self, validated_data):
        alternatives_data = validated_data.pop('alternatives', [])
        question = TbQuestions.objects.create(**validated_data)
        
        for alt_data in alternatives_data:
            TbAlternatives.objects.create(id_question=question, **alt_data)
        
        return question


class TbExamApplicationsDetailSerializer(serializers.ModelSerializer):
    """Serializer detalhado para aplicações"""
    exam_name = serializers.CharField(source='id_exam.exam_name', read_only=True)
    exam_subject = serializers.CharField(source='id_exam.subject', read_only=True)
    class_name = serializers.CharField(source='id_class.class_name', read_only=True)
    teacher_name = serializers.CharField(source='id_teacher.teacher_name', read_only=True)
    school_name = serializers.CharField(source='id_class.id_school.school', read_only=True)
    students_count = serializers.SerializerMethodField()
    results_count = serializers.SerializerMethodField()
    
    class Meta:
        model = TbExamApplications
        fields = [
            'id', 'id_exam', 'exam_name', 'exam_subject',
            'id_class', 'class_name', 'school_name',
            'id_teacher', 'teacher_name', 'application_date',
            'start_time', 'end_time', 'status', 'observations',
            'application_type', 'assessment_period', 'fiscal_year',
            'students_count', 'results_count', 'created_at'
        ]
    
    def get_students_count(self, obj):
        return TbStudents.objects.filter(id_class=obj.id_class).count()
    
    def get_results_count(self, obj):
        return TbExamResults.objects.filter(id_exam_application=obj).count()


class TbExamResultsDetailSerializer(serializers.ModelSerializer):
    """Serializer detalhado para resultados"""
    student_name = serializers.CharField(source='id_student.student_name', read_only=True)
    student_serial = serializers.IntegerField(source='id_student.student_serial', read_only=True)
    class_name = serializers.CharField(source='id_student.id_class.class_name', read_only=True)
    exam_name = serializers.CharField(source='id_exam_application.id_exam.exam_name', read_only=True)
    percentage = serializers.SerializerMethodField()
    
    class Meta:
        model = TbExamResults
        fields = [
            'id', 'id_student', 'student_name', 'student_serial', 'class_name',
            'id_exam_application', 'exam_name', 'total_score', 'max_score',
            'percentage', 'correct_answers', 'wrong_answers', 'blank_answers',
            'completion_time_minutes', 'started_at', 'finished_at', 'created_at'
        ]
    
    def get_percentage(self, obj):
        if obj.max_score and obj.max_score > 0:
            return round((obj.total_score / obj.max_score) * 100, 2)
        return 0.0


class BulkStudentAnswersSerializer(serializers.Serializer):
    """Serializer para lançamento em lote de respostas"""
    id_student = serializers.IntegerField()
    id_exam_application = serializers.IntegerField()
    answers = serializers.ListField(
        child=serializers.DictField()
    )
    
    def validate(self, data):
        # Validar se o aluno existe
        if not TbStudents.objects.filter(id_student=data['id_student']).exists():
            raise serializers.ValidationError("Aluno não encontrado")
        
        # Validar se a aplicação existe
        if not TbExamApplications.objects.filter(id=data['id_exam_application']).exists():
            raise serializers.ValidationError("Aplicação de exame não encontrada")
        
        return data
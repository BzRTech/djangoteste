from rest_framework import serializers
from students.models import *

# ============================================
# 1. CADASTROS BÁSICOS E GEOLOCALIZAÇÃO
# ============================================

class TbCitySerializer(serializers.ModelSerializer):
    class Meta:
        model = TbCity
        fields = '__all__'


class TbSubjectSerializer(serializers.ModelSerializer):
    """Serializer para disciplinas (Base do currículo)"""
    class Meta:
        model = TbSubject
        fields = '__all__'


class TbDescriptorsCatalogSerializer(serializers.ModelSerializer):
    """Catálogo de Descritores"""
    class Meta:
        model = TbDescriptorsCatalog
        fields = '__all__'


class TbCompetencyIdebSerializer(serializers.ModelSerializer):
    """Catálogo de Competências"""
    class Meta:
        model = TbCompetencyIdeb
        fields = '__all__'


# ============================================
# 2. ESTRUTURA ESCOLAR E PESSOAS
# ============================================

class TbSchoolSerializer(serializers.ModelSerializer):
    city_name = serializers.CharField(source='id_city.city', read_only=True, allow_null=True)
    state = serializers.CharField(source='id_city.state', read_only=True, allow_null=True)

    class Meta:
        model = TbSchool
        fields = ['id', 'school', 'director_name', 'id_city', 'city_name', 'state', 'address', 'created_at', 'codigo_ideb']
        extra_kwargs = {
            'id_city': {'required': False, 'allow_null': True},
            'director_name': {'required': False, 'allow_blank': True, 'allow_null': True},
            'address': {'required': False, 'allow_blank': True, 'allow_null': True},
            'codigo_ideb': {'required': False, 'allow_blank': True, 'allow_null': True},  # ← Adicionar
        }
        


class TbTeacherSubjectSerializer(serializers.ModelSerializer):
    """Serializer para a tabela intermediária"""
    subject_name = serializers.CharField(source='id_subject.subject_name', read_only=True)
    
    class Meta:
        model = TbTeacherSubject
        fields = ['id', 'id_teacher', 'id_subject', 'subject_name', 'created_at']


class TbTeacherSerializer(serializers.ModelSerializer):
    """Serializer Principal de Professor com suporte a Many-to-Many manual"""
    subjects = serializers.PrimaryKeyRelatedField(
        many=True,
        queryset=TbSubject.objects.all(),
        write_only=True,
        required=False
    )
    subject_details = serializers.SerializerMethodField(read_only=True)
    
    class Meta:
        model = TbTeacher
        fields = [
            'id', 'teacher_serial', 'teacher_name', 'status', 
            'created_at', 'subjects', 'subject_details'
        ]
    
    def get_subject_details(self, obj):
        """Retorna lista de nomes das disciplinas via tabela intermediária"""
        teacher_subjects = TbTeacherSubject.objects.filter(id_teacher=obj).select_related('id_subject')
        return [ts.id_subject.subject_name for ts in teacher_subjects]
    
    def create(self, validated_data):
        subjects = validated_data.pop('subjects', [])
        teacher = TbTeacher.objects.create(**validated_data)
        for subject in subjects:
            TbTeacherSubject.objects.create(id_teacher=teacher, id_subject=subject)
        return teacher
    
    def update(self, instance, validated_data):
        subjects = validated_data.pop('subjects', None)
        
        instance.teacher_name = validated_data.get('teacher_name', instance.teacher_name)
        instance.teacher_serial = validated_data.get('teacher_serial', instance.teacher_serial)
        instance.status = validated_data.get('status', instance.status)
        instance.save()
        
        if subjects is not None:
            TbTeacherSubject.objects.filter(id_teacher=instance).delete()
            for subject in subjects:
                TbTeacherSubject.objects.create(id_teacher=instance, id_subject=subject)
        return instance


class TbTeacherSchoolSerializer(serializers.ModelSerializer):
    """Tabela intermediária Professor <-> Escola"""
    teacher_name = serializers.CharField(source='id_teacher.teacher_name', read_only=True)
    school_name = serializers.CharField(source='id_school.school', read_only=True)
    
    class Meta:
        model = TbTeacherSchool
        fields = [
            'id', 'id_teacher', 'teacher_name', 'id_school', 
            'school_name', 'assignment_date', 'status', 'created_at'
        ]


class TbClassSerializer(serializers.ModelSerializer):
    teacher_name = serializers.CharField(source='id_teacher.teacher_name', read_only=True, allow_null=True)
    school_name = serializers.CharField(source='id_school.school', read_only=True, allow_null=True)

    class Meta:
        model = TbClass
        fields = [
            'id', 'class_name', 'id_teacher', 'teacher_name',
            'id_school', 'school_name', 'school_year', 'grade',
            'shift', 'created_at'
        ]
        extra_kwargs = {
            'id_teacher': {'required': False, 'allow_null': True},
            'id_school': {'required': False, 'allow_null': True},
            'shift': {'required': False, 'allow_blank': True, 'allow_null': True},
        }


class TbStudentsSerializer(serializers.ModelSerializer):
    class_name = serializers.CharField(source='id_class.class_name', read_only=True, allow_null=True)

    class Meta:
        model = TbStudents
        fields = [
            'id_student', 'student_serial', 'student_name',
            'id_class', 'class_name', 'enrollment_date',
            'status', 'created_at'
        ]
        extra_kwargs = {
            'id_class': {'required': False, 'allow_null': True},
            'enrollment_date': {'required': False, 'allow_null': True},
        }


# ============================================
# 3. INDICADORES E METAS (IDEB)
# ============================================

class TbSchoolIdebIndicatorsSerializer(serializers.ModelSerializer):
    school_name = serializers.CharField(source='id_school.school', read_only=True)
    
    class Meta:
        model = TbSchoolIdebIndicators
        fields = [
            'id', 'id_school', 'school_name', 'fiscal_year',
            'ideb_target', 'regional_average', 'state_average',
            'critical_threshold', 'actual_avg_score', 'created_at'
        ]


class TbClassIdebIndicatorsSerializer(serializers.ModelSerializer):
    class_name = serializers.CharField(source='id_class.class_name', read_only=True)
    
    class Meta:
        model = TbClassIdebIndicators
        fields = [
            'id', 'id_class', 'class_name', 'fiscal_year',
            'class_ideb_target', 'expected_avg_score', 
            'actual_avg_score', 'created_at'
        ]


# ============================================
# 4. DEFINIÇÃO DE PROVAS E QUESTÕES
# ============================================

class TbExamsSerializer(serializers.ModelSerializer):
    class Meta:
        model = TbExams
        fields = '__all__'
        extra_kwargs = {
            'description': {'required': False, 'allow_blank': True, 'allow_null': True},
            'total_questions': {'required': False, 'allow_null': True},
            'exam_file': {'required': False, 'allow_blank': True, 'allow_null': True},
        }


# ✅ SERIALIZER CORRIGIDO PARA ALTERNATIVES
class TbAlternativesSerializer(serializers.ModelSerializer):
    alternative_letter = serializers.SerializerMethodField()

    class Meta:
        model = TbAlternatives
        fields = '__all__'

    def get_alternative_letter(self, obj):
        """Converte alternative_order (1,2,3...) em letra (A,B,C...)"""
        if obj.alternative_order is None:
            return None
        letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
        if 1 <= obj.alternative_order <= 26:
            return letters[obj.alternative_order - 1]
        return str(obj.alternative_order)

class TbAlternativesCreateSerializer(serializers.ModelSerializer):
    """Serializer para criação de alternativas (apenas campos necessários)"""
    class Meta:
        model = TbAlternatives
        fields = ['alternative_order', 'alternative_text', 'is_correct', 'distractor_type']
        extra_kwargs = {
            'distractor_type': {'required': False, 'allow_null': True, 'allow_blank': True}
        }


# ✅ SERIALIZER DE LEITURA (usado para GET)
class TbQuestionsSerializer(serializers.ModelSerializer):
    exam_name = serializers.CharField(source='id_exam.exam_name', read_only=True)
    descriptor_name = serializers.CharField(source='id_descriptor.descriptor_name', read_only=True, allow_null=True)
    alternatives = TbAlternativesSerializer(many=True, read_only=True, source='tbalternatives_set')

    class Meta:
        model = TbQuestions
        fields = [
            'id', 'id_exam', 'exam_name', 'question_number',
            'question_text', 'question_type', 'correct_answer',
            'skill_assessed', 'difficulty_level', 'points',
            'id_descriptor', 'descriptor_name', 'alternatives', 'created_at'
        ]
        extra_kwargs = {
            'id_descriptor': {'required': False, 'allow_null': True},
            'correct_answer': {'required': False, 'allow_null': True},
            'skill_assessed': {'required': False, 'allow_blank': True, 'allow_null': True},
            'difficulty_level': {'required': False, 'allow_blank': True, 'allow_null': True},
            'points': {'required': False, 'allow_null': True},
        }


# ✅ SERIALIZER DE ESCRITA (usado para POST/PUT)
class TbQuestionsCreateSerializer(serializers.ModelSerializer):
    """Serializer otimizado para criação de questão com alternativas aninhadas"""
    alternatives = TbAlternativesCreateSerializer(many=True, required=False)
    
    class Meta:
        model = TbQuestions
        fields = [
            'id', 'id_exam', 'question_number', 'question_text',
            'question_type', 'correct_answer', 'skill_assessed',
            'difficulty_level', 'points', 'id_descriptor', 'alternatives'
        ]
        extra_kwargs = {
            'id_descriptor': {'required': False, 'allow_null': True},
            'correct_answer': {'required': False, 'allow_null': True},
            'skill_assessed': {'required': False, 'allow_blank': True, 'allow_null': True},
            'difficulty_level': {'required': False, 'allow_blank': True, 'allow_null': True},
            'points': {'required': False, 'allow_null': True},
        }
    
    def create(self, validated_data):
        alternatives_data = validated_data.pop('alternatives', [])
        question = TbQuestions.objects.create(**validated_data)

        for alt_data in alternatives_data:
            TbAlternatives.objects.create(id_question=question, **alt_data)

        # ✅ CORREÇÃO: Retorna usando o serializer completo para incluir as alternativas
        return question

    def update(self, instance, validated_data):
        alternatives_data = validated_data.pop('alternatives', [])

        # Atualizar campos da questão
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()

        # Remover alternativas antigas
        instance.tbalternatives_set.all().delete()

        # Criar novas alternativas
        for alt_data in alternatives_data:
            TbAlternatives.objects.create(id_question=instance, **alt_data)

        return instance
    
    def to_representation(self, instance):
        """
        ✅ SOLUÇÃO: Usa o TbQuestionsSerializer para serializar a resposta
        Isso garante que as alternativas sejam incluídas no response
        """
        return TbQuestionsSerializer(instance, context=self.context).data


class TbQuestionCompetencySerializer(serializers.ModelSerializer):
    """Relacionamento Questão <-> Competência"""
    question_text = serializers.CharField(source='id_question.question_text', read_only=True)
    competency_name = serializers.CharField(source='id_competency.competency_name', read_only=True)
    
    class Meta:
        model = TbQuestionCompetency
        fields = ['id_question', 'question_text', 'id_competency', 'competency_name']


class TbExamsDetailSerializer(serializers.ModelSerializer):
    """Serializer detalhado com contagem de questões"""
    questions_count = serializers.SerializerMethodField()
    subject_name = serializers.CharField(source='subject', read_only=True)

    class Meta:
        model = TbExams
        fields = [
            'id', 'exam_code', 'exam_name', 'subject', 'subject_name',
            'school_year', 'total_questions', 'description', 'exam_file',
            'questions_count', 'created_at'
        ]

    def get_questions_count(self, obj):
        return TbQuestions.objects.filter(id_exam=obj).count()


# ============================================
# 5. APLICAÇÃO DE PROVAS
# ============================================

class TbExamApplicationsSerializer(serializers.ModelSerializer):
    """Serializer básico para aplicação de exames"""
    exam_name = serializers.CharField(source='id_exam.exam_name', read_only=True)
    class_name = serializers.CharField(source='id_class.class_name', read_only=True)
    teacher_name = serializers.CharField(source='id_teacher.teacher_name', read_only=True)
    students_count = serializers.SerializerMethodField()
    
    class Meta:
        model = TbExamApplications
        fields = [
            'id', 'id_exam', 'exam_name', 'id_class', 'class_name',
            'id_teacher', 'teacher_name', 'application_date', 'start_time',
            'end_time', 'status', 'observations', 'application_type',
            'assessment_period', 'fiscal_year', 'students_count', 'created_at'
        ]
        extra_kwargs = {
            'start_time': {'required': False, 'allow_null': True},
            'end_time': {'required': False, 'allow_null': True},
            'observations': {'required': False, 'allow_null': True, 'allow_blank': True},
            'application_type': {'required': False, 'allow_null': True},
            'assessment_period': {'required': False, 'allow_null': True},
            'fiscal_year': {'required': False, 'allow_null': True},
        }

    def get_students_count(self, obj):
        """Retorna o número de alunos que responderam esta prova"""
        return TbStudentAnswers.objects.filter(id_exam_application=obj).values('id_student').distinct().count()


class TbExamApplicationsDetailSerializer(serializers.ModelSerializer):
    """Serializer detalhado para visualização completa da aplicação"""
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


class TbAssessmentMetadataSerializer(serializers.ModelSerializer):
    exam_name = serializers.CharField(source='id_exam_application.id_exam.exam_name', read_only=True)
    
    class Meta:
        model = TbAssessmentMetadata
        fields = [
            'id', 'id_exam_application', 'exam_name', 'application_type',
            'assessment_period', 'fiscal_year', 'notes', 'created_at'
        ]


# ============================================
# 6. RESPOSTAS E RESULTADOS DOS ALUNOS
# ============================================

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
        extra_kwargs = {
            'id_selected_alternative': {'required': False, 'allow_null': True},
            'answer_text': {'required': False, 'allow_blank': True, 'allow_null': True},
            'response_time_seconds': {'required': False, 'allow_null': True},
            'answered_at': {'required': False, 'allow_null': True},
        }


class BulkStudentAnswersSerializer(serializers.Serializer):
    """Serializer utilitário para receber respostas em lote"""
    id_student = serializers.IntegerField()
    id_exam_application = serializers.IntegerField()
    answers = serializers.ListField(child=serializers.DictField())
    
    def validate(self, data):
        if not TbStudents.objects.filter(id_student=data['id_student']).exists():
            raise serializers.ValidationError("Aluno não encontrado")
        if not TbExamApplications.objects.filter(id=data['id_exam_application']).exists():
            raise serializers.ValidationError("Aplicação de exame não encontrada")
        return data


class TbExamResultsSerializer(serializers.ModelSerializer):
    """Serializer básico para resultados"""
    student_name = serializers.CharField(source='id_student.student_name', read_only=True)
    exam_name = serializers.CharField(source='id_exam_application.id_exam.exam_name', read_only=True)

    class Meta:
        model = TbExamResults
        fields = [
            'id', 'id_student', 'student_name', 'id_exam_application',
            'exam_name', 'total_score', 'max_score', 'correct_answers',
            'wrong_answers', 'blank_answers', 'started_at', 'finished_at',
            'created_at'
        ]
        extra_kwargs = {
            'total_score': {'required': False, 'allow_null': True},
            'max_score': {'required': False, 'allow_null': True},
            'correct_answers': {'required': False, 'allow_null': True},
            'wrong_answers': {'required': False, 'allow_null': True},
            'blank_answers': {'required': False, 'allow_null': True},
            'started_at': {'required': False, 'allow_null': True},
            'finished_at': {'required': False, 'allow_null': True},
        }


class TbExamResultsDetailSerializer(serializers.ModelSerializer):
    """Serializer enriquecido para relatórios"""
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
            'started_at', 'finished_at', 'created_at'
        ]

    def get_percentage(self, obj):
        if obj.max_score and obj.max_score > 0:
            return round((obj.total_score / obj.max_score) * 100, 2)
        return 0.0


# ============================================
# 7. PROGRESSO E ANALÍTICOS
# ============================================

class TbStudentDescriptorAchievementsSerializer(serializers.ModelSerializer):
    student_name = serializers.CharField(source='id_student.student_name', read_only=True)
    descriptor_name = serializers.CharField(source='id_descriptor.descriptor_name', read_only=True)
    
    class Meta:
        model = TbStudentDescriptorAchievements
        fields = [
            'id', 'id_student', 'student_name', 'id_descriptor',
            'descriptor_name', 'id_exam_application', 'achieved_at'
        ]


class TbStudentLearningProgressSerializer(serializers.ModelSerializer):
    """
    Serializer para progresso de aprendizagem do aluno
    """
    student_name = serializers.CharField(source='id_student.student_name', read_only=True)
    descriptor_name = serializers.CharField(source='id_descriptor.descriptor_name', read_only=True)
    descriptor_code = serializers.CharField(source='id_descriptor.descriptor_code', read_only=True)
    
    class Meta:
        model = TbStudentLearningProgress
        fields = [
            'id', 'id_student', 'student_name', 'id_descriptor',
            'descriptor_code', 'descriptor_name', 'id_exam_application', 
            'score', 'max_score', 'descriptor_mastery', 'assessment_date', 
            'created_at'
        ]


class TbQuestionDescriptorSerializer(serializers.ModelSerializer):
    """
    Serializer para a tabela de relacionamento tb_question_descriptor
    """
    question_text = serializers.CharField(source='id_question.question_text', read_only=True)
    descriptor_name = serializers.CharField(source='id_descriptor.descriptor_name', read_only=True)
    descriptor_code = serializers.CharField(source='id_descriptor.descriptor_code', read_only=True)

    class Meta:
        model = TbQuestionDescriptor
        fields = [
            'id', 'id_question', 'question_text',
            'id_descriptor', 'descriptor_code', 'descriptor_name',
            'created_at'
        ]


# ============================================
# 8. DASHBOARD SECRETARIA DE EDUCACAO
# ============================================

class TbSchoolGeolocationSerializer(serializers.ModelSerializer):
    """Serializer para geolocalizacao das escolas"""
    school_name = serializers.CharField(source='id_school.school', read_only=True)

    class Meta:
        model = TbSchoolGeolocation
        fields = [
            'id', 'id_school', 'school_name', 'latitude', 'longitude',
            'zona', 'created_at', 'updated_at'
        ]


class TbSchoolWithGeolocationSerializer(serializers.ModelSerializer):
    """Serializer de escola incluindo geolocalizacao"""
    city_name = serializers.CharField(source='id_city.city', read_only=True, allow_null=True)
    state = serializers.CharField(source='id_city.state', read_only=True, allow_null=True)
    geolocation = TbSchoolGeolocationSerializer(read_only=True)

    class Meta:
        model = TbSchool
        fields = [
            'id', 'school', 'director_name', 'id_city', 'city_name',
            'state', 'address', 'codigo_ideb', 'geolocation', 'created_at'
        ]


class TbStudentAttendanceSerializer(serializers.ModelSerializer):
    """Serializer para frequencia individual do aluno"""
    student_name = serializers.CharField(source='id_student.student_name', read_only=True)
    class_name = serializers.CharField(source='id_class.class_name', read_only=True)

    class Meta:
        model = TbStudentAttendance
        fields = [
            'id', 'id_student', 'student_name', 'id_class', 'class_name',
            'attendance_date', 'status', 'justification', 'created_at'
        ]


class TbClassAttendanceSummarySerializer(serializers.ModelSerializer):
    """Serializer para resumo de frequencia por turma"""
    class_name = serializers.CharField(source='id_class.class_name', read_only=True)
    school_name = serializers.CharField(source='id_class.id_school.school', read_only=True)

    class Meta:
        model = TbClassAttendanceSummary
        fields = [
            'id', 'id_class', 'class_name', 'school_name', 'year_month',
            'school_days', 'total_presences', 'total_absences', 'total_justified',
            'attendance_rate', 'created_at', 'updated_at'
        ]


class TbSchoolInfrastructureSerializer(serializers.ModelSerializer):
    """Serializer completo para infraestrutura"""
    school_name = serializers.CharField(source='id_school.school', read_only=True)

    class Meta:
        model = TbSchoolInfrastructure
        fields = '__all__'


class TbSchoolInfrastructureSummarySerializer(serializers.ModelSerializer):
    """Serializer resumido para listagens"""
    school_name = serializers.CharField(source='id_school.school', read_only=True)
    total_recursos_tech = serializers.SerializerMethodField()
    score_acessibilidade = serializers.SerializerMethodField()

    class Meta:
        model = TbSchoolInfrastructure
        fields = [
            'id', 'id_school', 'school_name', 'num_salas', 'num_laboratorios',
            'tem_biblioteca', 'tem_quadra', 'tem_internet', 'num_computadores',
            'tem_acessibilidade', 'estado_conservacao', 'necessita_reforma',
            'total_recursos_tech', 'score_acessibilidade'
        ]

    def get_total_recursos_tech(self, obj):
        return obj.num_computadores + obj.num_tablets + obj.num_projetores

    def get_score_acessibilidade(self, obj):
        """Calcula score de acessibilidade (0-5)"""
        score = 0
        if obj.tem_acessibilidade:
            score += 1
        if obj.tem_rampa:
            score += 1
        if obj.tem_banheiro_pcd:
            score += 1
        if obj.tem_piso_tatil:
            score += 1
        if obj.tem_elevador:
            score += 1
        return score


class TbSchoolFinancialSerializer(serializers.ModelSerializer):
    """Serializer para dados financeiros por escola"""
    school_name = serializers.CharField(source='id_school.school', read_only=True)
    percentual_executado = serializers.SerializerMethodField()
    total_despesas = serializers.SerializerMethodField()

    class Meta:
        model = TbSchoolFinancial
        fields = '__all__'
        extra_fields = ['school_name', 'percentual_executado', 'total_despesas']

    def get_fields(self):
        fields = super().get_fields()
        for field in self.Meta.extra_fields:
            if field not in fields:
                pass  # extra_fields são adicionados via SerializerMethodField
        return fields

    def get_percentual_executado(self, obj):
        if obj.orcamento_total > 0:
            return round((float(obj.orcamento_executado) / float(obj.orcamento_total)) * 100, 2)
        return 0

    def get_total_despesas(self, obj):
        return float(
            obj.despesa_pessoal + obj.despesa_material + obj.despesa_manutencao +
            obj.despesa_alimentacao + obj.despesa_transporte + obj.despesa_equipamentos +
            obj.despesa_outros
        )


class TbMunicipalFinancialSerializer(serializers.ModelSerializer):
    """Serializer para dados financeiros municipais"""
    percentual_executado = serializers.SerializerMethodField()

    class Meta:
        model = TbMunicipalFinancial
        fields = '__all__'

    def get_percentual_executado(self, obj):
        if obj.orcamento_total > 0:
            return round((float(obj.orcamento_executado) / float(obj.orcamento_total)) * 100, 2)
        return 0


class TbSchoolFlowIndicatorsSerializer(serializers.ModelSerializer):
    """Serializer para indicadores de fluxo escolar"""
    school_name = serializers.CharField(source='id_school.school', read_only=True)

    class Meta:
        model = TbSchoolFlowIndicators
        fields = '__all__'


class TbTeacherProfileSerializer(serializers.ModelSerializer):
    """Serializer para perfil do professor"""
    teacher_name = serializers.CharField(source='id_teacher.teacher_name', read_only=True)
    teacher_serial = serializers.IntegerField(source='id_teacher.teacher_serial', read_only=True)

    class Meta:
        model = TbTeacherProfile
        fields = '__all__'


class TbTeacherWithProfileSerializer(serializers.ModelSerializer):
    """Serializer de professor incluindo perfil completo"""
    profile = TbTeacherProfileSerializer(read_only=True)
    subject_details = serializers.SerializerMethodField(read_only=True)

    class Meta:
        model = TbTeacher
        fields = [
            'id', 'teacher_serial', 'teacher_name', 'status',
            'created_at', 'profile', 'subject_details'
        ]

    def get_subject_details(self, obj):
        teacher_subjects = TbTeacherSubject.objects.filter(id_teacher=obj).select_related('id_subject')
        return [ts.id_subject.subject_name for ts in teacher_subjects]


class TbStudentProfileSerializer(serializers.ModelSerializer):
    """Serializer para perfil demografico do aluno"""
    student_name = serializers.CharField(source='id_student.student_name', read_only=True)
    student_serial = serializers.IntegerField(source='id_student.student_serial', read_only=True)

    class Meta:
        model = TbStudentProfile
        fields = '__all__'


class TbStudentWithProfileSerializer(serializers.ModelSerializer):
    """Serializer de aluno incluindo perfil completo"""
    class_name = serializers.CharField(source='id_class.class_name', read_only=True, allow_null=True)
    profile = TbStudentProfileSerializer(read_only=True)

    class Meta:
        model = TbStudents
        fields = [
            'id_student', 'student_serial', 'student_name',
            'id_class', 'class_name', 'enrollment_date',
            'status', 'created_at', 'profile'
        ]


class TbAlertSerializer(serializers.ModelSerializer):
    """Serializer para alertas do dashboard"""
    school_name = serializers.CharField(source='id_school.school', read_only=True, allow_null=True)

    class Meta:
        model = TbAlert
        fields = '__all__'


# ============================================
# 9. SERIALIZERS AGREGADOS PARA DASHBOARD
# ============================================

class DashboardVisaoGeralSerializer(serializers.Serializer):
    """Serializer para a visao geral do dashboard"""
    total_escolas = serializers.IntegerField()
    total_alunos = serializers.IntegerField()
    total_professores = serializers.IntegerField()
    total_turmas = serializers.IntegerField()
    ideb_medio = serializers.DecimalField(max_digits=4, decimal_places=2, allow_null=True)
    taxa_aprovacao = serializers.DecimalField(max_digits=5, decimal_places=2, allow_null=True)
    taxa_frequencia = serializers.DecimalField(max_digits=5, decimal_places=2, allow_null=True)
    orcamento_executado_percentual = serializers.DecimalField(max_digits=5, decimal_places=2, allow_null=True)


class EscolaResumoSerializer(serializers.Serializer):
    """Serializer para resumo de escola no mapa"""
    id = serializers.IntegerField()
    nome = serializers.CharField()
    latitude = serializers.DecimalField(max_digits=10, decimal_places=7)
    longitude = serializers.DecimalField(max_digits=10, decimal_places=7)
    zona = serializers.CharField()
    total_alunos = serializers.IntegerField()
    ideb = serializers.DecimalField(max_digits=4, decimal_places=2, allow_null=True)
    taxa_aprovacao = serializers.DecimalField(max_digits=5, decimal_places=2, allow_null=True)
    taxa_frequencia = serializers.DecimalField(max_digits=5, decimal_places=2, allow_null=True)
    estado_conservacao = serializers.CharField(allow_null=True)
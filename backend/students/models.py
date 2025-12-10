from django.db import models


# ============================================
# MODELOS DE LOCALIZAÇÃO E ESTRUTURA
# ============================================

class TbCity(models.Model):
    id = models.AutoField(primary_key=True)
    city = models.CharField(max_length=100)
    state = models.CharField(max_length=2)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        managed = False
        db_table = 'tb_city'
        verbose_name = 'Cidade'
        verbose_name_plural = 'Cidades'

    def __str__(self):
        return f"{self.city} - {self.state}"


class TbSchool(models.Model):
    id = models.AutoField(primary_key=True)
    school = models.CharField(max_length=255)
    director_name = models.CharField(max_length=255, blank=True, null=True)
    id_city = models.ForeignKey(TbCity, on_delete=models.DO_NOTHING, db_column='id_city')
    address = models.CharField(max_length=255, blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    codigo_ideb = models.CharField(max_length=50, blank=True, null=True)  # ✅ Novo campo

    class Meta:
        managed = False
        db_table = 'tb_school'
        verbose_name = 'Escola'
        verbose_name_plural = 'Escolas'

    def __str__(self):
        return self.school

class TbSubject(models.Model):
    id = models.AutoField(primary_key=True)
    subject_name = models.CharField(max_length=100)
    description = models.TextField(blank=True, null=True)

    class Meta:
        managed = False
        # Define o nome da tabela no banco de dados
        db_table = 'tb_subject'
        # Define o nome legível no singular e plural
        verbose_name = 'Disciplina'
        verbose_name_plural = 'Disciplinas'
        # Adiciona ordenação padrão
        ordering = ['subject_name'] 

    def __str__(self):
        return self.subject_name
    
class TbTeacher(models.Model):
    id = models.AutoField(primary_key=True)
    teacher_serial = models.BigIntegerField(unique=True)
    teacher_name = models.CharField(max_length=255)
    status = models.CharField(max_length=50, default='active')
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        managed = False
        db_table = 'tb_teacher'
        verbose_name = 'Professor'
        verbose_name_plural = 'Professores'

    def __str__(self):
        return self.teacher_name

class TbTeacherSubject(models.Model):
    """Tabela intermediária: Professor-Disciplina (Many-to-Many)"""
    id = models.AutoField(primary_key=True)
    id_teacher = models.ForeignKey(TbTeacher, on_delete=models.CASCADE, db_column='id_teacher', related_name='teacher_subjects')
    id_subject = models.ForeignKey(TbSubject, on_delete=models.CASCADE, db_column='id_subject', related_name='subject_teachers')
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        managed = False
        db_table = 'tb_teacher_subject'
        verbose_name = 'Professor-Disciplina'
        verbose_name_plural = 'Professores-Disciplinas'
        unique_together = [['id_teacher', 'id_subject']]
    
    def __str__(self):
        return f"{self.id_teacher.teacher_name} - {self.id_subject.subject_name}"
    
class TbTeacherSchool(models.Model):
    id = models.AutoField(primary_key=True)
    id_teacher = models.ForeignKey(TbTeacher, on_delete=models.DO_NOTHING, db_column='id_teacher')
    id_school = models.ForeignKey(TbSchool, on_delete=models.DO_NOTHING, db_column='id_school')
    assignment_date = models.DateField()
    status = models.CharField(max_length=50, default='active')
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        managed = False
        db_table = 'tb_teacher_school'
        verbose_name = 'Professor-Escola'
        verbose_name_plural = 'Professores-Escolas'
        unique_together = [['id_teacher', 'id_school']]


class TbClass(models.Model):
    id = models.AutoField(primary_key=True)
    class_name = models.CharField(max_length=100)
    id_teacher = models.ForeignKey(TbTeacher, on_delete=models.DO_NOTHING, db_column='id_teacher')
    id_school = models.ForeignKey(TbSchool, on_delete=models.DO_NOTHING, db_column='id_school')
    school_year = models.IntegerField()
    grade = models.CharField(max_length=50, blank=True, null=True)
    shift = models.CharField(max_length=50, blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        managed = False
        db_table = 'tb_class'
        verbose_name = 'Turma'
        verbose_name_plural = 'Turmas'
        ordering = ['-created_at', 'class_name']

    def __str__(self):
        return self.class_name


class TbStudents(models.Model):
    id_student = models.AutoField(primary_key=True)
    student_serial = models.IntegerField(unique=True)
    student_name = models.CharField(max_length=255)
    id_class = models.ForeignKey(TbClass, on_delete=models.DO_NOTHING, db_column='id_class')
    enrollment_date = models.DateField(blank=True, null=True)
    status = models.CharField(max_length=50, default='enrolled')
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        managed = False
        db_table = 'tb_students'
        verbose_name = 'Aluno'
        verbose_name_plural = 'Alunos'

    def __str__(self):
        return self.student_name

# ============================================
# MODELOS DE INDICADORES IDEB
# ============================================

class TbSchoolIdebIndicators(models.Model):
    id = models.AutoField(primary_key=True)
    id_school = models.ForeignKey(TbSchool, on_delete=models.CASCADE, db_column='id_school')
    fiscal_year = models.BigIntegerField()
    ideb_target = models.DecimalField(max_digits=5, decimal_places=2, blank=True, null=True)
    regional_average = models.DecimalField(max_digits=5, decimal_places=2, blank=True, null=True)
    state_average = models.DecimalField(max_digits=5, decimal_places=2, blank=True, null=True)
    critical_threshold = models.DecimalField(max_digits=5, decimal_places=2, blank=True, null=True)
    actual_avg_score = models.DecimalField(max_digits=5, decimal_places=2, blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        managed = False
        db_table = 'tb_school_ideb_indicators'
        verbose_name = 'Indicador IDEB da Escola'
        verbose_name_plural = 'Indicadores IDEB das Escolas'
        unique_together = [['id_school', 'fiscal_year']]


class TbClassIdebIndicators(models.Model):
    id = models.AutoField(primary_key=True)
    id_class = models.ForeignKey(TbClass, on_delete=models.CASCADE, db_column='id_class')
    fiscal_year = models.BigIntegerField()
    class_ideb_target = models.DecimalField(max_digits=5, decimal_places=2, blank=True, null=True)
    expected_avg_score = models.DecimalField(max_digits=5, decimal_places=2, blank=True, null=True)
    actual_avg_score = models.DecimalField(max_digits=5, decimal_places=2, blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        managed = False
        db_table = 'tb_class_ideb_indicators'
        verbose_name = 'Indicador IDEB da Turma'
        verbose_name_plural = 'Indicadores IDEB das Turmas'
        unique_together = [['id_class', 'fiscal_year']]


# ============================================
# MODELOS DE COMPETÊNCIAS E DESCRITORES
# ============================================

class TbCompetencyIdeb(models.Model):
    id = models.AutoField(primary_key=True)
    subject = models.CharField(max_length=100)
    competency_code = models.CharField(max_length=50, unique=True)
    competency_name = models.CharField(max_length=500)
    grade = models.CharField(max_length=10)
    description = models.TextField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        managed = False
        db_table = 'tb_competency_ideb'
        verbose_name = 'Competência IDEB'
        verbose_name_plural = 'Competências IDEB'

    def __str__(self):
        return f"{self.competency_code} - {self.competency_name}"


# ⚠️ CORREÇÃO: Nome correto da tabela é tb_descriptors_catalog
class TbDescriptorsCatalog(models.Model):
    id = models.AutoField(primary_key=True)
    subject = models.CharField(max_length=100, blank=True, null=True)
    learning_field = models.CharField(max_length=255, blank=True, null=True)
    grade = models.CharField(max_length=50, blank=True, null=True)
    descriptor_code = models.CharField(max_length=50, unique=True)
    descriptor_name = models.CharField(max_length=255)
    descriptor_description = models.TextField(blank=True, null=True)
    icon = models.CharField(max_length=255, blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        managed = False
        db_table = 'tb_descriptors_catalog'  # ✅ Nome correto da tabela
        verbose_name = 'Descritor'
        verbose_name_plural = 'Catálogo de Descritores'

    def __str__(self):
        return f"{self.descriptor_code} - {self.descriptor_name}"


# ============================================
# MODELOS DE EXAMES E QUESTÕES
# ============================================

class TbExams(models.Model):
    id = models.AutoField(primary_key=True)
    exam_code = models.CharField(max_length=50, unique=True)
    exam_name = models.CharField(max_length=255)
    subject = models.CharField(max_length=100, blank=True, null=True)
    school_year = models.IntegerField(blank=True, null=True)
    total_questions = models.IntegerField(blank=True, null=True)
    description = models.TextField(blank=True, null=True)
    exam_file = models.CharField(max_length=500, blank=True, null=True)  # URL do arquivo no S3
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        managed = False
        db_table = 'tb_exams'
        verbose_name = 'Exame'
        verbose_name_plural = 'Exames'
        ordering = ['-created_at', 'exam_name']

    def __str__(self):
        return f"{self.exam_code} - {self.exam_name}"


class TbQuestions(models.Model):
    id = models.AutoField(primary_key=True)
    id_exam = models.ForeignKey(TbExams, on_delete=models.DO_NOTHING, db_column='id_exam')
    question_number = models.IntegerField()
    question_text = models.TextField()
    question_type = models.CharField(max_length=50, blank=True, null=True)
    correct_answer = models.CharField(max_length=255, blank=True, null=True)
    skill_assessed = models.CharField(max_length=255, blank=True, null=True)
    difficulty_level = models.CharField(max_length=50, blank=True, null=True)
    points = models.DecimalField(max_digits=5, decimal_places=2, default=1.0)
    id_descriptor = models.ForeignKey(  # ✅ Renomeado de id_distractor
        TbDescriptorsCatalog, 
        on_delete=models.DO_NOTHING, 
        db_column='id_descriptor',
        blank=True,
        null=True
    )
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        managed = False
        db_table = 'tb_questions'
        verbose_name = 'Questão'
        verbose_name_plural = 'Questões'
        unique_together = [['id_exam', 'question_number']]

    def __str__(self):
        return f"Questão {self.question_number} - {self.id_exam.exam_name}"


class TbQuestionCompetency(models.Model):
    id_question = models.ForeignKey(TbQuestions, on_delete=models.CASCADE, db_column='id_question')
    id_competency = models.ForeignKey(TbCompetencyIdeb, on_delete=models.CASCADE, db_column='id_competency')

    class Meta:
        managed = False
        db_table = 'tb_question_competency'
        verbose_name = 'Questão-Competência'
        verbose_name_plural = 'Questões-Competências'
        unique_together = [['id_question', 'id_competency']]

class TbAlternatives(models.Model):
    id = models.AutoField(primary_key=True)
    id_question = models.ForeignKey(
        'TbQuestions', 
        on_delete=models.CASCADE, 
        db_column='id_question'
    )
    alternative_order = models.IntegerField()  # ✅ CORRIGIDO
    alternative_text = models.TextField()
    is_correct = models.BooleanField(default=False)
    distractor_type = models.CharField(max_length=100, blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        managed = False
        db_table = 'tb_alternatives'
        verbose_name = 'Alternativa'
        verbose_name_plural = 'Alternativas'
        unique_together = [['id_question', 'alternative_order']]
        ordering = ['id_question', 'alternative_order']

    def __str__(self):
        # Converte número para letra (1=A, 2=B, etc)
        letter = chr(64 + self.alternative_order) if self.alternative_order <= 26 else str(self.alternative_order)
        return f"{letter}) {self.alternative_text[:50]}"
    
    @property
    def alternative_letter(self):
        """Propriedade computada para compatibilidade com frontend"""
        if self.alternative_order and self.alternative_order <= 26:
            return chr(64 + self.alternative_order)  # 1=A, 2=B, 3=C...
        return str(self.alternative_order)
# ============================================
# MODELOS DE APLICAÇÕES E RESULTADOS
# ============================================

class TbExamApplications(models.Model):
    id = models.AutoField(primary_key=True)
    id_exam = models.ForeignKey(TbExams, on_delete=models.DO_NOTHING, db_column='id_exam')
    id_class = models.ForeignKey(TbClass, on_delete=models.DO_NOTHING, db_column='id_class')
    id_teacher = models.ForeignKey(TbTeacher, on_delete=models.DO_NOTHING, db_column='id_teacher')
    application_date = models.DateField()
    start_time = models.TimeField(blank=True, null=True)  # ✅ ADICIONAR
    end_time = models.TimeField(blank=True, null=True)    # ✅ ADICIONAR
    fiscal_year = models.IntegerField(blank=True, null=True)  # ✅ ADICIONAR
    status = models.CharField(max_length=50, default='scheduled')
    observations = models.TextField(blank=True, null=True)
    application_type = models.CharField(max_length=50, blank=True, null=True)
    assessment_period = models.CharField(max_length=50, blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        managed = False
        db_table = 'tb_exam_applications'
        verbose_name = 'Aplicação de Exame'
        verbose_name_plural = 'Aplicações de Exames'

    def __str__(self):
        return f"{self.id_exam.exam_name} - {self.id_class.class_name} ({self.application_date})"

class TbAssessmentMetadata(models.Model):
    id = models.AutoField(primary_key=True)
    id_exam_application = models.OneToOneField(
        TbExamApplications, 
        on_delete=models.CASCADE, 
        db_column='id_exam_application'
    )
    application_type = models.CharField(max_length=50)
    assessment_period = models.CharField(max_length=50)
    fiscal_year = models.BigIntegerField()
    notes = models.TextField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        managed = False
        db_table = 'tb_assessment_metadata'
        verbose_name = 'Metadado de Avaliação'
        verbose_name_plural = 'Metadados de Avaliações'


class TbStudentAnswers(models.Model):
    id = models.AutoField(primary_key=True)
    id_student = models.ForeignKey(TbStudents, on_delete=models.DO_NOTHING, db_column='id_student')
    id_exam_application = models.ForeignKey(
        TbExamApplications, 
        on_delete=models.DO_NOTHING, 
        db_column='id_exam_application'
    )
    id_question = models.ForeignKey(TbQuestions, on_delete=models.DO_NOTHING, db_column='id_question')
    id_selected_alternative = models.ForeignKey(
        TbAlternatives, 
        on_delete=models.DO_NOTHING, 
        db_column='id_selected_alternative',
        blank=True,
        null=True
    )
    answer_text = models.TextField(blank=True, null=True)
    is_correct = models.BooleanField(blank=True, null=True)
    response_time_seconds = models.IntegerField(blank=True, null=True)
    answered_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        managed = False
        db_table = 'tb_student_answers'
        verbose_name = 'Resposta do Aluno'
        verbose_name_plural = 'Respostas dos Alunos'
        unique_together = [['id_student', 'id_exam_application', 'id_question']]


class TbExamResults(models.Model):
    id = models.AutoField(primary_key=True)
    id_student = models.ForeignKey(TbStudents, on_delete=models.DO_NOTHING, db_column='id_student')
    id_exam_application = models.ForeignKey(
        TbExamApplications, 
        on_delete=models.DO_NOTHING, 
        db_column='id_exam_application'
    )
    total_score = models.DecimalField(max_digits=5, decimal_places=2, blank=True, null=True)
    max_score = models.DecimalField(max_digits=5, decimal_places=2, blank=True, null=True)
    correct_answers = models.IntegerField(blank=True, null=True)
    wrong_answers = models.IntegerField(blank=True, null=True)
    blank_answers = models.IntegerField(blank=True, null=True)
    # completion_time_minutes = models.IntegerField(blank=True, null=True)
    started_at = models.DateTimeField(blank=True, null=True)
    finished_at = models.DateTimeField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        managed = False
        db_table = 'tb_exam_results'
        verbose_name = 'Resultado do Exame'
        verbose_name_plural = 'Resultados dos Exames'
        unique_together = [['id_student', 'id_exam_application']]


# ============================================
# MODELOS DE PROGRESSO E CONQUISTAS
# ============================================

class TbStudentDescriptorAchievements(models.Model):  # ✅ Renomeado
    id = models.AutoField(primary_key=True)
    id_student = models.ForeignKey(TbStudents, on_delete=models.DO_NOTHING, db_column='id_student')
    id_descriptor = models.ForeignKey(  # ✅ Renomeado
        TbDescriptorsCatalog,
        on_delete=models.DO_NOTHING,
        db_column='id_descriptor'
    )
    id_exam_application = models.ForeignKey(
        TbExamApplications,
        on_delete=models.DO_NOTHING,
        db_column='id_exam_application',
        blank=True,  # ✅ Permite vazio em forms
        null=True    # ✅ Permite NULL no banco (para atribuições manuais)
    )
    achieved_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        managed = False
        db_table = 'tb_student_descriptor_achievements'  # ✅ Nome correto
        verbose_name = 'Conquista de Descritor'
        verbose_name_plural = 'Conquistas de Descritores'
        unique_together = [['id_student', 'id_descriptor']]  # ✅ Evita duplicatas


class TbStudentLearningProgress(models.Model):
    id = models.AutoField(primary_key=True)
    id_student = models.ForeignKey(TbStudents, on_delete=models.CASCADE, db_column='id_student')
    id_descriptor = models.ForeignKey(
        TbDescriptorsCatalog,
        on_delete=models.CASCADE,
        db_column='id_descriptor'
    )
    id_exam_application = models.ForeignKey(
        TbExamApplications,
        on_delete=models.CASCADE,
        db_column='id_exam_application'
    )
    score = models.DecimalField(max_digits=10, decimal_places=2)
    max_score = models.DecimalField(max_digits=10, decimal_places=2)
    descriptor_mastery = models.DecimalField(max_digits=5, decimal_places=2)
    assessment_date = models.DateField()
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        managed = False
        db_table = 'tb_student_learning_progress'
        verbose_name = 'Progresso de Aprendizagem'
        verbose_name_plural = 'Progressos de Aprendizagem'

    def __str__(self):
        return f"{self.id_student.student_name} - {self.id_descriptor.descriptor_name}"
    
class TbQuestionDescriptor(models.Model):
    id_question = models.ForeignKey('TbQuestions', models.DO_NOTHING, db_column='id_question')
    id_descriptor = models.ForeignKey('TbDescriptorsCatalog', models.DO_NOTHING, db_column='id_descriptor')
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        managed = True
        db_table = 'tb_question_descriptor'


# ============================================
# MODELOS PARA DASHBOARD SECRETARIA DE EDUCACAO
# ============================================

class TbSchoolGeolocation(models.Model):
    """Geolocalizacao das escolas para mapa interativo"""
    id = models.AutoField(primary_key=True)
    id_school = models.OneToOneField(
        TbSchool,
        on_delete=models.CASCADE,
        db_column='id_school',
        related_name='geolocation'
    )
    latitude = models.DecimalField(max_digits=10, decimal_places=7)
    longitude = models.DecimalField(max_digits=10, decimal_places=7)
    zona = models.CharField(max_length=20, choices=[
        ('urbana', 'Urbana'),
        ('rural', 'Rural')
    ], default='urbana')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        managed = True
        db_table = 'tb_school_geolocation'
        verbose_name = 'Geolocalizacao da Escola'
        verbose_name_plural = 'Geolocalizacoes das Escolas'

    def __str__(self):
        return f"{self.id_school.school} ({self.latitude}, {self.longitude})"


class TbStudentAttendance(models.Model):
    """Registro de frequencia diaria dos alunos"""
    id = models.AutoField(primary_key=True)
    id_student = models.ForeignKey(
        TbStudents,
        on_delete=models.CASCADE,
        db_column='id_student',
        related_name='attendances'
    )
    id_class = models.ForeignKey(
        TbClass,
        on_delete=models.CASCADE,
        db_column='id_class',
        related_name='attendances'
    )
    attendance_date = models.DateField()
    status = models.CharField(max_length=20, choices=[
        ('presente', 'Presente'),
        ('ausente', 'Ausente'),
        ('justificado', 'Falta Justificada'),
        ('atrasado', 'Atrasado')
    ])
    justification = models.TextField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        managed = True
        db_table = 'tb_student_attendance'
        verbose_name = 'Frequencia do Aluno'
        verbose_name_plural = 'Frequencias dos Alunos'
        unique_together = [['id_student', 'attendance_date']]
        ordering = ['-attendance_date']

    def __str__(self):
        return f"{self.id_student.student_name} - {self.attendance_date} - {self.status}"


class TbClassAttendanceSummary(models.Model):
    """Resumo mensal de frequencia por turma"""
    id = models.AutoField(primary_key=True)
    id_class = models.ForeignKey(
        TbClass,
        on_delete=models.CASCADE,
        db_column='id_class',
        related_name='attendance_summaries'
    )
    year_month = models.CharField(max_length=7)  # Format: YYYY-MM
    school_days = models.IntegerField(default=0)
    total_presences = models.IntegerField(default=0)
    total_absences = models.IntegerField(default=0)
    total_justified = models.IntegerField(default=0)
    attendance_rate = models.DecimalField(max_digits=5, decimal_places=2, default=0)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        managed = True
        db_table = 'tb_class_attendance_summary'
        verbose_name = 'Resumo de Frequencia da Turma'
        verbose_name_plural = 'Resumos de Frequencia das Turmas'
        unique_together = [['id_class', 'year_month']]

    def __str__(self):
        return f"{self.id_class.class_name} - {self.year_month} - {self.attendance_rate}%"


class TbSchoolInfrastructure(models.Model):
    """Infraestrutura das escolas"""
    id = models.AutoField(primary_key=True)
    id_school = models.OneToOneField(
        TbSchool,
        on_delete=models.CASCADE,
        db_column='id_school',
        related_name='infrastructure'
    )
    # Espacos fisicos
    num_salas = models.IntegerField(default=0)
    num_laboratorios = models.IntegerField(default=0)
    tem_biblioteca = models.BooleanField(default=False)
    tem_quadra = models.BooleanField(default=False)
    tem_quadra_coberta = models.BooleanField(default=False)
    tem_refeitorio = models.BooleanField(default=False)
    tem_auditorio = models.BooleanField(default=False)
    tem_sala_leitura = models.BooleanField(default=False)
    tem_sala_professores = models.BooleanField(default=False)
    tem_sala_atendimento = models.BooleanField(default=False)

    # Tecnologia
    tem_internet = models.BooleanField(default=False)
    tipo_internet = models.CharField(max_length=50, blank=True, null=True)  # fibra, radio, etc
    velocidade_internet_mbps = models.IntegerField(blank=True, null=True)
    num_computadores = models.IntegerField(default=0)
    num_tablets = models.IntegerField(default=0)
    tem_projetor = models.BooleanField(default=False)
    num_projetores = models.IntegerField(default=0)

    # Acessibilidade
    tem_acessibilidade = models.BooleanField(default=False)
    tem_rampa = models.BooleanField(default=False)
    tem_banheiro_pcd = models.BooleanField(default=False)
    tem_piso_tatil = models.BooleanField(default=False)
    tem_elevador = models.BooleanField(default=False)

    # Servicos basicos
    tem_agua_potavel = models.BooleanField(default=True)
    tem_energia = models.BooleanField(default=True)
    tem_esgoto = models.BooleanField(default=True)
    tem_coleta_lixo = models.BooleanField(default=True)

    # Conservacao
    estado_conservacao = models.CharField(max_length=20, choices=[
        ('otimo', 'Otimo'),
        ('bom', 'Bom'),
        ('regular', 'Regular'),
        ('ruim', 'Ruim'),
        ('critico', 'Critico')
    ], default='bom')
    ultima_reforma = models.DateField(blank=True, null=True)
    necessita_reforma = models.BooleanField(default=False)
    areas_reforma = models.TextField(blank=True, null=True)  # JSON list of areas

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        managed = True
        db_table = 'tb_school_infrastructure'
        verbose_name = 'Infraestrutura da Escola'
        verbose_name_plural = 'Infraestruturas das Escolas'

    def __str__(self):
        return f"Infraestrutura - {self.id_school.school}"


class TbSchoolFinancial(models.Model):
    """Dados financeiros por escola por ano"""
    id = models.AutoField(primary_key=True)
    id_school = models.ForeignKey(
        TbSchool,
        on_delete=models.CASCADE,
        db_column='id_school',
        related_name='financial_records'
    )
    fiscal_year = models.IntegerField()

    # Orcamento
    orcamento_total = models.DecimalField(max_digits=15, decimal_places=2, default=0)
    orcamento_executado = models.DecimalField(max_digits=15, decimal_places=2, default=0)

    # Categorias de despesa
    despesa_pessoal = models.DecimalField(max_digits=15, decimal_places=2, default=0)
    despesa_material = models.DecimalField(max_digits=15, decimal_places=2, default=0)
    despesa_manutencao = models.DecimalField(max_digits=15, decimal_places=2, default=0)
    despesa_alimentacao = models.DecimalField(max_digits=15, decimal_places=2, default=0)
    despesa_transporte = models.DecimalField(max_digits=15, decimal_places=2, default=0)
    despesa_equipamentos = models.DecimalField(max_digits=15, decimal_places=2, default=0)
    despesa_outros = models.DecimalField(max_digits=15, decimal_places=2, default=0)

    # Receitas
    fundeb_recebido = models.DecimalField(max_digits=15, decimal_places=2, default=0)
    pdde_recebido = models.DecimalField(max_digits=15, decimal_places=2, default=0)
    outras_receitas = models.DecimalField(max_digits=15, decimal_places=2, default=0)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        managed = True
        db_table = 'tb_school_financial'
        verbose_name = 'Dados Financeiros da Escola'
        verbose_name_plural = 'Dados Financeiros das Escolas'
        unique_together = [['id_school', 'fiscal_year']]
        ordering = ['-fiscal_year']

    def __str__(self):
        return f"{self.id_school.school} - {self.fiscal_year}"

    @property
    def percentual_executado(self):
        if self.orcamento_total > 0:
            return (self.orcamento_executado / self.orcamento_total) * 100
        return 0

    @property
    def custo_por_aluno(self):
        total_alunos = self.id_school.tbclass_set.aggregate(
            total=models.Count('tbstudents')
        )['total'] or 1
        return self.orcamento_executado / total_alunos


class TbMunicipalFinancial(models.Model):
    """Dados financeiros consolidados do municipio por ano"""
    id = models.AutoField(primary_key=True)
    fiscal_year = models.IntegerField(unique=True)

    # Orcamento total
    orcamento_total = models.DecimalField(max_digits=18, decimal_places=2, default=0)
    orcamento_executado = models.DecimalField(max_digits=18, decimal_places=2, default=0)

    # Receitas
    fundeb_total = models.DecimalField(max_digits=18, decimal_places=2, default=0)
    fnde_total = models.DecimalField(max_digits=18, decimal_places=2, default=0)
    recursos_proprios = models.DecimalField(max_digits=18, decimal_places=2, default=0)
    outras_receitas = models.DecimalField(max_digits=18, decimal_places=2, default=0)

    # Indicadores
    percentual_mde = models.DecimalField(max_digits=5, decimal_places=2, default=0)  # % aplicado em MDE
    custo_aluno_ano = models.DecimalField(max_digits=10, decimal_places=2, default=0)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        managed = True
        db_table = 'tb_municipal_financial'
        verbose_name = 'Financeiro Municipal'
        verbose_name_plural = 'Financeiro Municipal'
        ordering = ['-fiscal_year']

    def __str__(self):
        return f"Financeiro Municipal - {self.fiscal_year}"


class TbSchoolFlowIndicators(models.Model):
    """Indicadores de fluxo escolar (aprovacao, reprovacao, abandono)"""
    id = models.AutoField(primary_key=True)
    id_school = models.ForeignKey(
        TbSchool,
        on_delete=models.CASCADE,
        db_column='id_school',
        related_name='flow_indicators'
    )
    fiscal_year = models.IntegerField()
    etapa = models.CharField(max_length=50, choices=[
        ('anos_iniciais', 'Anos Iniciais'),
        ('anos_finais', 'Anos Finais'),
        ('eja', 'EJA')
    ])

    total_matriculas = models.IntegerField(default=0)
    total_aprovados = models.IntegerField(default=0)
    total_reprovados = models.IntegerField(default=0)
    total_abandono = models.IntegerField(default=0)
    total_transferidos = models.IntegerField(default=0)

    taxa_aprovacao = models.DecimalField(max_digits=5, decimal_places=2, default=0)
    taxa_reprovacao = models.DecimalField(max_digits=5, decimal_places=2, default=0)
    taxa_abandono = models.DecimalField(max_digits=5, decimal_places=2, default=0)

    distorcao_idade_serie = models.DecimalField(max_digits=5, decimal_places=2, default=0)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        managed = True
        db_table = 'tb_school_flow_indicators'
        verbose_name = 'Indicador de Fluxo Escolar'
        verbose_name_plural = 'Indicadores de Fluxo Escolar'
        unique_together = [['id_school', 'fiscal_year', 'etapa']]
        ordering = ['-fiscal_year']

    def __str__(self):
        return f"{self.id_school.school} - {self.fiscal_year} - {self.etapa}"


class TbTeacherProfile(models.Model):
    """Perfil estendido do professor"""
    id = models.AutoField(primary_key=True)
    id_teacher = models.OneToOneField(
        TbTeacher,
        on_delete=models.CASCADE,
        db_column='id_teacher',
        related_name='profile'
    )

    # Formacao
    escolaridade = models.CharField(max_length=50, choices=[
        ('medio', 'Ensino Medio'),
        ('graduacao', 'Graduacao'),
        ('especializacao', 'Especializacao'),
        ('mestrado', 'Mestrado'),
        ('doutorado', 'Doutorado')
    ], default='graduacao')
    formacao_area = models.CharField(max_length=100, blank=True, null=True)
    formacao_continuada = models.BooleanField(default=False)

    # Vinculo
    tipo_contrato = models.CharField(max_length=50, choices=[
        ('efetivo', 'Efetivo'),
        ('temporario', 'Temporario'),
        ('clt', 'CLT')
    ], default='efetivo')
    carga_horaria = models.IntegerField(default=40)  # horas semanais

    # Dados pessoais
    data_nascimento = models.DateField(blank=True, null=True)
    genero = models.CharField(max_length=20, blank=True, null=True)
    anos_experiencia = models.IntegerField(default=0)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        managed = True
        db_table = 'tb_teacher_profile'
        verbose_name = 'Perfil do Professor'
        verbose_name_plural = 'Perfis dos Professores'

    def __str__(self):
        return f"Perfil - {self.id_teacher.teacher_name}"


class TbStudentProfile(models.Model):
    """Perfil demografico estendido do aluno"""
    id = models.AutoField(primary_key=True)
    id_student = models.OneToOneField(
        TbStudents,
        on_delete=models.CASCADE,
        db_column='id_student',
        related_name='profile'
    )

    # Dados pessoais
    data_nascimento = models.DateField(blank=True, null=True)
    genero = models.CharField(max_length=20, choices=[
        ('masculino', 'Masculino'),
        ('feminino', 'Feminino'),
        ('outro', 'Outro')
    ], blank=True, null=True)
    raca_cor = models.CharField(max_length=30, choices=[
        ('branca', 'Branca'),
        ('preta', 'Preta'),
        ('parda', 'Parda'),
        ('amarela', 'Amarela'),
        ('indigena', 'Indigena'),
        ('nao_declarada', 'Nao Declarada')
    ], blank=True, null=True)

    # Necessidades especiais
    tem_deficiencia = models.BooleanField(default=False)
    tipo_deficiencia = models.CharField(max_length=100, blank=True, null=True)
    necessita_aee = models.BooleanField(default=False)  # Atendimento Educacional Especializado

    # Dados socioeconomicos
    bolsa_familia = models.BooleanField(default=False)
    nivel_socioeconomico = models.CharField(max_length=30, choices=[
        ('muito_baixo', 'Muito Baixo'),
        ('baixo', 'Baixo'),
        ('medio_baixo', 'Medio-Baixo'),
        ('medio', 'Medio'),
        ('medio_alto', 'Medio-Alto'),
        ('alto', 'Alto')
    ], blank=True, null=True)

    # Transporte
    utiliza_transporte_escolar = models.BooleanField(default=False)
    distancia_escola_km = models.DecimalField(max_digits=5, decimal_places=2, blank=True, null=True)

    # Localizacao
    zona_residencia = models.CharField(max_length=20, choices=[
        ('urbana', 'Urbana'),
        ('rural', 'Rural')
    ], default='urbana')

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        managed = True
        db_table = 'tb_student_profile'
        verbose_name = 'Perfil do Aluno'
        verbose_name_plural = 'Perfis dos Alunos'

    def __str__(self):
        return f"Perfil - {self.id_student.student_name}"


class TbAlert(models.Model):
    """Sistema de alertas para o dashboard"""
    id = models.AutoField(primary_key=True)
    id_school = models.ForeignKey(
        TbSchool,
        on_delete=models.CASCADE,
        db_column='id_school',
        related_name='alerts',
        blank=True,
        null=True  # null = alerta geral do municipio
    )

    tipo = models.CharField(max_length=50, choices=[
        ('frequencia', 'Frequencia'),
        ('desempenho', 'Desempenho'),
        ('infraestrutura', 'Infraestrutura'),
        ('financeiro', 'Financeiro'),
        ('docente', 'Corpo Docente'),
        ('fluxo', 'Fluxo Escolar')
    ])
    severidade = models.CharField(max_length=20, choices=[
        ('baixa', 'Baixa'),
        ('media', 'Media'),
        ('alta', 'Alta'),
        ('critica', 'Critica')
    ])
    titulo = models.CharField(max_length=200)
    descricao = models.TextField()
    data_geracao = models.DateTimeField(auto_now_add=True)
    data_resolucao = models.DateTimeField(blank=True, null=True)
    resolvido = models.BooleanField(default=False)

    class Meta:
        managed = True
        db_table = 'tb_alert'
        verbose_name = 'Alerta'
        verbose_name_plural = 'Alertas'
        ordering = ['-data_geracao']

    def __str__(self):
        escola = self.id_school.school if self.id_school else "Municipal"
        return f"[{self.severidade}] {self.titulo} - {escola}"
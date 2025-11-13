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

    class Meta:
        managed = False
        db_table = 'tb_school'
        verbose_name = 'Escola'
        verbose_name_plural = 'Escolas'

    def __str__(self):
        return self.school


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
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        managed = False
        db_table = 'tb_exams'
        verbose_name = 'Exame'
        verbose_name_plural = 'Exames'

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


class TbAlternatives(models.Model):
    id = models.AutoField(primary_key=True)
    id_question = models.ForeignKey(TbQuestions, on_delete=models.CASCADE, db_column='id_question')
    alternative_letter = models.CharField(max_length=1)
    alternative_text = models.TextField()
    is_correct = models.BooleanField(default=False)
    descriptor_type = models.CharField(max_length=100, blank=True, null=True)  # ✅ Renomeado
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        managed = False
        db_table = 'tb_alternatives'
        verbose_name = 'Alternativa'
        verbose_name_plural = 'Alternativas'
        unique_together = [['id_question', 'alternative_letter']]

    def __str__(self):
        return f"{self.alternative_letter}) {self.alternative_text[:50]}"


class TbQuestionCompetency(models.Model):
    id_question = models.ForeignKey(TbQuestions, on_delete=models.CASCADE, db_column='id_question')
    id_competency = models.ForeignKey(TbCompetencyIdeb, on_delete=models.CASCADE, db_column='id_competency')

    class Meta:
        managed = False
        db_table = 'tb_question_competency'
        verbose_name = 'Questão-Competência'
        verbose_name_plural = 'Questões-Competências'
        unique_together = [['id_question', 'id_competency']]


# ============================================
# MODELOS DE APLICAÇÕES E RESULTADOS
# ============================================

class TbExamApplications(models.Model):
    id = models.AutoField(primary_key=True)
    id_exam = models.ForeignKey(TbExams, on_delete=models.DO_NOTHING, db_column='id_exam')
    id_class = models.ForeignKey(TbClass, on_delete=models.DO_NOTHING, db_column='id_class')
    id_teacher = models.ForeignKey(TbTeacher, on_delete=models.DO_NOTHING, db_column='id_teacher')
    application_date = models.DateField()
    start_time = models.TimeField(blank=True, null=True)
    end_time = models.TimeField(blank=True, null=True)
    status = models.CharField(max_length=50, default='scheduled')
    observations = models.TextField(blank=True, null=True)
    application_type = models.CharField(max_length=50, blank=True, null=True)
    assessment_period = models.CharField(max_length=50, blank=True, null=True)
    fiscal_year = models.BigIntegerField(blank=True, null=True)
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
    completion_time_minutes = models.IntegerField(blank=True, null=True)
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
        db_column='id_exam_application'
    )
    achieved_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        managed = False
        db_table = 'tb_student_descriptor_achievements'  # ✅ Nome correto
        verbose_name = 'Conquista de Descritor'
        verbose_name_plural = 'Conquistas de Descritores'


class TbStudentLearningProgress(models.Model):
    id = models.AutoField(primary_key=True)
    id_student = models.ForeignKey(TbStudents, on_delete=models.CASCADE, db_column='id_student')
    id_competency = models.ForeignKey(
        TbCompetencyIdeb, 
        on_delete=models.CASCADE, 
        db_column='id_competency'
    )
    id_exam_application = models.ForeignKey(
        TbExamApplications, 
        on_delete=models.CASCADE, 
        db_column='id_exam_application'
    )
    score = models.DecimalField(max_digits=10, decimal_places=2)
    max_score = models.DecimalField(max_digits=10, decimal_places=2)
    competency_mastery = models.DecimalField(max_digits=5, decimal_places=2)
    assessment_date = models.DateField()
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        managed = False
        db_table = 'tb_student_learning_progress'
        verbose_name = 'Progresso de Aprendizagem'
        verbose_name_plural = 'Progressos de Aprendizagem'

    def __str__(self):
        return f"{self.id_student.student_name} - {self.id_competency.competency_name}"
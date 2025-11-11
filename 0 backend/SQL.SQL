-- tb_city definição

CREATE TABLE tb_city (
	id serial4 NOT NULL,
	city varchar(100) NOT NULL,
	state varchar(2) NOT NULL,
	created_at timestamptz DEFAULT CURRENT_TIMESTAMP NULL,
	CONSTRAINT tb_city_pkey PRIMARY KEY (id)
);

ALTER TABLE tb_city OWNER TO postgres;
GRANT ALL ON TABLE tb_city TO postgres;


-- tb_competency_ideb definição

CREATE TABLE tb_competency_ideb (
	id serial4 NOT NULL,
	subject varchar(100) NOT NULL,
	competency_code varchar(50) NOT NULL,
	competency_name varchar(500) NOT NULL,
	grade varchar(10) NOT NULL,
	description text NULL,
	created_at timestamptz DEFAULT CURRENT_TIMESTAMP NULL,
	CONSTRAINT tb_competency_ideb_competency_code_key UNIQUE (competency_code),
	CONSTRAINT tb_competency_ideb_pkey PRIMARY KEY (id)
);

ALTER TABLE tb_competency_ideb OWNER TO postgres;
GRANT ALL ON TABLE tb_competency_ideb TO postgres;


-- tb_distractor_catalog definição

CREATE TABLE tb_distractor_catalog (
	id serial4 NOT NULL,
	subject varchar(100) NULL,
	learning_field varchar(255) NULL,
	grade varchar(50) NULL,
	distractor_code varchar(50) NOT NULL,
	distractor_name varchar(255) NOT NULL,
	distractor_description text NULL,
	icon varchar(255) NULL,
	created_at timestamptz DEFAULT CURRENT_TIMESTAMP NULL,
	CONSTRAINT tb_distractor_catalog_distractor_code_key UNIQUE (distractor_code),
	CONSTRAINT tb_distractor_catalog_pkey PRIMARY KEY (id)
);

ALTER TABLE tb_distractor_catalog OWNER TO postgres;
GRANT ALL ON TABLE tb_distractor_catalog TO postgres;


-- tb_exams definição

CREATE TABLE tb_exams (
	id serial4 NOT NULL,
	exam_code varchar(50) NOT NULL,
	exam_name varchar(255) NOT NULL,
	subject varchar(100) NULL,
	school_year int4 NULL,
	total_questions int4 NULL,
	description text NULL,
	created_at timestamptz DEFAULT CURRENT_TIMESTAMP NULL,
	CONSTRAINT tb_exams_exam_code_key UNIQUE (exam_code),
	CONSTRAINT tb_exams_pkey PRIMARY KEY (id)
);
CREATE INDEX idx_exams_subject ON tb_exams USING btree (subject);

ALTER TABLE tb_exams OWNER TO postgres;
GRANT ALL ON TABLE tb_exams TO postgres;


-- tb_teacher definição

CREATE TABLE tb_teacher (
	id serial4 NOT NULL,
	teacher_serial int8 NOT NULL,
	teacher_name varchar(255) NOT NULL,
	status varchar(50) DEFAULT 'active'::character varying NULL,
	created_at timestamptz DEFAULT CURRENT_TIMESTAMP NULL,
	CONSTRAINT tb_teacher_pkey PRIMARY KEY (id),
	CONSTRAINT tb_teacher_teacher_serial_key UNIQUE (teacher_serial)
);
CREATE INDEX idx_teacher_name ON tb_teacher USING btree (teacher_name);

ALTER TABLE tb_teacher OWNER TO postgres;
GRANT ALL ON TABLE tb_teacher TO postgres;


-- tb_questions definição

CREATE TABLE tb_questions (
	id serial4 NOT NULL,
	id_exam int4 NOT NULL,
	question_number int4 NOT NULL,
	question_text text NOT NULL,
	question_type varchar(50) NULL,
	correct_answer varchar(255) NULL,
	skill_assessed varchar(255) NULL,
	difficulty_level varchar(50) NULL,
	points numeric(5, 2) DEFAULT 1.0 NULL,
	id_distractor int4 NULL,
	created_at timestamptz DEFAULT CURRENT_TIMESTAMP NULL,
	CONSTRAINT tb_questions_id_exam_question_number_key UNIQUE (id_exam, question_number),
	CONSTRAINT tb_questions_pkey PRIMARY KEY (id),
	CONSTRAINT fk_questions_distractor FOREIGN KEY (id_distractor) REFERENCES tb_distractor_catalog(id),
	CONSTRAINT fk_questions_exam FOREIGN KEY (id_exam) REFERENCES tb_exams(id)
);

ALTER TABLE tb_questions OWNER TO postgres;
GRANT ALL ON TABLE tb_questions TO postgres;


-- tb_school definição

CREATE TABLE tb_school (
	id serial4 NOT NULL,
	school varchar(255) NOT NULL,
	director_name varchar(255) NULL,
	id_city int4 NOT NULL,
	address varchar(255) NULL,
	created_at timestamptz DEFAULT CURRENT_TIMESTAMP NULL,
	CONSTRAINT tb_school_pkey PRIMARY KEY (id),
	CONSTRAINT fk_school_city FOREIGN KEY (id_city) REFERENCES tb_city(id)
);

ALTER TABLE tb_school OWNER TO postgres;
GRANT ALL ON TABLE tb_school TO postgres;


-- tb_school_ideb_indicators definição

CREATE TABLE tb_school_ideb_indicators (
	id serial4 NOT NULL,
	id_school int8 NOT NULL,
	fiscal_year int8 NOT NULL,
	ideb_target numeric(5, 2) NULL,
	regional_average numeric(5, 2) NULL,
	state_average numeric(5, 2) NULL,
	critical_threshold numeric(5, 2) NULL,
	created_at timestamptz DEFAULT CURRENT_TIMESTAMP NULL,
	CONSTRAINT tb_school_ideb_indicators_id_school_fiscal_year_key UNIQUE (id_school, fiscal_year),
	CONSTRAINT tb_school_ideb_indicators_pkey PRIMARY KEY (id),
	CONSTRAINT tb_school_ideb_indicators_id_school_fkey FOREIGN KEY (id_school) REFERENCES tb_school(id) ON DELETE CASCADE
);
CREATE INDEX idx_school_indicators_id_school ON tb_school_ideb_indicators USING btree (id_school);

ALTER TABLE tb_school_ideb_indicators OWNER TO postgres;
GRANT ALL ON TABLE tb_school_ideb_indicators TO postgres;


-- tb_teacher_school definição

CREATE TABLE tb_teacher_school (
	id serial4 NOT NULL,
	id_teacher int4 NOT NULL,
	id_school int4 NOT NULL,
	assignment_date date NOT NULL,
	status varchar(50) DEFAULT 'active'::character varying NULL,
	created_at timestamptz DEFAULT CURRENT_TIMESTAMP NULL,
	CONSTRAINT tb_teacher_school_id_teacher_id_school_key UNIQUE (id_teacher, id_school),
	CONSTRAINT tb_teacher_school_pkey PRIMARY KEY (id),
	CONSTRAINT fk_teacher_school_school FOREIGN KEY (id_school) REFERENCES tb_school(id),
	CONSTRAINT fk_teacher_school_teacher FOREIGN KEY (id_teacher) REFERENCES tb_teacher(id)
);

ALTER TABLE tb_teacher_school OWNER TO postgres;
GRANT ALL ON TABLE tb_teacher_school TO postgres;


-- tb_alternatives definição

CREATE TABLE tb_alternatives (
	id serial4 NOT NULL,
	id_question int4 NOT NULL,
	alternative_letter bpchar(1) NOT NULL,
	alternative_text text NOT NULL,
	is_correct bool DEFAULT false NULL,
	distractor_type varchar(100) NULL,
	created_at timestamptz DEFAULT CURRENT_TIMESTAMP NULL,
	CONSTRAINT tb_alternatives_id_question_alternative_letter_key UNIQUE (id_question, alternative_letter),
	CONSTRAINT tb_alternatives_pkey PRIMARY KEY (id),
	CONSTRAINT fk_alternatives_question FOREIGN KEY (id_question) REFERENCES tb_questions(id) ON DELETE CASCADE
);

ALTER TABLE tb_alternatives OWNER TO postgres;
GRANT ALL ON TABLE tb_alternatives TO postgres;


-- tb_class definição

CREATE TABLE tb_class (
	id serial4 NOT NULL,
	class_name varchar(100) NOT NULL,
	id_teacher int4 NOT NULL,
	id_school int4 NOT NULL,
	school_year int4 NOT NULL,
	grade varchar(50) NULL,
	shift varchar(50) NULL,
	created_at timestamptz DEFAULT CURRENT_TIMESTAMP NULL,
	CONSTRAINT tb_class_pkey PRIMARY KEY (id),
	CONSTRAINT fk_class_school FOREIGN KEY (id_school) REFERENCES tb_school(id),
	CONSTRAINT fk_class_teacher FOREIGN KEY (id_teacher) REFERENCES tb_teacher(id)
);
CREATE INDEX idx_class_school_year ON tb_class USING btree (school_year);

ALTER TABLE tb_class OWNER TO postgres;
GRANT ALL ON TABLE tb_class TO postgres;


-- tb_class_ideb_indicators definição

CREATE TABLE tb_class_ideb_indicators (
	id serial4 NOT NULL,
	id_class int8 NOT NULL,
	fiscal_year int8 NOT NULL,
	class_ideb_target numeric(5, 2) NULL,
	expected_avg_score numeric(5, 2) NULL,
	created_at timestamptz DEFAULT CURRENT_TIMESTAMP NULL,
	CONSTRAINT tb_class_ideb_indicators_id_class_fiscal_year_key UNIQUE (id_class, fiscal_year),
	CONSTRAINT tb_class_ideb_indicators_pkey PRIMARY KEY (id),
	CONSTRAINT tb_class_ideb_indicators_id_class_fkey FOREIGN KEY (id_class) REFERENCES tb_class(id) ON DELETE CASCADE
);
CREATE INDEX idx_class_indicators_id_class ON tb_class_ideb_indicators USING btree (id_class);

ALTER TABLE tb_class_ideb_indicators OWNER TO postgres;
GRANT ALL ON TABLE tb_class_ideb_indicators TO postgres;


-- tb_exam_applications definição

CREATE TABLE tb_exam_applications (
	id serial4 NOT NULL,
	id_exam int4 NOT NULL,
	id_class int4 NOT NULL,
	id_teacher int4 NOT NULL,
	application_date date NOT NULL,
	start_time time NULL,
	end_time time NULL,
	status varchar(50) DEFAULT 'scheduled'::character varying NULL,
	observations text NULL,
	created_at timestamptz DEFAULT CURRENT_TIMESTAMP NULL,
	application_type varchar(50) NULL,
	assessment_period varchar(50) NULL,
	fiscal_year int8 NULL,
	CONSTRAINT tb_exam_applications_pkey PRIMARY KEY (id),
	CONSTRAINT fk_exam_applications_class FOREIGN KEY (id_class) REFERENCES tb_class(id),
	CONSTRAINT fk_exam_applications_exam FOREIGN KEY (id_exam) REFERENCES tb_exams(id),
	CONSTRAINT fk_exam_applications_teacher FOREIGN KEY (id_teacher) REFERENCES tb_teacher(id)
);

ALTER TABLE tb_exam_applications OWNER TO postgres;
GRANT ALL ON TABLE tb_exam_applications TO postgres;


-- tb_question_competency definição

CREATE TABLE tb_question_competency (
	id_question int8 NOT NULL,
	id_competency int4 NOT NULL,
	CONSTRAINT tb_question_competency_pkey PRIMARY KEY (id_question, id_competency),
	CONSTRAINT tb_question_competency_id_competency_fkey FOREIGN KEY (id_competency) REFERENCES tb_competency_ideb(id) ON DELETE CASCADE,
	CONSTRAINT tb_question_competency_id_question_fkey FOREIGN KEY (id_question) REFERENCES tb_questions(id) ON DELETE CASCADE
);
CREATE INDEX idx_question_competency_id_competency ON tb_question_competency USING btree (id_competency);
CREATE INDEX idx_question_competency_id_question ON tb_question_competency USING btree (id_question);

ALTER TABLE tb_question_competency OWNER TO postgres;
GRANT ALL ON TABLE tb_question_competency TO postgres;


-- tb_students definição

CREATE TABLE tb_students (
	id_student serial4 NOT NULL,
	student_serial int4 NOT NULL,
	student_name varchar(255) NOT NULL,
	id_class int4 NOT NULL,
	enrollment_date date NULL,
	status varchar(50) DEFAULT 'enrolled'::character varying NULL,
	created_at timestamptz DEFAULT CURRENT_TIMESTAMP NULL,
	CONSTRAINT tb_students_pkey PRIMARY KEY (id_student),
	CONSTRAINT tb_students_student_serial_key UNIQUE (student_serial),
	CONSTRAINT fk_students_class FOREIGN KEY (id_class) REFERENCES tb_class(id)
);
CREATE INDEX idx_students_name ON tb_students USING btree (student_name);

ALTER TABLE tb_students OWNER TO postgres;
GRANT ALL ON TABLE tb_students TO postgres;


-- tb_assessment_metadata definição

CREATE TABLE tb_assessment_metadata (
	id serial4 NOT NULL,
	id_exam_application int8 NOT NULL,
	application_type varchar(50) NOT NULL,
	assessment_period varchar(50) NOT NULL,
	fiscal_year int8 NOT NULL,
	notes text NULL,
	created_at timestamptz DEFAULT CURRENT_TIMESTAMP NULL,
	CONSTRAINT tb_assessment_metadata_id_exam_application_key UNIQUE (id_exam_application),
	CONSTRAINT tb_assessment_metadata_pkey PRIMARY KEY (id),
	CONSTRAINT tb_assessment_metadata_id_exam_application_fkey FOREIGN KEY (id_exam_application) REFERENCES tb_exam_applications(id) ON DELETE CASCADE
);
CREATE INDEX idx_assessment_metadata_id_exam_app ON tb_assessment_metadata USING btree (id_exam_application);

ALTER TABLE tb_assessment_metadata OWNER TO postgres;
GRANT ALL ON TABLE tb_assessment_metadata TO postgres;


-- tb_exam_results definição

CREATE TABLE tb_exam_results (
	id serial4 NOT NULL,
	id_student int4 NOT NULL,
	id_exam_application int4 NOT NULL,
	total_score numeric(5, 2) NULL,
	max_score numeric(5, 2) NULL,
	correct_answers int4 NULL,
	wrong_answers int4 NULL,
	blank_answers int4 NULL,
	completion_time_minutes int4 NULL,
	started_at timestamptz NULL,
	finished_at timestamptz NULL,
	created_at timestamptz DEFAULT CURRENT_TIMESTAMP NULL,
	CONSTRAINT tb_exam_results_id_student_id_exam_application_key UNIQUE (id_student, id_exam_application),
	CONSTRAINT tb_exam_results_pkey PRIMARY KEY (id),
	CONSTRAINT fk_exam_results_application FOREIGN KEY (id_exam_application) REFERENCES tb_exam_applications(id),
	CONSTRAINT fk_exam_results_student FOREIGN KEY (id_student) REFERENCES tb_students(id_student)
);

ALTER TABLE tb_exam_results OWNER TO postgres;
GRANT ALL ON TABLE tb_exam_results TO postgres;


-- tb_student_answers definição

CREATE TABLE tb_student_answers (
	id serial4 NOT NULL,
	id_student int4 NOT NULL,
	id_exam_application int4 NOT NULL,
	id_question int4 NOT NULL,
	id_selected_alternative int4 NULL,
	answer_text text NULL,
	is_correct bool NULL,
	response_time_seconds int4 NULL,
	answered_at timestamptz DEFAULT CURRENT_TIMESTAMP NULL,
	CONSTRAINT tb_student_answers_id_student_id_exam_application_id_questi_key UNIQUE (id_student, id_exam_application, id_question),
	CONSTRAINT tb_student_answers_pkey PRIMARY KEY (id),
	CONSTRAINT fk_student_answers_alternative FOREIGN KEY (id_selected_alternative) REFERENCES tb_alternatives(id),
	CONSTRAINT fk_student_answers_application FOREIGN KEY (id_exam_application) REFERENCES tb_exam_applications(id),
	CONSTRAINT fk_student_answers_question FOREIGN KEY (id_question) REFERENCES tb_questions(id),
	CONSTRAINT fk_student_answers_student FOREIGN KEY (id_student) REFERENCES tb_students(id_student)
);

ALTER TABLE tb_student_answers OWNER TO postgres;
GRANT ALL ON TABLE tb_student_answers TO postgres;


-- tb_student_distractor_achievements definição

CREATE TABLE tb_student_distractor_achievements (
	id serial4 NOT NULL,
	id_student int4 NOT NULL,
	id_distractor int4 NOT NULL,
	id_exam_application int4 NOT NULL,
	achieved_at timestamptz DEFAULT CURRENT_TIMESTAMP NULL,
	CONSTRAINT tb_student_distractor_achievements_pkey PRIMARY KEY (id),
	CONSTRAINT fk_distractor_achievements_application FOREIGN KEY (id_exam_application) REFERENCES tb_exam_applications(id),
	CONSTRAINT fk_distractor_achievements_distractor FOREIGN KEY (id_distractor) REFERENCES tb_distractor_catalog(id),
	CONSTRAINT fk_distractor_achievements_student FOREIGN KEY (id_student) REFERENCES tb_students(id_student)
);

ALTER TABLE tb_student_distractor_achievements OWNER TO postgres;
GRANT ALL ON TABLE tb_student_distractor_achievements TO postgres;


-- tb_student_learning_progress definição

CREATE TABLE tb_student_learning_progress (
	id serial4 NOT NULL,
	id_student int8 NOT NULL,
	id_competency int4 NOT NULL,
	id_exam_application int8 NOT NULL,
	score numeric(10, 2) NOT NULL,
	max_score numeric(10, 2) NOT NULL,
	competency_mastery numeric(5, 2) NOT NULL,
	assessment_date date NOT NULL,
	created_at timestamptz DEFAULT CURRENT_TIMESTAMP NULL,
	CONSTRAINT tb_student_learning_progress_pkey PRIMARY KEY (id),
	CONSTRAINT tb_student_learning_progress_id_competency_fkey FOREIGN KEY (id_competency) REFERENCES tb_competency_ideb(id) ON DELETE CASCADE,
	CONSTRAINT tb_student_learning_progress_id_exam_application_fkey FOREIGN KEY (id_exam_application) REFERENCES tb_exam_applications(id) ON DELETE CASCADE,
	CONSTRAINT tb_student_learning_progress_id_student_fkey FOREIGN KEY (id_student) REFERENCES tb_students(id_student) ON DELETE CASCADE
);
CREATE INDEX idx_student_progress_id_competency ON tb_student_learning_progress USING btree (id_competency);
CREATE INDEX idx_student_progress_id_student ON tb_student_learning_progress USING btree (id_student);

ALTER TABLE tb_student_learning_progress OWNER TO postgres;
GRANT ALL ON TABLE tb_student_learning_progress TO postgres;
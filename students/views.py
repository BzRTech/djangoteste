# students/views.py
from django.urls import reverse_lazy
from django.views.generic import ListView, CreateView, UpdateView, DeleteView
from .models import TbStudents

class StudentListView(ListView):
    model = TbStudents
    template_name = 'students/student_list.html'
    context_object_name = 'students' # Nome da variável no template

class StudentCreateView(CreateView):
    model = TbStudents
    template_name = 'students/student_form.html'
    fields = ['student_name', 'student_serial', 'id_class'] # Campos que aparecerão no formulário
    success_url = reverse_lazy('student-list') # Redireciona para a lista após sucesso

class StudentUpdateView(UpdateView):
    model = TbStudents
    template_name = 'students/student_form.html'
    fields = ['student_name', 'student_serial', 'id_class']
    success_url = reverse_lazy('student-list')
    pk_url_kwarg = 'pk' # Diz ao Django que o ID vem da URL como 'pk'

class StudentDeleteView(DeleteView):
    model = TbStudents
    template_name = 'students/student_confirm_delete.html'
    success_url = reverse_lazy('student-list')
    pk_url_kwarg = 'pk'
# school_project/urls.py
from django.contrib import admin
from django.urls import path, include # Adicione 'include'

urlpatterns = [
    path('admin/', admin.site.urls),
    path('students/', include('students.urls')), # Inclui as URLs do app 'students'
]
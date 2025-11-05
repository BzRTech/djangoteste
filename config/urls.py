from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include('api.urls')),  # Todas as rotas da API começam com /api/
    # path('students/', include('students.urls')),  # Pode comentar/remover as views antigas
]
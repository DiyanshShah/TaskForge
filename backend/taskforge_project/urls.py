# backend/taskforge_project/urls.py

from django.contrib import admin
from django.urls import path, include
# from rest_framework.routers import DefaultRouter  <-- We comment this out
from tasks_api.views import TaskViewSet, UserCreate
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

# --- We are temporarily disabling the router for debugging ---
# router = DefaultRouter()
# router.register(r'tasks', TaskViewSet)

# This manually creates a view that only handles GET (to list) and POST (to create)
task_actions = TaskViewSet.as_view({'get': 'list', 'post': 'create'})

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/user/register/', UserCreate.as_view(), name='register'),
    path('api/token/', TokenObtainPairView.as_view(), name='get_token'),
    path('api/token/refresh/', TokenRefreshView.as_view(), name='refresh'),
    
    # This is our new, manually-wired URL for the tasks list
    path('api/tasks/', task_actions, name='task-list'),

    # We comment out the router's path
    # path('api/', include(router.urls)),
]
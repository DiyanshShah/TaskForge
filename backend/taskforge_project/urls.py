
from django.contrib import admin
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from tasks_api.views import TaskViewSet, UserCreate
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView


router = DefaultRouter()
router.register(r'tasks', TaskViewSet, basename='tasks')


urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/user/register/', UserCreate.as_view(), name='register'),
    path('api/token/', TokenObtainPairView.as_view(), name='get_token'),
    path('api/token/refresh/', TokenRefreshView.as_view(), name='refresh'),
    path('api/', include(router.urls)),
]
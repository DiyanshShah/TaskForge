from django.db import models
from django.conf import settings

# Create your models here.
class Task(models.Model):
    class Status(models.TextChoices):
        PLANNED = 'PL', 'Planned',
        DOING = 'DG', 'Doing',
        COMPLETED = 'CP', 'Completed',


    #Linking each tasks to a User
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='tasks'
    )    

    title = models.CharField(max_length=200)
    description = models.TextField(blank=True)
    status = models.CharField(
        max_length = 2,
        choices=Status.choices,
        default=Status.PLANNED,
    )
    due_date = models.DateTimeField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.title 
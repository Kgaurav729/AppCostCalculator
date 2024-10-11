# api/models.py
from django.db import models

class Category(models.Model):
    name = models.CharField(max_length=100)

    def __str__(self):
        return self.name


class Feature(models.Model):
    name = models.CharField(max_length=100)
    hours = models.IntegerField()
    category = models.ForeignKey(Category, related_name='features', on_delete=models.CASCADE)

    def __str__(self):
        return f"{self.name} ({self.hours} hours)"

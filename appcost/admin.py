# api/admin.py
from django.contrib import admin
from .models import Category, Feature

# Register Category and Feature models
admin.site.register(Category)
admin.site.register(Feature)

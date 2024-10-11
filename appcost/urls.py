from django.urls import path
from . import views  # Import your views

urlpatterns = [
    path('categories/', views.get_categories, name='get_categories'),  # For fetching app categories
    path('features/', views.get_features, name='get_features'),        # For fetching features based on category
    path('calculate/', views.calculate_cost, name='calculate_cost'),   # For calculating the cost
]

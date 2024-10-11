# views.py
from django.http import JsonResponse
from .models import Category, Feature

# Fetch app categories
def get_categories(request):
    categories = Category.objects.all().values('id', 'name')
    return JsonResponse(list(categories), safe=False)

# Fetch features for a specific category
def get_features(request):
    category_id = request.GET.get('category_id')
    if not category_id:
        return JsonResponse({'error': 'Category ID is required'}, status=400)

    features = Feature.objects.filter(category_id=category_id).values('id', 'name', 'hours')
    return JsonResponse(list(features), safe=False)

# Calculate the total cost based on selected features
def calculate_cost(request):
    category_id = request.GET.get('category_id')
    selected_features = request.GET.getlist('features[]')  # List of feature IDs

    if not category_id or not selected_features:
        return JsonResponse({'error': 'Both category and features are required'}, status=400)

    features = Feature.objects.filter(id__in=selected_features)
    total_hours = sum(feature.hours for feature in features)
    total_cost = total_hours * 10  # Assuming $10/hour as mentioned
    return JsonResponse({'total_cost': total_cost})

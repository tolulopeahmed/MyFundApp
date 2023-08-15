from django.http import JsonResponse
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from .linkedin_oauth import get_linkedin_oauth_url, exchange_linkedin_code_for_token

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_linkedin_auth_url(request):
    return JsonResponse({'auth_url': get_linkedin_oauth_url()})

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def exchange_linkedin_code(request):
    code = request.data.get('code')
    if not code:
        return JsonResponse({'error': 'Code is required.'}, status=400)
    
    access_token, linkedin_id = exchange_linkedin_code_for_token(code)
    if not access_token:
        return JsonResponse({'error': 'Unable to exchange code for access token.'}, status=400)
    
    # Store or update the LinkedIn access token and linkedin_id for the user
    user = request.user
    user.linkedin_access_token = access_token
    user.linkedin_id = linkedin_id
    user.save()
    
    return JsonResponse({'message': 'LinkedIn authentication successful.'})

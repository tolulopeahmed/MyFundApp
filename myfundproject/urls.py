from django.contrib import admin
from django.urls import path, include
from django.http import HttpResponse
from django.template import loader
from rest_framework_simplejwt.views import TokenObtainPairView


def welcome(request):
    template = loader.get_template('welcome.html')
    return HttpResponse(template.render({}, request))


urlpatterns = [
    path('admin/', admin.site.urls),
    path('api-auth/', include('rest_framework.urls')),
    path('api/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/', include('authentication.urls')),  
    path('', welcome, name='welcome'), 

]

from django.contrib import admin
from django.urls import path, include
from django.http import HttpResponse
from django.template import loader
from rest_framework_simplejwt.views import TokenObtainPairView
from django.conf import settings
from django.conf.urls.static import static
from django.views.decorators.csrf import csrf_exempt
from authentication.views import CustomGraphQLView
from authentication.schema import schema  # Adjust the import path
from graphql_jwt.decorators import jwt_cookie
from django.views.static import serve


def welcome(request):
    template = loader.get_template("welcome.html")
    return HttpResponse(template.render({}, request))


urlpatterns = [
    path("admin/", admin.site.urls),
    path("api-auth/", include("rest_framework.urls")),
    path("api/token/", TokenObtainPairView.as_view(), name="token_obtain_pair"),
    path("api/", include("authentication.urls")),
    path("", welcome, name="welcome"),
    path(
        "graphql/",
        csrf_exempt(
            jwt_cookie(CustomGraphQLView.as_view(graphiql=True, schema=schema))
        ),
    ),
    path(
        "media/<path:path>/",
        serve,
        {"document_root": settings.MEDIA_ROOT, "show_indexes": True},
    ),
]

urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)

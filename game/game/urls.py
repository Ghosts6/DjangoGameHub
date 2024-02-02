from django.contrib import admin
from django.urls import include,path

urlpatterns = [
    path('', include('app.urls')),
    path('admin/', admin.site.urls),
]
handler404 = 'game.views.custom_page_not_found'
handler500 = 'game.views.custom_server_error'
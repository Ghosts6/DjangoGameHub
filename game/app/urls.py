from django.urls import path
from . import views
from django.conf import settings
from django.conf.urls.static import static
from django.views.generic import TemplateView


urlpatterns = [
    path('', TemplateView.as_view(template_name='home.html'), name='home'),
    path('home/',views.home,name='home'),
    path('top_scores/home/',views.home,name='home'),
    path('tic_tac_toe/<str:player_name>/home/', views.home , name='home'),
    path('dinosaur/<str:player_name>/home/', views.home, name='home'),
    path('snake/<str:player_name>/', views.Snake_Game, name='Snake_Game'),
    path('flappy-bird/<str:player_name>/home/', views.home, name='home'),
    path('tic_tac_toe/<str:player_name>/', views.Tic_Tac_Toe, name='Tic_Tac_Toe'),
    path('flappy-bird/<str:player_name>/',views.Flappy_Bird, name='Flappy_Bird'),
    path('dinosaur/<str:player_name>/',views.Dinosaur_Game, name='Dinosaur_Game'),
    path('save_score/', views.save_score, name='save_score'),
    path('top_scores/', views.top_scores, name='top_scores'),
    path('submit_snake_score/', views.handle_snake_score_submission, name='submit_snake_score'),
    path('save_dinosaur_score/', views.save_dinosaur_score, name='save_dinosaur_score'),
    path('save_flappy_score/', views.save_flappy_score, name='save_flappy_score'),
]

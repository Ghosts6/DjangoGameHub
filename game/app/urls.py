from django.urls import path
from . import views

urlpatterns = [
    path('', views.home, name='home'),
    path('register/', views.register, name='register'),
    path('login/', views.user_login, name='login'),
    path('logout/', views.user_logout, name='logout'),
    path('snake/', views.Snake_Game, name='Snake_Game'),
    path('tic_tac_toe/', views.Tic_Tac_Toe, name='Tic_Tac_Toe'),
    path('flappy_bird/', views.Flappy_Bird, name='Flappy_Bird'),
    path('dinosaur/', views.Dinosaur_Game, name='Dinosaur_Game'),
    path('akinator/', views.akinator, name='akinator'),
    path('save_score/', views.save_score, name='save_score'),
    path('top_scores/', views.top_scores, name='top_scores'),
]